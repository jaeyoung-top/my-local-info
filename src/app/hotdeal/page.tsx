'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import CoupangBanner from '@/components/CoupangBanner';
import rawData from '../../../public/data/hotdeals.json';

const PAGE_SIZE = 20;

type Deal = {
  id: string;
  title: string;
  price: string | null;
  image: string | null;
  category: string;
  source: string;
  sourceColor: string;
  link: string;
  publishedAt: string;
  likes: number;
  fetchedAt: string;
};

const CATEGORIES = ['전체', 'PC', '가전', '식품', '생활용품', '게임', '의류', '화장품', '해외핫딜', '기타'];
const SOURCES = ['전체', 'FM코리아', '퀘이사존', '개드립', '루리웹', '클리앙'];

const SOURCE_COLORS: Record<string, string> = {
  'FM코리아': '#FF8C00',
  '퀘이사존': '#7C3AED',
  '개드립': '#DC2626',
  '루리웹': '#3B82F6',
  '클리앙': '#2A6EBB',
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const now = new Date();
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  } catch {
    return dateStr;
  }
}

function DealCard({ deal }: { deal: Deal }) {
  const srcColor = SOURCE_COLORS[deal.source] || '#888';
  return (
    <a
      href={deal.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {deal.image ? (
        <div className="relative h-40 w-full overflow-hidden bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <span
            className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow"
            style={{ backgroundColor: srcColor }}
          >
            {deal.source}
          </span>
        </div>
      ) : (
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF3B3B] to-[#F25C05]" />
      )}

      <div className="flex flex-col flex-grow p-4 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {!deal.image && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: srcColor }}
            >
              {deal.source}
            </span>
          )}
          {deal.category !== '기타' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {deal.category}
            </span>
          )}
          <span className="ml-auto text-[10px] text-gray-400">{timeAgo(deal.publishedAt) || timeAgo(deal.fetchedAt)}</span>
        </div>

        <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-3 group-hover:text-[#F25C05] transition-colors flex-grow">
          {deal.title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          {deal.price ? (
            <span className="text-base font-black text-[#FF3B3B]">{deal.price}</span>
          ) : (
            <span className="text-xs text-gray-400">가격 미표기</span>
          )}
          {deal.likes > 0 && (
            <span className="text-[11px] text-gray-400 font-medium">👍 {deal.likes}</span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <span className="block w-full text-center text-[11px] font-black text-[#F25C05] bg-[#FFF5F0] py-2 rounded-xl group-hover:bg-[#F25C05] group-hover:text-white transition-colors">
          바로가기 →
        </span>
      </div>
    </a>
  );
}

export default function HotDealPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [activeSource, setActiveSource] = useState('전체');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const deals = (rawData.deals || []) as Deal[];

  const filtered = useMemo(() => {
    let result = deals;
    if (activeCategory !== '전체') result = result.filter(d => d.category === activeCategory);
    if (activeSource !== '전체') result = result.filter(d => d.source === activeSource);
    if (sortBy === 'popular') result = [...result].sort((a, b) => b.likes - a.likes);
    return result;
  }, [deals, activeCategory, activeSource, sortBy]);

  // 필터/정렬 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, activeSource, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = filtered.length - visibleCount;

  const lastUpdated = rawData.lastUpdated
    ? new Date(rawData.lastUpdated).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    : '';

  return (
    <div className="min-h-screen bg-[#FFF5F0] text-[#334155]">
      <Header color="orange" />

      {/* 히어로 */}
      <div className="bg-gradient-to-r from-[#FF3B3B] to-[#F25C05] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔥</span>
            <h1 className="text-3xl font-black tracking-tight">전국 핫딜 모음</h1>
          </div>
          <p className="text-white/80 text-sm font-medium">
            FM코리아·퀘이사존·개드립·루리웹·클리앙 핫딜을 한눈에 모아드려요
          </p>
          {lastUpdated && (
            <p className="text-white/60 text-xs mt-2">마지막 업데이트: {lastUpdated}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* 필터 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeCategory === cat ? 'bg-[#F25C05] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-gray-50">
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(src => (
                <button
                  key={src}
                  onClick={() => setActiveSource(src)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    activeSource === src ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              {(['latest', 'popular'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    sortBy === s ? 'bg-[#FF3B3B] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s === 'latest' ? '최신순' : '인기순'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 수 */}
        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 font-medium mb-4">
            {visibleCount < filtered.length
              ? `${visibleCount} / ${filtered.length}개 표시 중`
              : `총 ${filtered.length}개`}
          </p>
        )}

        {/* 딜 그리드 */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🔥</div>
            <p className="text-lg font-bold mb-2">핫딜을 수집 중입니다</p>
            <p className="text-sm">3시간마다 최신 핫딜이 업데이트됩니다</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((deal, idx) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {/* 쿠팡 배너 (20개마다) */}
            {visibleCount >= PAGE_SIZE && (
              <div className="mt-6">
                <CoupangBanner />
              </div>
            )}

            {/* 더보기 버튼 */}
            {hasMore ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-10 py-3.5 bg-[#F25C05] text-white text-sm font-black rounded-2xl hover:bg-[#d34b00] active:scale-95 transition-all shadow-md"
                >
                  더보기 ({remaining}개 남음)
                </button>
                <p className="text-xs text-gray-400">{visibleCount} / {filtered.length}개</p>
              </div>
            ) : (
              <div className="mt-8 text-center text-xs text-gray-400 py-4 border-t border-gray-100">
                모든 핫딜을 확인했습니다 🎉
              </div>
            )}
          </>
        )}

        {/* 하단 배너 */}
        {!hasMore && filtered.length > 0 && (
          <div className="mt-6">
            <CoupangBanner />
          </div>
        )}

        {/* 면책 */}
        <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 text-xs text-gray-400 space-y-1">
          <p>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
          <p>핫딜 정보는 각 커뮤니티에서 자동 수집됩니다. 가격·재고는 실시간 변동될 수 있으니 구매 전 반드시 확인하세요.</p>
        </div>
      </div>
    </div>
  );
}
