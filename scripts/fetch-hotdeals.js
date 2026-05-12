const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const CATEGORY_KEYWORDS = {
  'PC': ['pc', '컴퓨터', '노트북', '그래픽카드', 'cpu', '메모리', 'ram', 'ssd', 'hdd', '마우스', '키보드', '모니터', '웹캠', '헤드셋', '스피커', '라우터', '공유기'],
  '가전': ['tv', '냉장고', '세탁기', '에어컨', '청소기', '에어프라이어', '전자레인지', '공기청정기', '건조기', '식기세척기', '전기밥솥', '블렌더', '믹서', '헤어드라이어', '다리미'],
  '식품': ['식품', '과자', '음료', '커피', '라면', '쌀', '고기', '야채', '과일', '치킨', '피자', '버거', '초콜릿', '과즙', '홍삼', '비타민', '단백질', '프로틴'],
  '생활용품': ['생활', '주방', '욕실', '청소', '세제', '휴지', '수건', '침구', '이불', '베개', '커튼', '수납', '선반', '행거', '옷걸이'],
  '의류': ['의류', '옷', '신발', '가방', '티셔츠', '바지', '패딩', '코트', '점퍼', '자켓', '스니커즈', '슬리퍼', '운동화', '청바지', '레깅스'],
  '화장품': ['화장품', '스킨케어', '로션', '크림', '에센스', '앰플', '샴푸', '비누', '선크림', '마스크팩', '파운데이션', '립스틱', '향수'],
  '게임': ['게임', '플스', 'ps5', 'ps4', 'xbox', '닌텐도', '스팀', '게이밍', '플레이스테이션'],
  '해외핫딜': ['아마존', '해외', '직구', '알리', '이베이', 'amazon', 'aliexpress', '알리익스프레스', '해외구매'],
};

function categorize(title) {
  const lower = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return '기타';
}

function extractPrice(title) {
  const patterns = [
    /[\[（\(](\d[\d,]+)\s*원/,
    /(\d[\d,]+)\s*원/,
  ];
  for (const re of patterns) {
    const m = title.match(re);
    if (m) return m[1] + '원';
  }
  return null;
}

function makeId(prefix, link) {
  return `${prefix}_${Buffer.from(link).toString('base64url').slice(-16)}`;
}

function normalizeImg(src, base) {
  if (!src) return null;
  src = src.trim();
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return base + src;
  return null;
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Cache-Control': 'no-cache',
};

// 개별 페이지에서 OG 이미지 추출 (새 딜에만 사용)
async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const og = $('meta[property="og:image"]').attr('content')
      || $('meta[name="twitter:image"]').attr('content');
    if (!og) return null;
    // 루리웹 등 상대 경로 처리
    try { return new URL(og, url).href; } catch { return og; }
  } catch {
    return null;
  }
}

// 동시 5개씩 OG 이미지 수집
async function enrichWithImages(deals) {
  const CONCURRENCY = 5;
  const noImg = deals.filter(d => !d.image);
  console.log(`OG 이미지 수집: ${noImg.length}개 대상`);

  for (let i = 0; i < noImg.length; i += CONCURRENCY) {
    const chunk = noImg.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async deal => {
      deal.image = await fetchOgImage(deal.link);
    }));
  }
}

// ─── 뽐뿌 ───────────────────────────────────────────────────────────────────
async function fetchPpomppu() {
  const deals = [];
  try {
    const res = await fetch('https://www.ppomppu.co.kr/zboard/zboard.php?id=hotdeal', { headers: HEADERS });
    if (!res.ok) { console.log(`뽐뿌 응답 오류: ${res.status}`); return deals; }

    const html = await res.text();
    const $ = cheerio.load(html);

    $('tr').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('a[href*="zboard.php"]').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 5) return;

      const link = href.startsWith('http') ? href : `https://www.ppomppu.co.kr/zboard/${href}`;

      // 목록 썸네일 시도
      const $img = $el.find('img.thumb, img[src*="thumb"], td.title img').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || null;
      const image = normalizeImg(imgSrc, 'https://www.ppomppu.co.kr');

      const cells = $el.find('td');
      const dateText = cells.filter((_, td) => /\d{2}\/\d{2}|\d{4}-\d{2}/.test($(td).text().trim())).first().text().trim();
      const likes = parseInt(cells.last().text().replace(/\D/g, '')) || 0;

      deals.push({
        id: makeId('pp', link),
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        image,
        category: categorize(title),
        source: '뽐뿌',
        sourceColor: '#FF6B35',
        link,
        publishedAt: dateText || '',
        likes,
        fetchedAt: new Date().toISOString(),
      });
    });

    console.log(`뽐뿌: ${deals.length}개 파싱`);
  } catch (err) {
    console.error('뽐뿌 크롤링 오류:', err.message);
  }
  return deals;
}

