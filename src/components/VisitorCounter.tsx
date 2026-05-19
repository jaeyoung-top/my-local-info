'use client';

import analyticsData from '../../public/data/analytics.json';

export default function VisitorCounter() {
  const { totalVisits, todayVisits } = analyticsData;

  // 아직 Cloudflare 데이터가 없으면 표시 안 함
  if (!totalVisits && !todayVisits) return null;

  return (
    <div className="flex items-center gap-2 text-white/60 text-xs font-bold mt-4 justify-center">
      <span>👥</span>
      {todayVisits > 0 && (
        <>
          <span>오늘 <span className="text-white font-black">{todayVisits.toLocaleString()}</span>명 방문</span>
          <span className="text-white/30">|</span>
        </>
      )}
      <span>누적 <span className="text-white font-black">{totalVisits.toLocaleString()}</span>명</span>
    </div>
  );
}
