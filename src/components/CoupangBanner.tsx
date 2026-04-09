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
        // @ts-ignore
        new window.PartnersCoupang.G({
          id: 1 // 사용자 요청에 따라 1로 설정
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex flex-col items-center my-8">
      <div className="w-full overflow-hidden flex justify-center min-h-[140px] bg-white rounded-xl border border-gray-100 shadow-sm p-2">
        <div id="coupang-banner-container" className="w-full flex justify-center">
          {/* 배너가 여기에 렌더링됩니다. */}
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2">
        "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
      </p>
    </div>
  );
}
