'use client';

const COUPANG_PARTNER_ID = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID || "AF3039195";

export default function CoupangBanner() {
  // 환경변수가 없거나 초기값인 경우 렌더링하지 않음
  if (!COUPANG_PARTNER_ID || COUPANG_PARTNER_ID === "나중에_입력") {
    return null;
  }

  return (
    <div className="w-full flex justify-center my-6 overflow-hidden">
      {/* 쿠팡 파트너스 배너 (동적 iframe 방식) */}
      <iframe
        src={`https://link.coupang.com/a/${COUPANG_PARTNER_ID}`}
        width="100%"
        height="120"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        className="max-w-[728px] rounded-lg"
      ></iframe>
    </div>
  );
}
