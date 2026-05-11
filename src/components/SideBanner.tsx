// 728×90 배너를 90° 회전해 우측에 고정 표시 (xl 이상에서만)
// 회전 후 시각적 크기: 90px 너비 × 728px 높이
// right offset = 728/2 - 90/2 = 319px (중심이 우측 가장자리에 오도록)
export default function SideBanner() {
  return (
    <div
      className="hidden xl:block fixed z-40 pointer-events-none"
      style={{
        right: '-319px',
        top: '50%',
        width: '728px',
        height: '90px',
        transform: 'translateY(-50%) rotate(90deg)',
        transformOrigin: 'center center',
      }}
    >
      <a
        href="https://link.coupang.com/a/eG5z73"
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="unsafe-url"
        className="pointer-events-auto"
      >
        <img
          src="https://ads-partners.coupang.com/banners/987905?subId=&traceId=V0-301-371ae01f4226dec2-I987905&w=728&h=90"
          alt="쿠팡 파트너스"
          width={728}
          height={90}
          style={{ display: 'block' }}
        />
      </a>
    </div>
  );
}
