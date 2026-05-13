'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CoupangBanner from '@/components/CoupangBanner';
import rawData from '../../../public/data/hotdeals.json';

const PAGE_SIZE = 30;

type PriceEntry = { site: string; price: string };
type HistoryPoint = { date: string; price: number };
type PriceHistory = { points: HistoryPoint[]; minPrice: number; maxPrice: number };

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
  priceHistory?: PriceHistory | null;
};

const CATEGORIES = ['전체', 'PC', '가전', '식품', '생활용품', '게임', '의류', '화장품', '해외핫딜', '기타'];
const SOURCES = ['전체', 'FM코리아', '퀘이사존', '개드립', '루리웹', '뽐뿌', '아카라이브'];

const SOURCE_COLORS: Record<string, string> = {
  'FM코리아': '#FF8C00', '퀘이사존': '#7C3AED', '개드립': '#DC2626',
  '루리웹': '#3B82F6', '뽐뿌': '#4F46E5', '아카라이브': '#10B981', '클리앙': '#2A6EBB',
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
  } catch { return ''; }
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch { return ''; }
}

function generateSummary(deal: Deal): string {
  const entries = (deal.priceComparison || []).filter(e => parsePriceNum(e.price) < Infinity);
  const hist = deal.priceHistory;
  const currentNum = deal.price ? parsePriceNum(deal.price) : null;

  const parts: string[] = [];

  if (entries.length >= 2) {
    const sorted = [...entries].sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price));
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const lowestNum = parsePriceNum(lowest.price);
    const highestNum = parsePriceNum(highest.price);
    const diff = highestNum - lowestNum;
    const pct = Math.round((diff / highestNum) * 100);
    parts.push(`${lowest.site} ${lowest.price}이 비교 최저가 (최고가 대비 ${diff.toLocaleString()}원·${pct}% 저렴)`);
  }

  if (hist && currentNum) {
    if (currentNum <= hist.minPrice * 1.03) {
      parts.push(`역대 최저가(${hist.minPrice.toLocaleString()}원) 수준 — 구매 추천`);
    } else if (currentNum >= hist.maxPrice * 0.97) {
      parts.push(`역대 최고가(${hist.maxPrice.toLocaleString()}원) 수준 — 신중 검토 필요`);
    } else {
      const fromMin = currentNum - hist.minPrice;
      parts.push(`역대 최저가보다 ${fromMin.toLocaleString()}원 높음 (최저 ${hist.minPrice.toLocaleString()}원)`);
    }
  }

  return parts.join(' · ') || '';
}

// ─── 가격 흐름 SVG 차트 ────────────────────────────────────────────────────────
function PriceChart({ history, currentPrice }: { history: PriceHistory; currentPrice: number | null }) {
  const { points, minPrice, maxPrice } = history;
  if (points.length < 2) return null;

  const W = 300, H = 90, PX = 12, PY = 10;
  const range = maxPrice - minPrice || 1;
  const toX = (i: number) => PX + (i / (points.length - 1)) * (W - PX * 2);
  const toY = (p: number) => PY + ((maxPrice - p) / range) * (H - PY * 2);

  const polyline = points.map((p, i) => `${toX(i)},${toY(p.price)}`).join(' ');
  const area = `${toX(0)},${H} ` + points.map((p, i) => `${toX(i)},${toY(p.price)}`).join(' ') + ` ${toX(points.length - 1)},${H}`;

  const isLow = currentPrice !== null && currentPrice <= minPrice * 1.05;
  const isHigh = currentPrice !== null && currentPrice >= maxPrice * 0.95;
  const lineColor = isLow ? '#34d399' : isHigh ? '#f87171' : '#fb923c';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[90px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaGrad)" />
        <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(i)} cy={toY(p.price)} r="3" fill={lineColor} />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-[#475569] mt-1 px-1">
        {points.length <= 8
          ? points.map((p, i) => <span key={i}>{p.date}</span>)
          : [points[0], points[Math.floor(points.length / 2)], points[points.length - 1]].map((p, i) => (
              <span key={i}>{p.date}</span>
            ))
        }
      </div>
      <div className="flex justify-between text-[10px] mt-2 px-1">
        <span className="text-[#34d399]">최저 {minPrice.toLocaleString()}원</span>
        <span className="text-[#f87171]">최고 {maxPrice.toLocaleString()}원</span>
      </div>
    </div>
  );
}

