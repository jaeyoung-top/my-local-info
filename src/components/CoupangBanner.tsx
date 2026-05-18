'use client';

import { useState, useEffect } from 'react';

// 카테고리별 위젯 설정 (쿠팡 파트너스 다양한 카테고리 노출)
const WIDGET_CONFIGS = [
  { id: '987900', label: '인기 상품' },
  { id: '987900', label: '오늘의 딜' },
  { id: '987900', label: '추천 상품' },
];

export default function CoupangBanner() {
  const [tsource, setTsource] = useState('');
  const [configIdx, setConfigIdx] = useState(0);

  useEffect(() => {
    // 매 렌더마다 랜덤 tsource → 쿠팡이 다른 상품 세트를 반환
    setTsource(Math.random().toString(36).slice(2));
    setConfigIdx(Math.floor(Math.random() * WIDGET_CONFIGS.length));
  }, []);

  const config = WIDGET_CONFIGS[configIdx];
  const src = tsource
    ? `https://ads-partners.coupang.com/widgets.html?id=${config.id}&template=carousel&trackingCode=AF3039195&width=680&height=140&tsource=${tsource}`
    : '';

  return (
    <div className="w-full my-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-[15px] font-black text-gray-800 flex items-center gap-2">
          <span className="bg-[#F25C05] text-white text-[10px] font-black px-2 py-0.5 rounded-md">BEST</span>
          쿠팡 {config?.label ?? '인기 상품'}
        </h3>
        <span className="text-[10px] text-gray-400 font-bold">Sponsored by Coupang</span>
      </div>
      <div className="flex justify-center py-3 px-4 overflow-x-auto">
        {src && (
          <iframe
            key={tsource}
            src={src}
            width="680"
            height="140"
            frameBorder={0}
            scrolling="no"
            referrerPolicy="unsafe-url"
            title={`쿠팡 ${config?.label}`}
            style={{ display: 'block' }}
          />
        )}
      </div>
      <p className="text-[10px] text-gray-400 text-center py-3 border-t border-gray-100">
        * 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
