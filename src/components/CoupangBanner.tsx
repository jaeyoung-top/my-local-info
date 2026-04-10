'use client';

import { useEffect } from 'react';

interface CoupangBannerProps {
  bannerId?: string;
}

export default function CoupangBanner({ bannerId = 'default' }: CoupangBannerProps) {
  const containerId = `coupang-container-${bannerId}`;

  useEffect(() => {
    // 이 변수는 컴포넌트가 사라질 때 실행을 중단하기 위한 취소 신호
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;

      const el = document.getElementById(containerId);
      if (!el) return;

      // 이미 이 배너 칸에 광고가 그려졌으면 다시 그리지 않음 (중복 방지)
      if (el.getAttribute('data-cp-done') === '1') return;
      el.setAttribute('data-cp-done', '1');
      el.innerHTML = ''; // 기존 내용을 깨끗이 비움

      // @ts-ignore
      new window.PartnersCoupang.G({
        id: 856456,
        containerId: containerId,
      });
    };

    const SCRIPT_ID = 'coupang-g-script-v1';

    // @ts-ignore
    if (window.PartnersCoupang) {
      // 스크립트가 이미 로드됐으면 바로 실행
      tryInit();
      return;
    }

    if (!document.getElementById(SCRIPT_ID)) {
      // 최초 1회만 스크립트 태그를 생성
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://ads-partners.coupang.com/g.js';
      script.async = true;
      script.onload = tryInit;
      document.body.appendChild(script);
    } else {
      // 스크립트 태그는 있지만 아직 로딩 중 → 주기적으로 확인
      const timer = setInterval(() => {
        // @ts-ignore
        if (window.PartnersCoupang || cancelled) {
          clearInterval(timer);
          if (!cancelled) tryInit();
        }
      }, 50);
      return () => clearInterval(timer);
    }

    // 컴포넌트가 사라질 때: 취소 신호를 켜고 배너 칸을 초기화
    return () => {
      cancelled = true;
      const el = document.getElementById(containerId);
      if (el) {
        el.removeAttribute('data-cp-done');
        el.innerHTML = '<div class="text-gray-300 text-xs text-center py-4 animate-pulse">배너 로드 중...</div>';
      }
    };
  }, [containerId]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-8">
      <div className="w-full max-w-4xl px-4">
        <div className="w-full overflow-hidden flex justify-center items-center min-h-[140px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div
            id={containerId}
            className="w-full flex justify-center items-center min-h-[120px]"
          >
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
