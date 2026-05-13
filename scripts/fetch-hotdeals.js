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

const IMG_DIR = path.join(process.cwd(), 'public', 'hotdeal-images');

function ensureImgDir() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
}

function categorize(title) {
  const lower = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return '기타';
}

function extractPrice(text) {
  if (!text) return null;
  const patterns = [/[\[（\(](\d[\d,]+)\s*원/, /(\d[\d,]+)\s*원/];
  for (const re of patterns) {
    const m = text.match(re);
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
  if (src.startsWith('data:') || src.length < 10) return null;
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return base + src;
  return null;
}

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
};

function siteHeaders(referer) {
  return { ...BASE_HEADERS, 'Referer': referer };
}

// ─── 이미지 다운로드 ──────────────────────────────────────────────────────────

async function fetchOgImage(url, referer) {
  try {
    const res = await fetch(url, {
      headers: siteHeaders(referer),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const og = $('meta[property="og:image"]').attr('content')
      || $('meta[name="twitter:image"]').attr('content');
    if (!og) return null;
    try { return new URL(og, url).href; } catch { return og; }
  } catch {
    return null;
  }
}

async function downloadImage(imageUrl, dealId, referer) {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl, {
      headers: { ...BASE_HEADERS, 'Referer': referer, 'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return null;
    const extMap = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/avif': 'avif' };
    const ext = extMap[ct.split(';')[0].trim()] || 'jpg';
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) return null;
    const filename = `${dealId}.${ext}`;
    fs.writeFileSync(path.join(IMG_DIR, filename), buf);
    return `/hotdeal-images/${filename}`;
  } catch {
    return null;
  }
}

const REFERER_MAP = {
  'FM코리아': 'https://www.fmkorea.com',
  '퀘이사존': 'https://quasarzone.com',
  '아카라이브': 'https://arca.live',
  '개드립': 'https://www.dogdrip.net',
  '루리웹': 'https://bbs.ruliweb.com',
  '클리앙': 'https://www.clien.net',
};

async function downloadImages(deals) {
  const CONCURRENCY = 5;
  let ok = 0;
  for (let i = 0; i < deals.length; i += CONCURRENCY) {
    const chunk = deals.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async deal => {
      const referer = REFERER_MAP[deal.source] || '';
      let imgUrl = deal.imageUrl || null;
      if (!imgUrl) imgUrl = await fetchOgImage(deal.link, referer);
      if (imgUrl) {
        const local = await downloadImage(imgUrl, deal.id, referer);
        if (local) { deal.image = local; ok++; }
      }
      delete deal.imageUrl;
    }));
  }
  console.log(`이미지 다운로드: ${ok}/${deals.length}개 성공`);
}

function cleanupOldImages(keepIds) {
  if (!fs.existsSync(IMG_DIR)) return;
  const keepSet = new Set(keepIds);
  let removed = 0;
  for (const file of fs.readdirSync(IMG_DIR)) {
    if (!keepSet.has(file.replace(/\.[^.]+$/, ''))) {
      fs.unlinkSync(path.join(IMG_DIR, file));
      removed++;
    }
  }
  if (removed > 0) console.log(`오래된 이미지 ${removed}개 삭제`);
}

// ─── FM코리아 ─────────────────────────────────────────────────────────────────
async function fetchFmkorea() {
  const deals = [];
  try {
    const res = await fetch('https://www.fmkorea.com/hotdeal', { headers: siteHeaders('https://www.fmkorea.com') });
    if (!res.ok) { console.log(`FM코리아 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    $('#content .fm_best_widget ul li').each((i, el) => {
      const $el = $(el);
      // 종료된 딜 제외
      if ($el.find('.hotdeal_var8Y').length > 0) return;

      const $a = $el.find('.title a').first();
      const title = $a.text().replace(/\[\d+\]/g, '').trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 3) return;

      const link = href.startsWith('http') ? href : `https://www.fmkorea.com${href}`;

      // hotdeal_info에서 가격 추출 우선
      let price = null;
      $el.find('.hotdeal_info span, .hotdeal_info a').each((_, s) => {
        const t = $(s).text().trim();
        if (!price) price = extractPrice(t);
      });
      if (!price) price = extractPrice(title);

      // 썸네일
      const $img = $el.find('img').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || null;
      const imageUrl = normalizeImg(imgSrc, 'https://www.fmkorea.com');

      const likes = parseInt($el.find('.pc_voted_count .count').text().trim()) || 0;

      deals.push({
        id: makeId('fm', link), title, price,
        image: null, imageUrl,
        category: categorize(title),
        source: 'FM코리아', sourceColor: '#FF8C00',
        link, publishedAt: '', likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`FM코리아: ${deals.length}개 파싱`);
  } catch (err) { console.error('FM코리아 오류:', err.message); }
  return deals;
}

// ─── 퀘이사존 ─────────────────────────────────────────────────────────────────
async function fetchQuasarzone() {
  const deals = [];
  try {
    const res = await fetch('https://quasarzone.com/bbs/qb_saleinfo', { headers: siteHeaders('https://quasarzone.com') });
    if (!res.ok) { console.log(`퀘이사존 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    $('.market-info-type-list table tbody tr').each((i, el) => {
      const $el = $(el);
      // 종료된 딜 제외
      if ($el.find('.label').text().trim() === '종료') return;

      const $a = $el.find('a.subject-link').first();
      const titleEl = $el.find('.ellipsis-with-reply-cnt').first();
      const title = (titleEl.text() || $a.text()).replace(/\[\d+\]/g, '').trim();
      const href = $a.attr('href');
      if (!title || !href) return;

      const link = href.startsWith('http') ? href : `https://quasarzone.com${href}`;

      // market-info-sub에서 가격
      let price = null;
      $el.find('.market-info-sub span').each((_, s) => {
        const t = $(s).text().trim();
        if (!price) price = extractPrice(t);
      });
      if (!price) price = extractPrice(title);

      // 썸네일 (목록에 있을 경우)
      const $img = $el.find('img').first();
      const imageUrl = normalizeImg($img.attr('src') || $img.attr('data-src') || null, 'https://quasarzone.com');

      const likes = parseInt($el.find('td .num').first().text().trim()) || 0;

      deals.push({
        id: makeId('qz', link), title, price,
        image: null, imageUrl,
        category: categorize(title),
        source: '퀘이사존', sourceColor: '#7C3AED',
        link, publishedAt: '', likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`퀘이사존: ${deals.length}개 파싱`);
  } catch (err) { console.error('퀘이사존 오류:', err.message); }
  return deals;
}

// ─── 아카라이브 ───────────────────────────────────────────────────────────────
async function fetchArcalive() {
  const deals = [];
  try {
    const res = await fetch('https://arca.live/b/hotdeal', { headers: siteHeaders('https://arca.live') });
    if (!res.ok) { console.log(`아카라이브 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    $('.list-table .vrow.hybrid').each((i, el) => {
      const $el = $(el);
      // 종료 제외
      if ($el.find('.deal-close').length > 0) return;

      const href = $el.attr('href');
      // 제목: .title의 직계 텍스트 노드만
      const titleEl = $el.find('.title').first();
      const title = titleEl.contents()
        .filter((_, n) => n.nodeType === 3)
        .text().trim() || titleEl.text().trim();

      if (!title || !href) return;
      const link = href.startsWith('http') ? href : `https://arca.live${href}`;

      // deal-price가 있으면 우선 사용
      const dealPrice = $el.find('.deal-price').text().trim();
      const price = extractPrice(dealPrice) || extractPrice(title);

      // 썸네일 이미지 시도
      const $img = $el.find('img').first();
      const imageUrl = normalizeImg($img.attr('src') || $img.attr('data-src') || null, 'https://arca.live');

      const likes = parseInt($el.find('.col-rate').text().trim()) || 0;
      const dateText = $el.find('time').attr('datetime') || '';

      deals.push({
        id: makeId('ac', link), title, price,
        image: null, imageUrl,
        category: categorize(title),
        source: '아카라이브', sourceColor: '#0D9488',
        link, publishedAt: dateText, likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`아카라이브: ${deals.length}개 파싱`);
  } catch (err) { console.error('아카라이브 오류:', err.message); }
  return deals;
}

// ─── 개드립 ───────────────────────────────────────────────────────────────────
async function fetchDogdrip() {
  const deals = [];
  try {
    const res = await fetch('https://www.dogdrip.net/hotdeal', { headers: siteHeaders('https://www.dogdrip.net') });
    if (!res.ok) { console.log(`개드립 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    // 개드립 ul.list > li 구조
    $('.list li:not(.notice)').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('a.title-link').first();
      const title = $a.text().trim();
      let href = $a.attr('href');
      if (!title || !href || title.length < 3) return;

      if (!href.startsWith('http')) href = `https://www.dogdrip.net${href}`;
      // 쿼리스트링 제거 (clean URL)
      try { href = new URL(href).origin + new URL(href).pathname; } catch {}

      // 썸네일
      const $img = $el.find('img.webzine-thumbnail').first();
      const imageUrl = normalizeImg($img.attr('src') || null, 'https://www.dogdrip.net');

      // 추천수
      const likes = parseInt($el.find('.text-primary').last().text().trim()) || 0;
      // 날짜 (시간 표시)
      const dateText = $el.find('.text-muted').last().text().replace(/\s+/g, ' ').trim();

      deals.push({
        id: makeId('dd', href), title,
        price: extractPrice(title),
        image: null, imageUrl,
        category: categorize(title),
        source: '개드립', sourceColor: '#DC2626',
        link: href, publishedAt: dateText, likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`개드립: ${deals.length}개 파싱`);
  } catch (err) { console.error('개드립 오류:', err.message); }
  return deals;
}

// ─── 루리웹 ───────────────────────────────────────────────────────────────────
async function fetchRuliweb() {
  const deals = [];
  try {
    const res = await fetch('https://bbs.ruliweb.com/market/board/1020', { headers: siteHeaders('https://bbs.ruliweb.com') });
    if (!res.ok) { console.log(`루리웹 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    $('tr.table_body').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('a.subject_link').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 5) return;

      const link = href.startsWith('http') ? href : `https://bbs.ruliweb.com${href}`;
      const $img = $el.find('.thumbnail img, .subject_img img, img.lazy').first();
      const imageUrl = normalizeImg(
        $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || null,
        'https://bbs.ruliweb.com'
      );
      const $timeEl = $el.find('time').first();
      const dateText = $timeEl.attr('datetime') || $el.find('.time_date').first().text().trim();
      const likes = parseInt($el.find('.recomd').first().text().trim()) || 0;

      deals.push({
        id: makeId('rl', link), title,
        price: extractPrice(title),
        image: null, imageUrl,
        category: categorize(title),
        source: '루리웹', sourceColor: '#3B82F6',
        link, publishedAt: dateText, likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`루리웹: ${deals.length}개 파싱`);
  } catch (err) { console.error('루리웹 오류:', err.message); }
  return deals;
}

// ─── 클리앙 ───────────────────────────────────────────────────────────────────
async function fetchClien() {
  const deals = [];
  try {
    const res = await fetch('https://www.clien.net/service/board/jirum', { headers: siteHeaders('https://www.clien.net') });
    if (!res.ok) { console.log(`클리앙 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    $('.list_item').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('.subject_span a, .list_subject a').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href) return;

      const link = href.startsWith('http') ? href : `https://www.clien.net${href}`;
      const $img = $el.find('.list_img img, .subject_img img').first();
      const imageUrl = normalizeImg($img.attr('src') || $img.attr('data-src') || null, 'https://www.clien.net');
      const $time = $el.find('time').first();
      const dateText = $time.attr('datetime') || $time.attr('title') || '';
      const likes = parseInt($el.find('.list_recommend span').first().text().trim()) || 0;

      deals.push({
        id: makeId('cl', link), title,
        price: extractPrice(title),
        image: null, imageUrl,
        category: categorize(title),
        source: '클리앙', sourceColor: '#2A6EBB',
        link, publishedAt: dateText, likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`클리앙: ${deals.length}개 파싱`);
  } catch (err) { console.error('클리앙 오류:', err.message); }
  return deals;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('핫딜 수집 시작...');
  ensureImgDir();

  const [fmDeals, qzDeals, acDeals, ddDeals, rlDeals, clDeals] = await Promise.all([
    fetchFmkorea(),
    fetchQuasarzone(),
    fetchArcalive(),
    fetchDogdrip(),
    fetchRuliweb(),
    fetchClien(),
  ]);

  const allNew = [...fmDeals, ...qzDeals, ...acDeals, ...ddDeals, ...rlDeals, ...clDeals];
  console.log(`전체 수집: ${allNew.length}개`);

  const outputPath = path.join(process.cwd(), 'public', 'data', 'hotdeals.json');
  let existing = { deals: [] };
  try { existing = JSON.parse(fs.readFileSync(outputPath, 'utf8')); } catch {}

  const existingLinks = new Set((existing.deals || []).map(d => d.link));
  const newDeals = allNew.filter(d => d.title.length > 3 && !existingLinks.has(d.link));
  console.log(`신규: ${newDeals.length}개`);

  if (newDeals.length > 0) await downloadImages(newDeals);

  // 기존 이미지 없는 딜 재시도 (최대 10개)
  const retryDeals = (existing.deals || []).filter(d => !d.image).slice(0, 10).map(d => ({ ...d, imageUrl: null }));
  if (retryDeals.length > 0) {
    console.log(`기존 이미지 재시도: ${retryDeals.length}개`);
    await downloadImages(retryDeals);
    const retryMap = new Map(retryDeals.map(d => [d.id, d.image]));
    for (const d of (existing.deals || [])) {
      if (retryMap.get(d.id)) d.image = retryMap.get(d.id);
    }
  }

  const combined = [...newDeals, ...(existing.deals || [])].slice(0, 600);
  cleanupOldImages(combined.map(d => d.id));

  fs.writeFileSync(outputPath, JSON.stringify({
    deals: combined,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');

  console.log(`저장 완료: 총 ${combined.length}개 (신규 ${newDeals.length}개)`);
}

main().catch(console.error);
