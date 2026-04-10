const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function generatePost(item, isDaily = false) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const today = new Date().toISOString().split('T')[0];
  
  // 일반 파일명: id.md
  // 데일리 파일명: yyyy-mm-dd-daily-category-id.md
  const fileName = isDaily 
    ? `${today}-daily-${item.category === 'AI지원' ? 'ai' : 'benefit'}-${item.id}.md`
    : `${item.id}.md`;
  
  const savePath = path.join(postsDir, fileName);

  if (fs.existsSync(savePath)) {
    return false;
  }

  console.log(`[${item.id}] ${isDaily ? '오늘의 추천' : '신규 정보'} 블로그 포스트 생성 중...`);

  const prompt = isDaily
    ? `Write a Korean blog post titled "[오늘의 추천 정보] ${item.name}". 
       Re-introduce this service in a fresh way for today (${today}).
       Data: ${JSON.stringify(item, null, 2)}
       Format:
       ---
       title: [오늘의 추천] ${item.name} - ${item.summary}
       date: ${today}
       summary: ${item.summary} (오늘의 추천 정보입니다)
       category: ${item.category}
       tags: [오늘의추천, ${item.category}, 송파구]
       source: ${item.link || ''}
       ---
       (Write 800+ characters in Korean, friendly blog tone, why this is recommended today)`
    : `아래 공공/지역서비스 정보를 바탕으로 블로그 글을 작성해줘.
       정보: ${JSON.stringify(item, null, 2)}
       아래 형식으로 출력해줘:
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

    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;

    fs.writeFileSync(savePath, aiText.trim(), 'utf8');
    console.log(`✅ [${fileName}] 생성 완료!`);
    return true;
  } catch (err) {
    console.error(`❌ [${item.id}] 생성 오류:`, err.message);
    return false;
  }
}

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return;

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  let localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // 1. 송파소식 (이벤트) - 오직 새 소식만
  console.log('--- 송파소식 점검 ---');
  for (const item of localData.events) {
    const created = await generatePost(item);
    if (created) await new Promise(r => setTimeout(r, 2000));
  }

  // 2. 공공정보 & AI지원 - 새 소식 있으면 생성
  console.log('--- 혜택 및 AI 신규 정보 점검 ---');
  let newGenerated = 0;
  const dailyTargets = [...localData.benefits, ...(localData.aiSupport || [])];
  
  for (const item of dailyTargets) {
    const created = await generatePost(item);
    if (created) {
      newGenerated++;
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // 3. 매일 업로드 보장 (오늘 생성된 신규 혜택/AI 글이 없다면 기존 것 중 하나 강제 생성)
  const today = new Date().toISOString().split('T')[0];
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  const files = fs.readdirSync(postsDir);
  const hasTodayPost = files.some(f => f.startsWith(today));

  if (!hasTodayPost && dailyTargets.length > 0) {
    console.log('--- 오늘의 추천 정보 생성 (매일 업로드 보장) ---');
    // 랜덤하게 하나 골라서 생성
    const randomItem = dailyTargets[Math.floor(Math.random() * dailyTargets.length)];
    await generatePost(randomItem, true);
  } else {
    console.log('✅ 오늘 이미 새로운 글이 게시되었습니다.');
  }
}

main();
