'use client';

import { useEffect, useRef } from 'react';

interface CoupangBannerProps {
  // 페이지에서 여러 배너가 겹치지 않게 구별하는 고유 이름
  bannerId?: string;
}

// 쿠팡 스크립트는 페이지 전체에서 딱 1개만 불러옵니다.
const SCRIPT_ID = 'coupang-partner-script-global';

// 스크립트 로드 완료를 기다리는 콜백 목록 (여러 배너가 한꺼번에 등록)
let pendingCallbacks: (() => void)[] = [];
let isScriptLoaded = false;

function loadCoupangScript(onReady: () => void) {
  // 이미 스크립트가 다 로드된 상태라면 바로 실행
  if (isScriptLoaded) {
    onReady();
    return;
  }

  // 아직 로드 중이면 콜백 목록에만 추가
  pendingCallbacks.push(onReady);

  // 이미 script 태그가 페이지에 있으면 중복 추가 안 함
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  // 처음 한 번만 script 태그를 만들어서 추가
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://ads-partners.coupang.com/g.js';
  script.async = true;
  script.onload = () => {
    isScriptLoaded = true;
    // 기다리던 모든 배너에게 "이제 시작해도 돼!" 알림
    pendingCallbacks.forEach((cb) => cb());
    pendingCallbacks = [];
  };
  document.body.appendChild(script);
}

export default function CoupangBanner({ bannerId = 'default' }: CoupangBannerProps) {
  const containerId = `coupang-container-${bannerId}`;
  // 이미 이 배너 칸이 초기화됐는지 기억하는 표시
  const isInitialized = useRef(false);

  useEffect(() => {
    // 이미 초기화된 배너는 다시 초기화하지 않음 (중복 방지)
    if (isInitialized.current) return;

    const initBanner = () => {
      // @ts-ignore
      if (!window.PartnersCoupang) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      // 배너 칸을 깨끗하게 비운 뒤 새 배너를 그림
      container.innerHTML = '';
      isInitialized.current = true;

      // @ts-ignore
      new window.PartnersCoupang.G({
        id: 856456,
        containerId: containerId,
      });
    };

    loadCoupangScript(initBanner);

    // 이 배너 컴포넌트가 페이지에서 사라질 때 초기화 상태를 리셋
    return () => {
      isInitialized.current = false;
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
