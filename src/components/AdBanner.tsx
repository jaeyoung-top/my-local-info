'use client';

import { useEffect } from 'react';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-4233694153840183";

export default function AdBanner() {
  useEffect(() => {
    // 구글 애드센스 초기화
    const timer = setTimeout(() => {
      try {
        // @ts-ignore
        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
          // @ts-ignore
          window.adsbygoogle.push({});
        }
      } catch (err) {
        console.warn('AdSense notice:', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!ADSENSE_ID || ADSENSE_ID === "나중에_입력") {
    return null;
  }

  return (
    <div className="w-full overflow-hidden flex justify-center min-h-[100px] my-8 bg-gray-50 rounded-xl p-2 border border-dashed border-gray-200">
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
