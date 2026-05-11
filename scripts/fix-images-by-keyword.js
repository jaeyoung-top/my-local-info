/**
 * 항목 이름·카테고리 키워드로 관련성 높은 Unsplash 이미지를 배정합니다.
 * 전체 항목에서 중복 없이 배정하며, 키워드 매칭 점수로 최적 카테고리를 선택합니다.
 */
const fs = require('fs');
const path = require('path');

// ── 카테고리별 Unsplash 이미지 풀 ──────────────────────────────────────────
const POOLS = {
  ai: [
    'photo-1677442136019-21780ecad995', 'photo-1620712943543-bcc4688e7485',
    'photo-1591453089816-0fbb971b454c', 'photo-1550751827-4bd374c3f58b',
    'photo-1488229297570-58520851e868', 'photo-1516110833967-0b5716ca1387',
    'photo-1485827404703-89b55fcc595e', 'photo-1518770660439-4636190af475',
    'photo-1461749280684-dccba630e2f6', 'photo-1526378800651-c32d170fe6f8',
    'photo-1531297484001-80022131f5a1', 'photo-1555255707-c07966088b7b',
    'photo-1581091226825-a6a2a5aee158', 'photo-1593642632559-0c6d3fc62b89',
    'photo-1504868584819-f8e8b4b6d7e3', 'photo-1563986768494-4dee2763ff3f',
    'photo-1516321165247-4aa89a48be55', 'photo-1558618047-3c8c76ca7d13',
    'photo-1666875753105-c63a6f3bdc86', 'photo-1535378917042-10a22c95931a',
    'photo-1677442135703-1787eea5ce01', 'photo-1676274189360-4f57f6da8908',
    'photo-1655720828018-edd2daec9349', 'photo-1668554245893-2430d0077217',
    'photo-1644088379091-d574269d422f', 'photo-1655720833187-5c70c0d2de99',
    'photo-1703729577767-6ae53eef2d1b', 'photo-1616499370260-485b3e5ed653',
  ],
  education: [
    'photo-1524995997946-a1c2e315a42f', 'photo-1497633762265-9d179a990aa6',
    'photo-1503676260728-1c00da094a0b', 'photo-1434030216411-0b793f4b4173',
    'photo-1456513080510-7bf3a84b82f8', 'photo-1519750157634-b6d493a0f77c',
    'photo-1580582932707-520aed937b7b', 'photo-1516321497487-e288fb19713f',
    'photo-1509062522246-3755977927d7', 'photo-1427504494785-3a9ca7044f45',
    'photo-1580894732444-8ecded7900cd', 'photo-1562408590-e32931084e23',
    'photo-1571260899304-425eee4c7efc', 'photo-1588072432836-e10032774350',
    'photo-1606761568499-6d2451b23c66', 'photo-1523050854058-8df90110c9f1',
    'photo-1488190211105-8b0e65b80b4e', 'photo-1546410531-bb4caa6b424d',
    'photo-1488521787991-ed7bbaae773c', 'photo-1550399504-8953e1a6ac87',
    'photo-1453928582365-b6ad33cbcf64', 'photo-1513258496099-48168024aec0',
    'photo-1472289065668-ce650ac443d2', 'photo-1583468982228-19f19164aee2',
    'photo-1491841573634-28140fc7ced7', 'photo-1604326531570-4fa61d6e49d4',
  ],
  youth_job: [
    'photo-1551836022-d0bc15250ff5', 'photo-1521737604893-d14cc237f11d',
    'photo-1542744173-8e7e53415bb0', 'photo-1573497620053-ea5300f94f21',
    'photo-1529612700005-e35377bf1415', 'photo-1568992688065-536aad8a12f6',
    'photo-1560179707-f14e90ef3623', 'photo-1553877522-43269d4ea984',
    'photo-1600880292089-90a7e086ee0c', 'photo-1527689368864-3a821dbccc34',
    'photo-1522202176988-66273c2fd55f', 'photo-1497366216548-37526070297c',
    'photo-1604328698692-f76ea9498e76', 'photo-1571171637578-41bc2dd41cd2',
    'photo-1553484771-371a605b060b', 'photo-1486406146926-c627a92ad1ab',
    'photo-1507679799987-c73779587ccf', 'photo-1454165804606-c3d57bc86b40',
    'photo-1521791055366-0d553872952f', 'photo-1568992687947-868a62a9f521',
    'photo-1556761175-5973dc0f32e7', 'photo-1552664730-d307ca884978',
    'photo-1541746972996-4e0b0f43e02a', 'photo-1664575198308-3959904fa430',
    'photo-1573166364524-d9dbfd8bbf83', 'photo-1600880292203-757bb62b4baf',
    'photo-1519389950473-47ba0277781c', 'photo-1573496359142-b8d87734a5a2',
  ],
  elderly: [
    'photo-1525026198548-4baa812f1183', 'photo-1516307365426-bea591f05011',
    'photo-1511296684614-2e94eb687be6', 'photo-1559234935-37c9c04975e4',
    'photo-1547592166-23ac45744acd', 'photo-1581579439828-3cbf55c888dc',
    'photo-1474552226712-ac0f0961a954', 'photo-1499952127939-9bbf5af6c51c',
    'photo-1508214751196-bcfd4ca60f91', 'photo-1536420111820-c2e08c93b9d8',
    'photo-1544027993-37dbfe43562a', 'photo-1559839914-17aae19cec71',
    'photo-1489710437720-ebb67ec84dd2', 'photo-1581579186913-45ac24ed53b4',
    'photo-1609220136736-443140cffec6', 'photo-1543168256-418811576931',
    'photo-1591085686350-798c0f9faa7f', 'photo-1571019613454-1cb2f99b2d8b',
    'photo-1514454852052-f6bb38cd6a42', 'photo-1541781774459-bb2af2f05b55',
  ],
  children_family: [
    'photo-1502086223501-7ea6ecd79368', 'photo-1516627145497-ae6968895b74',
    'photo-1519340333755-56e9c1d04579', 'photo-1476703993599-0035a21b17a9',
    'photo-1503454537195-1dcabb73ffb9', 'photo-1551009175-15bdf9dcb580',
    'photo-1587654780291-39c9404d746b', 'photo-1534939561126-855b8675edd7',
    'photo-1545558014-8692077e9b5c', 'photo-1560969184-10fe8719e047',
    'photo-1471286174890-9c112c969b87', 'photo-1518199266791-5375a83190b7',
    'photo-1492725764893-90b379f0f5d1', 'photo-1555252333-9f8e92e65df9',
    'photo-1484863137850-59afcfe05386', 'photo-1491013516836-7db643ee125a',
    'photo-1567581935884-3349723552ca', 'photo-1516733725897-1aa73b87c8e8',
    'photo-1602576666092-bf6447a729fc', 'photo-1578496479914-7ef3b0af7bce',
    'photo-1529156069898-49953e39b3ac', 'photo-1620652693537-89c6c92a1b7b',
    'photo-1491841573634-28140fc7ced7', 'photo-1531983412531-1f49a365ffed',
  ],
  health: [
    'photo-1559027615-cd4628902d4a', 'photo-1505751172876-fa1923c5c528',
    'photo-1532938911079-1b06ac7ceec7', 'photo-1576091160399-112ba8d25d1d',
    'photo-1526256262350-7da7584cf5eb', 'photo-1584308666744-24d5c474f2ae',
    'photo-1494390248081-4e521a5940db', 'photo-1511174346297-cde2546c76b1',
    'photo-1550831107-1553da8c8464', 'photo-1571772996211-2e3d26573f9a',
    'photo-1559523183-b1fc3fddf7c5', 'photo-1538108149393-fbbd81895907',
    'photo-1579684385127-1ef15d508118', 'photo-1612349317150-e413f6a5b16d',
    'photo-1587854692152-cbe660dbde88', 'photo-1631217868264-e5b90bb7e133',
    'photo-1666214276372-24b8ec5b8b4f', 'photo-1576671081837-49000212a370',
    'photo-1582719478250-c89cae4dc85b', 'photo-1571019613454-1cb2f99b2d8b',
    'photo-1585435557343-3b092031a831', 'photo-1607619056574-7b8d3ee536b2',
    'photo-1530026405186-ed1f139313f8', 'photo-1504439468489-c8920d796a29',
  ],
  culture_event: [
    'photo-1543362906-acfc16c67564', 'photo-1514525253161-7a46d19cd819',
    'photo-1511632765486-a01980e01a18', 'photo-1492684223066-81342ee5ff30',
    'photo-1533174072545-7a4b6ad7a6c3', 'photo-1506157786151-b8491531f063',
    'photo-1429962714451-bb934ecdc4ec', 'photo-1501281668745-f7f57925c3b4',
    'photo-1459749411175-04bf5292ceea', 'photo-1471478331149-c72f17e33c73',
    'photo-1504196606672-aef5c9cefc92', 'photo-1560523160-754a9e25c68f',
    'photo-1528495612343-9ca542153b44', 'photo-1492684223066-81342ee5ff30',
    'photo-1523580846011-d3a5bc25702b', 'photo-1470229722913-7c0e2dbbafd3',
    'photo-1499364615650-ec38552f4f34', 'photo-1540575467063-178a50c2df87',
    'photo-1603228254119-e6a4d095dc59', 'photo-1516450360452-9312f5e86fc7',
    'photo-1493676304819-0d7a8d026dcf', 'photo-1468359601543-843bfaef291a',
    'photo-1477959858617-67f85cf4f1df', 'photo-1598550476439-6a1f857cd614',
    'photo-1574181611646-5f91d0f9c249', 'photo-1563841930606-67e2b4e3fc53',
    'photo-1506905925346-21bda4d32df4', 'photo-1533050487297-09b450131914',
  ],
  finance_welfare: [
    'photo-1554224155-8d04cb21cd6c', 'photo-1579621970588-a35d0e7ab9b6',
    'photo-1565514020179-026b92b84bb6', 'photo-1460925895917-afdab827c52f',
    'photo-1450101499163-c8848c66ca85', 'photo-1568992687947-868a62a9f521',
    'photo-1521791055366-0d553872952f', 'photo-1507679799987-c73779587ccf',
    'photo-1454165804606-c3d57bc86b40', 'photo-1553729459-efe14ef6055d',
    'photo-1611974789855-9c2a0a7236a3', 'photo-1638466700763-c4d3dda58ece',
    'photo-1535320903710-d993d3d77d29', 'photo-1559523182-a284c3fb7cff',
    'photo-1518458028785-8fbcd101ebb9', 'photo-1556742049-0cfed4f6a45d',
    'photo-1579621970563-ebec7560ff3e', 'photo-1563013544-824ae1b704d3',
    'photo-1609743522653-52354461eb27', 'photo-1634733988138-bf2c3a2a13fa',
    'photo-1561414927-6d86591d0c4f', 'photo-1507003211169-0a1dd7228f2d',
    'photo-1526304640581-d334cdbbf45e', 'photo-1553729784-e91953dec042',
    'photo-1434626881859-194d67b2b86f', 'photo-1579621970588-a35d0e7ab9b6',
    'photo-1633158829585-23ba8f7c8caf', 'photo-1604156425963-9be03f86a428',
  ],
  housing_environment: [
    'photo-1560185007-c5ca9d2c014d', 'photo-1486325212027-8081e485255e',
    'photo-1570129477492-45c003edd2be', 'photo-1448630360428-65456885c650',
    'photo-1582407947304-fd86f28320be', 'photo-1532996122724-e3c354a0b15b',
    'photo-1497436072909-60f360e1d4b1', 'photo-1472289065668-ce650ac443d2',
    'photo-1518531933037-91b2f5f229cc', 'photo-1466611653911-95081537e5b7',
    'photo-1473090826765-d54ac2fdc1eb', 'photo-1421789665209-c9b2a435e3dc',
    'photo-1545324418-cc1a3fa10c00', 'photo-1524758631624-e2822e304c36',
    'photo-1558618666-fcd25c85cd64', 'photo-1512917774080-9991f1c4c750',
    'photo-1502005229762-cf1b2da7c5d6', 'photo-1564013799919-ab600027ffc6',
    'photo-1600596542815-ffad4c1539a9', 'photo-1600585154340-be6161a56a0c',
    'photo-1508193638397-1c4234db14d8', 'photo-1440342359743-84fcb8c21f21',
  ],
  startup_business: [
    'photo-1553484771-371a605b060b', 'photo-1488190211105-8b0e65b80b4e',
    'photo-1559136555-9303baea8ebd', 'photo-1581094651181-35942459ef62',
    'photo-1522202176988-66273c2fd55f', 'photo-1497366858526-0766d8eaf7b8',
    'photo-1556761175-5973dc0f32e7', 'photo-1552664730-d307ca884978',
    'photo-1664575198308-3959904fa430', 'photo-1519389950473-47ba0277781c',
    'photo-1460925895917-afdab827c52f', 'photo-1559523182-a284c3fb7cff',
    'photo-1486406146926-c627a92ad1ab', 'photo-1507679799987-c73779587ccf',
    'photo-1519738471661-66f7a19d4163', 'photo-1507003211169-0a1dd7228f2d',
  ],
};

