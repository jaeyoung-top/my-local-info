const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const MAX_EVENTS = 12;
const SIMILARITY_THRESHOLD = 0.38;

function nameHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return (h % 900000) + 100000;
}

/** OG 이미지 + 본문 첫 번째 이미지까지 시도 */
async function fetchPageImage(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SongpaBot/1.0)' }
    });
    clearTimeout(timer);
    const html = await res.text();
    const $ = cheerio.load(html);

    // 1) OG 이미지
    for (const sel of [
      'meta[property="og:image"]',
      'meta[name="og:image"]',
      'meta[name="twitter:image"]',
      'meta[property="twitter:image"]'
    ]) {
      let og = $(sel).attr('content');
      if (og && og.trim()) {
        og = og.trim();
        if (og.startsWith('//')) og = 'https:' + og;
        else if (!og.startsWith('http')) og = new URL(og, url).href;
        return og;
      }
    }

    // 2) 본문 첫 번째 <img> (100px 이상)
    let bodyImg = null;
    $('img').each((_, el) => {
      if (bodyImg) return;
      let src = $(el).attr('src') || '';
      const w = parseInt($(el).attr('width') || '0');
      const h = parseInt($(el).attr('height') || '0');
      if (src && (w >= 100 || h >= 100 || (!w && !h))) {
        if (!src.startsWith('http')) src = new URL(src, url).href;
        if (!src.includes('logo') && !src.includes('icon') && !src.includes('banner')) {
          bodyImg = src;
        }
      }
    });
    return bodyImg || null;
  } catch {
    return null;
  }
}

function getKeywords(name) {
  return new Set((name.match(/[가-힣]{2,}/g) || []));
}
function nameSimilarity(a, b) {
  const ka = getKeywords(a), kb = getKeywords(b);
  const inter = [...ka].filter(w => kb.has(w)).length;
  const union = new Set([...ka, ...kb]).size;
  return union === 0 ? 0 : inter / union;
}