// ─── 클리앙 ──────────────────────────────────────────────────────────────────
async function fetchClien() {
  const deals = [];
  try {
    const res = await fetch('https://www.clien.net/service/board/jirum', { headers: HEADERS });
    if (!res.ok) { console.log(`클리앙 응답 오류: ${res.status}`); return deals; }

    const html = await res.text();
    const $ = cheerio.load(html);

    $('.list_item').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('.subject_span a, .list_subject a').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href) return;

      const link = href.startsWith('http') ? href : `https://www.clien.net${href}`;

      // 목록 썸네일 시도
      const $img = $el.find('.list_img img, .subject_img img, img.thumb').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || null;
      const image = normalizeImg(imgSrc, 'https://www.clien.net');

      const $time = $el.find('time').first();
      const dateText = $time.attr('datetime') || $time.attr('title') || '';
      const likes = parseInt($el.find('.list_recommend span').first().text().trim()) || 0;

      deals.push({
        id: makeId('cl', link),
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        image,
        category: categorize(title),
        source: '클리앙',
        sourceColor: '#2A6EBB',
        link,
        publishedAt: dateText,
        likes,
        fetchedAt: new Date().toISOString(),
      });
    });

    console.log(`클리앙: ${deals.length}개 파싱`);
  } catch (err) {
    console.error('클리앙 크롤링 오류:', err.message);
  }
  return deals;
}

// ─── 루리웹 ──────────────────────────────────────────────────────────────────
async function fetchRuliweb() {
  const deals = [];
  try {
    const res = await fetch('https://bbs.ruliweb.com/market/board/1020', { headers: HEADERS });
    if (!res.ok) { console.log(`루리웹 응답 오류: ${res.status}`); return deals; }

    const html = await res.text();
    const $ = cheerio.load(html);

    $('tr.table_body').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('a.subject_link').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 5) return;

      const link = href.startsWith('http') ? href : `https://bbs.ruliweb.com${href}`;

      // 루리웹은 목록에 썸네일 있음
      const $img = $el.find('.thumbnail img, .subject_img img, td.subject img, img.lazy').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || null;
      const image = normalizeImg(imgSrc, 'https://bbs.ruliweb.com');

      const $timeEl = $el.find('time').first();
      const dateText = $timeEl.attr('datetime') || $el.find('.time_date').first().text().trim();
      const likes = parseInt($el.find('.recomd').first().text().trim()) || 0;

      deals.push({
        id: makeId('rl', link),
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        image,
        category: categorize(title),
        source: '루리웹',
        sourceColor: '#3B82F6',
        link,
        publishedAt: dateText || '',
        likes,
        fetchedAt: new Date().toISOString(),
      });
    });

    console.log(`루리웹: ${deals.length}개 파싱`);
  } catch (err) {
    console.error('루리웹 크롤링 오류:', err.message);
  }
  return deals;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('핫딜 수집 시작...');

  const [ppDeals, clDeals, rlDeals] = await Promise.all([
    fetchPpomppu(),
    fetchClien(),
    fetchRuliweb(),
  ]);

  const allNew = [...ppDeals, ...clDeals, ...rlDeals];
  console.log(`전체 수집: ${allNew.length}개`);

  const outputPath = path.join(process.cwd(), 'public', 'data', 'hotdeals.json');

  let existing = { deals: [] };
  try { existing = JSON.parse(fs.readFileSync(outputPath, 'utf8')); } catch {}

  const existingLinks = new Set((existing.deals || []).map(d => d.link));

  // 신규 딜만 필터
  const newDeals = allNew.filter(d => d.title.length > 3 && !existingLinks.has(d.link));
  console.log(`신규: ${newDeals.length}개`);

  // 신규 딜에 OG 이미지 보충
  if (newDeals.length > 0) {
    await enrichWithImages(newDeals);
  }

  // 기존 딜도 image 없는 것만 재시도 (최대 10개, 오래된 것 제외)
  const existingNoImg = (existing.deals || []).filter(d => !d.image).slice(0, 10);
  if (existingNoImg.length > 0) {
    console.log(`기존 딜 이미지 보충: ${existingNoImg.length}개`);
    await enrichWithImages(existingNoImg);
  }

  // 합치기 (최신 500개 유지)
  const combined = [...newDeals, ...(existing.deals || [])].slice(0, 500);

  fs.writeFileSync(outputPath, JSON.stringify({
    deals: combined,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');

  console.log(`저장 완료: 총 ${combined.length}개 (신규 ${newDeals.length}개)`);
}

main().catch(console.error);
