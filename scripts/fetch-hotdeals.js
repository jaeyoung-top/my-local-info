const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const PAGES_TO_FETCH = 5;
const MAX_TOTAL = 500;
const COMPARE_CONCURRENCY = 8;

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

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  'Referer': 'https://hotdeal.zip/',
};

function categorize(apiCat) {
  return CATEGORY_MAP[apiCat] || '기타';
}

async function fetchPage(page) {
  const res = await fetch(`https://hotdeal.zip/api/deals.php?page=${page}&category=all`, {
    headers: { ...BASE_HEADERS, 'Accept': 'application/json, */*' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}

// 상세 페이지에서 가격비교 테이블 파싱
async function fetchPriceComparison(seoUrl) {
  try {
    const res = await fetch(`https://hotdeal.zip/${seoUrl}`, {
      headers: { ...BASE_HEADERS, 'Accept': 'text/html' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const $ = cheerio.load(await res.text());
    const results = [];
    $('table tbody tr').each((_, el) => {
      const tds = $(el).find('td');
      const site = $(tds[0]).text().trim();
      const price = $(tds[2]).text().trim();
      if (site && price && price !== '정보 없음' && price !== '') {
        results.push({ site, price });
      }
    });
    return results;
  } catch {
    return [];
  }
}

// 원본 커뮤니티 글 본문 스크래핑
function resolvePostLink(source, link) {
  if (!link) return null;
  try {
    const u = new URL(link);
    if (u.hostname === 'hotdealzip.mycafe24.com') {
      const encoded = u.searchParams.get('url');
      if (!encoded) return link;
      const decoded = decodeURIComponent(encoded);
      if (u.pathname.includes('ppomppu')) return 'https://www.ppomppu.co.kr/zboard/' + decoded;
      return decoded; // 루리웹
    }
    return link;
  } catch { return link; }
}

function normalizeImgSrc(src) {
  if (!src || typeof src !== 'string') return null;
  src = src.trim();
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('http')) return src;
  return null;
}

function isUsefulImage(src) {
  if (!src) return false;
  const lower = src.toLowerCase();
  const skip = ['1x1', 'pixel', 'spacer', 'blank', 'logo', 'icon', 'btn_', 'button', 'lazyload', 'loading', 'spinner', 'arrow', 'dot0'];
  for (const p of skip) if (lower.includes(p)) return false;
  return true;
}

async function fetchPostContent(source, link) {
  if (!link || source === '아카라이브') return null;
  const realUrl = resolvePostLink(source, link);
  if (!realUrl) return null;
  try {
    let origin = 'https://www.google.com/';
    try { origin = new URL(realUrl).origin + '/'; } catch {}
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'ko-KR,ko;q=0.9',
      'Referer': origin,
    };
    const res = await fetch(realUrl, { headers, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || '';
    let html;
    if (ct.toLowerCase().includes('euc-kr')) {
      html = iconv.decode(buf, 'euc-kr');
    } else {
      const rawStr = buf.toString('utf8');
      html = rawStr.substring(0, 3000).toLowerCase().includes('charset=euc-kr')
        ? iconv.decode(buf, 'euc-kr') : rawStr;
    }

    const $ = cheerio.load(html);
    let $content;
    let shopUrl = null;

    if (source === 'FM코리아' || source === '개드립') {
      $content = $('.xe_content');
      if (source === 'FM코리아') {
        shopUrl = $('.xe_content a.hotdeal_url').first().attr('href') || null;
      } else {
        // 개드립: shop link is in a table cell outside xe_content — search full page
        $('a').each((_, el) => {
          if (shopUrl) return false;
          const href = $(el).attr('href') || '';
          if (href.startsWith('http') && !href.includes('dogdrip') && !href.includes('google') && !href.includes('kakao') && !href.includes('facebook') && !href.includes('youtube') && !href.includes('twitter')) {
            shopUrl = href;
          }
        });
      }
    } else if (source === '루리웹') {
      $content = $('.view_content');
      // Prefer dedicated source_url link, then any external link
      shopUrl = $('a.source_url[href^="http"]').first().attr('href') || null;
      if (!shopUrl) {
        $('a').each((_, el) => {
          if (shopUrl) return false;
          const href = $(el).attr('href') || '';
          if (href.startsWith('http') && !href.includes('ruliweb') && !href.includes('google') && !href.includes('kakao') && !href.includes('youtube') && !href.includes('twitter') && !/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(href)) {
            shopUrl = href;
          }
        });
      }
    } else if (source === '뽐뿌') {
      $content = $('td.board-contents');
      // 뽐뿌 posts don't contain external shop links
    } else if (source === '퀘이사존') {
      // Shop URL: text content of first <a> in market-info-view-table is the raw URL
      const qzLinkText = $('table.market-info-view-table td a').first().text().trim();
      if (qzLinkText && qzLinkText.startsWith('http')) {
        shopUrl = qzLinkText;
      } else {
        // Fallback: decode base64 from javascript:goToLink('base64')
        const qzHref = $('table.market-info-view-table td a').first().attr('href') || '';
        const b64Match = qzHref.match(/goToLink\(['"]([A-Za-z0-9+/=]+)['"]\)/);
        if (b64Match) {
          try {
            const decoded = Buffer.from(b64Match[1], 'base64').toString('utf8');
            if (decoded.startsWith('http')) shopUrl = decoded;
          } catch {}
        }
      }
      const taContent = $('dl dd > textarea').text().trim();
      if (!taContent && !shopUrl) return null;
      const $inner = cheerio.load(taContent || '');
      const text = $inner('body').text().replace(/\s+/g, ' ').trim();
      const images = [];
      $inner('img').each((_, el) => {
        const src = normalizeImgSrc($inner(el).attr('src') || $inner(el).attr('data-src'));
        if (src && isUsefulImage(src)) images.push(src);
      });
      if (!text && images.length === 0 && !shopUrl) return null;
      return { text: text.substring(0, 2000), images: images.slice(0, 8), shopUrl };
    } else {
      return null;
    }
    if (!$content || !$content.length) return shopUrl ? { text: '', images: [], shopUrl } : null;
    const text = $content.text().replace(/\s+/g, ' ').trim();
    const images = [];
    $content.find('img').each((_, el) => {
      const src = normalizeImgSrc($(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original'));
      if (src && isUsefulImage(src)) images.push(src);
    });
    if (!text && images.length === 0 && !shopUrl) return null;
    return { text: text.substring(0, 2000), images: images.slice(0, 8), shopUrl };
  } catch {
    return null;
  }
}

// price_info.php POST — 다나와 기반 가격 흐름 데이터
async function fetchPriceHistory(dealId) {
  try {
    const numId = String(dealId).replace('hdz_', '');
    const res = await fetch('https://hotdeal.zip/api/price_info.php', {
      method: 'POST',
      headers: {
        ...BASE_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: 'deal_id=' + numId,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data?.price_data) return null;

    // 3개월 우선, 없으면 1개월
    const period = json.data.price_data['3'] || json.data.price_data['1'];
    if (!period || !period.result?.length) return null;

    return {
      points: period.result.map(r => ({ date: r.date, price: r.minPrice })),
      minPrice: parseInt(period.minPrice),
      maxPrice: parseInt(period.maxPrice),
    };
  } catch {
    return null;
  }
}

function mapDeal(d) {
  return {
    id: `hdz_${d.id}`,
    seoUrl: d.seo_url,
    title: d.title,
    price: d.price || null,
    image: d.thumbnail_url || null,
    category: categorize(d.category),
    site: d.site || null,
    source: d.community_name || '기타',
    sourceColor: SOURCE_COLORS[d.community_name] || '#888888',
    link: d.post_url || `https://hotdeal.zip/${d.seo_url}`,
    publishedAt: d.created_at || '',
    likes: d.views || 0,
    fetchedAt: new Date().toISOString(),
    priceComparison: [],
  };
}

async function fetchAllDetails(deals) {
  let done = 0, cmpOk = 0, histOk = 0, postOk = 0;
  for (let i = 0; i < deals.length; i += COMPARE_CONCURRENCY) {
    const chunk = deals.slice(i, i + COMPARE_CONCURRENCY);
    await Promise.all(chunk.map(async deal => {
      const [cmp, hist, post] = await Promise.all([
        deal.seoUrl ? fetchPriceComparison(deal.seoUrl) : Promise.resolve([]),
        fetchPriceHistory(deal.id),
        fetchPostContent(deal.source, deal.link),
      ]);
      deal.priceComparison = cmp;
      deal.priceHistory = hist || null;
      deal.postContent = post ? { text: post.text, images: post.images } : null;
      deal.shopUrl = post?.shopUrl || null;
      if (cmp.length > 0) cmpOk++;
      if (hist) histOk++;
      if (post) postOk++;
      done++;
    }));
  }
  console.log(`상세 수집 완료: ${done}개 — 가격비교 ${cmpOk}개, 가격흐름 ${histOk}개, 원문 ${postOk}개`);
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

  console.log(`신규: ${newDeals.length}개 — 상세 정보 수집 중...`);
  if (newDeals.length > 0) await fetchAllDetails(newDeals);

  // seoUrl 필드는 내부용이므로 저장 전 제거
  for (const d of newDeals) delete d.seoUrl;

  // 기존 딜 중 로컬 이미지 참조 제거
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
