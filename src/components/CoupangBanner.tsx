'use client';

const COUPANG_ID = 'AF3039195';

// 쿠팡 현재 인기 상품 카테고리 (고정 목록)
const POPULAR_PRODUCTS = [
  {
    name: '에어프라이어',
    desc: '기름 없이 바삭하게',
    query: '에어프라이어',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
  },
  {
    name: '로봇청소기',
    desc: '자동으로 청소하는 스마트홈',
    query: '로봇청소기',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  },
  {
    name: '공기청정기',
    desc: '실내 공기질 관리 필수',
    query: '공기청정기',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80',
  },
  {
    name: '무선이어폰',
    desc: '완전 무선 고음질 사운드',
    query: '무선이어폰',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&q=80',
  },
  {
    name: '건강기능식품',
    desc: '면역력·영양 관리 베스트',
    query: '건강기능식품 베스트',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&q=80',
  },
  {
    name: '커피머신',
    desc: '홈카페 인기 1위',
    query: '캡슐커피머신',
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500&q=80',
  },
  {
    name: '스탠드선풍기',
    desc: '조용하고 강력한 바람',
    query: '스탠드선풍기',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  },
  {
    name: '텀블러·보온병',
    desc: '보온·보냉 장시간 유지',
    query: '텀블러 보온병',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
  },
];

export default function CoupangBanner(_props: { bannerId?: string; tags?: string[] }) {
  return (
    <div className="w-full my-10">
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[15px] font-black text-gray-800 flex items-center gap-2">
            <span className="bg-[#F25C05] text-white text-[10px] font-black px-2 py-0.5 rounded-md">BEST</span>
            지금 쿠팡에서 많이 사는 상품
          </h3>
          <span className="text-[10px] text-gray-400 font-bold">Sponsored by Coupang</span>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
          {POPULAR_PRODUCTS.map((product, idx) => (
            <a
              key={idx}
              href={`https://www.coupang.com/np/search?q=${encodeURIComponent(product.query)}&channel=partner&lptag=${COUPANG_ID}`}
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

        {/* 하단 안내 */}
        <p className="text-[10px] text-gray-400 text-center py-3 border-t border-gray-100">
          * 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </div>
  );
}
