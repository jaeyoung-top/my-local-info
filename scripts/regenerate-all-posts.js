const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function generatePost(item) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const today = new Date().toISOString().split('T')[0];

  const fileName = `${item.id}.md`;
  const savePath = path.join(postsDir, fileName);

  const prompt = `아래 공공/지역서비스 정보를 바탕으로, 실제 혜택을 받으려는 독자에게 진정한 가치를 제공하는 심층 안내 글을 작성해줘.

정보: ${JSON.stringify(item, null, 2)}

**글쓰기 목표**: 이 글을 읽으면 독자가 본인 해당 여부를 판단하고 신청까지 완료할 수 있어야 한다. 공식 사이트 없이도 답을 찾을 수 있는 수준의 정보를 담을 것.

**절대 하지 말 것:**
- "자세한 내용은 공식 사이트를 확인하세요"처럼 핵심 정보를 생략하고 독자를 다른 곳으로 돌리는 문구
- "안녕하세요! 오늘은 좋은 소식을 가지고 왔습니다!" 형태의 AI 특유의 인트로
- 모든 글에 동일한 섹션 제목과 구조 사용 (주제와 독자에 따라 자유롭게 구성)
- 실질적 정보 대신 격려·칭찬 문구로 분량 채우기
- "이 글은 요약·정리한 안내글입니다" 같은 면책 주석 절대 금지

**반드시 포함할 것:**
1. **실제 숫자**: 지원 금액·나이 기준·소득 기준을 구체적 수치로. 항목 데이터에 없으면 해당 제도의 일반적 기준을 활용해 작성
2. **자가진단 체크리스트**: "다음 조건 중 하나라도 해당되면 신청 가능" 또는 "모두 충족해야 신청 가능" 형태
3. **실생활 사례**: "예를 들어 송파구에 거주하는 30대 직장인이라면..." 같은 구체적 시나리오 최소 1개
4. **탈락·지연 이유**: 공식 안내에는 없지만 실제로 많이 발생하는 문제와 예방 방법
5. **중복 수혜 가능 여부**: 다른 유사 혜택과 함께 받을 수 있는지 명확하게
6. **현실적 일정**: 신청부터 혜택 수령까지 평균 소요 기간

**길이**: 최소 4,000자 이상. 분량을 위한 반복 없이, 모두 유용한 정보로 채울 것.

**섹션 구성**: 아래는 예시이며, 내용에 따라 자유롭게 변형·추가·삭제 가능:
- 나는 해당될까? (자가진단 체크리스트)
- 실제 얼마나 받을 수 있나 (금액·혜택 상세)
- 신청 전 반드시 알아야 할 현실 조언
- 단계별 신청 가이드 (온라인/오프라인 경로 모두)
- 자주 하는 실수와 탈락 이유
- Q&A (구체적 답변 포함, "공식 사이트 확인" 없이)
- 함께 활용하면 좋은 지원제도 (간략 소개)

출력 형식 (앞뒤에 다른 텍스트 없이, YAML frontmatter 포함해서 그대로 출력):
---
title: "(실용적이고 검색에 유리한 제목, 예: '2026 청년수당 신청 방법·자격 조건·실수령액 총정리', 쌍따옴표로 감싸줘)"
date: ${today}
summary: "(핵심 혜택과 신청 대상을 담은 2문장 요약, 쌍따옴표로 감싸줘)"
category: "${item.category}"
tags: [${item.category}, 지원, 혜택, 송파구, 서울]
source: "${item.link || ''}"
---

[본문 4,000자 이상]`;

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
    return true;
  } catch (err) {
    console.error(`  ❌ 실패: ${err.message}`);
    return false;
  }
}

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경변수가 없습니다.');
    return;
  }

  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const backupDir = path.join(process.cwd(), 'src', 'content', 'posts-backup');
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');

  // 기존 포스트 백업
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const existingFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  console.log(`기존 포스트 ${existingFiles.length}개 백업 중...`);
  for (const file of existingFiles) {
    fs.copyFileSync(path.join(postsDir, file), path.join(backupDir, file));
  }
  console.log(`백업 완료: posts-backup/\n`);

  const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const allItems = [
    ...(localData.events || []),
    ...(localData.benefits || []),
    ...(localData.aiSupport || [])
  ];

  console.log(`총 ${allItems.length}개 항목 재생성 시작...`);
  console.log(`예상 소요 시간: 약 ${Math.ceil(allItems.length * 3 / 60)}분\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    process.stdout.write(`[${i + 1}/${allItems.length}] ${item.name} ... `);

    // 기존 파일 삭제
    const savePath = path.join(postsDir, `${item.id}.md`);
    if (fs.existsSync(savePath)) fs.unlinkSync(savePath);

    const ok = await generatePost(item);
    if (ok) {
      successCount++;
      console.log('✅');
    } else {
      failCount++;
      // 실패 시 백업 복원
      const backupPath = path.join(backupDir, `${item.id}.md`);
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, savePath);
        console.log('⚠️ 백업 복원됨');
      }
    }

    await new Promise(r => setTimeout(r, 2500));
  }

  console.log(`\n완료: 성공 ${successCount}개, 실패 ${failCount}개`);
  if (failCount > 0) {
    console.log(`실패 항목은 posts-backup/ 에서 확인 가능합니다.`);
  }
}

main();
