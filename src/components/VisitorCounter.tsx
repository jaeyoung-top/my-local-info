'use client';

import analyticsData from '../../public/data/analytics.json';

export default function VisitorCounter({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { totalVisits, todayVisits } = analyticsData;

  if (!totalVisits && !todayVisits) return null;

  const baseClass = variant === 'light'
    ? 'text-gray-400'
    : 'text-white/60';
  const highlightClass = variant === 'light'
    ? 'text-gray-700 font-black'
    : 'text-white font-black';
  const sepClass = variant === 'light'
    ? 'text-gray-200'
    : 'text-white/30';

  return (
    <div className={`flex items-center gap-2 text-xs font-bold justify-center ${baseClass}`}>
      <span>👥</span>
      {todayVisits > 0 && (
        <>
          <span>오늘 <span className={highlightClass}>{todayVisits.toLocaleString()}</span>명 방문</span>
          <span className={sepClass}>|</span>
        </>
      )}
      <span>누적 <span className={highlightClass}>{totalVisits.toLocaleString()}</span>명 방문</span>
    </div>
  );
}