// ── 키워드 → 카테고리 매핑 ──────────────────────────────────────────────────
const KEYWORD_MAP = [
  { pool: 'ai',               keywords: ['ai', 'AI', '인공지능', '디지털', '빅데이터', '데이터', 'IT', '소프트웨어', '코딩', '프로그래밍', '로봇', '자동화', '클라우드', '메타버스', 'AI지원', '디지털전환'] },
  { pool: 'education',        keywords: ['장학금', '교육', '학교', '대학', '학생', '수업료', '등록금', '학습', '강의', '훈련', '직업훈련', '평생교육', '연수', '교원', '입학'] },
  { pool: 'youth_job',        keywords: ['청년', '취업', '일자리', '고용', '구직', '직업', '경력', '인턴', '채용', '구인', '직장', '근로', '알바', '아르바이트', '스펙'] },
  { pool: 'elderly',          keywords: ['어르신', '노인', '경로', '시니어', '고령', '장수', '요양', '노령', '조부모', '은퇴', '퇴직'] },
  { pool: 'children_family',  keywords: ['아동', '육아', '출산', '임신', '영아', '어린이', '자녀', '가족', '보육', '유아', '신생아', '돌봄', '맞벌이', '부모', '임산부', '태아'] },
  { pool: 'health',           keywords: ['건강', '의료', '병원', '치료', '검진', '간호', '약', '진료', '재활', '정신건강', '심리', '암', '백신', '예방', '의약'] },
  { pool: 'culture_event',    keywords: ['축제', '행사', '공연', '전시', '문화', '이벤트', '콘서트', '박람회', '체험', '놀이', '여가', '스포츠', '관광', '예술', '음악', '영화', '연극', '청소년'] },
  { pool: 'finance_welfare',  keywords: ['지원금', '보조금', '수당', '급여', '연금', '장려금', '혜택', '복지', '바우처', '쿠폰', '할인', '면제', '감면', '보험', '기금', '지급', '급부'] },
  { pool: 'housing_environment', keywords: ['주택', '주거', '임대', '아파트', '전세', '월세', '환경', '녹색', '친환경', '에너지', '태양광', '재활용', '청정'] },
  { pool: 'startup_business', keywords: ['창업', '사업', '기업', '스타트업', '창직', '벤처', '소상공인', '자영업', '투자', '펀드'] },
];

