const fs = require('fs');
const path = require('path');

/**
 * 공공데이터포털 API를 통해 새로운 정보를 가져와 Gemini AI로 가공한 뒤
 * local-info.json에 추가하는 스크립트입니다.
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

  // 1단계: 공공데이터포털 API에서 데이터 가져오기
  // 사용자가 지정한 엔드포인트와 파라미터를 그대로 사용합니다.
  const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;

  try {
    const response = await fetch(publicDataUrl);
    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
    
    const result = await response.json();
    const services = result.data || [];

    // 필터링 로직
    const filterByKeyword = (items, keyword) => items.filter(item => 
      (item.svcNm || '').includes(keyword) || 
      (item.svcPpoNm || '').includes(keyword) || 
      (item.trgtNm || '').includes(keyword) || 
      (item.jurMnstNm || '').includes(keyword)
    );

    let filtered = filterByKeyword(services, '성남');
    if (filtered.length === 0) {
      filtered = filterByKeyword(services, '경기');
    }
    if (filtered.length === 0) {
      filtered = services;
    }

    // 2단계: 기존 데이터와 비교 (name 기준)
    const existingNames = new Set([
      ...localData.events.map(e => e.name),
      ...localData.benefits.map(b => b.name)
    ]);

    const newItems = filtered.filter(item => !existingNames.has(item.svcNm));

    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    // 새로운 항목 중 첫 번째 항목 선택
    const targetItem = newItems[0];
    const today = new Date().toISOString().split('T')[0];

    // 3단계: Gemini AI로 새 항목 1개만 가공
    const geminiPrompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜(${today}), endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터 원본:
${JSON.stringify(targetItem, null, 2)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: geminiPrompt }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      const errorDetail = await geminiResponse.text();
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.status} - ${errorDetail}`);
    }

    const geminiResult = await geminiResponse.json();
    const aiResponseText = geminiResult.candidates[0].content.parts[0].text;

    // JSON 부분만 파싱 (마크다운 코드 블록 제거)
    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI 응답에서 유효한 JSON 형식을 찾을 수 없습니다.');
    
    const processedItem = JSON.parse(jsonMatch[0]);

    // 4단계: 기존 데이터에 추가
    // category에 따라 적절한 배열에 추가
    if (processedItem.category === '행사') {
      localData.events.push(processedItem);
    } else {
      localData.benefits.push(processedItem);
    }
    
    // 마지막 업데이트 날짜 갱신
    localData.lastUpdated = today;

    // 파일 저장
    fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
    console.log('생성 완료');

  } catch (err) {
    console.error('데이터 처리 중 오류 발생 (기존 데이터 유지):', err.message);
  }
}

main();
