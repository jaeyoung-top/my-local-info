/**
 * 기존 local-info.json의 중복/부적절 이미지를 재할당하는 스크립트
 * 카테고리 키워드로 테마를 감지하고, 각 아이템에 가능한 고유한 이미지를 배정
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, '../public/data/local-info.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

// 카테고리별 대형 이미지 풀 (테마당 10~15개)
const THEME_POOLS = {
  education: [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
  ],
  health: [
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&q=80",
    "https://images.unsplash.com/photo-1511174346297-cde2546c76b1?w=800&q=80",
    "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=800&q=80",
    "https://images.unsplash.com/photo-1571772996211-2e3d26573f9a?w=800&q=80",
  ],
  finance: [
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80",
    "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&q=80",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?w=800&q=80",
    "https://images.unsplash.com/photo-1638466700763-c4d3dda58ece?w=800&q=80",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",
  ],
  children: [
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800&q=80",
    "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80",
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
  ],
  senior: [
    "https://images.unsplash.com/photo-1525026198548-4baa812f1183?w=800&q=80",
    "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80",
    "https://images.unsplash.com/photo-1511296684614-2e94eb687be6?w=800&q=80",
    "https://images.unsplash.com/photo-1559234935-37c9c04975e4?w=800&q=80",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    "https://images.unsplash.com/photo-1581579439828-3cbf55c888dc?w=800&q=80",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80",
    "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
    "https://images.unsplash.com/photo-1536420111820-c2e08c93b9d8?w=800&q=80",
  ],
  job: [
    "https://images.unsplash.com/photo-1551836022-d0bc15250ff5?w=800&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
    "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
    "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=800&q=80",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80",
    "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80",
  ],
  environment: [
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
    "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&q=80",
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80",
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
    "https://images.unsplash.com/photo-1473090826765-d54ac2fdc1eb?w=800&q=80",
    "https://images.unsplash.com/photo-1498925008800-019c7d59d903?w=800&q=80",
    "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=800&q=80",
    "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
    "https://images.unsplash.com/photo-1485395578879-6ba080c0c3cb?w=800&q=80",
  ],
  culture: [
    "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",
  ],
  ai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=800&q=80",
    "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80",
    "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=800&q=80",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
    "https://images.unsplash.com/photo-1516321165247-4aa89a48be55?w=800&q=80",
  ],
  admin: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
    "https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&q=80",
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
    "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    "https://images.unsplash.com/photo-1509822929063-6b6723e0e974?w=800&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80",
    "https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  ],
};

// 이름/요약에서 테마 감지
function detectTheme(item) {
  if (item.imageTheme && THEME_POOLS[item.imageTheme]) return item.imageTheme;
  const text = `${item.name || ''} ${item.summary || ''} ${item.category || ''}`.toLowerCase();

  if (/ai|인공지능|디지털|빅데이터|데이터|머신러닝|딥러닝|자동화/.test(text)) return 'ai';
  if (/아동|어린이|영유아|보육|유아|어린집|아이/.test(text)) return 'children';
  if (/노인|어르신|시니어|고령|노년/.test(text)) return 'senior';
  if (/취업|채용|일자리|고용|창업|구직|직업/.test(text)) return 'job';
  if (/교육|훈련|학습|연수|강의|특강|세미나|배움|수업/.test(text)) return 'education';
  if (/의료|건강|병원|진료|보건|복지|치료|돌봄/.test(text)) return 'health';
  if (/지원금|바우처|비용|급여|수당|장학|보조금|장려금/.test(text)) return 'finance';
  if (/환경|에코|친환경|재활용|탄소|에너지|녹색/.test(text)) return 'environment';
  if (/문화|예술|공연|축제|행사|전시|체험|박람회/.test(text)) return 'culture';
  return 'admin';
}

// 모든 아이템 수집
const allItems = [
  ...data.events,
  ...data.benefits,
  ...(data.aiSupport || []),
];

// 테마별 인덱스 카운터 (순환 할당으로 중복 최소화)
const themeCounters = {};
for (const key of Object.keys(THEME_POOLS)) themeCounters[key] = 0;

// 각 아이템에 이미지 재할당
let reassignCount = 0;
for (const item of allItems) {
  const theme = detectTheme(item);
  const pool = THEME_POOLS[theme];
  const idx = themeCounters[theme] % pool.length;
  const newImage = pool[idx];
  themeCounters[theme]++;

  if (item.image !== newImage) {
    item.image = newImage;
    reassignCount++;
  }
}

// 저장
writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`이미지 재할당 완료: ${reassignCount}/${allItems.length}개 항목 업데이트`);

// 중복 통계 출력
const imgCount = {};
for (const item of allItems) imgCount[item.image] = (imgCount[item.image] || 0) + 1;
const dups = Object.values(imgCount).filter(c => c > 1).length;
console.log(`중복 이미지 URL 수: ${dups} (이미지 URL 총 ${Object.keys(imgCount).length}개 사용)`);
