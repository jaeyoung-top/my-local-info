'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  color?: "orange" | "blue";
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const NAV_LINKS = [
  { href: "/", label: "홈", exact: true },
  { href: "/blog", label: "블로그" },
  { href: "/hotdeal", label: "🔥 핫딜" },
  { href: "/events", label: "이번달 행사" },
  { href: "/benefits", label: "지원금·혜택" },
  { href: "/ai-support", label: "AI지원" },
  { href: "/guide", label: "생활가이드" },
  { href: "/about", label: "소개" },
];

export default function Header({
  color = "orange",
  showSearch = false,
  searchQuery = "",
  setSearchQuery,
}: HeaderProps) {
  const pathname = usePathname();
  const bgColor = color === "orange" ? "bg-[#F25C05]" : "bg-[#1D428A]";
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className={`${bgColor} text-white shadow-sm`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11">
          {/* 로고 */}
          <Link href="/" className="font-black text-sm tracking-tight shrink-0">
            AI 송파 인포
          </Link>

          {/* 데스크탑 네비 */}
          <div className="hidden md:flex items-center gap-4 text-sm font-bold overflow-x-auto">
            {NAV_LINKS.map(({ href, label, exact }) => (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap hover:underline ${isActive(href, exact) ? "underline" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* 오른쪽: 검색 + 햄버거 */}
          <div className="flex items-center gap-2 shrink-0">
            {showSearch && setSearchQuery && (
              <div className="bg-white/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="검색"
                  className="bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-white/70 w-20 sm:w-28"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="text-sm leading-none">🔍</span>
              </div>
            )}
            <button
              className="md:hidden p-1.5 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴 열기"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 py-2 grid grid-cols-2 gap-1">
            {NAV_LINKS.map(({ href, label, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-sm font-bold transition-colors ${
                  isActive(href, exact) ? "bg-white/25" : "hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
