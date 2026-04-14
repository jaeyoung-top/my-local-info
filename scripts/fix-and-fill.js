/**
 * 1) benefits 중복 제거
 * 2) Gemini로 송파 행사 10개 한 번에 추가
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
];

async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) { console.error('GEMINI_API_KEY 없음'); return; }

  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // ── 1) benefits 중복 제거 ──────────────────────────────
  const normalize = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
  const seen = new Set();
  const before = localData.benefits.length;
  localData.benefits = localData.benefits.filter(b => {
    const key = normalize(b.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`혜택 중복 제거: ${before}개 → ${localData.benefits.length}개`);

  // ── 2) Gemini로 송파 행사 10개 생성 ───────────────────
  const today = new Date().toISOString().split('T')[0];
  const [year, month] = today.split('-');
  const existingEventNames = (localData.events || []).map(e => e.name);

  const prompt = `${year}년 ${parseInt(month)}월 기준, 서울 송파구에서 열리거나 예정된 문화·행사·축제·공연·전시·체험 프로그램을 10개 알려줘.
아래 이미 있는 행사는 제외해:
${JSON.stringify(existingEventNames)}

반드시 JSON 배열만 출력 (다른 텍스트 없이):
[
  {
    "name": "행사명 (공식명칭 또는 자연스러운 제목)",
    "location": "장소 (예: 석촌호수, 올림픽공원, 송파구청 등)",
    "target": "참가 대상 (예: 전체 구민, 어린이, 청소년 등)",
    "summary": "행사 한줄 소개 (50자 이내)",
    "startDate": "${year}-${month}-01",
    "endDate": "종료일 또는 상시",
    "link": "공식 페이지 URL (실제 존재하는 URL 또는 https://www.songpa.go.kr)"
  }
]

10개를 반드시 채워줘. 실제로 있을 법한 행사로.`;

  console.log('Gemini로 송파 행사 10개 요청 중...');
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!res.ok) throw new Error(`Gemini 오류: ${res.status}`);

  const result = await res.json();
  const text = result.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('JSON 배열 없음');

  const events = JSON.parse(jsonMatch[0]);
  const existingNorm = new Set((localData.events || []).map(e => normalize(e.name)));
  const usedImages = new Set((localData.events || []).map(e => e.image));

  let addedCount = 0;
  for (const ev of events) {
    if (!ev.name) continue;
    const key = normalize(ev.name);
    if ([...existingNorm].some(n => n.includes(key) || key.includes(n))) {
      console.log(`[중복] ${ev.name}`);
      continue;
    }
    const available = EVENT_IMAGES.filter(img => !usedImages.has(img));
    const image = available.length > 0
      ? available[addedCount % available.length]
      : EVENT_IMAGES[addedCount % EVENT_IMAGES.length];
    usedImages.add(image);

    localData.events.unshift({
      id: `gemini-${today}-${addedCount + 1}`,
      name: String(ev.name).trim(),
      category: '행사',
      startDate: ev.startDate || today,
      endDate: ev.endDate || '상시',
      location: String(ev.location || '송파구').trim(),
      target: String(ev.target || '전체 구민').trim(),
      summary: String(ev.summary || '').trim(),
      link: String(ev.link || 'https://www.songpa.go.kr').trim(),
      image,
    });
    existingNorm.add(key);
    addedCount++;
    console.log(`✅ 행사 추가: ${ev.name}`);
  }

  localData.lastUpdated = today;
  fs.writeFileSync(dataPath, JSON.stringify(localData, null, 2), 'utf8');
  console.log(`\n🎉 완료! 행사 ${addedCount}개 추가. 최종 현황:`);
  console.log(`  혜택: ${localData.benefits.length}개`);
  console.log(`  행사: ${localData.events.length}개`);
  console.log(`  AI지원: ${(localData.aiSupport||[]).length}개`);
}

main().catch(err => console.error('오류:', err.message));