/** 만료·오래된 행사 제거 + 내용/이미지 중복 제거 + 최대 개수 제한 */
function cleanEvents(events) {
  const today = new Date().toISOString().split('T')[0];
  const twoMonthsAgo = new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0];

  // 1. 만료/오래된 항목 제거
  const alive = events.filter(e => {
    if (e.endDate && e.endDate !== '상시' && e.endDate < today) return false;
    if (e.startDate && e.startDate < twoMonthsAgo) return false;
    return true;
  });

  // 2. 날짜 내림차순 정렬
  alive.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));

  // 3. 내용 유사도 기반 중복 제거 (키워드 38% 이상 겹치면 동일 행사)
  const kept = [];
  for (const e of alive) {
    if (!kept.some(k => nameSimilarity(k.name, e.name) >= SIMILARITY_THRESHOLD)) {
      kept.push(e);
    }
  }

  // 4. 이미지 중복 제거: 동일 URL은 두 번째부터 고유 해시 이미지로 교체
  const usedImages = new Set();
  const deduped = kept.map(e => {
    const img = e.image || '';
    if (img && !img.includes('picsum.photos')) {
      if (usedImages.has(img)) {
        return { ...e, image: `https://picsum.photos/seed/${nameHash(e.name)}/800/500` };
      }
      usedImages.add(img);
    }
    return e;
  });

  // 5. 최대 개수 제한
  return deduped.slice(0, MAX_EVENTS);
}

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 없음');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  let localData;
  try {
    localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('데이터 파일 읽기 오류:', err);
    return;
  }

  // ── 먼저 기존 events 정리 ───────────────────────────────────────────────
  const beforeCount = localData.events.length;
  localData.events = cleanEvents(localData.events);
  console.log(`기존 행사 정리: ${beforeCount}개 → ${localData.events.length}개`);

  // ── 새 행사 크롤링 ──────────────────────────────────────────────────────
  try {
    console.log('송파소식 크롤링 시작...');
    const mainRes = await fetch('https://songpa.newstool.co.kr/');
    const mainHtml = await mainRes.text();
    const $main = cheerio.load(mainHtml);

    let redirectUrl = '';
    const metaRefresh = $main('meta[http-equiv="refresh"]').attr('content');
    if (metaRefresh?.includes('URL=')) {
      redirectUrl = metaRefresh.split('URL=')[1].replace(/['"]/g, '');
    }
    if (!redirectUrl) redirectUrl = 'list.php?eid=9011';

    const listUrl = `https://songpa.newstool.co.kr/${redirectUrl.replace('./', '')}`;
    console.log(`목록 크롤링: ${listUrl}`);
    const listRes = await fetch(listUrl);
    const listHtml = await listRes.text();
    const $list = cheerio.load(listHtml);

    const articles = [];
    $list('a').each((_, el) => {
      const title = $list(el).text().replace(/\s+/g, ' ').trim();
      let href = $list(el).attr('href');
      if (href && href.includes('view.php') && title.length > 10) {
        if (!href.startsWith('http')) href = `https://songpa.newstool.co.kr/${href}`;
        articles.push(`- 제목: [${title}] URL: ${href}`);
      }
    });

    const uniqueArticles = [...new Set(articles)];
    if (uniqueArticles.length === 0) {
      console.log('크롤링된 기사 없음');
      fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const geminiPrompt = `다음은 '송파소식' 웹진의 이번 달 기사 목록입니다.
이 중에서 "문화, 공연, 행사, 축제"와 관련된 가장 중요한 기사 최대 2개를 골라 JSON 배열 형태로 정보를 추출해줘.
없으면 빈 배열 [] 을 출력해.

반환 형식 (반드시 JSON Array만):
[
  {
    "name": "행사 제목 (깔끔하게)",
    "category": "행사",
    "startDate": "YYYY-MM-DD (없으면 이번달 1일)",
    "endDate": "YYYY-MM-DD (없으면 이번달 말일)",
    "location": "장소 (없으면 '송파구 관내')",
    "target": "전체 구민",
    "summary": "행사 한줄 요약",
    "link": "해당 기사의 URL"
  }
]

기사 목록:
${uniqueArticles.join('\n')}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] })
      }
    );

    if (!geminiRes.ok) throw new Error(`Gemini API 실패: ${geminiRes.status}`);

    const geminiResult = await geminiRes.json();
    const aiText = geminiResult.candidates[0].content.parts[0].text;
    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) { console.log('AI 응답에서 행사 정보 없음'); }
    else {
      const newItems = JSON.parse(jsonMatch[0]);

      // 현재 사용 중인 이미지 URL 집합
      const usedImages = new Set(
        localData.events.map(e => e.image).filter(i => i && !i.includes('picsum.photos'))
      );

      const existingNames = new Set(
        localData.events.map(e => e.name.replace(/\s+/g, '').toLowerCase())
      );

      let addedCount = 0;
      for (const item of newItems) {
        const normName = item.name.replace(/\s+/g, '').toLowerCase();
        const isDupe = [...existingNames].some(n => n.includes(normName) || normName.includes(n));
        if (isDupe) continue;

        item.id = `crawler-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 이미지: 기사 페이지에서 가져오되 이미 사용된 이미지면 hash 폴백
        const pageImg = await fetchPageImage(item.link);
        if (pageImg && !usedImages.has(pageImg)) {
          item.image = pageImg;
          usedImages.add(pageImg);
        } else {
          item.image = `https://picsum.photos/seed/${nameHash(item.name)}/800/500`;
        }

        localData.events.unshift(item);
        existingNames.add(normName);
        addedCount++;
      }

      if (addedCount > 0) {
        console.log(`새 행사 ${addedCount}개 추가`);
        // 추가 후 다시 정리
        localData.events = cleanEvents(localData.events);
      } else {
        console.log('추가할 새 행사 없음 (중복 또는 없음)');
      }
    }
  } catch (err) {
    console.error('크롤링 오류:', err.message);
  }

  const today = new Date().toISOString().split('T')[0];
  localData.lastUpdated = today;
  fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
  console.log(`✅ 최종 행사 수: ${localData.events.length}개 (최대 ${MAX_EVENTS}개)`);
}

main();
