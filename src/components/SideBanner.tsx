'use client';

import { useEffect, useRef } from 'react';

export default function SideBanner() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 컨테이너 높이가 보이지 않을 경우 fallback으로 배너 표시 보장
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.display = 'block';
    }
  }, []);

  return (
    // 고정 컨테이너: 90px 너비 × 728px 높이, 화면 우측 중앙 고정
    // lg(1024px) 이상에서만 표시
    <div
      ref={wrapperRef}
      className="hidden lg:block"
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%) scale(0.6)',
        width: '90px',
        height: '728px',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {/* 728×90 배너를 컨테이너 중앙에 배치 후 90° 회전 */}
      <a
        href="https://link.coupang.com/a/eG5z73"
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="unsafe-url"
        style={{
          display: 'block',
          position: 'absolute',
          /* 이미지 중심을 컨테이너 중심(45, 364)에 맞춤: top = 364-45 = 319, left = 45-364 = -319 */
          top: '319px',
          left: '-319px',
          width: '728px',
          height: '90px',
          transform: 'rotate(90deg)',
          transformOrigin: 'center center',
        }}
      >
        <img
          src="https://ads-partners.coupang.com/banners/987905?subId=&traceId=V0-301-371ae01f4226dec2-I987905&w=728&h=90"
          alt="쿠팡 파트너스"
          width={728}
          height={90}
          style={{ display: 'block', width: '728px', height: '90px' }}
        />
      </a>
    </div>
  );
}
