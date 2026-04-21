import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 소개 | AI 송파 인포",
  description: "AI 송파 인포는 송파구 주민을 위해 지역 행사, 지원금, 혜택 정보를 매일 자동 업데이트하는 생활 정보 서비스입니다.",
};

const faqs = [
  {
    q: "정보는 얼마나 자주 업데이트되나요?",
    a: "공공데이터포털 API와 Gemini AI를 활용하여 매일 아침 최신 정보를 자동으로 수집·갱신합니다. 마지막 업데이트 일시는 메인 페이지 하단에서 확인하실 수 있습니다."
  },
  {
    q: "지원금 신청 자격이 있는지 어떻게 확인하나요?",
    a: "각 항목의 '자세히 보기'를 클릭하면 원문 출처 링크가 제공됩니다. 지원 조건과 자격 요건은 반드시 원문(구청 홈페이지, 공공데이터포털 등)에서 최종 확인하시기 바랍니다."
  },
  {
    q: "송파구 외 다른 지역 정보도 있나요?",
    a: "네, '공공(전국)지원금·혜택' 탭에서는 서울시 전체 또는 전국 단위의 공공 지원 정보를 제공합니다. 'AI 지원프로그램' 탭에서는 전국 대상 AI 교육 및 지원 사업도 확인하실 수 있습니다."
  },
  {
    q: "블로그 글은 누가 작성하나요?",
    a: "블로그 글은 Google Gemini AI가 공공데이터 원문을 바탕으로 자동 작성합니다. AI가 생성한 내용임을 항상 표시하며, 모든 글은 공식 출처 데이터를 근거로 합니다."
  },
  {
    q: "정보가 부정확하거나 오류가 있으면 어떻게 하나요?",
    a: "jypark@dooil.net 으로 문의해 주시면 빠르게 확인 후 수정하겠습니다. 공공데이터 변경 사항은 즉시 반영될 수 있도록 노력하고 있습니다."
  }
];

