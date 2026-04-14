'use client';

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import data from "../../public/data/local-info.json";
import NewsCard, { InfoItem } from "@/components/NewsCard";
import CoupangBanner from "@/components/CoupangBanner";
import Header from "@/components/Header";
import Script from "next/script";

export default function Home() {
  const { events, benefits, aiSupport, lastUpdated } = data;
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const monthString = currentMonth.toString().padStart(2, '0');

  // 검색어에 따른 필터링 로직
  const filteredEvents = events.filter((item: InfoItem) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBenefits = benefits.filter((item: InfoItem) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAiSupport = (aiSupport || []).filter((item: InfoItem) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const eventJsonLd = events.map((event: InfoItem) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "startDate": event.startDate,
    "endDate": event.endDate || event.startDate,
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "송파구",
        "addressRegion": "서울특별시"
      }
    },
    "description": event.summary
  }));

  const benefitJsonLd = benefits.map((benefit: InfoItem) => ({
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": benefit.name,
    "description": `${benefit.summary} (지원 대상: ${benefit.target})`,
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "송파구청"
    }
  }));

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {eventJsonLd.map((ld, i) => (
        <Script
          id={`event-ld-${i}`}
          key={`event-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      {benefitJsonLd.map((ld, i) => (
        <Script
          id={`benefit-ld-${i}`}
          key={`benefit-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Header 
        showSearch={true} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* 2. 로고 및 메인 헤더 영역 (세련된 큰 배너 스타일) */}
      <header className="relative bg-gradient-to-r from-[#1D428A] via-[#1a3668] to-[#F25C05] py-20 px-6 overflow-hidden shadow-inner mb-6">
        {/* 장식용 배경 패턴 */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F25C05] opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
          <div className="flex flex-col items-center md:items-start text-white">
            <p className="text-white/90 font-bold tracking-widest text-xs uppercase mb-4 bg-white/10 inline-block px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
              Songpa Local Information
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-3 drop-shadow-md">
              송파<span className="text-[#F25C05] drop-shadow-lg">INFO</span>
            </h1>
            <p className="text-white/95 text-lg md:text-xl mt-2 font-medium drop-shadow break-keep text-center md:text-left">
              우리 동네 이벤트부터 지원금까지 유용한 공공정보를 모았습니다
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end border-l-4 border-[#F25C05] pl-8 space-y-3">
            <p className="text-white font-black text-5xl drop-shadow-sm tracking-tighter">{currentYear}. {monthString}</p>
          </div>
        </div>
      </header>

      {/* 3. 메인 콘텐츠: 2단 레이아웃 (사이드바 / 본문) */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 좌측 사이드바: 1/4 영역 */}
          <aside className="lg:w-1/4 space-y-10">
            <div className="sidebar-sticky">
              {/* 이번 달 소식지 표지 스타일 박스 */}
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[3/4] flex flex-col justify-between group cursor-pointer">
                {/* 배경 이미지 */}
                <Image 
                  src="https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1000&auto=format&fit=crop"
                  alt="Current Issue Cover"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D428A]/90 via-[#1D428A]/40 to-black/30"></div>
                
                {/* 콘텐츠 영역 */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
                  <div>
                    <span className="bg-[#F25C05] text-white text-[10px] font-black px-2 py-1 rounded inline-block mb-3">
                      추천
                    </span>
                    <p className="text-white/80 font-bold text-xs tracking-wider mb-2">{currentYear}.{monthString}</p>
                    <h3 className="text-3xl font-black leading-tight break-keep drop-shadow-md">
                      아름다운 봄,<br/>벚꽃이야기<br/>호수벚꽃축제
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-white/90 line-clamp-2 drop-shadow">
                      송파, 축제의 현장으로 여러분을 초대합니다. 석촌호수에서 펼쳐지는 봄의 향연을 만나보세요.
                    </div>
                    <a 
                      href="https://songpa.newstool.co.kr/list.php?eid=9011"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center relative overflow-hidden py-3 bg-white/20 hover:bg-[#F25C05] backdrop-blur-sm border border-white/30 transition-all rounded-lg font-black text-sm uppercase group-hover:border-[#F25C05] group-hover:shadow-[0_0_15px_rgba(242,92,5,0.5)]"
                    >
                      E-BOOK 보기 ➔
                    </a>
                  </div>
                </div>
              </div>

              {/* 카테고리 퀵 서비스 */}
              <div className="mt-10 space-y-4">
                <h4 className="text-[#1D428A] font-black text-sm border-b-2 border-[#1D428A] pb-2">QUICK CATEGORY</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/events" className="px-4 py-3 bg-white border border-gray-200 rounded text-sm font-bold text-gray-600 hover:border-[#1D428A] hover:text-white hover:bg-[#1D428A] flex justify-between items-center transition-all shadow-sm">
                    {currentMonth}월 주요행사 <span>➔</span>
                  </Link>
                  <Link href="/benefits" className="px-4 py-3 bg-white border border-gray-200 rounded text-sm font-bold text-gray-600 hover:border-[#F25C05] hover:text-white hover:bg-[#F25C05] flex justify-between items-center transition-all shadow-sm">
                    지원금 및 생활 혜택 <span>➔</span>
                  </Link>
                  <Link href="/blog" className="px-4 py-3 bg-white border border-gray-200 rounded text-sm font-bold text-gray-600 hover:border-[#1a3668] hover:text-white hover:bg-[#1a3668] flex justify-between items-center transition-all shadow-sm">
                    블로그 소식 <span>➔</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* 우측 본문 리스트 영역: 3/4 영역 */}
          <div className="lg:w-3/4 space-y-12">
            
            {/* 섹션 1: 이번 달 주요 행사 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b-4 border-[#1D428A] pb-3">
                <span className="bg-[#1D428A] text-white text-xs font-black px-3 py-1 rounded">HOT</span>
                <h2 className="text-2xl font-black text-[#1D428A]">이번 달 주요 행사</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event: InfoItem) => (
                    <NewsCard key={event.id} item={event} color="indigo" />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4 col-span-full">검색 결과가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 중간 광고 광고 배너 */}
            <CoupangBanner bannerId="home-mid" />

            {/* 섹션 2: 나를 위한 지원금/혜택 */}
            <section className="space-y-6 pt-6">
              <div className="flex items-center gap-3 border-b-4 border-[#F25C05] pb-3">
                <span className="bg-[#F25C05] text-white text-xs font-black px-3 py-1 rounded">NEWS</span>
                <h2 className="text-2xl font-black text-[#F25C05]">지원금 및 생활 혜택</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBenefits.length > 0 ? (
                  filteredBenefits.map((benefit: InfoItem) => (
                    <NewsCard key={benefit.id} item={benefit} color="orange" />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4 col-span-full">검색 결과가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 섹션 3: 미래를 준비하는 AI 관련 지원 */}
            <section className="space-y-6 pt-6">
              <div className="flex items-center gap-3 border-b-4 border-[#2D3748] pb-3">
                <span className="bg-[#2D3748] text-white text-xs font-black px-3 py-1 rounded">TECH</span>
                <h2 className="text-2xl font-black text-[#2D3748]">AI 관련 지원 프로그램</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAiSupport.length > 0 ? (
                  filteredAiSupport.map((ai: InfoItem) => (
                    <NewsCard key={ai.id} item={ai} color="indigo" />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4 col-span-full">검색 결과가 없습니다.</p>
                )}
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-[#1D428A]">송파<span className="text-[#F25C05]">INFO</span></h2>
            <p className="text-gray-500 text-sm font-medium">송파구 소식을 정성껏 모아 전달하는 개인 운영 생활 정보 서비스입니다.</p>
            <p className="text-gray-400 text-xs">데이터 출처: 공공데이터포털 | 시스템 업데이트: {lastUpdated}</p>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#f5f6f8] rounded-full flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">📱</div>
            <div className="w-10 h-10 bg-[#f5f6f8] rounded-full flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">💻</div>
            <div className="w-10 h-10 bg-[#f5f6f8] rounded-full flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">📧</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

