'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '행사':      { bg: '#EBF1FB', text: '#1D428A' },
  '문화행사':  { bg: '#EBF1FB', text: '#1D428A' },
  '혜택':      { bg: '#FFF3E8', text: '#C05000' },
  '지원금':    { bg: '#FFF3E8', text: '#C05000' },
  '복지':      { bg: '#FFF3E8', text: '#C05000' },
  '청년지원':  { bg: '#E8F5E9', text: '#1B6B2F' },
  '취업':      { bg: '#E8F5E9', text: '#1B6B2F' },
  'AI지원':    { bg: '#F3E8FF', text: '#6B21A8' },
  'AI':        { bg: '#F3E8FF', text: '#6B21A8' },
};

function catColor(cat?: string) {
  if (!cat) return { bg: '#F1F5F9', text: '#64748B' };
  return CATEGORY_COLORS[cat] ?? { bg: '#F1F5F9', text: '#64748B' };
}

function formatDate(d: string) {
  if (!d) return '';
  const parts = d.split('-');
  if (parts.length === 3) return `${parts[0].slice(2)}.${parts[1]}.${parts[2]}`;
  return d;
}

const PAGE_SIZE = 25;

export default function BlogListClient({ posts }: { posts: Post[] }) {
  const [activeCat, setActiveCat] = useState('전체');
  const [page, setPage] = useState(1);

  // 유니크 카테고리 목록
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[];
    return ['전체', ...cats.sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    if (activeCat === '전체') return posts;
    return posts.filter(p => p.category === activeCat);
  }, [posts, activeCat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function selectCat(cat: string) {
    setActiveCat(cat);
    setPage(1);
  }

  // 페이지 번호 범위
  const pageNums = (() => {
    const delta = 4;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    const nums: number[] = [];
    for (let i = left; i <= right; i++) nums.push(i);
    return nums;
  })();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#1D428A]">송파 이야기 블로그</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {activeCat === '전체' ? `전체 ${filtered.length}개` : `${activeCat} · ${filtered.length}개`}
        </p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => selectCat(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
              activeCat === cat
                ? 'bg-[#1D428A] text-white border-[#1D428A]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 포스트 목록 */}
      {visible.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">✍️</p>
          <p className="font-bold">아직 등록된 게시글이 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {visible.map((post, i) => {
            const color = catColor(post.category);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                  i !== 0 ? 'border-t border-gray-100' : ''
                }`}
              >
                {/* 카테고리 배지 */}
                <span
                  className="shrink-0 mt-0.5 text-[10px] font-black px-2 py-0.5 rounded"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  {post.category || '기타'}
                </span>

                {/* 제목 + 요약 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate leading-snug">
                    {post.title}
                  </p>
                  {post.summary && (
                    <p className="text-xs text-gray-400 truncate mt-0.5 leading-relaxed">
                      {post.summary}
                    </p>
                  )}
                </div>

                {/* 날짜 */}
                <span className="shrink-0 text-[11px] text-gray-300 mt-0.5 whitespace-nowrap">
                  {formatDate(post.date)}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30 text-sm"
          >
            ‹
          </button>
          {pageNums[0] > 1 && (
            <>
              <button onClick={() => setPage(1)} className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 text-xs">1</button>
              {pageNums[0] > 2 && <span className="text-gray-300 text-xs px-1">…</span>}
            </>
          )}
          {pageNums.map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                n === page ? 'bg-[#1D428A] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
          {pageNums[pageNums.length - 1] < totalPages && (
            <>
              {pageNums[pageNums.length - 1] < totalPages - 1 && <span className="text-gray-300 text-xs px-1">…</span>}
              <button onClick={() => setPage(totalPages)} className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 text-xs">{totalPages}</button>
            </>
          )}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30 text-sm"
          >
            ›
          </button>
        </div>
      )}

      {/* 현재 위치 */}
      {totalPages > 1 && (
        <p className="text-center text-[11px] text-gray-300 mt-2">
          {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} / {filtered.length}개
        </p>
      )}
    </main>
  );
}
