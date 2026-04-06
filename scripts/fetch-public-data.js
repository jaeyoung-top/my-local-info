const fs = require('fs');
const path = require('path');

/**
 * 공공데이터포털 API를 통해 새로운 정보를 가져와 Gemini AI로 가공한 뒤
 * local-info.json에 추가하는 스크립트입니다.
 * API 필드명: 한국어 (서비스명, 지원대상, 소관기관명 등)
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
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (err) {
    console.error('기존 데이터 파일을 읽는 중 오류가 발생했습니다. (파일 유지를 위해 종료)', err);
    return;
  }

  // 1단계: 공공데이터포털 API에서 데이터 가져오기 (여러 페이지)
  let allServices = [];
  for (let page = 1; page <= 5; page++) {
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

  if (allServices.length === 0) {
    console.log('수집된 데이터가 없습니다.');
    return;
  }

  // 2단계: 서울/송파 관련 필터링 (한국어 필드명 사용)
  const filterByKeyword = (items, keyword) => items.filter(item =>
    (item['서비스명'] || '').includes(keyword) ||
    (item['소관기관명'] || '').includes(keyword) ||
    (item['지원대상'] || '').includes(keyword) ||
    (item['서비스목적요약'] || '').includes(keyword)
  );

  let filtered = filterByKeyword(allServices, '송파');
  if (filtered.length === 0) {
    filtered = filterByKeyword(allServices, '서울');
  }
  if (filtered.length === 0) {
    // 서울 없으면 전국 단위 복지서비스 중 일부 사용
    filtered = allServices.filter(item =>
      (item['소관기관유형'] || '').includes('지방') ||
      (item['소관기관유형'] || '').includes('자치')
    );
  }
  if (filtered.length === 0) {
    filtered = allServices;
  }

  console.log(`필터링 후 ${filtered.length}개 항목`);

  // 3단계: 기존 데이터와 비교 (이름 기준 중복 제거)
  const normalizeString = (str) => String(str || '').replace(/\s+/g, '').toLowerCase();

  const existingNames = new Set([
    ...localData.events.map(e => normalizeString(e.name)),
    ...localData.benefits.map(b => normalizeString(b.name))
  ]);

  const newItems = filtered.filter(item => {
    const normalizedItemName = normalizeString(item['서비스명']);
    if (!normalizedItemName || normalizedItemName.length < 2) return false;
    for (const existingName of existingNames) {
      if (existingName.includes(normalizedItemName) || normalizedItemName.includes(existingName)) {
        return false;
      }
    }
    return true;
  });

  if (newItems.length === 0) {
    console.log('새로운 데이터가 없습니다 (모두 중복)');
    return;
  }

  console.log(`새로운 항목 ${newItems.length}개 발견, 첫 번째 처리 중...`);
  const targetItem = newItems[0];
  const today = new Date().toISOString().split('T')[0];

  // 4단계: Gemini AI로 새 항목 가공
  const geminiPrompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{"id": "숫자6자리", "name": "서비스명(짧고 명확하게)", "category": "혜택", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD 또는 상시", "location": "장소 또는 기관명", "target": "지원대상(간략히)", "summary": "한줄요약(50자 이내)", "link": "상세URL", "image": "이미지URL"}

startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
image 필드에는 다음 중 내용과 가장 잘 어울리는 이미지 URL 하나를 골라서 반드시 넣어줘:
1. https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop (봉사, 혜택, 따뜻함)
2. https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2070&auto=format&fit=crop (동물, 복지)
3. https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop (교육, 도서관)
4. https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop (어린이, 학교, 교육)
5. https://images.unsplash.com/photo-1551836022-d0bc15250ff5?q=80&w=1000&auto=format&fit=crop (일자리, 상담, 사무실)
6. https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop (기부, 나눔, 따뜻한 손길)
7. https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop (청년, 활기찬 대학생)
8. https://images.unsplash.com/photo-1525026198548-4baa812f1183?q=80&w=1000&auto=format&fit=crop (노인 복지, 어르신 돌봄)
9. https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1000&auto=format&fit=crop (의료, 건강, 병원)
10. https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop (학업, 학생)
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터 원본:
${JSON.stringify(targetItem, null, 2)}`;

  // Use gemini-2.5-flash
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      const errorDetail = await geminiResponse.text();
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.status} - ${errorDetail}`);
    }

    const geminiResult = await geminiResponse.json();
    const aiResponseText = geminiResult.candidates[0].content.parts[0].text;

    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI 응답에서 유효한 JSON 형식을 찾을 수 없습니다.');

    const processedItem = JSON.parse(jsonMatch[0]);
    processedItem.id = String(processedItem.id || Date.now());

    // 5단계: 혜택 배열에 추가
    localData.benefits.push(processedItem);
    localData.lastUpdated = today;

    fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
    console.log(`생성 완료: ${processedItem.name}`);

  } catch (err) {
    console.error('데이터 처리 중 오류 발생 (기존 데이터 유지):', err.message);
  }
}

main();
