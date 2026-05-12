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
  // [12,900원] 또는 12900원 패턴 추출
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

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Cache-Control': 'no-cache',
};

async function fetchPpomppu() {
  const deals = [];
  try {
    const res = await fetch('https://www.ppomppu.co.kr/zboard/zboard.php?id=hotdeal', { headers: HEADERS });
    if (!res.ok) { console.log(`뽐뿌 응답 오류: ${res.status}`); return deals; }

    const html = await res.text();
    const $ = cheerio.load(html);

    $('tr').each((i, el) => {
      const $el = $(el);
      // 뽐뿌 목록: title 셀에 링크 있음
      const $a = $el.find('a[href*="zboard.php"]').first();
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (!title || !href || title.length < 5) return;

      const link = href.startsWith('http') ? href : `https://www.ppomppu.co.kr/zboard/${href}`;

      // 날짜/조회/공감 셀들
      const cells = $el.find('td');
      const dateText = cells.filter((_, td) => {
        const t = $(td).text().trim();
        return /\d{2}\/\d{2}|\d{4}-\d{2}/.test(t);
      }).first().text().trim();

      const likesText = cells.last().text().trim();
      const likes = parseInt(likesText.replace(/\D/g, '')) || 0;

      deals.push({
        id: `pp_${Buffer.from(link).toString('base64url').slice(-16)}`,
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
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
      const $time = $el.find('time, .list_time span').first();
      // datetime 속성 우선, 없으면 title 속성, 마지막으로 텍스트
      const dateText = $time.attr('datetime') || $time.attr('title') || '';
      const likes = parseInt($el.find('.list_recommend span').first().text().trim()) || 0;

      deals.push({
        id: `cl_${Buffer.from(link).toString('base64url').slice(-16)}`,
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
        category: categorize(title),
        source: '클리앙',
        sourceColor: '#2A6EBB',
        link,
        publishedAt: dateText || '',
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
      const $timeEl = $el.find('time').first();
      const dateText = $timeEl.attr('datetime') || $el.find('.time_date').first().text().trim();
      const likes = parseInt($el.find('.recomd').first().text().trim()) || 0;

      deals.push({
        id: `rl_${Buffer.from(link).toString('base64url').slice(-16)}`,
        title: title.replace(/\s+/g, ' ').trim(),
        price: extractPrice(title),
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

async function main() {
  console.log('핫딜 수집 시작...');

  const [ppDeals, clDeals, rlDeals] = await Promise.all([
    fetchPpomppu(),
    fetchClien(),
    fetchRuliweb(),
  ]);

  const allNew = [...ppDeals, ...clDeals, ...rlDeals];
  console.log(`전체 신규 수집: ${allNew.length}개`);

  const outputPath = path.join(process.cwd(), 'public', 'data', 'hotdeals.json');

  let existing = { deals: [] };
  try {
    existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch {}

  const existingLinks = new Set((existing.deals || []).map(d => d.link));
  const newDeals = allNew.filter(d => d.title.length > 3 && !existingLinks.has(d.link));

  // 최신 500개 유지
  const combined = [...newDeals, ...(existing.deals || [])].slice(0, 500);

  fs.writeFileSync(outputPath, JSON.stringify({
    deals: combined,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');

  console.log(`저장 완료: 총 ${combined.length}개 (신규 ${newDeals.length}개)`);
}

main().catch(console.error);
