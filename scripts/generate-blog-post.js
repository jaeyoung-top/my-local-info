const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('환경변수 GEMINI_API_KEY가 설정되지 않았습니다.');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  let localData;
  try {
    localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error('데이터 파일을 읽는 중 오류가 발생했습니다.', err);
    return;
  }

  // 모든 정보 합치기
  const aiItems = localData.aiSupport || [];
  const allItems = [...localData.events, ...localData.benefits, ...aiItems];

  let generatedCount = 0;
  const MAX_GENERATE = 20; // 모든 정보를 한 번에 생성하도록 상향

  for (const item of allItems) {
    if (generatedCount >= MAX_GENERATE) break;

    // item.id를 파일명으로 사용
    const fileName = `${item.id}.md`;
    const savePath = path.join(postsDir, fileName);

    // 이미 마크다운 파일이 존재하면 건너뜀
    if (fs.existsSync(savePath)) {
      continue;
    }

    console.log(`[${item.id}] 새로운 정보를 블로그 포스트로 변환 중...`);

    const today = new Date().toISOString().split('T')[0];
    const prompt = `아래 공공/지역서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(item, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 주저리주저리 쓰지마:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: ${item.category}
tags: [${item.category}, 지원, 추천]
source: ${item.link || ''}
---

(본문: 800자 이상, 안내하는 블로그 톤, 추천 이유 3가지 포함, 신청 방법 및 상세안내 포함)`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const result = await response.json();
      const aiText = result.candidates[0].content.parts[0].text;

      fs.writeFileSync(savePath, aiText.trim(), 'utf8');
      console.log(`✅ [${fileName}] 생성 완료!`);
      generatedCount++;
      
      // API Rate Limit을 위해 잠깐 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (err) {
      console.error(`❌ [${item.id}] 글 생성 중 오류:`, err.message);
    }
  }

  if (generatedCount === 0) {
    console.log('🎉 모든 정보가 이미 블로그 글로 작성되어 있습니다.');
  }
}

main();
