import Image from "next/image";
import Link from "next/link";
import data from "../../public/data/local-info.json";

interface InfoItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

export default function Home() {
  const { events, benefits, lastUpdated } = data;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {/* 1. 최상단 오렌지색 검색/메뉴 바 */}
      <div className="bg-[#F25C05] text-white py-2 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm font-bold">
          <div className="flex gap-6">
            <span className="cursor-pointer hover:underline">홈</span>
            <span className="cursor-pointer hover:underline">송파소식지</span>
            <span className="cursor-pointer hover:underline">구정안내</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-3 py-1 rounded flex items-center gap-2">
              <span className="text-xs">전체 검색</span>
              <span className="text-lg leading-none">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 로고 및 메인 헤더 영역 (세련된 큰 배너 스타일) */}
      <header className="relative bg-gradient-to-r from-[#1D428A] via-[#1a3668] to-[#F25C05] py-20 px-6 overflow-hidden shadow-inner mb-6">
        {/* 장식용 배경 패턴 */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F25C05] opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
          <div className="flex flex-col items-center md:items-start text-white">
            <p className="text-white/90 font-bold tracking-widest text-xs uppercase mb-4 bg-white/10 inline-block px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
              Songpa News & Life Information
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-3 drop-shadow-md">
              송파<span className="text-[#F25C05] drop-shadow-lg">소식</span>
            </h1>
            <p className="text-white/95 text-lg md:text-xl mt-2 font-medium drop-shadow break-keep text-center md:text-left">
              우리 동네의 오늘을 전합니다, 2026년 4월 특별호
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end border-l-4 border-[#F25C05] pl-8 space-y-3">
            <p className="text-white font-black text-5xl drop-shadow-sm tracking-tighter">2026. 04</p>
            <p className="text-[#F25C05] font-black bg-white px-4 py-1.5 rounded-md text-sm shadow-lg tracking-wider">VOL. 42</p>
          </div>
        </div>
      </header>

      {/* 3. 메인 콘텐츠: 2단 레이아웃 (사이드바 / 본문) */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 좌측 사이드바: 1/4 영역 */}
          <aside className="lg:w-1/4 space-y-10">
            <div className="sidebar-sticky">
              {/* 이번 달 소식지 표지 스타일 박스 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[3/4] flex flex-col justify-between group cursor-pointer">
                {/* 배경 이미지 */}
                <Image 
                  src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop"
                  alt="Current Issue Cover"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D428A]/90 via-[#1D428A]/40 to-black/30"></div>
                
                {/* 콘텐츠 영역 */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
                  <div>
                    <span className="bg-[#F25C05] text-white text-[10px] font-black px-2 py-1 rounded inline-block mb-3">
                      특집
                    </span>
                    <p className="text-white/80 font-bold text-xs tracking-wider mb-2">VOL. 2026.04</p>
                    <h3 className="text-3xl font-black leading-tight break-keep drop-shadow-md">
                      아름다운 봄,<br/>벚꽃이야기<br/>호수벚꽃축제
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-white/90 line-clamp-2 drop-shadow">
                      송파, 축제의 현장으로 여러분을 초대합니다. 석촌호수에서 펼쳐지는 봄의 향연을 만나보세요.
                    </div>
                    <button className="w-full relative overflow-hidden py-3 bg-white/20 hover:bg-[#F25C05] backdrop-blur-sm border border-white/30 transition-all rounded-lg font-black text-sm uppercase group-hover:border-[#F25C05] group-hover:shadow-[0_0_15px_rgba(242,92,5,0.5)]">
                      E-BOOK 보기 ➔
                    </button>
                  </div>
                </div>
              </div>

              {/* 카테고리 퀵 서비스 */}
              <div className="mt-10 space-y-4">
                <h4 className="text-[#1D428A] font-black text-sm border-b-2 border-[#1D428A] pb-2">QUICK CATEGORY</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['전체', '행사/축제', '지원금', '교육/강좌', '알림사항'].map((cat) => (
                    <button key={cat} className="px-3 py-2 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 hover:border-[#1D428A] hover:text-[#1D428A] transition-all">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 우측 본문 리스트 영역: 3/4 영역 */}
          <div className="lg:w-3/4 space-y-12">
            
            {/* 섹션 1: 이번 달 주요 행사 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b-4 border-[#1D428A] pb-3">
                <span className="bg-[#1D428A] text-white text-xs font-black px-3 py-1 rounded">HOT</span>
                <h2 className="text-2xl font-black text-[#1D428A]">이번 달 주요 행사</h2>
              </div>
              <div className="grid gap-4">
                {events.map((event: InfoItem) => (
                  <NewsCard key={event.id} item={event} color="indigo" />
                ))}
              </div>
            </section>

            {/* 섹션 2: 나를 위한 지원금/혜택 */}
            <section className="space-y-6 pt-6">
              <div className="flex items-center gap-3 border-b-4 border-[#F25C05] pb-3">
                <span className="bg-[#F25C05] text-white text-xs font-black px-3 py-1 rounded">NEWS</span>
                <h2 className="text-2xl font-black text-[#F25C05]">지원금 및 생활 혜택</h2>
              </div>
              <div className="grid gap-4">
                {benefits.map((benefit: InfoItem) => (
                  <NewsCard key={benefit.id} item={benefit} color="orange" />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-[#1D428A]">송파<span className="text-[#F25C05]">소식</span></h2>
            <p className="text-gray-400 text-sm">서울특별시 송파구 올림픽로 326 (신천동) 송파구청 홍보담당관</p>
            <p className="text-gray-400 text-xs">데이터 출처: 공공데이터포털 | 시스템 업데이트: {lastUpdated}</p>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#f5f6f8] rounded-full flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">📱</div>
            <div className="w-10 h-10 bg-[#f5f6f8] rounded-full flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">💻</div>
            <div className="w-10 h-10 bg-[#f5f6f8] rounded-full flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">📧</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NewsCard({ item, color }: { item: InfoItem & { image?: string }; color: 'indigo' | 'orange' }) {
  const isPeriod = item.startDate !== item.endDate;
  const brandColor = color === 'indigo' ? '#1D428A' : '#F25C05';
  
  return (
    <Link 
      href={`/info/${item.id}`}
      className={`news-card block overflow-hidden group transition-all duration-300 ${color === 'orange' ? 'border-2 border-[#F25C05] shadow-[0_5px_15px_rgba(242,92,5,0.15)] rounded-2xl cursor-pointer hover:shadow-xl' : 'border border-gray-100 rounded-xl cursor-pointer hover:border-[#1D428A] hover:shadow-lg'}`}
    >
      <div className="flex flex-col sm:flex-row items-stretch min-h-[240px]">
        {/* 이미지 영역: 실제 이미지 또는 플레이스홀더 */}
        <div className="sm:w-1/3 bg-gray-100 relative aspect-video sm:aspect-auto shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-100">
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.name} 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
               <span className="text-5xl opacity-40 group-hover:scale-125 transition-transform duration-500">
                {color === 'indigo' ? '🎫' : '💡'}
              </span>
            </div>
          )}
          {/* 카테고리 뱃지 (이미지 위에 오버레이) */}
          <div 
            className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded text-white shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            {item.category}
          </div>
        </div>

        {/* 텍스트 정보 영역 */}
        <div className="sm:w-2/3 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Release Date: {item.startDate}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#F25C05] transition-colors leading-tight break-keep">
              {item.name}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 break-keep font-medium">
              {item.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex flex-col text-[10px] font-bold text-gray-400">
               <span className="flex items-center gap-1 mb-1">📍 {item.location}</span>
               {item.target && (
                 <span className={`${color === 'orange' ? 'bg-[#F25C05] text-white px-3 py-1.5 rounded-lg text-[11px] mt-1 inline-block font-black shadow-sm' : 'text-[#1D428A]/60 mt-0.5'}`}>
                   {color === 'orange' ? `🎯 지원 대상: ${item.target}` : `TARGET: ${item.target}`}
                 </span>
               )}
            </div>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-400 group-hover:border-[#F25C05] group-hover:text-[#F25C05] group-hover:bg-[#F25C05]/5 transition-all">
              <span className="text-lg">➔</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