const usageGuide = [
  {
    step: "01",
    title: "탭 선택",
    desc: "메인 페이지의 탭에서 '송파구 행사', '공공 지원금·혜택', 'AI 지원프로그램' 중 원하는 카테고리를 선택하세요.",
    icon: "🗂️"
  },
  {
    step: "02",
    title: "검색 활용",
    desc: "상단 검색창에 키워드(예: '청년', '문화', '취업')를 입력하면 관련 정보만 빠르게 필터링됩니다.",
    icon: "🔍"
  },
  {
    step: "03",
    title: "상세 정보 확인",
    desc: "카드를 클릭하면 AI가 정리한 상세 블로그 글 또는 원문 공식 링크로 이동합니다.",
    icon: "📋"
  },
  {
    step: "04",
    title: "블로그 활용",
    desc: "블로그 탭에서는 각 혜택의 신청 방법, 유의 사항, 활용 팁을 쉽게 풀어쓴 글을 확인할 수 있습니다.",
    icon: "📝"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-16 px-6 mb-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#F25C05] font-black text-sm tracking-widest uppercase mb-4 inline-block">About Songpa INFO</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 drop-shadow-sm">서비스 소개</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed break-keep">
            송파INFO는 우리 동네의 활기찬 소식과 흩어져 있는 유용한 공공 혜택을 한눈에 모아보는{" "}
            <strong>생활 정보 큐레이션 서비스</strong>입니다.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-10">

        {/* 운영 목적 */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#1D428A] text-white rounded-lg flex items-center justify-center text-sm">🎯</span>
            운영 목적
          </h2>
          <p className="text-gray-600 leading-8 text-lg break-keep">
            지역 주민들이 실질적으로 누릴 수 있는 다양한 혜택과 즐길 수 있는 행사 정보를 누락 없이 전달하기 위해 시작되었습니다.
            바쁜 일상 속에서 송파구청과 공공기관의 소중한 정보들이 묻히지 않도록, 가장 최신의 정보를 선별하여 제공합니다.
          </p>
        </section>

        {/* 데이터 출처 */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#F25C05] text-white rounded-lg flex items-center justify-center text-sm">📊</span>
            데이터 출처 및 투명성
          </h2>
          <div className="space-y-4 text-gray-600 leading-8">
            <p>본 서비스에서 제공하는 모든 정보는 다음과 같은 신뢰할 수 있는 공식 출처를 기반으로 합니다:</p>
            <ul className="list-disc list-inside space-y-2 font-medium">
              <li>대한민국 공공데이터포털 (data.go.kr)</li>
              <li>송파구청 공식 뉴스레터 및 홈페이지 (songpa.go.kr)</li>
              <li>정부24 및 각 부처 공식 사이트</li>
            </ul>
            <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4">
              ※ 행사나 지원 정책의 상세 조건은 반드시 원문 링크를 통해 최종 확인하시기 바랍니다. AI가 요약한 내용과 실제 정책 사이에 차이가 있을 수 있습니다.
            </p>
          </div>
        </section>

        {/* AI 기술 활용 */}
        <section className="bg-gradient-to-br from-[#1D428A]/5 to-[#F25C05]/5 rounded-3xl p-8 md:p-12 border border-[#1D428A]/10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center text-sm">🤖</span>
            AI 기술 활용 방식
          </h2>
          <p className="text-gray-600 leading-8 break-keep mb-6">
            송파INFO는 수많은 공공데이터 중 주민들에게 꼭 필요한 핵심만을 요약하고, 친숙한 블로그 형태로 전달하기 위해{" "}
            <strong>Gemini AI 기술</strong>을 활용하고 있습니다. AI는 정보를 분석하고 읽기 쉽게 가공하는 역할을 수행하며,
            모든 글은 공공데이터 원문의 팩트를 기반으로 생성됩니다.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "🔄", title: "매일 자동 수집", desc: "GitHub Actions로 매일 아침 최신 데이터를 자동으로 가져옵니다." },
              { icon: "✍️", title: "AI 글 자동 작성", desc: "Gemini AI가 공공데이터를 읽기 쉬운 블로그 글로 변환합니다." },
              { icon: "🚀", title: "즉시 배포", desc: "Cloudflare Pages를 통해 변경 사항이 즉시 반영됩니다." }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-500 text-sm leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 사용 방법 */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">💡</span>
            이렇게 활용하세요
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {usageGuide.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-[#1D428A]/10 rounded-xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#F25C05] tracking-widest mb-1">STEP {item.step}</p>
                  <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-6">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 지원 정보 안내 */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">🏛️</span>
            주요 공공 지원 분야
          </h2>
          <p className="text-gray-500 text-sm mb-6">본 서비스에서 다루는 주요 지원 및 혜택 분야를 소개합니다.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: "👶", label: "보육·육아 지원" },
              { icon: "🎓", label: "청년·취업 지원" },
              { icon: "👴", label: "노인·어르신 복지" },
              { icon: "🏠", label: "주거·임대 지원" },
              { icon: "🎭", label: "문화·예술 행사" },
              { icon: "💼", label: "창업·소상공인 지원" },
              { icon: "🏥", label: "건강·의료 지원" },
              { icon: "📚", label: "교육·학습 프로그램" },
              { icon: "🤖", label: "AI·디지털 교육" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#F25C05] text-white rounded-lg flex items-center justify-center text-sm">❓</span>
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <p className="font-bold text-gray-800 mb-2">Q. {faq.q}</p>
                <p className="text-gray-600 leading-7 text-sm">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 문의 */}
        <section className="bg-gradient-to-r from-[#1D428A] to-[#1a3668] rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">문의 및 피드백</h2>
          <p className="text-white/80 leading-7 mb-6 text-sm">
            정보 오류, 누락된 혜택, 서비스 개선 의견이 있으시면 언제든지 연락해 주세요.
            여러분의 피드백이 더 나은 서비스를 만드는 데 큰 도움이 됩니다.
          </p>
          <a
            href="mailto:jypark@dooil.net"
            className="inline-block bg-[#F25C05] hover:bg-[#d94e04] text-white font-black px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            이메일로 문의하기 →
          </a>
        </section>

        {/* 바로가기 */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">🏠</p>
            <p className="font-bold text-gray-800">메인 홈</p>
            <p className="text-gray-500 text-xs mt-1">전체 정보 한눈에</p>
          </Link>
          <Link href="/blog" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">📝</p>
            <p className="font-bold text-gray-800">블로그</p>
            <p className="text-gray-500 text-xs mt-1">상세 정보 읽기</p>
          </Link>
          <Link href="/privacy" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">🔒</p>
            <p className="font-bold text-gray-800">개인정보처리방침</p>
            <p className="text-gray-500 text-xs mt-1">정보 보호 안내</p>
          </Link>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <p className="text-gray-400 text-sm mb-3">© 2026 AI 송파 인포 | data.go.kr & Google Gemini 기반</p>
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#1D428A]">홈</Link>
          <span>|</span>
          <Link href="/blog" className="hover:text-[#1D428A]">블로그</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-[#1D428A]">소개</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#1D428A] font-bold">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
