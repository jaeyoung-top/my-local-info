'use client';

import { useState } from 'react';
import NewsCard, { InfoItem } from './NewsCard';

interface PaginatedListProps {
  items: InfoItem[];
  color: 'indigo' | 'orange';
  itemsPerPage?: number;
  emptyMessage?: string;
}

export default function PaginatedList({
  items,
  color,
  itemsPerPage = 8,
  emptyMessage = '현재 등록된 정보가 없습니다.',
}: PaginatedListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const pageItems = items.slice(start, start + itemsPerPage);

  const accentColor = color === 'orange' ? '#F25C05' : '#1D428A';

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium">{emptyMessage}</div>
    );
  }

  const pageNumbers: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  return (
    <div>
      <div className="grid gap-6">
        {pageItems.map((item) => (
          <NewsCard key={item.id} item={item} color={color} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-current transition-all"
              style={{ '--hover-color': accentColor } as React.CSSProperties}
              onMouseEnter={(e) => { if (page > 1) { (e.currentTarget as HTMLElement).style.borderColor = accentColor; (e.currentTarget as HTMLElement).style.color = accentColor; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
            >
              ← 이전
            </button>

            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="w-10 text-center text-gray-400 font-bold select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p as number)}
                  className="w-10 h-10 rounded-xl font-black text-sm transition-all border-2"
                  style={
                    p === page
                      ? { backgroundColor: accentColor, color: '#fff', borderColor: accentColor, transform: 'scale(1.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                      : { borderColor: '#e5e7eb', color: '#6b7280' }
                  }
                  onMouseEnter={(e) => { if (p !== page) { (e.currentTarget as HTMLElement).style.borderColor = accentColor; (e.currentTarget as HTMLElement).style.color = accentColor; } }}
                  onMouseLeave={(e) => { if (p !== page) { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; } }}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onMouseEnter={(e) => { if (page < totalPages) { (e.currentTarget as HTMLElement).style.borderColor = accentColor; (e.currentTarget as HTMLElement).style.color = accentColor; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
            >
              다음 →
            </button>
          </div>

          <p className="text-gray-400 text-xs font-medium">
            {start + 1}–{Math.min(start + itemsPerPage, items.length)} / 전체 {items.length}개
          </p>
        </nav>
      )}
    </div>
  );
}
