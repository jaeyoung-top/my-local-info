const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const CATEGORY_KEYWORDS = {
  'PC': [
    'pc', '컴퓨터', '노트북', '그래픽카드', 'cpu', '메모리', 'ram', 'ssd', 'hdd', 'nvme',
    '마우스', '키보드', '모니터', '웹캠', '헤드셋', '스피커', '라우터', '공유기',
    'rtx', 'rx ', 'rx9', 'rx8', 'rx7', '인텔', 'amd', '라이젠', '코어i', '코어 i',
    '이어폰', '블루투스', '무선이어폰', '에어팟', '갤럭시버즈', 'qcy', 'jbl', 'sony wf', 'galaxy buds',
    '보조배터리', '파워뱅크', '충전기', 'usb', 'usb 허브', 'c타입', '어댑터',
    '아이폰', '갤럭시', '스마트폰', '휴대폰', '태블릿', '아이패드', '스마트워치', '갤럭시워치',
    'hdmi', '케이블', '파워서플라이', '메인보드', '쿨러', '케이스', 'ssd', '외장하드',
    '프린터', '스캐너', '웹캠', '마이크', '앤커', 'anker', 'ugreen', 'baseus',
    '비보북', '갤럭시북', '맥북', '그램 ', '엑스복', '프로북', '비브북', '노트북',
  ],
  '가전': [
    'tv ', ' tv', 'oled', 'qled', '냉장고', '세탁기', '에어컨', '청소기', '에어프라이어',
    '전자레인지', '공기청정기', '건조기', '식기세척기', '전기밥솥', '블렌더', '믹서기',
    '헤어드라이어', '다리미', '선풍기', '제습기', '가습기', '전기포트', '전기주전자',
    '인덕션', '커피머신', '커피메이커', '로봇청소기', '스팀청소기', '음식물처리기',
    '전동칫솔', '헤어스타일러', '고데기', '면도기', '제모기', '안마기', '마사지기',
    '냉풍기', '온풍기', '전기히터', '전기장판', '온열매트',
    '후라이팬', '프라이팬', '냄비', '텀블러', '보온병', '스탠리', '서모스', '해피콜',
    '밥솥', '오븐', '토스터', '와플메이커', '착즙기', '제빵기',
  ],
  '식품': [
    '식품', '과자', '음료', '커피', '라면', '쌀', '고기', '야채', '과일',
    '치킨', '피자', '버거', '초콜릿', '과즙', '홍삼', '비타민', '단백질', '프로틴',
    '두유', '우유', '주스', '콜라', '사이다', '맥주', '소주', '막걸리', '와인', '보드카',
    '캔 ', '봉 ', '팩 ', '입 ', '개입', '캔+', '봉+',
    '간식', '스낵', '젤리', '사탕', '견과', '아몬드', '캐슈넛', '호두', '땅콩',
    '김 ', '참외', '딸기', '수박', '포도', '사과', '복숭아', '망고', '블루베리',
    '감자', '고구마', '연어', '새우', '참치', '불고기', '삼겹살', '오겹살', '갈비', '한우',
    '꿀 ', '잼 ', '시리얼', '오메가', '유산균', '콜라겐', '닭가슴살', '만두',
    '냉동 ', '냉장 ', '두부', '치즈', '버터', '요거트', '아이스크림',
    '밀키스', '피크닉', '매일유업', '빙그레', '롯데칠성', '동원', '씨제이', 'cj ',
    '배홍동', '농심', '오뚜기', '풀무원', '샘표', '청정원', '오레오',
    '그래놀라', '켈로그', '커리 ', '카레', '돈까스', '소시지', '햄 ', '에너지 드링크',
    '에너지드링크', '몬스터 ', '핫식스', '레드불', '라떼', '교자', '비빔면', '냉면',
    '스파게티', '파스타', '칩스', '포카칩', '프링글스', '트레이닝푸드',
    '펩시', '삼양 ', '불닭', '오리온', '목우촌', '하림', '비비고', '매실', '녹차 ',
    '홍차', '블랙티', '아이스티', '소스 ', '드레싱', '케첩', '마요',
    '멸균우유', '분유', '이유식', '영양제', '건강기능식품',
    '올리브유', '참기름', '들기름', '생강청', '인절미', '카스테라', '떡 ', '빵 ', '베이글',
    '과일청', '꿀생강', '모카골드', '맥심', '티백', '녹차티', '레몬청',
    '계란', '달걀', '콜드브루', '블랙커피', '아메리카노', '에스프레소',
    '30정', '60정', '90정', '120정', '30캡슐', '60캡슐', '멀티비타민',
  ],
  '생활용품': [
    '주방', '욕실', '세제', '휴지', '수건', '침구', '이불', '베개', '커튼',
    '수납', '선반', '행거', '옷걸이', '키친타올', '키친타월', '타올', '타월',
    '주방세제', '세탁세제', '섬유유연제', '칫솔', '치약', '면도기', '화장지', '물티슈',
    '지퍼백', '위생팩', '빨대', '고무장갑', '비닐봉투', '쓰레기봉투',
    '방향제', '탈취제', '살충제', '모기향', '방충제',
    '의자', '책상', '테이블', '침대 ', '소파', '매트리스', '에어매트',
    '조명', '전구', 'led', '스탠드', '형광등',
    '세면도구', '욕실용품', '샤워기', '변기',
    '깨끗한나라', '유한킴벌리', '크리넥스', '스카트', '테크',
    '식기', '그릇', '냄비', '컵 ', '텀블러', '머그', '보온병', '젖병', '문풍지', '카시트',
  ],
  '의류': [
    '의류', ' 옷 ', '신발', '가방', '티셔츠', '바지', '패딩', '코트', '점퍼', '재킷', '자켓',
    '스니커즈', '슬리퍼', '운동화', '청바지', '레깅스', '원피스', '치마', '스커트',
    '블라우스', '셔츠', '남방', '후드티', '후드집업', '맨투맨', '스웨터', '니트', '가디건',
    '조거팬츠', '트레이닝', '반팔', '긴팔', '민소매', '속옷', '브라', '팬티',
    '양말', '장갑', '모자', '캡', '비니', '벨트', '지갑', '백팩', '크로스백', '토트백',
    '부츠', '구두', '로퍼', '샌들', '슬립온', '힐',
    '나이키', '아디다스', '뉴발란스', '리복', '언더아머', '폴로', '라코스테', '휠라', '챔피언',
    '노스페이스', '아이더', '블랙야크', '네파', '콜롬비아', '파타고니아',
    '유니클로', 'h&m', '자라', '무신사',
    '크록스', '스케쳐스', '컨버스', '반스', '팀버랜드', '닥터마틴',
    '중목', '단목', '장목', '발목양말', '무릎양말',
    '숏패딩', '롱패딩', '항공점퍼', '빕바지', '레인코트', '우비',
  ],
  '화장품': [
    '화장품', '스킨케어', '로션', '크림', '에센스', '앰플', '선크림', '선스크린', '자외선차단',
    '마스크팩', '파운데이션', '립스틱', '향수', '보습제', '미스트', '클렌징',
    '메이크업', '아이섀도', '틴트', '쿠션', '비비크림', '컨실러',
    '샴푸', '린스', '트리트먼트', '헤어에센스', '헤어팩', '두피',
    '바디로션', '바디워시', '바디크림', '핸드크림',
    '도브', '니베아', '존슨앤존슨', '아베다', '이니스프리', '라네즈', '헤라', '설화수',
    '더후', '오휘', '숨', '수려한', '미샤', '이니스프리', '에뛰드', '토니모리',
  ],
  '게임': [
    '게임 ', ' 게임', '플스', 'ps5', 'ps4', 'xbox', '닌텐도', '스팀', '게이밍', '플레이스테이션',
    '스위치', '조이스틱', '게임패드', '컨트롤러', '리딤코드', '게임기',
    '마인크래프트', '배틀그라운드', '롤', '오버워치',
    'psn', 'ps스토어', 'epic', '에픽스토어', '에픽 스토어', '스팀게임',
    '포르자', '호라이즌', '언차티드', '데스스트랜딩', '갓오브워',
    '레이저', 'razer', '게이머즈', '로블록스',
  ],
  '해외핫딜': [
    '아마존', '직구', '알리익스프레스', '알리 ', '이베이', 'amazon', 'aliexpress',
    '해외직배', 'b&h', 'bhphoto', '달러', 'usd', '엔화', '해외배송',
  ],
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
    if (ext === 'gif' && buf.length < 5000) return null;
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
  '82cook': 'https://www.82cook.com',
  '뽐뿌': 'https://www.ppomppu.co.kr',
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

      // FM코리아 목록 썸네일은 placeholder gif — OG 이미지로 대체
      const imageUrl = null;

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

// ─── 82cook 쇼핑정보 ──────────────────────────────────────────────────────────
async function fetch82cook() {
  const deals = [];
  try {
    const res = await fetch('https://www.82cook.com/entiz/enti.php?bn=31', {
      headers: siteHeaders('https://www.82cook.com'),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { console.log(`82cook 오류: ${res.status}`); return deals; }
    const $ = cheerio.load(await res.text());

    $('#bbs table tbody tr:not(.noticeList)').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('td.title a').first();
      const title = $a.text().replace(/\s*\[\d+\]\s*$/, '').trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 3) return;

      const link = href.startsWith('http')
        ? href
        : `https://www.82cook.com/entiz/${href.replace(/^\/+/, '')}`;

      const dateText = $el.find('td.regdate').text().trim();
      const likes = parseInt($el.find('td.numbers').last().text().replace(/,/g, '').trim()) || 0;

      deals.push({
        id: makeId('cook', link), title,
        price: extractPrice(title),
        image: null, imageUrl: null,
        category: categorize(title),
        source: '82cook', sourceColor: '#EC4899',
        link, publishedAt: dateText, likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`82cook: ${deals.length}개 파싱`);
  } catch (err) { console.error('82cook 오류:', err.message); }
  return deals;
}

// ─── 뽐뿌 ────────────────────────────────────────────────────────────────────
async function fetchPpomppu() {
  const deals = [];
  try {
    const res = await fetch('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu', {
      headers: siteHeaders('https://www.ppomppu.co.kr'),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { console.log(`뽐뿌 오류: ${res.status}`); return deals; }
    const buf = Buffer.from(await res.arrayBuffer());
    const html = iconv.decode(buf, 'euc-kr');
    const $ = cheerio.load(html);

    $('tr:not(.baseNotice)').each((i, el) => {
      const $el = $(el);
      const $a = $el.find('a.baseList-title').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 3) return;
      if (!href.includes('id=ppomppu')) return;

      const link = href.startsWith('/')
        ? `https://www.ppomppu.co.kr${href}`
        : `https://www.ppomppu.co.kr/zboard/${href}`;

      const $img = $el.find('img[src*="cdn2.ppomppu.co.kr"]').first();
      const imgSrc = $img.attr('src') || null;
      const imageUrl = imgSrc
        ? (imgSrc.startsWith('//') ? 'https:' + imgSrc : imgSrc)
        : null;

      const recText = $el.find('.baseList-rec').text().trim();
      const likes = parseInt(recText.split('-')[0].trim()) || 0;
      const dateText = $el.find('.baseList-time').text().trim();

      deals.push({
        id: makeId('pp', link), title,
        price: extractPrice(title),
        image: null, imageUrl,
        category: categorize(title),
        source: '뽐뿌', sourceColor: '#4F46E5',
        link, publishedAt: dateText, likes,
        fetchedAt: new Date().toISOString(),
      });
    });
    console.log(`뽐뿌: ${deals.length}개 파싱`);
  } catch (err) { console.error('뽐뿌 오류:', err.message); }
  return deals;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('핫딜 수집 시작...');
  ensureImgDir();

  const [fmDeals, qzDeals, ddDeals, rlDeals, clDeals, cookDeals, ppDeals] = await Promise.all([
    fetchFmkorea(),
    fetchQuasarzone(),
    fetchDogdrip(),
    fetchRuliweb(),
    fetchClien(),
    fetch82cook(),
    fetchPpomppu(),
  ]);

  const allNew = [...fmDeals, ...qzDeals, ...ddDeals, ...rlDeals, ...clDeals, ...cookDeals, ...ppDeals];
  console.log(`전체 수집: ${allNew.length}개`);

  const outputPath = path.join(process.cwd(), 'public', 'data', 'hotdeals.json');
  let existing = { deals: [] };
  try { existing = JSON.parse(fs.readFileSync(outputPath, 'utf8')); } catch {}

  const existingLinks = new Set((existing.deals || []).map(d => d.link));
  const SPAM_PATTERNS = ['공지', '블라인드 처리', '일일적립', '라방 ', '라이브예고', '종합 차트', '유저게시판'];
  const isSpam = t => SPAM_PATTERNS.some(p => t.includes(p));
  const newDeals = allNew.filter(d => d.title.length > 3 && !existingLinks.has(d.link) && !isSpam(d.title));
  console.log(`신규: ${newDeals.length}개`);

  if (newDeals.length > 0) await downloadImages(newDeals);

  // placeholder gif 감지 함수 (1095바이트 FM코리아 blank.gif 등)
  const isBadImage = (img) => {
    if (!img || !img.endsWith('.gif')) return false;
    try {
      const p = path.join(process.cwd(), 'public', img);
      return !fs.existsSync(p) || fs.statSync(p).size < 5000;
    } catch { return true; }
  };

  // 기존 딜 재분류·스팸 제거·나쁜 gif 클리어
  const cleanedExisting = (existing.deals || [])
    .filter(d => !isSpam(d.title))
    .map(d => ({
      ...d,
      image: isBadImage(d.image) ? null : d.image,
      category: categorize(d.title),
    }));

  // 이미지 없는 기존 딜 OG 이미지 재시도 (최대 30개)
  const retryDeals = cleanedExisting.filter(d => !d.image).slice(0, 30).map(d => ({ ...d, imageUrl: null }));
  if (retryDeals.length > 0) {
    console.log(`기존 이미지 재시도: ${retryDeals.length}개`);
    await downloadImages(retryDeals);
    const retryMap = new Map(retryDeals.map(d => [d.id, d.image]));
    for (const d of cleanedExisting) {
      if (retryMap.get(d.id)) d.image = retryMap.get(d.id);
    }
  }

  const combined = [...newDeals, ...cleanedExisting].slice(0, 600);
  cleanupOldImages(combined.map(d => d.id));

  fs.writeFileSync(outputPath, JSON.stringify({
    deals: combined,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');

  console.log(`저장 완료: 총 ${combined.length}개 (신규 ${newDeals.length}개)`);
}

main().catch(console.error);
