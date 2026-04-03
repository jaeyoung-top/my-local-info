const fs = require('fs');
const path = require('path');

/**
 * 최신 공공서비스 정보를 바탕으로 Gemini AI를 사용하여 블로그 포스트를 자동 생성하는 스크립트입니다.
 */
async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('환경변수 GEMINI_API_KEY가 설정되지 않았습니다.');
    return;
  }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

  // 폴더가 없으면 생성
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // 1단계: 최신 데이터 확인
  let localData;
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    localData = JSON.parse(fileContent);
  } catch (err) {
    console.error('데이터 파일을 읽는 중 오류가 발생했습니다.', err);
    return;
  }

  // 행사(events)와 혜택(benefits) 중 마지막 항목들을 확인
  const lastEvent = localData.events[localData.events.length - 1];
  const lastBenefit = localData.benefits[localData.benefits.length - 1];

  // 기존 포스트 파일들 읽기 (중복 확인용)
  const existingFiles = fs.readdirSync(postsDir);
  const existingContents = existingFiles.map(file => 
    fs.readFileSync(path.join(postsDir, file), 'utf8')
  );

  // 이미 작성된 글인지 확인하는 함수
  const isAlreadyPosted = (item) => {
    if (!item) return true;
    return existingContents.some(content => content.includes(item.name));
  };

  // 최신 항목 선택 (작성되지 않은 항목 우선)
  let targetItem = null;
  if (!isAlreadyPosted(lastBenefit)) {
    targetItem = lastBenefit;
  } else if (!isAlreadyPosted(lastEvent)) {
    targetItem = lastEvent;
  }

  if (!targetItem) {
    console.log('이미 작성된 글입니다');
    return;
  }

  // 2단계: Gemini AI로 블로그 글 생성
  const today = new Date().toISOString().split('T')[0];
  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(targetItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
source: ${targetItem.link || ''}
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  // 사용자가 지정한 엔드포인트 그대로 사용
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API 호출 실패: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;

    // 3단계: 파일 저장
    // FILENAME 패턴 찾기
    const filenameMatch = aiText.match(/FILENAME:\s*(\d{4}-\d{2}-\d{2}-[\w-]+)/);
    if (!filenameMatch) throw new Error('파일명(FILENAME) 정보를 찾을 수 없습니다.');

    const fileName = `${filenameMatch[1]}.md`;
    // 파일명 출력 라인을 제외한 나머지 본문 추출
    const finalContent = aiText.replace(/FILENAME:.*$/, '').trim();

    const savePath = path.join(postsDir, fileName);
    fs.writeFileSync(savePath, finalContent, 'utf8');
    
    console.log('생성 완료');

  } catch (err) {
    console.error('글 생성 중 오류가 발생했습니다:', err.message);
  }
}

main();
