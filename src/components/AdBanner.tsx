'use client';

import { useEffect } from 'react';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdBanner() {
  // 환경변수가 없거나 초기값인 경우 렌더링하지 않음
  if (!ADSENSE_ID || ADSENSE_ID === "나중에_입력") {
    return null;
  }

  useEffect(() => {
    // 광고 요소가 실제로 화면에 보이고 너비가 생길 때까지 조금 기다렸다가 호출합니다.
    const timer = setTimeout(() => {
      try {
        // @ts-ignore
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          // @ts-ignore
          window.adsbygoogle.push({});
        }
      } catch (err) {
        // 이 에러는 주로 광고가 아직 화면에 그려지지 않았을 때 발생하므로, 콘솔에 출력만 하고 운영에는 영향을 주지 않습니다.
        console.warn('AdSense notice (expected in some cases):', err);
      }
    }, 500); // 0.5초 정도 여유를 줍니다.

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full overflow-hidden my-8 flex justify-center min-h-[100px]">
      {/* 구글 애드센스 광고 단위 코드 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
