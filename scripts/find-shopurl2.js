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

async function fetchHtml(url) {
  let origin = 'https://www.google.com/';
  try { origin = new URL(url).origin + '/'; } catch {}
  const res = await fetch(url, {
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
  return html;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/hotdeals.json'), 'utf8'));
  const deals = data.deals || [];

  // 개드립
  {
    const deal = deals.find(d => d.source === '개드립' && d.link);
    console.log('\n=== 개드립 ===', deal?.link);
    const html = await fetchHtml(resolvePostLink('개드립', deal.link));
    const $ = cheerio.load(html);
    // 모든 외부 링크 출력
    const links = new Set();
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('dogdrip') && !href.includes('google') && !href.includes('kakao') && !href.includes('facebook')) {
        links.add(href);
      }
    });
    console.log('  external links:', [...links].slice(0, 5));
    // .xe_content 내 모든 a
    $('.xe_content a').each((_, el) => console.log('  xe a:', $(el).attr('href'), '|', $(el).text().trim()));
  }

  // 루리웹
  {
    const deal = deals.find(d => d.source === '루리웹' && d.link);
    console.log('\n=== 루리웹 ===', resolvePostLink('루리웹', deal.link));
    const html = await fetchHtml(resolvePostLink('루리웹', deal.link));
    const $ = cheerio.load(html);
    const links = new Set();
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('ruliweb') && !href.includes('google') && !href.includes('kakao')) links.add(href);
    });
    console.log('  external links:', [...links].slice(0, 5));
    $('.view_content a').each((_, el) => console.log('  view_content a:', $(el).attr('href')));
  }

  // 뽐뿌
  {
    const deal = deals.find(d => d.source === '뽐뿌' && d.link);
    const realUrl = resolvePostLink('뽐뿌', deal.link);
    console.log('\n=== 뽐뿌 ===', realUrl);
    const html = await fetchHtml(realUrl);
    const $ = cheerio.load(html);
    // 뽐뿌 특유의 링크 구조 찾기
    const links = new Set();
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('ppomppu') && !href.includes('cdn') && !href.includes('google') && !href.includes('kakao') && !href.includes('naver')) {
        links.add(href);
      }
    });
    console.log('  external links:', [...links].slice(0, 5));
    // title 링크
    $('a.title, a.subject, a#subject').each((_, el) => console.log('  title a:', $(el).attr('href')));
    // re_title
    $('#re_title').each((_, el) => console.log('  re_title:', $.html(el).substring(0, 200)));
  }

  // 퀘이사존
  {
    const deal = deals.find(d => d.source === '퀘이사존' && d.link);
    console.log('\n=== 퀘이사존 ===', deal?.link);
    const html = await fetchHtml(deal.link);
    const $ = cheerio.load(html);
    // market-info-view-table의 실제 내용
    console.log('  market-info-view-table HTML:');
    $('table.market-info-view-table tr').each((i, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      const href = $(el).find('a').attr('href');
      if (text.length < 500) console.log(`    tr[${i}]: "${text.substring(0, 100)}" | href: ${href}`);
    });
    // textarea 안 첫번째 링크 (다른 방법)
    const ta = $('dl dd > textarea').text();
    const matches = [...ta.matchAll(/href="(https?:\/\/[^"]+)"/g)];
    console.log('  textarea hrefs:', matches.slice(0, 3).map(m => m[1]));
    // 전체 외부 링크
    const links = new Set();
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (!href.includes('quasarzone') && !href.includes('google')) links.add(href);
    });
    console.log('  external links:', [...links].slice(0, 5));
  }
}
main().catch(console.error);
