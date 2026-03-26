import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import data from "../../../../public/data/local-info.json";

interface InfoItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
  image?: string;
}

export function generateStaticParams() {
  const allItems = [...data.events, ...data.benefits];
  return allItems.map((item) => ({
    id: item.id,
  }));
}

export default async function InfoDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const allItems: InfoItem[] = [...data.events, ...data.benefits];
  const item = allItems.find((p) => p.id === id);

  if (!item) {
    notFound();
  }

  const isBenefit = data.benefits.some(b => b.id === id);
  const color = isBenefit ? 'orange' : 'indigo';
  const brandColor = color === 'indigo' ? '#1D428A' : '#F25C05';

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {/* 상단 네비게이션 바 */}
      <div className="bg-[#1D428A] text-white py-3 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm font-bold">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">←</span>
            <span>홈으로 돌아가기</span>
          </Link>
          <div className="text-[#F25C05] bg-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
            송파소식
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* 상단 헤더 영역 (이미지 + 타이틀) */}
          <div className="relative h-[40vh] min-h-[300px] w-full bg-gray-100">
            {item.image ? (
              <Image 
                src={item.image} 
                alt={item.name} 
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                 <span className="text-7xl opacity-40">
                  {color === 'indigo' ? '🎫' : '💡'}
                </span>
              </div>
            )}
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* タイトルの情報 */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
              <span 
                className="inline-block px-3 py-1 rounded text-xs font-black mb-4 shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {item.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2 drop-shadow-md break-keep">
                {item.name}
              </h1>
              <p className="text-white/80 font-medium text-sm md:text-base flex items-center gap-2">
                <span>🗓️ {item.startDate === item.endDate ? item.startDate : `${item.startDate} ~ ${item.endDate}`}</span>
              </p>
            </div>
          </div>

          {/* 본문 내용 영역 */}
          <div className="p-8 md:p-12">
            
            {/* 정보 요약 카드 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-12 text-sm">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wider">주요 타겟 대상</h3>
                  <p className="font-semibold text-gray-900 text-lg break-keep">{item.target}</p>
                </div>
              </div>
              <div className="w-px bg-gray-200 hidden md:block"></div>
              <div className="flex-1 space-y-4">
                 <div>
                  <h3 className="text-gray-500 font-bold mb-1 text-xs uppercase tracking-wider">장소 및 위치</h3>
                  <p className="font-semibold text-gray-900 text-lg break-keep">{item.location}</p>
                </div>
              </div>
            </div>

            {/* 상세 설명 (임시로 summary 출력) */}
            <div className="prose prose-lg max-w-none text-gray-600 mb-12 min-h-[150px]">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">상세 안내</h3>
              <p className="leading-relaxed break-keep font-medium text-gray-700 text-lg">
                {item.summary}
              </p>
              <div className="mt-8 p-4 bg-blue-50/50 rounded-lg text-sm text-gray-500 border border-blue-100/50">
                해당 정보는 공공 목적으로 송파소식지에서 제공하는 정보의 요약본입니다. 정확한 일정이나 신청 방법 등은 반드시 하단의 '자세히 보기' 버튼을 통해 원본 사이트에서 한 번 더 확인하시기 바랍니다.
              </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center border-t border-gray-100 pt-8">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#1D428A] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                자세히 보기 ➔
              </a>
              <Link 
                href="/"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-bold rounded-xl transition-all text-center"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </article>
      </main>

      {/* 심플 푸터 */}
      <footer className="text-center py-8 text-gray-400 text-xs">
        © 2026 Songpa Local Information Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
