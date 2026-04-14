'use client';

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import data from "../../public/data/local-info.json";
import { InfoItem } from "@/components/NewsCard";
import CoupangBanner from "@/components/CoupangBanner";
import Header from "@/components/Header";
import VisitorCounter from "@/components/VisitorCounter";
import Script from "next/script";

// 인라인 카드 컴포넌트 (홈페이지 전용, 심플 카드)
function InfoCard({ item, accent }: { item: InfoItem; accent: string }) {
  const accentColor = accent === 'blue' ? '#1D428A' : accent === 'orange' ? '#F25C05' : '#2D3748';
  return (
    <a
      href={item.link && item.link !== '#' ? item.link : `/blog/${item.id}`}
      target={item.link && item.link !== '#' ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* 이미지 */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            {accent === 'blue' ? '🎫' : accent === 'orange' ? '💡' : '🤖'}
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span
          className="absolute top-3 left-3 text-white text-[10px] font-black px-2 py-1 rounded-md shadow"
          style={{ backgroundColor: accentColor }}
        >
          {item.category}
        </span>
      </div>
      {/* 본문 */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-base font-bold text-gray-800 group-hover:text-[#1D428A] transition-colors leading-snug mb-2 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-grow">
          {item.summary}
        </p>
        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-3">
          <span>📍 {item.location}</span>
          <span
            className="font-black text-[10px] px-2 py-1 rounded-full"
            style={{ color: accentColor, backgroundColor: `${accentColor}15` }}
          >
            자세히 →
          </span>
        </div>
      </div>
    </a>
  );
}

type TabKey = 'events' | 'benefits' | 'ai';

export default function Home() {
  const { events, benefits, aiSupport, lastUpdated } = data;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>('events');

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const monthString = currentMonth.toString().padStart(2, '0');

  const filterItems = (items: InfoItem[]) =>
    items.filter((item: InfoItem) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredEvents = filterItems(events as InfoItem[]);
  const filteredBenefits = filterItems(benefits as InfoItem[]);
  const filteredAiSupport = filterItems((aiSupport || []) as InfoItem[]);

  const tabs: { key: TabKey; label: string; emoji: string; color: string; count: number }[] = [
    { key: 'events', label: '송파구 이번달행사', emoji: '🎪', color: '#1D428A', count: filteredEvents.length },
    { key: 'benefits', label: '공공(전국)지원금·혜택', emoji: '💰', color: '#F25C05', count: filteredBenefits.length },
    { key: 'ai', label: 'AI 지원프로그램', emoji: '🤖', color: '#2D3748', count: filteredAiSupport.length },
  ];

  const currentItems =
    activeTab === 'events' ? filteredEvents :
    activeTab === 'benefits' ? filteredBenefits :
    filteredAiSupport;

  const currentAccent =
    activeTab === 'events' ? 'blue' :
    activeTab === 'benefits' ? 'orange' : 'dark';

  const eventJsonLd = (events as InfoItem[]).map((event) => ({
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

      <Header
        showSearch={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 히어로 배너 */}
      <header className="relative bg-gradient-to-br from-[#1D428A] via-[#1a3668] to-[#0d1f3c] py-16 px-6 overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F25C05] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-white/70 font-bold tracking-widest text-xs uppercase mb-4 inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            AI Songpa Info
          </p>
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-4 drop-shadow-md">
            AI 송파 <span className="text-[#F25C05]">인포</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg font-medium drop-shadow break-keep mb-8">
            우리 동네 행사·지원금·AI 프로그램을 한눈에 확인하세요
          </p>

          {/* 통계 뱃지 */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: '송파구 이번달행사', value: events.length, color: '#1D428A' },
              { label: '공공(전국)지원금·혜택', value: benefits.length, color: '#F25C05' },
              { label: 'AI 프로그램', value: (aiSupport || []).length, color: '#2D3748' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white">
                <span className="text-2xl font-black">{stat.value}</span>
                <span className="text-xs text-white/70 ml-2">{stat.label}</span>
              </div>
            ))}
          </div>
          <VisitorCounter />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: tab.color } : {}}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 카드 그리드 */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentItems.map((item: InfoItem) => (
              <InfoCard key={item.id} item={item} accent={currentAccent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-bold">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 쿠팡 배너 */}
        <div className="mt-12">
          <CoupangBanner />
        </div>

        {/* 블로그 바로가기 */}
        <div className="mt-12 bg-gradient-to-r from-[#1D428A] to-[#1a3668] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">송파 이야기 블로그</p>
            <h2 className="text-2xl font-black mb-1">더 자세한 이야기가 궁금하신가요?</h2>
            <p className="text-white/70 text-sm break-keep">각 항목의 상세 정보와 신청 방법을 블로그에서 확인하세요.</p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 bg-[#F25C05] hover:bg-[#d94e04] text-white font-black px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            블로그 보기 →
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#1D428A]">AI 송파 <span className="text-[#F25C05]">인포</span></h2>
            <p className="text-gray-500 text-sm font-medium">송파구 소식을 정성껏 모아 전달하는 개인 운영 생활 정보 서비스입니다.</p>
            <p className="text-gray-400 text-xs">데이터 출처: 공공데이터포털 | 마지막 업데이트: {lastUpdated}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/blog" className="text-xs font-bold text-gray-400 hover:text-[#1D428A] transition-colors">블로그</Link>
            <span className="text-gray-200">|</span>
            <Link href="/about" className="text-xs font-bold text-gray-400 hover:text-[#1D428A] transition-colors">소개</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
