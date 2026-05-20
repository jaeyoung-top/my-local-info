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

  // ── 방법 1: Web Analytics RUM API ──────────────────────────────────────────
  let siteTag = SITE_TAG || null;

  if (!siteTag) {
    const siteRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/rum/site_info?limit=50`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const siteData = await siteRes.json();
    console.log('rum/site_info status:', siteRes.status);
    if (siteRes.status !== 200) {
      console.log('rum/site_info error:', JSON.stringify(siteData));
    } else {
      const sites = siteData.result || [];
      console.log(`rum/site_info 사이트 수: ${sites.length}`);
      if (sites.length > 0) console.log('첫 번째 사이트 키:', Object.keys(sites[0]).join(', '));
      const site = sites.find(s =>
        (s.host || s.hostname || s.name || '').includes('songpa-info.com')
      ) || (sites.length === 1 ? sites[0] : null);
      if (site) siteTag = site.tag || site.siteTag || site.site_tag;
    }
  }

  if (siteTag) {
    const result = await queryRUM(API_TOKEN, ACCOUNT_ID, siteTag, today, thirtyDaysAgo, existing);
    if (result) {
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
      console.log(`✅ RUM 완료: 오늘 ${result.todayVisits}명, 최근 30일 ${result.totalVisits}명`);
      return;
    }
  }

  // ── 방법 2: Zone Analytics (HTTP 요청 기반) 폴백 ──────────────────────────
  console.log('RUM 실패 → Zone Analytics 시도...');
  const zoneRes = await fetch(
    `https://api.cloudflare.com/client/v4/zones?name=songpa-info.com`,
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  );
  const zoneData = await zoneRes.json();
  console.log('zones status:', zoneRes.status);

  const zoneId = zoneData.result?.[0]?.id;
  if (!zoneId) {
    console.log('Zone ID를 찾을 수 없음. API 토큰에 Zone Analytics:Read 권한이 필요합니다.');
    return;
  }

  console.log('Zone ID:', zoneId);

  const gqlBody = JSON.stringify({
    query: `{
      viewer {
        zones(filter: { zoneTag: "${zoneId}" }) {
          daily: httpRequestsAdaptiveGroups(
            limit: 30
            filter: { date_geq: "${thirtyDaysAgo}", date_leq: "${today}" }
            orderBy: [date_DESC]
          ) {
            dimensions { date }
            sum { pageViews requests }
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
    console.error('Zone GraphQL 오류:', JSON.stringify(gql.errors));
    return;
  }

  const daily = gql.data?.viewer?.zones?.[0]?.daily || [];
  if (daily.length === 0) {
    console.log('Zone Analytics 데이터 없음');
    return;
  }

  const todayRow = daily.find(g => g.dimensions.date === today);
  const todayVisits = todayRow?.sum?.pageViews ?? 0;
  const totalVisits = daily.reduce((s, g) => s + (g.sum?.pageViews ?? 0), 0);

  const result = {
    totalVisits: Math.max(existing.totalVisits || 0, totalVisits),
    todayVisits,
    date: today,
    source: 'cloudflare-zone-analytics',
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`✅ Zone Analytics 완료: 오늘 ${todayVisits}명, 최근 30일 ${totalVisits}명`);
}

async function queryRUM(token, accountId, siteTag, today, thirtyDaysAgo, existing) {
  const gqlBody = JSON.stringify({
    query: `{
      viewer {
        accounts(filter: { accountTag: "${accountId}" }) {
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

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: gqlBody,
  });
  const gql = await res.json();

  if (gql.errors) {
    console.error('RUM GraphQL 오류:', JSON.stringify(gql.errors));
    return null;
  }

  const daily = gql.data?.viewer?.accounts?.[0]?.daily || [];
  if (daily.length === 0) return null;

  const todayRow = daily.find(g => g.dimensions.date === today);
  const todayVisits = todayRow?.sum?.visits ?? 0;
  const totalVisits = daily.reduce((s, g) => s + (g.sum?.visits ?? 0), 0);

  return {
    totalVisits: Math.max(existing.totalVisits || 0, totalVisits),
    todayVisits,
    date: today,
    source: 'cloudflare-web-analytics',
    updatedAt: new Date().toISOString(),
  };
}

main().catch(console.error);
