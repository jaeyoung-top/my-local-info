'use client';

import { useEffect, useRef } from 'react';

export default function CoupangBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    const container = containerRef.current;

    const loadScript = document.createElement('script');
    loadScript.src = 'https://ads-partners.coupang.com/g.js';
    loadScript.async = true;
    loadScript.onload = () => {
      const initScript = document.createElement('script');
      initScript.text = `new PartnersCoupang.G({"id":987900,"template":"carousel","trackingCode":"AF3039195","width":"680","height":"140","tsource":""});`;
      container.appendChild(initScript);
    };
    container.appendChild(loadScript);
  }, []);

  return (
    <div className="w-full my-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-[15px] font-black text-gray-800 flex items-center gap-2">
          <span className="bg-[#F25C05] text-white text-[10px] font-black px-2 py-0.5 rounded-md">BEST</span>
          쿠팡 인기 상품
        </h3>
        <span className="text-[10px] text-gray-400 font-bold">Sponsored by Coupang</span>
      </div>
      <div
        ref={containerRef}
        className="flex justify-center py-3 px-4 overflow-x-auto"
      />
      <p className="text-[10px] text-gray-400 text-center py-3 border-t border-gray-100">
        * 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
