const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 전역 순번을 시드로 picsum 고유 이미지 URL 생성
function uniqueImageUrl(seq) {
  return `https://picsum.photos/seed/songpa${seq}/800/500`;
}

// 모든 카테고리 합치기 (순서 유지)
const categories = ['events', 'benefits', 'aiSupport'];
let seq = 1;
let fixed = 0;

// 전체 항목에 순번 기반 고유 이미지 부여
for (const cat of categories) {
  if (!data[cat]) continue;
  for (const item of data[cat]) {
    item.image = uniqueImageUrl(seq++);
    fixed++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`완료: ${fixed}개 항목 이미지를 고유 URL로 교체했습니다.`);
console.log('형식: https://picsum.photos/seed/{itemId}/800/500');
