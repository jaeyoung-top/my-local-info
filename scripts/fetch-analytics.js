const fs = require('fs');
const path = require('path');

async function main() {
  const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const SITE_TAG = process.env.CLOUDFLARE_RUM_SITE_TAG; // 직접 지정 가능

  if (!API_TOKEN || !ACCOUNT_ID) {
    console.error('CLOUDFLARE_API_TOKEN 또는 CLOUDFLARE_ACCOUNT_ID 없음');
    return;
  }

  const outPath = path.join(process.cwd(), 'public', 'data', 'analytics.json');
  let existing = { totalVisits: 0, todayVisits: 0 };
  try { existing = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {}

  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  let siteTag = SITE_TAG || null;

  if (!siteTag) {
    // Web Analytics 사이트 목록에서 태그 가져오기
    const siteRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/rum/site_info?limit=50`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const siteData = await siteRes.json();
    console.log('rum/site_info HTTP status:', siteRes.status);
    console.log('rum/site_info response:', JSON.stringify(siteData, null, 2));

    const sites = siteData.result || [];
    const site = sites.find(s =>
      (s.host || s.hostname || s.name || '').includes('songpa-info.com')
    ) || sites[0]; // 사이트가 하나뿐이면 첫 번째 사용

    if (site) {
      siteTag = site.tag || site.siteTag || site.site_tag;
      console.log('찾은 사이트:', JSON.stringify(site));
    }
  }

  if (!siteTag) {
    console.log('사이트 태그를 찾을 수 없음 — CLOUDFLARE_RUM_SITE_TAG 환경변수를 설정하거나 API 토큰 권한을 확인하세요');
    return;
  }

  console.log(`사이트 태그: ${siteTag}`);

  // GraphQL로 방문자 데이터 조회
  const gqlBody = JSON.stringify({
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
    body: gqlBody,
  });
  const gql = await gqlRes.json();

  if (gql.errors) {
    console.error('GraphQL 오류:', JSON.stringify(gql.errors, null, 2));
    return;
  }

  const daily = gql.data?.viewer?.accounts?.[0]?.daily || [];
  if (daily.length === 0) {
    console.log('조회된 데이터 없음 (siteTag가 맞는지 확인)');
    return;
  }

  const todayRow = daily.find(g => g.dimensions.date === today);
  const todayVisits = todayRow?.sum?.visits ?? 0;
  const totalVisits = daily.reduce((s, g) => s + (g.sum?.visits ?? 0), 0);

  const result = {
    totalVisits: Math.max(existing.totalVisits || 0, totalVisits),
    todayVisits,
    date: today,
    source: 'cloudflare-web-analytics',
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`✅ 완료: 오늘 ${todayVisits}명, 최근 30일 ${totalVisits}명`);
}

main().catch(console.error);
