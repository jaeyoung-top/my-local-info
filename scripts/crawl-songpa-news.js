const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * 송파소식 웹진을 크롤링하여 주요 행사/축제를 추출 후 
 * Gemini AI로 가공하여 local-info.json에 추가합니다.
 */
async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('환경변수(GEMINI_API_KEY)가 설정되지 않았습니다.');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  let localData;
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (err) {
    console.error('기존 데이터 파일을 읽는 중 오류가 발생했습니다.', err);
    return;
  }

  try {
    console.log('송파소식 메인 페이지 크롤링 시작...');
    // 1. 메인 페이지 접근하여 최신 호수(eid) 알아내기
    const mainResponse = await fetch('https://songpa.newstool.co.kr/');
    const mainHtml = await mainResponse.text();
    const $main = cheerio.load(mainHtml);
    
    let redirectUrl = '';
    const metaRefresh = $main('meta[http-equiv="refresh"]').attr('content');
    if (metaRefresh && metaRefresh.includes('URL=')) {
      redirectUrl = metaRefresh.split('URL=')[1].replace(/['"]/g, '');
    }

    if (!redirectUrl) {
      redirectUrl = 'list.php?eid=9011'; // fallback
    }

    // 2. 최신호 목록 페이지 크롤링
    const listUrl = `https://songpa.newstool.co.kr/${redirectUrl.replace('./', '')}`;
    console.log(`최신호 목록 크롤링: ${listUrl}`);
    const listResponse = await fetch(listUrl);
    const listHtml = await listResponse.text();
    const $list = cheerio.load(listHtml);

    const articles = [];
    $list('a').each((i, el) => {
      const title = $list(el).text().replace(/\s+/g, ' ').trim();
      let href = $list(el).attr('href');
      
      // 기사 링크(view.php)인 것만 필터링
      if (href && href.includes('view.php') && title.length > 10) {
        // 상대경로 절대경로 변환
        if (!href.startsWith('http')) {
          href = `https://songpa.newstool.co.kr/${href}`;
        }
        articles.push(`- 제목: [${title}] URL: ${href}`);
      }
    });

    // 중복 제거
    const uniqueArticles = [...new Set(articles)];
    
    if (uniqueArticles.length === 0) {
      console.log('크롤링된 기사가 없습니다.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const rawDataText = uniqueArticles.join('\n');

    console.log('Gemini AI에게 데이터 분석 및 행사 요소 추출 요청 중...');

    // 3. Gemini AI 프롬프트 (관련된 최대 2개의 행사를 뽑아달라고 요청)
    const geminiPrompt = `다음은 '송파소식' 웹진의 이번 달 기사 목록입니다.
이 중에서 "문화, 공연, 행사, 축제"와 관련된 가장 중요한 기사 최대 2개를 골라 JSON 배열 형태로 정보를 추출해줘.
없으면 빈 배열 [] 을 출력해.

반환 형식 예시 (반드시 JSON Array 형태로만 반환):
[
  {
    "id": "랜덤숫자6자리",
    "name": "행사 제목 (깔끔하게 다듬어서)",
    "category": "행사",
    "startDate": "YYYY-MM-DD (기사에 없으면 이번달 1일로 설정)",
    "endDate": "YYYY-MM-DD (기사에 없으면 '상시'로 설정)",
    "location": "장소 (기사에 없으면 '송파구 관내')",
    "target": "전체 구민",
    "summary": "제목을 바탕으로 작성한 행사 한줄 요약 소개",
    "link": "목록에서 가져온 해당 기사의 URL 주소",
    "image": "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1000&auto=format&fit=crop"
  }
]
카테고리는 무조건 '행사'로 지정해.
image 필드에는 아래 3개 중 가장 분위기가 맞는 이미지의 전체 URL을 그대로 복사해서 써줘.
1. https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1000&auto=format&fit=crop (공연, 벚꽃, 피크닉, 축제)
2. https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop (도서관, 평생학습, 교육)
3. https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop (어린이, 활기찬 엑티비티, 놀이)

기사 원본 텍스트:
${rawDataText}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // 타임아웃을 피하기 위한 간단한 타임아웃 설정이 필요하면 좋을 수 있으나 생략 가능
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

    const jsonMatch = aiResponseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('AI 응답에서 행사 정보를 찾지 못했습니다.');
      return;
    }
    
    const processedItems = JSON.parse(jsonMatch[0]);

    if(processedItems.length === 0){
      console.log('새로 추가할 맞춤 행사가 없습니다.');
      return;
    }

    // 4. 중복 방지 (기존 events 목록의 제목, 링크와 비교)
    let addedCount = 0;
    const normalizeString = (str) => String(str || '').replace(/\s+/g, '').toLowerCase();
    const existingNames = new Set(localData.events.map(e => normalizeString(e.name)));

    for (const item of processedItems) {
      const normName = normalizeString(item.name);
      
      let isDuplicate = false;
      for (const en of existingNames) {
        if (en.includes(normName) || normName.includes(en)) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        item.id = `crawler-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        localData.events.unshift(item); // 리스트의 최상단에 배치
        addedCount++;
      }
    }

    if (addedCount > 0) {
      localData.lastUpdated = today;
      fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
      console.log(`성공! 총 ${addedCount}개의 새 행사가 송파소식지로부터 추가되었습니다.`);
    } else {
      console.log('추출된 모든 행사가 이미 데이터베이스에 존재합니다 (중복 패스).');
    }

  } catch (err) {
    console.error('크롤링 봇 실행 중 오류 발생:', err.message);
  }
}

main();
