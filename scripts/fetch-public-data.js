const fs = require('fs');
const path = require('path');

/**
 * 공공데이터포털 API를 통해 새로운 정보를 가져와 Gemini AI로 가공한 뒤
 * local-info.json에 추가하는 스크립트입니다.
 * 개선: 하루에 최대 5개까지 새 항목을 처리 (기존 1개 → 5개)
 */
async function main() {
  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error('환경변수(PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY)가 설정되지 않았습니다.');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  let localData;
  try {
    localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('기존 데이터 파일을 읽는 중 오류가 발생했습니다.', err);
    return;
  }

  // 1단계: 공공데이터포털 API에서 데이터 가져오기
  let allServices = [];
  for (let page = 1; page <= 10; page++) {
    const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=${page}&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    try {
      const response = await fetch(publicDataUrl);
      if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
      const result = await response.json();
      const items = result.data || [];
      if (items.length === 0) break;
      allServices = allServices.concat(items);
    } catch (err) {
      console.error(`페이지 ${page} 데이터 수집 실패:`, err.message);
      break;
    }
  }

  console.log(`총 ${allServices.length}개 서비스 항목 수집`);
  if (allServices.length === 0) return;

  // 2단계: 제외 키워드 필터링
  const excludeKeywords = ['어업', '해양', '수산', '선박', '어선', '귀어', '농업', '농지', '임업', '축산'];

  const isRelevant = (item) => {
    const text = (
      (item['서비스명'] || '') +
      (item['소관기관명'] || '') +
      (item['지원대상'] || '') +
      (item['서비스목적요약'] || '')
    );
    const hasExclude = excludeKeywords.some(ex => text.includes(ex));
    if (hasExclude) return false;

    // 서울/송파 관련이거나 전국 단위 복지/혜택 포함
    const aiKeywords = ['인공지능', 'AI', 'ai', '빅데이터', '디지털전환', 'SW', '정보화'];
    const localKeywords = ['송파', '서울', '경기', '전국'];
    const welfareKeywords = ['지원', '복지', '장려금', '수당', '보조금', '바우처', '혜택'];

    const hasLocal = localKeywords.some(kw => text.includes(kw));
    const hasWelfare = welfareKeywords.some(kw => text.includes(kw));
    const hasAI = aiKeywords.some(kw => text.includes(kw));

    return hasLocal || hasWelfare || hasAI;
  };

  const filtered = allServices.filter(isRelevant);
  console.log(`필터링 후 ${filtered.length}개 항목`);

  // 3단계: 이미 저장된 항목과 중복 제거
  const normalizeString = (str) => String(str || '').replace(/\s+/g, '').toLowerCase();
  const existingNames = new Set([
    ...localData.events.map(e => normalizeString(e.name)),
    ...localData.benefits.map(b => normalizeString(b.name)),
    ...(localData.aiSupport || []).map(a => normalizeString(a.name))
  ]);

  const newItems = filtered.filter(item => {
    const normalizedName = normalizeString(item['서비스명']);
    if (!normalizedName || normalizedName.length < 2) return false;
    for (const existing of existingNames) {
      if (existing.includes(normalizedName) || normalizedName.includes(existing)) return false;
    }
    return true;
  });

  if (newItems.length === 0) {
    console.log('새로운 데이터가 없습니다 (모두 중복)');
    return;
  }

  // 최대 5개까지 처리 (API 과부하 방지)
  const targets = newItems.slice(0, 5);
  console.log(`새로운 항목 ${newItems.length}개 발견, ${targets.length}개 처리 시작...`);

  const today = new Date().toISOString().split('T')[0];
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const themePools = {
    education: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"],
    health: ["https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80", "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80", "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80"],
    finance: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80", "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80", "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80"],
    children: ["https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80", "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80", "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800&q=80"],
    senior: ["https://images.unsplash.com/photo-1525026198548-4baa812f1183?w=800&q=80", "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80", "https://images.unsplash.com/photo-1511296684614-2e94eb687be6?w=800&q=80"],
    job: ["https://images.unsplash.com/photo-1551836022-d0bc15250ff5?w=800&q=80", "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"],
    environment: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80", "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80", "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&q=80"],
    culture: ["https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80", "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"],
    ai: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80", "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80", "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"],
    admin: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"]
  };

  let addedCount = 0;

  for (const targetItem of targets) {
    const geminiPrompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{"id": "숫자6자리", "name": "서비스명(짧고 명확하게)", "category": "혜택 또는 AI지원", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD 또는 상시", "location": "장소 또는 기관명", "target": "지원대상(간략히)", "summary": "한줄요약(50자 이내)", "link": "상세URL", "imageTheme": "분류"}

startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
imageTheme 필드에는 다음 중 하나를 반드시 영문으로: [education, health, finance, children, senior, job, environment, culture, ai, admin]
AI/인공지능/디지털/빅데이터 관련이면 category를 "AI지원"으로, 나머지는 "혜택"으로.

반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터 원본:
${JSON.stringify(targetItem, null, 2)}`;

    try {
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] })
      });

      if (!geminiResponse.ok) throw new Error(`Gemini 오류: ${geminiResponse.status}`);

      const geminiResult = await geminiResponse.json();
      const aiResponseText = geminiResult.candidates[0].content.parts[0].text;

      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON 형식을 찾을 수 없음');

      const processedItem = JSON.parse(jsonMatch[0]);
      processedItem.id = String(processedItem.id || Date.now());

      // 이미지 할당 (중복 방지)
      const theme = processedItem.imageTheme && themePools[processedItem.imageTheme]
        ? processedItem.imageTheme : 'admin';
      const imagePool = themePools[theme];
      const usedImages = new Set([
        ...localData.events.map(e => e.image),
        ...localData.benefits.map(b => b.image),
        ...(localData.aiSupport || []).map(a => a.image)
      ]);
      const available = imagePool.filter(img => !usedImages.has(img));
      processedItem.image = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : imagePool[Math.floor(Math.random() * imagePool.length)];

      // 중복 이름을 existingNames에 추가
      existingNames.add(normalizeString(processedItem.name));

      // 카테고리별로 분류하여 추가
      if (processedItem.category === 'AI지원') {
        localData.aiSupport = localData.aiSupport || [];
        localData.aiSupport.push(processedItem);
      } else {
        localData.benefits.push(processedItem);
      }

      addedCount++;
      console.log(`✅ 추가됨: ${processedItem.name}`);

      // API 과부하 방지
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`❌ 항목 처리 실패:`, err.message);
    }
  }

  if (addedCount > 0) {
    localData.lastUpdated = today;
    fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
    console.log(`🎉 총 ${addedCount}개의 새 항목이 추가되었습니다.`);
  } else {
    console.log('새로 추가된 항목이 없습니다.');
  }
}

main();
