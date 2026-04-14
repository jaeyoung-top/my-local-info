import Image from "next/image";
import Link from "next/link";

export interface InfoItem {
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

export default function NewsCard({ item, color }: { item: InfoItem; color: 'indigo' | 'orange' }) {
  const brandColor = color === 'indigo' ? '#1D428A' : '#F25C05';
  
  return (
    <Link 
      href={`/blog/${item.id}`}
      className={`news-card block overflow-hidden group transition-all duration-300 ${color === 'orange' ? 'border-2 border-[#F25C05] shadow-[0_5px_15px_rgba(242,92,5,0.15)] rounded-2xl cursor-pointer hover:shadow-xl' : 'border border-gray-100 rounded-xl cursor-pointer hover:border-[#1D428A] hover:shadow-lg'}`}
    >
      <div className="flex flex-col h-full items-stretch min-h-[320px]">
        {/* 이미지 영역: 실제 이미지 또는 플레이스홀더 */}
        <div className="w-full h-48 sm:h-52 bg-gray-100 relative shrink-0 overflow-hidden border-b border-gray-100">
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.name} 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
               <span className="text-5xl opacity-40 group-hover:scale-125 transition-transform duration-500">
                {color === 'indigo' ? '🎫' : '💡'}
              </span>
            </div>
          )}
          {/* 카테고리 뱃지 (이미지 위에 오버레이) */}
          <div 
            className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded text-white shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            {item.category}
          </div>
        </div>

        {/* 텍스트 정보 영역 */}
        <div className="w-full flex-grow p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Release Date: {item.startDate}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#F25C05] transition-colors leading-tight break-keep">
              {item.name}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 break-keep font-medium">
              {item.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex flex-col text-[10px] font-bold text-gray-400">
               <span className="flex items-center gap-1 mb-1">📍 {item.location}</span>
               {item.target && (
                 <span className={`${color === 'orange' ? 'bg-[#F25C05] text-white px-3 py-1.5 rounded-lg text-[11px] mt-1 inline-block font-black shadow-sm' : 'text-[#1D428A]/60 mt-0.5'}`}>
                   {color === 'orange' ? `🎯 지원 대상: ${item.target}` : `TARGET: ${item.target}`}
                 </span>
               )}
            </div>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-400 group-hover:border-[#F25C05] group-hover:text-[#F25C05] group-hover:bg-[#F25C05]/5 transition-all">
              <span className="text-lg">➔</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
