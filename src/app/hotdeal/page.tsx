'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import CoupangBanner from '@/components/CoupangBanner';
import rawData from '../../../public/data/hotdeals.json';

const PAGE_SIZE = 30;

type PriceEntry = { site: string; price: string };

type Deal = {
  id: string;
  title: string;
  price: string | null;
  image: string | null;
  category: string;
  site?: string | null;
  source: string;
  sourceColor: string;
  link: string;
  publishedAt: string;
  likes: number;
  fetchedAt: string;
  priceComparison?: PriceEntry[];
};

const CATEGORIES = ['전체', 'PC', '가전', '식품', '생활용품', '게임', '의류', '화장품', '해외핫딜', '기타'];
const SOURCES = ['전체', 'FM코리아', '퀘이사존', '개드립', '루리웹', '뽐뿌', '아카라이브'];

const SOURCE_COLORS: Record<string, string> = {
  'FM코리아': '#FF8C00',
  '퀘이사존': '#7C3AED',
  '개드립': '#DC2626',
  '루리웹': '#3B82F6',
  '뽐뿌': '#4F46E5',
  '아카라이브': '#10B981',
  '클리앙': '#2A6EBB',
};

function parsePriceNum(price: string): number {
  const n = parseInt(price.replace(/[^0-9]/g, ''));
  return isNaN(n) ? Infinity : n;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const now = new Date();
    const d = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  } catch {
    return '';
  }
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '';
  }
}

