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

  const prompt = `아래 공공/지역서비스 정보를 바탕으로 주민을 위한 심층 안내 블로그 글을 작성해줘.
정보: ${JSON.stringify(item, null, 2)}

아래 형식으로 출력해줘 (앞뒤에 다른 텍스트 없이, YAML frontmatter 포함해서 그대로):
---
title: "(검색에 유리하고 실용적인 제목, 예: '2026 청년수당 신청 방법과 자격 조건 완벽 정리', 쌍따옴표로 감싸줘)"
date: ${today}
summary: "(핵심 혜택과 신청 대상을 담은 2문장 요약, 쌍따옴표로 감싸줘)"
category: "${item.category}"
tags: [${item.category}, 지원, 혜택, 송파구, 서울]
source: "${item.link || ''}"
---

본문은 2000자 이상, 마크다운 형식으로 아래 7개 섹션을 모두 포함해서 작성해줘:

## 1. 이런 분들께 꼭 필요합니다
이 서비스가 실제로 어떤 상황의 주민에게 도움이 되는지, 구체적인 사례나 상황을 들어 공감 가는 언어로 설명 (200자 이상)

## 2. 핵심 혜택 한눈에 보기
지원 내용, 지원 금액 또는 규모, 혜택 기간 등을 표나 목록 형태로 명확하게 정리

## 3. 신청 자격 상세 안내
나이, 소득, 거주지, 가구 구성 등 세부 자격 요건을 항목별로 나열. 자격 여부가 불명확한 경우 확인 방법도 안내

## 4. 신청 방법 단계별 가이드
온라인/오프라인 신청 경로, 필요 서류, 신청 절차를 단계별(Step 1, Step 2...)로 구체적으로 안내

## 5. 놓치기 쉬운 주의사항 3가지
실제로 신청 과정에서 많이 실수하거나 놓치는 부분을 강조 표시와 함께 안내

## 6. 자주 묻는 질문 (Q&A)
예상 질문 3개와 답변을 Q: / A: 형식으로 작성

## 7. 관련 정보 더 보기
비슷하거나 함께 활용하면 좋은 공공 혜택/서비스를 2~3개 간략히 소개하고, 공식 링크는 ${item.link || '공식 사이트'}를 안내

마지막에 이 글이 공식 원문을 요약·정리한 안내글임을 독자에게 알리는 한 줄 주석을 추가해줘.`;

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
