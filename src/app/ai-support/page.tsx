import Header from "@/components/Header";
import data from "../../../public/data/local-info.json";
import NewsCard, { InfoItem } from "@/components/NewsCard";

export default function AiSupportPage() {
  const { aiSupport } = data;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {/* 검색/메뉴 바 */}
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-12 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <span className="text-[#1D428A] font-bold text-sm tracking-widest uppercase">AI Support Program</span>
          <h1 className="text-4xl font-black text-gray-900 drop-shadow-sm">미래를 준비하는 AI 지원 프로그램 모아보기</h1>
          <p className="text-gray-500 mt-2">기업과 개인을 위한 최신 인공지능 관련 지원 및 교육 소식을 확인하세요.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6">
          {aiSupport && aiSupport.map((item: InfoItem) => (
            <NewsCard key={item.id} item={item} color="indigo" />
          ))}
          {(!aiSupport || aiSupport.length === 0) && (
            <div className="text-center py-20 text-gray-400 font-medium">
              현재 등록된 AI 지원 정보가 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
