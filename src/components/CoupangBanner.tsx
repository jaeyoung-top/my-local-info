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
          {tags && tags.length > 0 && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[17px] font-black text-gray-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#F25C05] text-white rounded-full text-[10px] animate-bounce">PICK</span>
                  이 글과 관련된 추천 상품
                </h3>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Sponsored by Coupang</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.slice(0, 3).map((tag, idx) => (
                  <a
                    key={idx}
                    href={`https://www.coupang.com/np/search?q=${encodeURIComponent(tag)}&channel=partner&lptag=${COUPANG_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                      <img 
                        src={getProductImage(tag)} 
                        alt={tag} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] text-[#F25C05] font-black mb-1 uppercase tracking-tight">Coupang Selection</div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3 truncate leading-tight">
                        {tag} 관련 최저가 보러가기
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400 font-medium">쿠팡에서 검색</span>
                        <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#F25C05] transition-colors">
                          <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">→</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* 하단 태그 클라우드 */}
              <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                {tags.map((tag, idx) => (
                  <a
                    key={idx}
                    href={`https://www.coupang.com/np/search?q=${encodeURIComponent(tag)}&channel=partner&lptag=${COUPANG_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-gray-400 hover:text-[#F25C05] bg-gray-50/50 px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 text-center opacity-60 font-medium italic">
        * 이 사이트에는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받을 수 있는 배너가 포함되어 있습니다.
      </p>
    </div>
  );
}
