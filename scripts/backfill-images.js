const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const CONCURRENCY = 6;

// Unsplash image pools for benefits/AI (themed, not picsum)
const THEME_POOLS = {
  education: [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  ],
  health: [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=800&q=80',
  ],
  finance: [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  ],
  children: [
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80',
    'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800&q=80',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
  ],
  senior: [
    'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80',
  ],
  job: [
    'https://images.unsplash.com/photo-1551836022-d0bc15250ff5?w=800&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80',
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80',
  ],
  environment: [
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
    'https://images.unsplash.com/photo-1498925008800-019c7d59d903?w=800&q=80',
  ],
  culture: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
  ],
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=800&q=80',
    'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  ],
  admin: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    'https://images.unsplash.com/photo-1571172996211-2e3d26573f9a?w=800&q=80',
  ],
};

// Keyword-based theme detection for items without imageTheme
function detectTheme(name, summary, category) {
  if (category === 'AI지원') return 'ai';
  const text = (name + ' ' + (summary || '')).toLowerCase();
  if (/ai|인공지능|빅데이터|디지털|sw|it/.test(text)) return 'ai';
  if (/아동|어린이|청소년|육아|보육|유아|출산|임신/.test(text)) return 'children';
  if (/노인|어르신|고령|실버|경로|시니어/.test(text)) return 'senior';
  if (/취업|구직|일자리|고용|직업/.test(text)) return 'job';
  if (/의료|건강|병원|질환|복지|돌봄/.test(text)) return 'health';
  if (/교육|학습|학교|훈련|강의|수업/.test(text)) return 'education';
  if (/문화|공연|예술|축제|전시|행사/.test(text)) return 'culture';
  if (/환경|녹색|에너지|탄소|기후/.test(text)) return 'environment';
  if (/금융|대출|보조금|지원금|수당|장려금|바우처|혜택/.test(text)) return 'finance';
  return 'admin';
}

function nameHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return (h % 900000) + 100000;
}

function getThemeImage(name, summary, category) {
  const theme = detectTheme(name, summary, category);
  const pool = THEME_POOLS[theme] || THEME_POOLS.admin;
  return pool[nameHash(name) % pool.length];
}

async function fetchOgImage(url) {
  if (!url || url === '#') return null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html' },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    let og =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content') || null;
    if (!og) return null;
    if (og.startsWith('http')) return og;
    if (og.startsWith('//')) return 'https:' + og;
    try { return new URL(og, url).href; } catch {}
    return null;
  } catch {
    return null;
  }
}

// Known generic/logo OG images to skip
const GENERIC_OG_PATTERNS = [
  'gov.kr/images/etc/og_image',
  'bizinfo.go.kr/images/bizinfo/common',
  '/img.png',
  '/logo.png',
  '/og.png',
  '/og_image',
  'sns_thumbnail',
];

function isGenericOgImage(url) {
  if (!url) return true;
  return GENERIC_OG_PATTERNS.some(p => url.includes(p));
}

async function processInBatches(items, fn, concurrency) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

async function main() {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const isPicsum = (url) => url && url.includes('picsum.photos');

  // === Events: fetch real OG image from article ===
  const eventsToUpdate = localData.events.filter(e => isPicsum(e.image) && e.link && e.link !== '#');
  console.log(`행사 업데이트: ${eventsToUpdate.length}개`);
  let eventOk = 0;

  await processInBatches(eventsToUpdate, async (item) => {
    const og = await fetchOgImage(item.link);
    if (og && !isGenericOgImage(og)) {
      item.image = og;
      eventOk++;
    }
    // else keep picsum fallback
  }, CONCURRENCY);

  console.log(`  실제 이미지: ${eventOk}개 / ${eventsToUpdate.length}개`);

  // === Benefits: themed Unsplash image ===
  const benefitsToUpdate = localData.benefits.filter(e => isPicsum(e.image));
  console.log(`혜택 업데이트: ${benefitsToUpdate.length}개`);

  for (const item of benefitsToUpdate) {
    item.image = getThemeImage(item.name, item.summary, item.category);
  }

  // === AI Support: AI-themed Unsplash image ===
  const aiToUpdate = (localData.aiSupport || []).filter(e => isPicsum(e.image));
  console.log(`AI지원 업데이트: ${aiToUpdate.length}개`);

  for (const item of aiToUpdate) {
    item.image = getThemeImage(item.name, item.summary, 'AI지원');
  }

  fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
  console.log(`저장 완료: 행사 ${eventOk}개 실제이미지, 혜택 ${benefitsToUpdate.length}개, AI ${aiToUpdate.length}개 Unsplash로 교체`);
}

main().catch(console.error);
