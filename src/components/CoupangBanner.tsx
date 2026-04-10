'use client';

import { useEffect } from 'react';

interface CoupangBannerProps {
  bannerId?: string;
  tags?: string[];
}

export default function CoupangBanner({ bannerId = 'default', tags = [] }: CoupangBannerProps) {
  const containerId = `coupang-container-${bannerId}`;
  const COUPANG_ID = 'AF3039195';

  useEffect(() => {
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      const el = document.getElementById(containerId);
      if (!el) return;
      if (el.getAttribute('data-cp-done') === '1') return;
      el.setAttribute('data-cp-done', '1');
      el.innerHTML = '';

      // @ts-ignore
      new window.PartnersCoupang.G({
        id: 856456,
        containerId: containerId,
      });
    };

    const SCRIPT_ID = 'coupang-g-script-v1';

    // @ts-ignore
    if (window.PartnersCoupang) {
      tryInit();
      return;
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://ads-partners.coupang.com/g.js';
      script.async = true;
      script.onload = tryInit;
      document.body.appendChild(script);
    } else {
      const timer = setInterval(() => {
        // @ts-ignore
        if (window.PartnersCoupang || cancelled) {
          clearInterval(timer);
          if (!cancelled) tryInit();
        }
      }, 50);
      return () => clearInterval(timer);
    }

    return () => {
      cancelled = true;
      const el = document.getElementById(containerId);
      if (el) {
        el.removeAttribute('data-cp-done');
        el.innerHTML = '<div class="text-gray-300 text-xs text-center py-4 animate-pulse">배너 로드 중...</div>';
      }
    };
  }, [containerId]);

  // 테마별 이미지 매칭 (Unsplash)
  const getProductImage = (tag: string) => {
    if (tag.includes('AI') || tag.includes('인공지능') || tag.includes('코딩')) 
      return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80";
    if (tag.includes('교육') || tag.includes('도서'))
      return "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80";
    if (tag.includes('봄') || tag.includes('나들이') || tag.includes('벚꽃') || tag.includes('축제'))
      return "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80";
    if (tag.includes('지원') || tag.includes('혜택') || tag.includes('자산'))
      return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80";
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80";
  };

  // 1. 쇼핑 검색에 적합하지 않은 추상적 키워드 필터링
  const nonShoppableWords = ['행사', '지원', '추천', '소식', '정보', '송파구', '오늘의추천', '안내', '혜택', '모집'];
  const shoppableTags = tags ? tags.filter(tag => !nonShoppableWords.some(word => tag.includes(word))) : [];

  // 2. 검색하기 좋은 쿠팡 인기 베스트 키워드 모음 (태그가 없을 경우 대체용)
  const defaultPopularTags = ['베스트셀러', '로켓프레시', '생필품특가', '가전디지털', '홈인테리어', '주방용품'];

  // 3. 만약 남은 쇼핑 태그가 없다면 쿠팡 베스트 키워드 사용
  const displayTags = shoppableTags.length > 0 ? shoppableTags : defaultPopularTags;

  return (
    <div className="w-full flex flex-col items-center justify-center my-12">
      <div className="w-full max-w-4xl px-4">
        <div className="w-full bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* 상단: 다이나믹 배너 영역 */}
          <div className="p-6 pb-0">
            <div className="bg-gray-50 rounded-2xl flex justify-center items-center min-h-[140px] overflow-hidden">
              <div id={containerId} className="w-full flex justify-center items-center">
                <div className="text-gray-300 text-xs animate-pulse font-medium">광고 불러오는 중...</div>
              </div>
            </div>
          </div>

          {/* 하단: 맞춤형 상품 쇼케이스 (진짜 상점 느낌) */}
          <div className="p-8 pb-6 bg-[#FCF8F3]/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
              <h3 className="text-[17px] font-black text-[#111827] flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#F25C05] text-white rounded-full text-[10px] animate-bounce shadow-sm">PICK</span>
                {tags && tags.length > 0 ? '이 글과 관련된 추천 상품' : '오늘의 핫딜 추천 상품'}
              </h3>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest px-2 py-1 bg-white rounded-md border border-gray-100">Sponsored by Coupang</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayTags.slice(0, 4).map((tag, idx) => (
                <a
                  key={idx}
                  href={`https://www.coupang.com/np/search?q=${encodeURIComponent(tag)}&channel=partner&lptag=${COUPANG_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(242,92,5,0.12)] hover:-translate-y-1 hover:border-[#F25C05]/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                    <img 
                      src={getProductImage(tag)} 
                      alt={tag} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="text-[10px] text-[#F25C05] font-black mb-1.5 uppercase tracking-wide">Coupang Pick</div>
                    <h4 className="text-[13px] font-bold text-gray-800 mb-3 truncate leading-tight group-hover:text-[#F25C05] transition-colors">
                      {tag} 최저가 확인
                    </h4>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                      <span className="text-[11px] text-gray-400 font-medium group-hover:text-gray-600 transition-colors">쿠팡에서 검색</span>
                      <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#F25C05] transition-colors shadow-sm">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors block translate-x-[1px]">➔</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* 하단 태그 클라우드 */}
            <div className="mt-6 flex flex-wrap gap-2 pt-5 border-t border-gray-100/60">
              {displayTags.map((tag, idx) => (
                <a
                  key={idx}
                  href={`https://www.coupang.com/np/search?q=${encodeURIComponent(tag)}&channel=partner&lptag=${COUPANG_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-gray-500 hover:text-white hover:bg-[#F25C05] bg-white border border-gray-100 px-3 py-1.5 rounded-full transition-all shadow-sm"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center opacity-60 font-medium italic">
        * 이 사이트에는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받을 수 있는 배너가 포함되어 있습니다.
      </p>
    </div>
  );
}
