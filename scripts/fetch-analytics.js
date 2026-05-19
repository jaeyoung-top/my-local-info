const fs = require('fs');
const path = require('path');

async function main() {
  const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!API_TOKEN || !ACCOUNT_ID) {
    console.error('CLOUDFLARE_API_TOKEN 또는 CLOUDFLARE_ACCOUNT_ID 없음');
    return;
  }

  const outPath = path.join(process.cwd(), 'public', 'data', 'analytics.json');
  let existing = { totalVisits: 0, todayVisits: 0 };
  try { existing = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {}

  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const startDatetime = thirtyDaysAgo + 'T00:00:00Z';
  const endDatetime = today + 'T23:59:59Z';

  // 1) Web Analytics 사이트 목록에서 songpa-info.com 태그 가져오기
  const siteRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/rum/site_info`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  const siteData = await siteRes.json();
  const site = (siteData.result || []).find(s =>
    (s.host || '').includes('songpa-info.com') || (s.auto_install === true)
  );

  if (!site?.tag) {
    console.log('Web Analytics 사이트 태그를 찾을 수 없음');
    return;
  }

  const siteTag = site.tag;
  console.log(`Web Analytics 사이트 태그: ${siteTag}`);

  // 2) GraphQL로 실제 방문자 데이터 조회
  const query = JSON.stringify({
    query: `{
      viewer {
        accounts(filter: { accountTag: "${ACCOUNT_ID}" }) {
          daily: rumPageloadEventsAdaptiveGroups(
            limit: 30
            filter: {
              siteTag: "${siteTag}"
              date_geq: "${thirtyDaysAgo}"
              date_leq: "${today}"
            }
            orderBy: [date_DESC]
          ) {
            dimensions { date }
            sum { visits pageViews }
          }
        }
      }
    }`
  });

  const gqlRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
    body: query,
  });
  const gql = await gqlRes.json();

  if (gql.errors) {
    console.error('GraphQL 오류:', JSON.stringify(gql.errors));
    return;
  }

  const daily = gql.data?.viewer?.accounts?.[0]?.daily || [];
  if (daily.length === 0) {
    console.log('데이터 없음');
    return;
  }

  const todayRow = daily.find(g => g.dimensions.date === today);
  const todayVisits = todayRow?.sum?.visits ?? 0;
  const totalVisits = daily.reduce((s, g) => s + (g.sum?.visits ?? 0), 0);

  // 누적: 이전 기록과 비교해 더 큰 값 보존
  const result = {
    totalVisits: Math.max(existing.totalVisits || 0, totalVisits),
    todayVisits,
    date: today,
    source: 'cloudflare-web-analytics',
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`✅ 실방문자 수집 완료: 오늘 ${todayVisits}명, 최근 30일 ${totalVisits}명`);
}

main().catch(console.error);
