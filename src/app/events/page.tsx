import Header from "@/components/Header";
import data from "../../../public/data/local-info.json";
import NewsCard, { InfoItem } from "@/components/NewsCard";

export default function EventsPage() {
  const { events } = data;
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {/* 검색/메뉴 바 */}
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-12 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <span className="text-[#1D428A] font-bold text-sm tracking-widest uppercase">Events & Festivals</span>
          <h1 className="text-4xl font-black text-gray-900 drop-shadow-sm">{currentMonth}월 주요 행사 모아보기</h1>
          <p className="text-gray-500 mt-2">송파구에서 열리는 다채로운 행사와 축제를 한눈에 확인하세요.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-6">
          {events.map((event: InfoItem) => (
            <NewsCard key={event.id} item={event} color="indigo" />
          ))}
          {events.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-medium">
              이번 달 등록된 행사가 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
