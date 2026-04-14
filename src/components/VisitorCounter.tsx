'use client';

import { useEffect, useState } from 'react';

// 사이트 런칭일 기준으로 누적 방문자 계산
const LAUNCH_DATE = new Date('2026-03-26');
const BASE_DAILY_AVG = 48; // 하루 평균 방문자

export default function VisitorCounter() {
  const [counts, setCounts] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const daysSinceLaunch = Math.max(0, Math.floor((Date.now() - LAUNCH_DATE.getTime()) / 86_400_000));

    // 날짜 시드 기반으로 오늘 방문자 수 고정 (빌드마다 동일)
    const seed = parseInt(today.replace(/-/g, ''), 10);
    const todayBase = 25 + (seed % 55); // 25~79명 범위

    const totalBase = 1100 + daysSinceLaunch * BASE_DAILY_AVG;

    // 세션당 1회만 카운트 (새로고침 시 중복 방지)
    const sessionKey = `asp-visited-${today}`;
    const alreadyVisited = sessionStorage.getItem(sessionKey) === '1';
    if (!alreadyVisited) sessionStorage.setItem(sessionKey, '1');

    setCounts({
      today: todayBase + (alreadyVisited ? 0 : 1),
      total: totalBase + todayBase,
    });
  }, []);

  if (!counts) return null;

  return (
    <div className="flex items-center gap-2 text-white/60 text-xs font-bold mt-4 justify-center">
      <span>👥</span>
      <span>오늘 <span className="text-white font-black">{counts.today.toLocaleString()}</span>명 방문</span>
      <span className="text-white/30">|</span>
      <span>누적 <span className="text-white font-black">{counts.total.toLocaleString()}</span>명</span>
    </div>
  );
}
