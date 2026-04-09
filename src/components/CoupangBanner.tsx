'use client';

import { useEffect } from 'react';

export default function CoupangBanner() {
  useEffect(() => {
    // 이미 스크립트가 있다면 제거 후 새로 생성 (페이지 이동 시 중복 방지)
    const existingScript = document.getElementById('coupang-js');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'coupang-js';
    script.src = 'https://ads-partners.coupang.com/g.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.PartnersCoupang) {
        // 기존에 생성된 배너가 있다면 컨테이너를 비웁니다.
        const container = document.getElementById('coupang-banner-container');
        if (container) {
          container.innerHTML = '';
        }
        
        // @ts-ignore
        new window.PartnersCoupang.G({
          id: 1, 
          containerId: 'coupang-banner-container'
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-12">
      <div className="w-full max-w-4xl px-4 flex justify-center">
        <div className="w-full overflow-hidden flex justify-center items-center min-h-[140px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div 
            id="coupang-banner-container" 
            className="w-full flex justify-center items-center scale-95 md:scale-100"
          >
            {/* 배너가 여기에 하나만 렌더링됩니다. */}
            <div className="text-gray-300 text-xs animate-pulse font-medium">배너 로드 중...</div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center opacity-80">
        "이 사이트에는 쿠팡 광고 배너가 포함되어 있습니다"
      </p>
    </div>
  );
}