// ─── 딜 상세 모달 ─────────────────────────────────────────────────────────────
function DealModal({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'compare' | 'history'>('compare');
  const srcColor = SOURCE_COLORS[deal.source] || '#6366f1';
  const hasHistory = !!(deal.priceHistory?.points?.length && deal.priceHistory.points.length >= 2);
  const hasCompare = !!(deal.priceComparison?.length);
  const currentNum = deal.price ? parsePriceNum(deal.price) : null;
  const summary = generateSummary(deal);

  const compareEntries = deal.priceComparison || [];
  const lowestNum = compareEntries.length
    ? Math.min(...compareEntries.map(e => parsePriceNum(e.price)))
    : Infinity;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#161b27] w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-y-auto border border-[#252d3f]"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#252d3f] sticky top-0 bg-[#161b27] z-10">
          <span className="text-xs text-[#475569]">핫딜 상세</span>
          <button onClick={onClose} className="text-[#475569] hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        {/* 메인 정보 */}
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            {deal.image && (
              <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#1e2433]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                {deal.category !== '기타' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a3147] text-[#94a3b8]">{deal.category}</span>
                )}
                {deal.site && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a3147] text-[#94a3b8]">{deal.site}</span>
                )}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: srcColor + '33', color: srcColor }}>{deal.source}</span>
              </div>
              <h2 className="text-sm font-bold text-white leading-snug">{deal.title}</h2>
              {deal.publishedAt && (
                <p className="text-[10px] text-[#475569] mt-1">{deal.publishedAt.slice(0, 16)}</p>
              )}
            </div>
          </div>

          {/* 가격 + 구매 버튼 */}
          <div className="flex items-center justify-between bg-[#1e2433] rounded-xl px-4 py-3 mb-4">
            <div>
              {deal.site && <span className="text-[10px] text-[#475569] block mb-0.5">{deal.site}</span>}
              {deal.price
                ? <span className="text-xl font-black text-[#ff6b6b]">{deal.price}</span>
                : <span className="text-sm text-[#475569]">가격 미표기</span>}
            </div>
            <a
              href={deal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#ff6b6b] text-white text-sm font-black rounded-xl hover:bg-[#ff4f4f] active:scale-95 transition-all"
            >
              구매하기
            </a>
          </div>

          {/* AI 요약 */}
          {summary && (
            <div className="bg-[#1a2535] border border-[#2a3f55] rounded-xl px-4 py-3 mb-4 text-xs text-[#93c5fd] leading-relaxed">
              💡 {summary}
            </div>
          )}
        </div>

        {/* 탭 */}
        {(hasCompare || hasHistory) && (
          <div className="border-t border-[#252d3f]">
            <div className="flex px-4 pt-2 gap-1">
              {hasCompare && (
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors ${
                    activeTab === 'compare' ? 'bg-[#1e2433] text-white' : 'text-[#475569] hover:text-[#94a3b8]'
                  }`}
                >
                  🏷️ 가격 비교
                </button>
              )}
              {hasHistory && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors ${
                    activeTab === 'history' ? 'bg-[#1e2433] text-white' : 'text-[#475569] hover:text-[#94a3b8]'
                  }`}
                >
                  📈 가격 흐름
                </button>
              )}
            </div>

            <div className="bg-[#1e2433] mx-4 mb-4 rounded-xl overflow-hidden">
              {/* 가격 비교 탭 */}
              {activeTab === 'compare' && hasCompare && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#252d3f]">
                      <th className="text-left px-3 py-2 text-[#475569] font-bold">판매처</th>
                      <th className="text-right px-3 py-2 text-[#475569] font-bold">가격</th>
                      <th className="text-right px-3 py-2 text-[#475569] font-bold">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareEntries.map((e, i) => {
                      const num = parsePriceNum(e.price);
                      const isLowest = num === lowestNum && compareEntries.length > 1;
                      return (
                        <tr key={i} className="border-b border-[#252d3f] last:border-0">
                          <td className="px-3 py-2.5 text-[#94a3b8]">{e.site}</td>
                          <td className={`px-3 py-2.5 text-right font-bold ${isLowest ? 'text-[#ff6b6b]' : 'text-[#e2e8f0]'}`}>
                            {e.price}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {isLowest && <span className="text-[10px] bg-[#ff6b6b]/20 text-[#ff6b6b] px-1.5 py-0.5 rounded font-bold">최저</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* 가격 흐름 탭 */}
              {activeTab === 'history' && hasHistory && (
                <div className="p-4">
                  <PriceChart history={deal.priceHistory!} currentPrice={currentNum} />
                  {currentNum && deal.priceHistory && (
                    <div className="mt-3 text-center text-xs text-[#475569]">
                      현재 딜 가격 <span className="text-[#ff6b6b] font-bold">{currentNum.toLocaleString()}원</span>
                      {currentNum <= deal.priceHistory.minPrice * 1.03 && (
                        <span className="ml-2 text-[#34d399] font-bold">✓ 최저가 수준</span>
                      )}
                      {currentNum >= deal.priceHistory.maxPrice * 0.97 && (
                        <span className="ml-2 text-[#f87171] font-bold">⚠ 최고가 수준</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 딜 행 ────────────────────────────────────────────────────────────────────
function DealRow({ deal, onDetail }: { deal: Deal; onDetail: (deal: Deal) => void }) {
  const srcColor = SOURCE_COLORS[deal.source] || '#6366f1';
  const hasCompare = deal.priceComparison && deal.priceComparison.length > 0;
  const compareEntries = hasCompare ? deal.priceComparison!.slice(0, 3) : [];
  const lowestPrice = hasCompare ? Math.min(...compareEntries.map(e => parsePriceNum(e.price))) : Infinity;
  const hasHistory = !!(deal.priceHistory?.points?.length);

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 hover:bg-[#1e2433] active:bg-[#252b3b] transition-colors border-b border-[#1e2433] group cursor-pointer"
      onClick={() => onDetail(deal)}
    >
      {/* 썸네일 */}
      <div className="w-[60px] h-[60px] shrink-0 rounded-lg overflow-hidden bg-[#1e2433]">
        {deal.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deal.image} alt={deal.title} className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="4" fill="#2a3040" />
              <path d="M8 15l3-4 2 2.5 2-3L19 15H8z" fill="#3a4560" />
              <circle cx="9.5" cy="9.5" r="1.5" fill="#3a4560" />
            </svg>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          {deal.category !== '기타' && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a3147] text-[#94a3b8]">{deal.category}</span>
          )}
          {deal.site && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2a3147] text-[#94a3b8]">{deal.site}</span>
          )}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: srcColor + '33', color: srcColor }}>{deal.source}</span>
          {hasHistory && <span className="text-[10px] text-[#475569]">📈</span>}
        </div>

        <p className="text-sm font-bold text-[#e2e8f0] leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {deal.title}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          {deal.price
            ? <span className="text-sm font-black text-[#ff6b6b]">{deal.price}</span>
            : <span className="text-xs text-[#475569]">가격 미표기</span>}
          <span className="text-[10px] text-[#475569]">{timeAgo(deal.publishedAt) || timeAgo(deal.fetchedAt)}</span>
          {deal.likes > 0 && <span className="text-[10px] text-[#475569]">조회 {deal.likes}</span>}
        </div>

        {hasCompare && (
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] text-[#3a4560] font-bold uppercase tracking-wider">비교</span>
            {compareEntries.map((pc, i) => {
              const isLowest = parsePriceNum(pc.price) === lowestPrice && compareEntries.length > 1;
              return (
                <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isLowest ? 'bg-[#ff6b6b]/10 text-[#ff6b6b]' : 'bg-[#2a3147] text-[#64748b]'}`}>
                  {pc.site} {pc.price}{isLowest ? ' 최저' : ''}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 시간 + 상세 */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[11px] text-[#3a4560]">{formatTime(deal.publishedAt)}</span>
        <span className="text-[10px] text-[#3a4560] group-hover:text-[#64748b] transition-colors">상세 ›</span>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function HotDealPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [activeSource, setActiveSource] = useState('전체');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const deals = (rawData.deals || []) as Deal[];

  const filtered = useMemo(() => {
    let result = deals;
    if (activeCategory !== '전체') result = result.filter(d => d.category === activeCategory);
    if (activeSource !== '전체') result = result.filter(d => d.source === activeSource);
    if (sortBy === 'popular') result = [...result].sort((a, b) => b.likes - a.likes);
    return result;
  }, [deals, activeCategory, activeSource, sortBy]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeCategory, activeSource, sortBy]);

  const handleClose = useCallback(() => setSelectedDeal(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

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
      <div className="bg-[#0d1117] border-b border-[#1e2433] px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔥</span>
            <h1 className="text-xl font-black tracking-tight text-white">전국 핫딜 모음</h1>
          </div>
          <p className="text-[#475569] text-xs">
            FM코리아·퀘이사존·개드립·루리웹·뽐뿌·아카라이브
            {lastUpdated && <span className="ml-2">· {lastUpdated} 업데이트</span>}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* 필터 (sticky) */}
        <div className="bg-[#0d1117] border-b border-[#1e2433] px-4 py-3 space-y-2 sticky top-0 z-10">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-[#ff6b6b] text-white' : 'bg-[#1e2433] text-[#64748b] hover:text-[#94a3b8]'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SOURCES.map(src => (
              <button key={src} onClick={() => setActiveSource(src)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${activeSource === src ? 'bg-[#1e3a5f] text-[#60a5fa]' : 'bg-[#1e2433] text-[#64748b] hover:text-[#94a3b8]'}`}>
                {src}
              </button>
            ))}
            <div className="ml-auto flex gap-1.5">
              {(['latest', 'popular'] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${sortBy === s ? 'bg-[#1e2433] text-[#ff6b6b]' : 'bg-[#1e2433] text-[#64748b] hover:text-[#94a3b8]'}`}>
                  {s === 'latest' ? '최신순' : '인기순'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-2 text-[10px] text-[#3a4560]">
            {visibleCount < filtered.length ? `${visibleCount} / ${filtered.length}개 표시` : `총 ${filtered.length}개`}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#3a4560]">
            <div className="text-4xl mb-4">🔥</div>
            <p className="font-bold mb-1">핫딜을 수집 중입니다</p>
            <p className="text-sm">3시간마다 최신 핫딜이 업데이트됩니다</p>
          </div>
        ) : (
          <>
            <div className="bg-[#0d1117]">
              {visible.map(deal => (
                <DealRow key={deal.id} deal={deal} onDetail={setSelectedDeal} />
              ))}
            </div>

            {visibleCount >= PAGE_SIZE && (
              <div className="px-4 py-4"><CoupangBanner /></div>
            )}

            {hasMore ? (
              <div className="px-4 py-6 flex flex-col items-center gap-2">
                <button onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="w-full py-3 bg-[#1e2433] text-[#94a3b8] text-sm font-bold rounded-lg hover:bg-[#252d3f] hover:text-white transition-colors">
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

        {!hasMore && filtered.length > 0 && (
          <div className="px-4 pb-4"><CoupangBanner /></div>
        )}

        <div className="px-4 py-4 border-t border-[#1e2433] text-[10px] text-[#2a3147] space-y-1">
          <p>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
          <p>핫딜 정보는 각 커뮤니티에서 자동 수집됩니다. 가격·재고는 실시간 변동될 수 있으니 구매 전 반드시 확인하세요.</p>
        </div>
      </div>

      {/* 모달 */}
      {selectedDeal && <DealModal deal={selectedDeal} onClose={handleClose} />}
    </div>
  );
}
