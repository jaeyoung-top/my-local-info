import Link from "next/link";
import data from "../../../public/data/local-info.json";
import NewsCard, { InfoItem } from "@/components/NewsCard";

export default function BenefitsPage() {
  const { benefits } = data;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {/* 검색/메뉴 바 */}
      <div className="bg-[#F25C05] text-white py-2 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm font-bold">
          <div className="flex gap-6">
            <Link href="/" className="cursor-pointer hover:underline">홈</Link>
            <Link href="/blog" className="cursor-pointer hover:underline">블로그</Link>
            <Link href="/events" className="cursor-pointer hover:underline">행사/축제</Link>
            <Link href="/benefits" className="cursor-pointer underline">지원금/혜택</Link>
            <Link href="/about" className="cursor-pointer hover:underline">소개</Link>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-gray-200 py-12 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <span className="text-[#F25C05] font-bold text-sm tracking-widest uppercase">Benefits & Support</span>
          <h1 className="text-4xl font-black text-gray-900 drop-shadow-sm">놓치면 안 될 지원금 / 혜택 모아보기</h1>
          <p className="text-gray-500 mt-2">구민들을 위한 다양한 혜택과 맞춤형 복지 서비스를 확인하세요.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6">
          {benefits.map((benefit: InfoItem) => (
            <NewsCard key={benefit.id} item={benefit} color="orange" />
          ))}
          {benefits.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-medium">
              현재 등록된 혜택 정보가 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
