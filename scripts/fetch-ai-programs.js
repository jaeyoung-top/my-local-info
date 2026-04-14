const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

/**
 * AI 지원 프로그램 수집 전용 스크립트
 * 
 * 방법: Gemini AI에게 "현재 운영 중인 AI 지원 프로그램 목록을 알려달라"고 요청하여
 * 실제로 알려진 프로그램들을 JSON으로 생성.
 * (공공 API가 AI 항목을 잘 제공하지 않아 Gemini로 대체)
 * 
 * 매일 실행 시 새로운 프로그램만 추가되고 중복은 건너뜁니다.
 */

const AI_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&q=80",
  "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80",
  "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
];

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경변수가 없습니다.');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  let localData;
  try {
    localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('데이터 파일 읽기 실패:', err.message);
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const year = today.split('-')[0];
  const month = today.split('-')[1];

  // 이미 등록된 AI 프로그램 이름 목록
  const existingAiNames = new Set(
    (localData.aiSupport || []).map(a =>
      String(a.name || '').replace(/\s+/g, '').toLowerCase()
    )
  );
  const existingCount = existingAiNames.size;
  console.log(`현재 AI 지원 프로그램 수: ${existingCount}개`);

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Gemini에게 실제 운영 중인 AI 지원 프로그램을 조사하여 JSON으로 달라고 요청
  const prompt = `${year}년 ${parseInt(month)}월 현재 대한민국에서 신청 가능하거나 운영 중인 AI·디지털·빅데이터 관련 지원 프로그램을 5개 조사해서 JSON 배열로 알려줘.

아래 기관들의 프로그램을 우선적으로 찾아봐:
- NIPA (정보통신산업진흥원, nipa.kr)
- 서울 AI 허브 (seoulaihub.kr)
- K-Startup 창업진흥원 (k-startup.go.kr)  
- 기업마당 (bizinfo.go.kr)
- AI 바우처 지원사업 (관련 부처)
- 중소벤처기업부 디지털 전환 사업
- 과학기술정보통신부 AI 관련 사업

이미 아래 목록에 있는 프로그램은 제외하고 다른 것으로 골라줘:
${JSON.stringify([...(localData.aiSupport || []).map(a => a.name)])}

반드시 JSON 배열 형식으로만 출력 (다른 텍스트 없이):
[
  {
    "name": "프로그램명 (공식 명칭)",
    "location": "운영 기관명",
    "target": "지원 대상 (간략히, 30자 이내)",
    "summary": "한 줄 요약 (50자 이내, 무엇을 지원하는지)",
    "startDate": "${today}",
    "endDate": "마감일 또는 상시",
    "link": "공식 홈페이지 URL (실제 존재하는 URL만)"
  }
]

5개를 반드시 채워줘. 실제로 존재하는 프로그램만 사용해.`;

  console.log('Gemini AI로 최신 AI 지원 프로그램 조사 중...');

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`Gemini API 오류: ${response.status}`);
    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;

    // JSON 배열 파싱
    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('AI 응답에서 JSON을 찾을 수 없음');
    const programs = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(programs) || programs.length === 0) {
      console.log('조회된 프로그램이 없습니다.');
      return;
    }

    console.log(`${programs.length}개 프로그램 조회됨`);

    // 중복 제거 후 추가
    const normalizeStr = (str) => String(str || '').replace(/\s+/g, '').toLowerCase();
    
    // 이미 사용된 이미지
    const usedImages = new Set([
      ...(localData.aiSupport || []).map(a => a.image)
    ]);

    let addedCount = 0;
    for (const prog of programs) {
      if (!prog.name || !prog.summary) continue;

      const normalizedName = normalizeStr(prog.name);

      // 중복 체크: 기존 이름과 비교
      let isDuplicate = false;
      for (const existingName of existingAiNames) {
        if (existingName.includes(normalizedName) || normalizedName.includes(existingName)) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) {
        console.log(`[중복 건너뜀] ${prog.name}`);
        continue;
      }

      // 사용하지 않은 이미지 선택
      const availableImages = AI_IMAGE_POOL.filter(img => !usedImages.has(img));
      const image = availableImages.length > 0
        ? availableImages[Math.floor(Math.random() * availableImages.length)]
        : AI_IMAGE_POOL[Math.floor(Math.random() * AI_IMAGE_POOL.length)];
      usedImages.add(image);

      // 고유 ID 생성 (ai- + 날짜 + 순번)
      const newId = `ai-${today}-${addedCount + 1}`;

      const newItem = {
        id: newId,
        name: String(prog.name).trim(),
        category: 'AI지원',
        startDate: prog.startDate || today,
        endDate: prog.endDate || '상시',
        location: String(prog.location || 'AI 관련 기관').trim(),
        target: String(prog.target || '관심있는 누구나').trim(),
        summary: String(prog.summary).trim(),
        link: String(prog.link || 'https://nipa.kr').trim(),
        image,
      };

      localData.aiSupport = localData.aiSupport || [];
      localData.aiSupport.push(newItem);
      existingAiNames.add(normalizedName);
      addedCount++;
      console.log(`✅ 추가: ${newItem.name}`);
    }

    if (addedCount > 0) {
      localData.lastUpdated = today;
      fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
      console.log(`🎉 AI 지원 프로그램 ${addedCount}개 추가 완료! 총 ${(localData.aiSupport || []).length}개`);
    } else {
      console.log('새로 추가된 AI 프로그램이 없습니다 (모두 중복).');
    }

  } catch (err) {
    console.error('AI 프로그램 수집 중 오류:', err.message);
  }
}

main();
