const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

/**
 * 하나의 항목으로 블로그 포스트를 생성합니다.
 * - 항목 ID로 파일명을 만들어 이미 생성된 것이면 건너뜁니다.
 * - "오늘의 추천" 방식의 재포장은 완전히 제거합니다.
 */
async function generatePost(item) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const today = new Date().toISOString().split('T')[0];

  // 파일명은 항목 ID 기반으로 고정 (중복 방지)
  const fileName = `${item.id}.md`;
  const savePath = path.join(postsDir, fileName);

  if (fs.existsSync(savePath)) {
    console.log(`[SKIP] ${item.name} - 이미 포스트가 존재합니다.`);
    return false;
  }

  console.log(`[생성 중] ${item.name} (${item.id})`);

  const prompt = `아래 공공/지역서비스 정보를 바탕으로 블로그 글을 작성해줘.
정보: ${JSON.stringify(item, null, 2)}

아래 형식으로 출력해줘 (앞뒤에 다른 텍스트 없이, YAML frontmatter 포함해서 그대로):
---
title: "(친근하고 흥미로운 제목, 쌍따옴표로 감싸줘)"
date: ${today}
summary: "(한 줄 요약, 쌍따옴표로 감싸줘)"
category: "${item.category}"
tags: [${item.category}, 지원, 추천, 송파구]
source: "${item.link || ''}"
---

(본문: 800자 이상, 친근한 안내 블로그 톤, 아래 내용을 포함해줘)
1. 이 서비스가 왜 필요한지 (일상적인 언어로)
2. 신청 대상 및 방법
3. 놓치면 안 되는 핵심 포인트 3가지`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;

    fs.writeFileSync(savePath, aiText.trim(), 'utf8');
    console.log(`✅ 완료: ${fileName}`);
    return true;
  } catch (err) {
    console.error(`❌ 실패 [${item.id}]:`, err.message);
    return false;
  }
}

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경변수가 없습니다.');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // 모든 카테고리를 합쳐서 순서대로 처리
  const allItems = [
    ...localData.events,
    ...localData.benefits,
    ...(localData.aiSupport || [])
  ];

  console.log(`총 ${allItems.length}개 항목 확인 중...`);

  let createdCount = 0;
  for (const item of allItems) {
    const created = await generatePost(item);
    if (created) {
      createdCount++;
      // API 과부하 방지: 요청 사이 2초 대기
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (createdCount === 0) {
    console.log('✅ 모든 항목에 대한 포스트가 이미 존재합니다. 새로 생성된 글 없음.');
  } else {
    console.log(`🎉 총 ${createdCount}개의 새 블로그 포스트 생성 완료!`);
  }
}

main();
