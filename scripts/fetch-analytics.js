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

  // 기존 데이터 로드 (누적 보존)
  let existing = { totalVisits: 0, todayVisits: 0, date: '', history: [] };
  try { existing = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {}

  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  // 1) songpa-info.com 존 ID 조회
  const zoneRes = await fetch(`https://api.cloudflare.com/client/v4/zones?name=songpa-info.com`, {
    headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
  });
  const zoneData = await zoneRes.json();
  const zoneId = zoneData.result?.[0]?.id;

  if (zoneId) {
    // 2) Cloudflare Zone Analytics GraphQL
    const query = JSON.stringify({
      query: `{
        viewer {
          zones(filter: { zoneTag: "${zoneId}" }) {
            httpRequests1dGroups(
              limit: 30
              filter: { date_geq: "${thirtyDaysAgo}", date_leq: "${today}" }
              orderBy: [date_DESC]
            ) {
              dimensions { date }
              sum { pageViews }
              uniq { uniques }
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
    const groups = gql.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];

    if (groups.length > 0) {
      const todayRow = groups.find(g => g.dimensions.date === today);
      const todayVisits = todayRow?.uniq?.uniques ?? todayRow?.sum?.pageViews ?? 0;
      const totalVisits = groups.reduce((s, g) => s + (g.uniq?.uniques ?? g.sum?.pageViews ?? 0), 0);

      // 누적: 기존 total에서 최근 30일 합산으로 갱신
      const result = {
        totalVisits: Math.max(existing.totalVisits, totalVisits),
        todayVisits,
        date: today,
        source: 'cloudflare-zone',
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
      console.log(`✅ Cloudflare Zone Analytics: 오늘 ${todayVisits}명, 최근30일 ${totalVisits}명`);
      return;
    }
  }

  // 3) Zone 없을 때: Cloudflare Pages Analytics 시도
  const pagesRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/my-local-info/analytics?from=${thirtyDaysAgo}&to=${today}`,
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  );
  const pagesData = await pagesRes.json();

  if (pagesData.success && pagesData.result) {
    const r = pagesData.result;
    const result = {
      totalVisits: r.totalVisits ?? r.visits ?? existing.totalVisits,
      todayVisits: r.todayVisits ?? 0,
      date: today,
      source: 'cloudflare-pages',
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`✅ Cloudflare Pages Analytics: ${JSON.stringify(result)}`);
    return;
  }

  // 4) 둘 다 안 될 경우: 날짜만 갱신, 기존 값 유지
  console.log('⚠️ Cloudflare Analytics 데이터 없음 — 기존 값 유지');
  const result = { ...existing, date: today, updatedAt: new Date().toISOString(), source: 'preserved' };
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
}

main().catch(console.error);