function DealRow({ deal }: { deal: Deal }) {
  const srcColor = SOURCE_COLORS[deal.source] || '#6366f1';
  const hasCompare = deal.priceComparison && deal.priceComparison.length > 0;
  const compareEntries = hasCompare ? deal.priceComparison!.slice(0, 3) : [];
  const lowestPrice = hasCompare
    ? Math.min(...compareEntries.map(e => parsePriceNum(e.price)))
    : Infinity;

  return (
    <a
      href={deal.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 px-4 py-3 hover:bg-[#1e2433] active:bg-[#252b3b] transition-colors border-b border-[#1e2433] group"
    >
      {/* 썸네일 */}
      <div className="w-[60px] h-[60px] shrink-0 rounded-lg overflow-hidden bg-[#1e2433]">
        {deal.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#3a4155]">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#2a3040"/><path d="M8 15l3-4 2 2.5 2-3L19 15H8z" fill="#3a4560"/><circle cx="9.5" cy="9.5" r="1.5" fill="#3a4560"/></svg>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0">
        {/* 태그 행 */}
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          {deal.category !== '기타' && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a3147] text-[#94a3b8]">
              {deal.category}
            </span>
          )}
          {deal.site && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a3147] text-[#94a3b8]">
              {deal.site}
            </span>
          )}
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
            style={{ backgroundColor: srcColor + '33', color: srcColor }}
          >
            {deal.source}
          </span>
        </div>

        {/* 제목 */}
        <p className="text-sm font-bold text-[#e2e8f0] leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {deal.title}
        </p>

        {/* 가격 + 시간 */}
        <div className="flex items-center gap-2 mt-1.5">
          {deal.price ? (
            <span className="text-sm font-black text-[#ff6b6b]">{deal.price}</span>
          ) : (
            <span className="text-xs text-[#475569]">가격 미표기</span>
          )}
          <span className="text-[10px] text-[#475569]">{timeAgo(deal.publishedAt) || timeAgo(deal.fetchedAt)}</span>
          {deal.likes > 0 && (
            <span className="text-[10px] text-[#475569]">조회 {deal.likes}</span>
          )}
        </div>

        {/* 타사 가격비교 */}
        {hasCompare && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-[#475569] font-bold uppercase tracking-wider">비교</span>
            {compareEntries.map((pc, i) => {
              const isLowest = parsePriceNum(pc.price) === lowestPrice && compareEntries.length > 1;
              return (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isLowest
                      ? 'bg-[#ff6b6b]/10 text-[#ff6b6b]'
                      : 'bg-[#2a3147] text-[#64748b]'
                  }`}
                >
                  {pc.site} {pc.price}{isLowest ? ' 최저' : ''}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 시간 */}
      <span className="text-[11px] text-[#3a4560] shrink-0 pt-0.5">{formatTime(deal.publishedAt)}</span>
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
    <div className="min-h-screen bg-[#0d1117] text-[#e2e8f0]">
      <Header color="orange" />

      {/* 히어로 */}
      <div className="bg-[#0d1117] border-b border-[#1e2433] px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔥</span>
            <h1 className="text-xl font-black tracking-tight text-white">전국 핫딜 모음</h1>
          </div>
          <p className="text-[#475569] text-xs">
            FM코리아·퀘이사존·개드립·루리웹·뽐뿌·아카라이브
            {lastUpdated && <span className="ml-2">· 업데이트 {lastUpdated}</span>}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">

        {/* 필터 */}
        <div className="bg-[#0d1117] border-b border-[#1e2433] px-4 py-3 space-y-2.5 sticky top-0 z-10">
          {/* 카테고리 */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#ff6b6b] text-white'
                    : 'bg-[#1e2433] text-[#64748b] hover:text-[#94a3b8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 소스 + 정렬 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {SOURCES.map(src => (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  activeSource === src
                    ? 'bg-[#1e3a5f] text-[#60a5fa]'
                    : 'bg-[#1e2433] text-[#64748b] hover:text-[#94a3b8]'
                }`}
              >
                {src}
              </button>
            ))}
            <div className="ml-auto flex gap-1.5">
              {(['latest', 'popular'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    sortBy === s
                      ? 'bg-[#1e2433] text-[#ff6b6b]'
                      : 'bg-[#1e2433] text-[#64748b] hover:text-[#94a3b8]'
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
          <div className="px-4 py-2 text-[10px] text-[#3a4560]">
            {visibleCount < filtered.length
              ? `${visibleCount} / ${filtered.length}개 표시`
              : `총 ${filtered.length}개`}
          </div>
        )}

        {/* 딜 목록 */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#3a4560]">
            <div className="text-4xl mb-4">🔥</div>
            <p className="font-bold mb-1">핫딜을 수집 중입니다</p>
            <p className="text-sm">3시간마다 최신 핫딜이 업데이트됩니다</p>
          </div>
        ) : (
          <>
            <div className="bg-[#0d1117]">
              {visible.map((deal) => (
                <DealRow key={deal.id} deal={deal} />
              ))}
            </div>

            {/* 쿠팡 배너 */}
            {visibleCount >= PAGE_SIZE && (
              <div className="px-4 py-4">
                <CoupangBanner />
              </div>
            )}

            {/* 더보기 */}
            {hasMore ? (
              <div className="px-4 py-6 flex flex-col items-center gap-2">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="w-full py-3 bg-[#1e2433] text-[#94a3b8] text-sm font-bold rounded-lg hover:bg-[#252d3f] hover:text-white transition-colors"
                >
                  더보기 ({remaining}개 남음)
                </button>
                <p className="text-[10px] text-[#3a4560]">{visibleCount} / {filtered.length}개</p>
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-[10px] text-[#3a4560] border-t border-[#1e2433]">
                모든 핫딜을 확인했습니다
              </div>
            )}
          </>
        )}

        {/* 하단 배너 */}
        {!hasMore && filtered.length > 0 && (
          <div className="px-4 pb-4">
            <CoupangBanner />
          </div>
        )}

        {/* 면책 */}
        <div className="px-4 py-4 border-t border-[#1e2433] text-[10px] text-[#2a3147] space-y-1">
          <p>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
          <p>핫딜 정보는 각 커뮤니티에서 자동 수집됩니다. 가격·재고는 실시간 변동될 수 있으니 구매 전 반드시 확인하세요.</p>
        </div>
      </div>
    </div>
  );
}
