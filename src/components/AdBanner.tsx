'use client';

import { useEffect } from 'react';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdBanner() {
  // 환경변수가 없거나 초기값인 경우 렌더링하지 않음
  if (!ADSENSE_ID || ADSENSE_ID === "나중에_입력") {
    return null;
  }

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden my-8 flex justify-center">
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
