const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

function resolvePostLink(source, link) {
  if (!link) return null;
  try {
    const u = new URL(link);
    if (u.hostname === 'hotdealzip.mycafe24.com') {
      const encoded = u.searchParams.get('url');
      if (!encoded) return link;
      const decoded = decodeURIComponent(encoded);
      if (u.pathname.includes('ppomppu')) return 'https://www.ppomppu.co.kr/zboard/' + decoded;
      return decoded;
    }
    return link;
  } catch { return link; }
}

async function inspect(source, link) {
  const realUrl = resolvePostLink(source, link);
  console.log(`\n=== ${source} ===`);
  console.log(`  URL: ${realUrl}`);
  try {
    let origin = 'https://www.google.com/';
    try { origin = new URL(realUrl).origin + '/'; } catch {}
    const res = await fetch(realUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html', 'Accept-Language': 'ko-KR,ko;q=0.9', 'Referer': origin,
      },
      signal: AbortSignal.timeout(12000),
    });
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || '';
    let html = ct.toLowerCase().includes('euc-kr') ? iconv.decode(buf, 'euc-kr') : buf.toString('utf8');
    if (html.substring(0, 3000).toLowerCase().includes('charset=euc-kr')) html = iconv.decode(buf, 'euc-kr');

    const $ = cheerio.load(html);

    if (source === 'FM코리아' || source === '개드립') {
      console.log('  hotdeal_url:', $('.xe_content a.hotdeal_url').attr('href'));
      console.log('  xe_content first a:', $('.xe_content a').first().attr('href'));
    } else if (source === '루리웹') {
      const links = [];
      $('.view_content a[href^="http"]').each((_, el) => {
        const href = $(el).attr('href');
        if (href && !href.includes('ruliweb')) links.push(href);
      });
      console.log('  external links:', links.slice(0, 3));
    } else if (source === '뽐뿌') {
      // 뽐뿌는 게시글 위쪽 info_bg 테이블에 링크가 있을 수 있음
      const links = [];
      $('a[href^="http"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (!href.includes('ppomppu') && !href.includes('cdn') && !href.includes('google') && !href.includes('kakao')) {
          links.push(href);
        }
      });
      console.log('  external links (first 5):', links.slice(0, 5));
    } else if (source === '퀘이사존') {
      // textarea 안의 a href
      const taContent = $('dl dd > textarea').text().trim();
      const match = taContent.match(/href="(https?:\/\/[^"]+)"/);
      console.log('  textarea first href:', match?.[1]);
      // market-info-view-table의 링크
      $('table.market-info-view-table a[href^="http"]').each((_, el) => {
        console.log('  market-table link:', $(el).attr('href'));
      });
    }
  } catch(e) { console.error('  ERR:', e.message); }
}

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/hotdeals.json'), 'utf8'));
  const deals = data.deals || [];
  for (const src of ['FM코리아', '개드립', '루리웹', '뽐뿌', '퀘이사존']) {
    const deal = deals.find(d => d.source === src && d.link);
    if (deal) await inspect(src, deal.link);
  }
}
main().catch(console.error);
