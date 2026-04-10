'use client';

import { useEffect } from 'react';

interface CoupangBannerProps {
  // 페이지에서 여러 개 배너를 쓸 때 충돌 방지를 위한 고유 ID
  bannerId?: string;
}

export default function CoupangBanner({ bannerId = 'default' }: CoupangBannerProps) {
  const containerId = `coupang-banner-container-${bannerId}`;
  const scriptId = `coupang-js-${bannerId}`;

  useEffect(() => {
    // 기존 스크립트가 있다면 제거 후 새로 생성 (페이지 이동 시 중복 방지)
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://ads-partners.coupang.com/g.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.PartnersCoupang) {
        // 기존에 생성된 배너가 있다면 컨테이너를 비웁니다.
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
        }

        // @ts-ignore
        new window.PartnersCoupang.G({
          id: 856456,
          containerId: containerId
        });
      }
    };
    document.body.appendChild(script);

    // 컴포넌트가 사라질 때 스크립트를 정리합니다.
    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [containerId, scriptId]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-8">
      <div className="w-full max-w-4xl px-4">
        <div className="w-full overflow-hidden flex justify-center items-center min-h-[140px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative">
          <div
            id={containerId}
            className="w-full flex justify-center items-center scale-90 md:scale-100 min-h-[120px]"
          >
            {/* 배너가 여기에 렌더링됩니다. */}
            <div className="text-gray-300 text-xs animate-pulse font-medium">배너 로드 중...</div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center opacity-80">
        이 사이트에는 쿠팡 파트너스 광고가 포함되어 있습니다
      </p>
    </div>
  );
}
