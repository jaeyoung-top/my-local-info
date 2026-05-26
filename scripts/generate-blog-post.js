const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 글쓰기 스타일 - 카테고리별로 순환 선택
const WRITING_STYLES = [
  {
    name: '현장 탐방형',
    instruction: `1인칭 화자가 실제로 신청하거나 현장을 다녀온 것처럼 서술합니다.
"제가 실제로 문의해봤더니...", "처음엔 저도 몰랐는데 구청 담당자에게 물어보니..."와 같이 시작하세요.
독자가 "나도 이렇게 하면 되겠구나"를 느낄 수 있도록 생생하게 씁니다.
첫 문장은 절대 "안녕하세요"나 "이번에는" 으로 시작하지 마세요. 장면 묘사나 질문으로 시작하세요.`
  },
  {
    name: '팩트체크형',
    instruction: `제목과 실제 내용의 차이를 짚어주는 팩트체크 스타일로 씁니다.
"많은 분이 이렇게 알고 있지만, 실제로는..." 형태로 오해를 바로잡으세요.
공식 안내문에는 없지만 실제 신청자들이 겪는 현실적인 이슈를 중심으로 구성합니다.
숫자와 비교 데이터를 문장 안에 자연스럽게 녹이세요.`
  },
  {
    name: '상황별 시나리오형',
    instruction: `구체적인 인물 시나리오 3~4개로 글을 구성합니다.
"잠실동에 사는 32살 직장인 박씨의 경우...", "둘째 임신 중인 가락동 40대 주부라면..." 처럼
독자가 자신의 상황과 비교할 수 있도록 다양한 케이스를 다룹니다.
각 시나리오마다 결론(받을 수 있다/없다, 얼마 받는다)을 명확히 제시하세요.`
  },
  {
    name: '비교 분석형',
    instruction: `비슷한 혜택들을 비교하거나, 신청 경로별 장단점을 비교하는 구조로 씁니다.
"A 방법과 B 방법, 어느 쪽이 나을까?", "서울시 vs 송파구 혜택, 뭐가 다를까?" 형태로 구성하세요.
표나 항목 비교 형태를 활용하고, 마지막에 명확한 추천을 제시합니다.`
  }
];

// 카테고리별 스타일 선택 (순환)
function selectStyle(item, allItems) {
  const idx = allItems.indexOf(item);
  return WRITING_STYLES[idx % WRITING_STYLES.length];
}

async function generatePost(item, forceRegenerate = false, styleIndex = 0) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const today = new Date().toISOString().split('T')[0];

  const fileName = `${item.id}.md`;
  const savePath = path.join(postsDir, fileName);

  if (!forceRegenerate && fs.existsSync(savePath)) {
    console.log(`[SKIP] ${item.name}`);
    return false;
  }

  console.log(`[생성 중] ${item.name} (${item.id})`);

  const style = WRITING_STYLES[styleIndex % WRITING_STYLES.length];

  const prompt = `당신은 서울 송파구에서 10년 이상 거주한 생활 정보 에디터입니다.
아래 공공 서비스·지원금 정보를 바탕으로 진짜 주민에게 도움이 되는 글을 씁니다.

[항목 정보]
${JSON.stringify(item, null, 2)}

[이번 글의 스타일: ${style.name}]
${style.instruction}

[지역 색깔 넣기]
다음 중 적절한 것을 자연스럽게 언급하세요 (모두 쓸 필요 없음):
잠실역 인근, 가락시장 옆 주민센터, 올림픽공원 행정복지센터, 방이동 먹자골목, 석촌호수, 문정동 법조타운

[반드시 포함할 내용]
1. 구체적 금액·기간·나이 기준 — 항목에 없으면 해당 제도의 알려진 수치 사용
2. "이 혜택을 모르면 연간 얼마의 손해인가" 계산
3. 탈락하는 사람들의 실제 공통점 2~3가지 (서류 누락, 기한 초과 등 구체적으로)
4. 중복 수혜 가능 여부 — 비슷한 다른 제도와 함께 받을 수 있는지
5. 온라인·오프라인 신청 경로 둘 다 (앱 이름, 접속 URL 또는 주민센터 방문 방법)

[절대 하지 말 것]
- "안녕하세요! 오늘은", "이번 포스팅에서는" 으로 시작하는 것
- "더 자세한 내용은 공식 홈페이지를 확인하세요" 형태의 회피
- 글 마지막에 "마치며", "마무리하며" 섹션 달기
- 모든 섹션 제목을 볼드·번호 목록으로만 구성 (산문 섹션 비율도 높여야 함)
- 같은 문장 패턴 반복 ("~하는 것이 중요합니다", "~을 확인하시기 바랍니다")

[길이] 최소 4,500자. 유용한 정보로만 채울 것.

출력 (앞뒤 텍스트 없이 아래 형식 그대로):
---
title: "(검색에 유리하고 클릭하고 싶은 제목, 쌍따옴표로 감싸줘)"
date: ${today}
summary: "(신청 대상과 핵심 혜택을 담은 2문장, 쌍따옴표로 감싸줘)"
category: "${item.category}"
tags: [${item.category}, 지원, 혜택, 송파구, 서울]
source: "${item.link || ''}"
---

[본문]`;

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
    console.log(`✅ 완료: ${fileName} [${style.name}]`);
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

  const allItems = [
    ...localData.events,
    ...localData.benefits,
    ...(localData.aiSupport || [])
  ];

  console.log(`총 ${allItems.length}개 항목 확인 중...`);

  let createdCount = 0;
  for (let i = 0; i < allItems.length; i++) {
    const created = await generatePost(allItems[i], false, i);
    if (created) {
      createdCount++;
      await new Promise(r => setTimeout(r, 4500));
    }
  }

  if (createdCount === 0) {
    console.log('✅ 모든 항목에 대한 포스트가 이미 존재합니다.');
  } else {
    console.log(`🎉 총 ${createdCount}개의 새 블로그 포스트 생성 완료!`);
  }
}

main();