function detectPool(item) {
  const text = `${item.name} ${item.summary || ''} ${item.category || ''}`;
  const scores = {};

  for (const { pool, keywords } of KEYWORD_MAP) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > 0) scores[pool] = (scores[pool] || 0) + score;
  }

  // 카테고리 직접 매핑
  if (item.category === 'AI지원') scores.ai = (scores.ai || 0) + 5;
  if (item.category === '행사')   scores.culture_event = (scores.culture_event || 0) + 3;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : 'finance_welfare';
}

// 전체 풀을 섞어 최대 이미지 수 확보
function buildMasterPool() {
  const all = [];
  for (const ids of Object.values(POOLS)) {
    for (const id of ids) all.push(id);
  }
  return [...new Set(all)]; // 중복 제거
}

function main() {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const categories = ['events', 'benefits', 'aiSupport'];

  const used = new Set();
  // 카테고리별 사용 인덱스 트래킹
  const poolIndex = {};

  function pickImage(poolName) {
    const pool = POOLS[poolName] || POOLS.finance_welfare;
    if (!poolIndex[poolName]) poolIndex[poolName] = 0;

    // 이 풀에서 미사용 이미지 탐색
    for (let i = 0; i < pool.length; i++) {
      const idx = (poolIndex[poolName] + i) % pool.length;
      const id = pool[idx];
      if (!used.has(id)) {
        used.add(id);
        poolIndex[poolName] = (idx + 1) % pool.length;
        return `https://images.unsplash.com/${id}?w=800&q=80`;
      }
    }

    // 모든 풀에서 미사용 탐색 (마스터 풀 fallback)
    const master = buildMasterPool();
    for (const id of master) {
      if (!used.has(id)) {
        used.add(id);
        return `https://images.unsplash.com/${id}?w=800&q=80`;
      }
    }

    // 최후 fallback: 이미 쓴 것도 허용
    return `https://images.unsplash.com/${pool[0]}?w=800&q=80`;
  }

  let count = 0;
  for (const cat of categories) {
    if (!data[cat]) continue;
    for (const item of data[cat]) {
      const poolName = detectPool(item);
      item.image = pickImage(poolName);
      count++;
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

  // 결과 통계
  const all = [...(data.events||[]), ...(data.benefits||[]), ...(data.aiSupport||[])];
  const imgs = all.map(i => i.image);
  const uniqueCount = new Set(imgs).size;
  console.log(`완료: ${count}개 항목에 관련 이미지 배정`);
  console.log(`고유 이미지: ${uniqueCount}개 / 중복: ${count - uniqueCount}개`);
}

main();
