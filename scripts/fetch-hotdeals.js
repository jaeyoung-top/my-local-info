const fs = require('fs');
const path = require('path');

const PAGES_TO_FETCH = 5;
const MAX_TOTAL = 500;

const SOURCE_COLORS = {
  'FM코리아': '#FF8C00',
  '퀘이사존': '#7C3AED',
  '개드립': '#DC2626',
  '루리웹': '#3B82F6',
  '뽐뿌': '#4F46E5',
  '아카라이브': '#10B981',
  '클리앙': '#2A6EBB',
};

const CATEGORY_MAP = {
  '식품': '식품',
  'PC': 'PC',
  '화장품': '화장품',
  '생활관': '생활용품',
  '생활용품': '생활용품',
  '가전': '가전',
  '게임': '게임',
  '의류': '의류',
  '패션': '의류',
  '해외핫딜': '해외핫딜',
  '해외직구': '해외핫딜',
};

function categorize(apiCat) {
  return CATEGORY_MAP[apiCat] || '기타';
}

async function fetchPage(page) {
  const res = await fetch(`https://hotdeal.zip/api/deals.php?page=${page}&category=all`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, */*',
      'Referer': 'https://hotdeal.zip/',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}

function mapDeal(d) {
  return {
    id: `hdz_${d.id}`,
    title: d.title,
    price: d.price || null,
    image: d.thumbnail_url || null,
    category: categorize(d.category),
    source: d.community_name || '기타',
    sourceColor: SOURCE_COLORS[d.community_name] || '#888888',
    link: d.post_url || `https://hotdeal.zip/${d.seo_url}`,
    publishedAt: d.created_at || '',
    likes: d.views || 0,
    fetchedAt: new Date().toISOString(),
  };
}

async function main() {
  console.log('hotdeal.zip API 수집 시작...');

  const outputPath = path.join(process.cwd(), 'public', 'data', 'hotdeals.json');
  let existing = { deals: [] };
  try { existing = JSON.parse(fs.readFileSync(outputPath, 'utf8')); } catch {}

  // 더 이상 사용하지 않는 로컬 이미지 정리
  const imgDir = path.join(process.cwd(), 'public', 'hotdeal-images');
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    for (const f of files) fs.unlinkSync(path.join(imgDir, f));
    if (files.length > 0) console.log(`로컬 이미지 ${files.length}개 정리`);
  }

  const existingIds = new Set((existing.deals || []).map(d => d.id));
  const newDeals = [];

  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    try {
      const json = await fetchPage(page);
      const items = json.data || json.deals || [];
      for (const d of items) {
        if (d.status && d.status !== 'active') continue;
        const deal = mapDeal(d);
        if (!existingIds.has(deal.id)) newDeals.push(deal);
      }
      console.log(`페이지 ${page}: ${items.length}개 수집`);
      if (!json.pagination?.has_more) break;
    } catch (err) {
      console.error(`페이지 ${page} 오류:`, err.message);
      break;
    }
  }

  console.log(`신규: ${newDeals.length}개`);

  // 기존 딜 중 로컬 이미지 참조 제거 (CDN URL로 대체됨)
  const cleanedExisting = (existing.deals || []).map(d => ({
    ...d,
    image: d.image && d.image.startsWith('/hotdeal-images/') ? null : d.image,
  }));

  const combined = [...newDeals, ...cleanedExisting].slice(0, MAX_TOTAL);

  fs.writeFileSync(outputPath, JSON.stringify({
    deals: combined,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');

  console.log(`저장 완료: 총 ${combined.length}개 (신규 ${newDeals.length}개)`);
}

main().catch(console.error);
