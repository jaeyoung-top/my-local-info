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
    education: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800&q=80",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
    ],
    health: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&q=80",
      "https://images.unsplash.com/photo-1511174346297-cde2546c76b1?w=800&q=80",
      "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=800&q=80",
      "https://images.unsplash.com/photo-1571772996211-2e3d26573f9a?w=800&q=80"
    ],
    finance: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80",
      "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&q=80",
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?w=800&q=80",
      "https://images.unsplash.com/photo-1638466700763-c4d3dda58ece?w=800&q=80",
      "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80"
    ],
    children: [
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
      "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800&q=80",
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
      "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80"
    ],
    senior: [
      "https://images.unsplash.com/photo-1525026198548-4baa812f1183?w=800&q=80",
      "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80",
      "https://images.unsplash.com/photo-1511296684614-2e94eb687be6?w=800&q=80",
      "https://images.unsplash.com/photo-1559234935-37c9c04975e4?w=800&q=80",
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
      "https://images.unsplash.com/photo-1581579439828-3cbf55c888dc?w=800&q=80",
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80",
      "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
      "https://images.unsplash.com/photo-1536420111820-c2e08c93b9d8?w=800&q=80"
    ],
    job: [
      "https://images.unsplash.com/photo-1551836022-d0bc15250ff5?w=800&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
      "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80",
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80",
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80"
    ],
    environment: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
      "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&q=80",
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
      "https://images.unsplash.com/photo-1473090826765-d54ac2fdc1eb?w=800&q=80",
      "https://images.unsplash.com/photo-1498925008800-019c7d59d903?w=800&q=80",
      "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=800&q=80",
      "https://images.unsplash.com/photo-1485395578879-6ba080c0c3cb?w=800&q=80",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80"
    ],
    ai: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
      "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=800&q=80",
      "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80",
      "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&q=80"
    ],
    admin: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
      "https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&q=80",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&q=80",
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
      "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
      "https://images.unsplash.com/photo-1509822929063-6b6723e0e974?w=800&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
    ]
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
