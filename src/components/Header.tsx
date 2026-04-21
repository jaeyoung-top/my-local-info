'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  color?: "orange" | "blue";
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({ 
  color = "orange", 
  showSearch = false, 
  searchQuery = "", 
  setSearchQuery 
}: HeaderProps) {
  const pathname = usePathname();
  const bgColor = color === "orange" ? "bg-[#F25C05]" : "bg-[#1D428A]";

  return (
    <div className={`${bgColor} text-white py-2 px-6 shadow-sm`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center text-sm font-bold">
        <div className="flex gap-6">
          <Link href="/" className={`cursor-pointer hover:underline ${pathname === '/' ? 'underline' : ''}`}>홈</Link>
          <Link href="/blog" className={`cursor-pointer hover:underline ${pathname.startsWith('/blog') ? 'underline' : ''}`}>블로그</Link>
          <Link href="/events" className={`cursor-pointer hover:underline ${pathname === '/events' ? 'underline' : ''}`}>송파구 이번달행사</Link>
          <Link href="/benefits" className={`cursor-pointer hover:underline ${pathname === '/benefits' ? 'underline' : ''}`}>공공(전국)지원금·혜택</Link>
          <Link href="/ai-support" className={`cursor-pointer hover:underline ${pathname === '/ai-support' ? 'underline' : ''}`}>AI지원프로그램</Link>
          <Link href="/about" className={`cursor-pointer hover:underline ${pathname === '/about' ? 'underline' : ''}`}>소개</Link>
          <Link href="/privacy" className={`cursor-pointer hover:underline opacity-70 ${pathname === '/privacy' ? 'underline' : ''}`}>개인정보처리방침</Link>
        </div>
        
        {showSearch && setSearchQuery && (
          <div className="flex items-center gap-2">
            <div className="bg-white/20 px-3 py-1 rounded flex items-center gap-2">
              <input 
                type="text" 
                placeholder="전체 검색" 
                className="bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-white/70 w-24 md:w-32"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="text-base leading-none">🔍</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
