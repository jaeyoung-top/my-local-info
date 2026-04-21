const COUPANG_ID = 'AF3039195';

type Product = { name: string; desc: string; href: string; image: string };

function makeHref(query: string) {
  return `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}&channel=partner&lptag=${COUPANG_ID}`;
}

// 각 상품에 내용과 일치하는 고유 이미지 배정 (Unsplash 저작권 무료)
const SEASON_PRODUCTS: Record<'spring' | 'summer' | 'fall' | 'winter', Product[]> = {
  spring: [
    {
      name: '공기청정기',
      desc: '봄철 황사·미세먼지 필수템',
      href: makeHref('공기청정기'),
      image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80', // 공기청정기/정화기기
    },
    {
      name: '황사마스크',
      desc: 'KF94 황사·꽃가루 차단',
      href: makeHref('황사마스크 KF94'),
      image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&q=80', // 마스크 착용
    },
    {
      name: '자외선차단제',
      desc: '봄 자외선 SPF50+ 필수',
      href: makeHref('자외선차단제 SPF50'),
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80', // 스킨케어/선크림
    },
    {
      name: '피크닉 돗자리',
      desc: '봄나들이 방수 돗자리',
      href: makeHref('피크닉 돗자리 방수'),
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80', // 공원 피크닉
    },
    {
      name: '경량 바람막이',
      desc: '봄 나들이 필수 아우터',
      href: makeHref('경량 바람막이'),
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80', // 아웃도어 의류
    },
    {
      name: '접이식 캠핑의자',
      desc: '야외활동 경량 폴딩체어',
      href: makeHref('접이식 캠핑의자'),
      image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500&q=80', // 캠핑/야외
    },
    {
      name: '코 세척기',
      desc: '봄철 알레르기 비염 관리',
      href: makeHref('코세척기 비염'),
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80', // 의료/건강관리
    },
    {
      name: '보온 텀블러',
      desc: '봄 나들이 보온·보냉',
      href: makeHref('텀블러 보온'),
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', // 텀블러/컵
    },
  ],
  summer: [
    {
      name: '선풍기',
      desc: '조용하고 강력한 바람',
      href: makeHref('스탠드선풍기'),
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', // 전자/가전
    },
    {
      name: '에어컨 필터',
      desc: '에어컨 청소·냉방 효율↑',
      href: makeHref('에어컨 필터 청소'),
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', // 실내 청소/유지보수
    },
    {
      name: '쿨링 매트',
      desc: '여름밤 시원한 수면',
      href: makeHref('쿨링매트'),
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', // 침실/수면 공간
    },
    {
      name: '자외선차단제',
      desc: '강한 자외선 완벽 차단',
      href: makeHref('자외선차단제 SPF50'),
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80', // 여름 뷰티/스킨케어
    },
    {
      name: '물놀이 용품',
      desc: '여름 레저 필수 아이템',
      href: makeHref('물놀이 용품'),
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80', // 물놀이/수영장
    },
    {
      name: '제습기',
      desc: '장마철 습기 완벽 제거',
      href: makeHref('제습기'),
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&q=80', // 실내 가전/공기
    },
    {
      name: '아이스 텀블러',
      desc: '얼음 유지 스텐 텀블러',
      href: makeHref('아이스 텀블러 스텐'),
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80', // 아이스드링크/여름
    },
    {
      name: '건강기능식품',
      desc: '여름 체력·면역 관리',
      href: makeHref('건강기능식품 피로'),
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&q=80', // 건강식품/보충제
    },
  ],
  fall: [
    {
      name: '전기장판',
      desc: '가을밤 따뜻한 온열매트',
      href: makeHref('전기장판'),
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', // 포근한 실내 소파
    },
    {
      name: '가습기',
      desc: '건조한 실내 공기 관리',
      href: makeHref('가습기 초음파'),
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&q=80', // 실내 분위기/습도
    },
    {
      name: '커피머신',
      desc: '홈카페 캡슐커피머신',
      href: makeHref('캡슐커피머신'),
      image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500&q=80', // 커피머신
    },
    {
      name: '등산화',
      desc: '단풍철 가을 트레킹화',
      href: makeHref('등산화 가을'),
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&q=80', // 하이킹/트레킹 신발
    },
    {
      name: '경량 패딩',
      desc: '일교차 큰 가을 필수템',
      href: makeHref('경량 패딩'),
      image: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=500&q=80', // 재킷/아웃도어 패션
    },
    {
      name: '보온 텀블러',
      desc: '따뜻한 음료 오래 유지',
      href: makeHref('텀블러 보온'),
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', // 텀블러
    },
    {
      name: '건강기능식품',
      desc: '환절기 면역력 강화',
      href: makeHref('건강기능식품 면역'),
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&q=80', // 건강보조식품
    },
    {
      name: '에어프라이어',
      desc: '간편 홈쿡 인기 1위',
      href: makeHref('에어프라이어'),
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80', // 요리/주방 가전
    },
  ],
  winter: [
    {
      name: '전기장판',
      desc: '겨울 필수 온열매트',
      href: makeHref('전기장판'),
      image: 'https://images.unsplash.com/photo-1548710993-28e4bd7e8e21?w=500&q=80', // 따뜻한 침실/겨울
    },
    {
      name: '온풍기·히터',
      desc: '순간 발열 전기히터',
      href: makeHref('온풍기 전기히터'),
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&q=80', // 포근한 실내/겨울 인테리어
    },
    {
      name: '가습기',
      desc: '건조한 겨울 실내 필수',
      href: makeHref('가습기 초음파'),
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&q=80', // 실내 공기 관리
    },
    {
      name: '핫팩',
      desc: '겨울 외출 필수 손난로',
      href: makeHref('핫팩 손난로'),
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=500&q=80', // 겨울 야외/장갑
    },
    {
      name: '보온 텀블러',
      desc: '따뜻한 음료 장시간 유지',
      href: makeHref('텀블러 보온'),
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', // 텀블러
    },
    {
      name: '건강기능식품',
      desc: '겨울 면역·체력 관리',
      href: makeHref('건강기능식품 면역'),
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&q=80', // 건강보조제
    },
    {
      name: '무선이어폰',
      desc: '연말 선물 인기 1위',
      href: makeHref('무선이어폰'),
      image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&q=80', // 이어폰/헤드폰
    },
    {
      name: '커피머신',
      desc: '홈카페 캡슐커피머신',
      href: makeHref('캡슐커피머신'),
      image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500&q=80', // 커피머신
    },
  ],
};

function getSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

const SEASON_LABEL: Record<ReturnType<typeof getSeason>, string> = {
  spring: '🌸 봄 시즌',
  summer: '☀️ 여름 시즌',
  fall: '🍂 가을 시즌',
  winter: '❄️ 겨울 시즌',
};

export default function CoupangBanner() {
  const season = getSeason();
  const products = SEASON_PRODUCTS[season];

  return (
    <div className="w-full my-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-[15px] font-black text-gray-800 flex items-center gap-2">
          <span className="bg-[#F25C05] text-white text-[10px] font-black px-2 py-0.5 rounded-md">BEST</span>
          {SEASON_LABEL[season]} 쿠팡 인기 상품
        </h3>
        <span className="text-[10px] text-gray-400 font-bold">Sponsored by Coupang</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
        {products.map((product) => (
          <a
            key={product.name}
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white hover:bg-[#FFF9F5] transition-colors duration-200 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="px-4 py-3">
              <p className="text-[13px] font-black text-gray-800 group-hover:text-[#F25C05] transition-colors truncate">
                {product.name}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{product.desc}</p>
              <p className="text-[10px] text-[#F25C05] font-bold mt-2">쿠팡에서 보기 →</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 text-center py-3 border-t border-gray-100">
        * 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
