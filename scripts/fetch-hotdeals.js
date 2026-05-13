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

function extractPrice(title) {
  const patterns = [/[\[（\(](\d[\d,]+)\s*원/, /(\d[\d,]+)\s*원/];
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

// 소스별 Referer 매핑
const REFERER_MAP = {
  '루리웹': 'https://bbs.ruliweb.com',
  '클리앙': 'https://www.clien.net',
  '뽐뿌': 'https://www.ppomppu.co.kr',
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Cache-Control': 'no-cache',
};

// 이미지를 로컬에 다운로드하고 /hotdeal-images/{id}.{ext} 경로 반환
async function downloadImage(imageUrl, dealId, referer) {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl, {
      headers: {
        ...HEADERS,
        'Referer': referer,
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return null;

    // 확장자 결정
    const extMap = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/avif': 'avif' };
    const ext = extMap[contentType.split(';')[0].trim()] || 'jpg';

    const filename = `${dealId}.${ext}`;
    const dest = path.join(IMG_DIR, filename);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return null; // 너무 작으면 오류 이미지
    fs.writeFileSync(dest, buffer);
    return `/hotdeal-images/${filename}`;
  } catch {
    return null;
  }
}

// OG 이미지 URL 추출
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
    try { return new URL(og, url).href; } catch { return og; }
  } catch {
    return null;
  }
}

// 신규 딜 이미지 다운로드 (동시 5개)
async function downloadImages(deals) {
  const CONCURRENCY = 5;
  let downloaded = 0;
  for (let i = 0; i < deals.length; i += CONCURRENCY) {
    const chunk = deals.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async deal => {
      const referer = REFERER_MAP[deal.source] || '';
      let imgUrl = deal.imageUrl; // 원본 URL

      // 목록에서 가져온 URL이 없으면 OG 이미지 시도
      if (!imgUrl) {
        imgUrl = await fetchOgImage(deal.link);
      }

      if (imgUrl) {
        const local = await downloadImage(imgUrl, deal.id, referer);
        if (local) {
          deal.image = local;
          downloaded++;
        }
      }
      delete deal.imageUrl; // 임시 필드 제거
    }));
  }
  console.log(`이미지 다운로드: ${downloaded}/${deals.length}개 성공`);
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
      const $img = $el.find('img.thumb, img[src*="thumb"], td.title img').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || null;
      const imageUrl = normalizeImg(imgSrc, 'https://www.ppomppu.co.kr');

      const cells = $el.find('td');
      const dateText = cells.filter((_, td) => /\d{2}\/\d{2}|\d{4}-\d{2}/.test($(td).text().trim())).first().text().trim();
      const likes = parseInt(cells.last().text().replace(/\D/g, '')) || 0;

      deals.push({
        id: makeId('pp', link),
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        image: null,
        imageUrl,       // 임시: 다운로드 후 제거
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
      const $img = $el.find('.list_img img, .subject_img img, img.thumb').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || null;
      const imageUrl = normalizeImg(imgSrc, 'https://www.clien.net');

      const $time = $el.find('time').first();
      const dateText = $time.attr('datetime') || $time.attr('title') || '';
      const likes = parseInt($el.find('.list_recommend span').first().text().trim()) || 0;

      deals.push({
        id: makeId('cl', link),
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        image: null,
        imageUrl,
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
      const $img = $el.find('.thumbnail img, .subject_img img, td.subject img, img.lazy').first();
      const imgSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original') || null;
      const imageUrl = normalizeImg(imgSrc, 'https://bbs.ruliweb.com');

      const $timeEl = $el.find('time').first();
      const dateText = $timeEl.attr('datetime') || $el.find('.time_date').first().text().trim();
      const likes = parseInt($el.find('.recomd').first().text().trim()) || 0;

      deals.push({
        id: makeId('rl', link),
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        image: null,
        imageUrl,
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

// 오래된 이미지 파일 정리 (보관할 ID 목록 외 삭제)
function cleanupOldImages(keepIds) {
  if (!fs.existsSync(IMG_DIR)) return;
  const keepSet = new Set(keepIds);
  const files = fs.readdirSync(IMG_DIR);
  let removed = 0;
  for (const file of files) {
    const idPart = file.replace(/\.[^.]+$/, ''); // 확장자 제거
    if (!keepSet.has(idPart)) {
      fs.unlinkSync(path.join(IMG_DIR, file));
      removed++;
    }
  }
  if (removed > 0) console.log(`오래된 이미지 ${removed}개 삭제`);
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('핫딜 수집 시작...');
  ensureImgDir();

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
  const newDeals = allNew.filter(d => d.title.length > 3 && !existingLinks.has(d.link));
  console.log(`신규: ${newDeals.length}개`);

  // 신규 딜 이미지 다운로드
  if (newDeals.length > 0) {
    await downloadImages(newDeals);
  }

  // 기존 딜 중 이미지 없는 것 최대 10개 재시도
  const retryDeals = (existing.deals || [])
    .filter(d => !d.image)
    .slice(0, 10)
    .map(d => ({ ...d, imageUrl: null }));
  if (retryDeals.length > 0) {
    console.log(`기존 딜 이미지 재시도: ${retryDeals.length}개`);
    await downloadImages(retryDeals);
    // 업데이트 반영
    const retryMap = new Map(retryDeals.map(d => [d.id, d.image]));
    for (const d of (existing.deals || [])) {
      if (retryMap.has(d.id) && retryMap.get(d.id)) {
        d.image = retryMap.get(d.id);
      }
    }
  }

  const combined = [...newDeals, ...(existing.deals || [])].slice(0, 500);

  // 사용 중인 이미지 ID만 보관
  cleanupOldImages(combined.map(d => d.id));

  fs.writeFileSync(outputPath, JSON.stringify({
    deals: combined,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');

  console.log(`저장 완료: 총 ${combined.length}개 (신규 ${newDeals.length}개)`);
}

main().catch(console.error);
