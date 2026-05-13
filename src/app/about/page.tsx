import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 소개 | AI 송파 인포",
  description: "AI 송파 인포는 송파구 주민을 위해 지역 행사, 지원금, 혜택 정보와 대한민국 대표 커뮤니티 핫딜을 매일 선별·정리하는 생활 정보 큐레이션 서비스입니다.",
};

const faqs = [
  {
    q: "정보는 얼마나 자주 업데이트되나요?",
    a: "공공데이터포털, 송파구청 공식 채널 등 신뢰할 수 있는 공식 소스는 매일 1회 확인하여 최신 정보를 정리합니다. 핫딜은 FM코리아·퀘이사존·뽐뿌·루리웹·개드립·아카라이브에서 3시간마다 자동 수집됩니다. 마지막 업데이트 일시는 메인 페이지 하단에서 확인하실 수 있습니다."
  },
  {
    q: "지원금 신청 자격이 있는지 어떻게 확인하나요?",
    a: "각 항목의 '자세히 보기'를 클릭하면 상세 안내 글과 원문 출처 링크가 제공됩니다. 지원 조건과 자격 요건은 반드시 원문(구청 홈페이지, 공공데이터포털 등)에서 최종 확인하시기 바랍니다."
  },
  {
    q: "핫딜 정보는 어떻게 수집되나요?",
    a: "FM코리아, 퀘이사존, 뽐뿌, 루리웹, 개드립, 아카라이브 등 국내 주요 커뮤니티에서 공유되는 핫딜 정보를 3시간마다 자동 수집합니다. 각 딜의 원문 링크, 타 사이트 가격 비교, 가격 흐름 데이터도 함께 제공합니다. 가격·재고는 실시간으로 변동될 수 있으니 구매 전 반드시 확인하세요."
  },
  {
    q: "송파구 외 다른 지역 정보도 있나요?",
    a: "네, '공공(전국)지원금·혜택' 탭에서는 서울시 전체 또는 전국 단위의 공공 지원 정보를 제공합니다. 'AI 지원프로그램' 탭에서는 전국 대상 AI 교육 및 지원 사업도 확인하실 수 있습니다. 핫딜 또한 대한민국 대표 커뮤니티 기반으로 지역 제한 없이 제공됩니다."
  },
  {
    q: "블로그 글은 어떻게 작성되나요?",
    a: "공공기관의 공식 원문 데이터를 기반으로 주민이 실제로 필요한 신청 방법, 유의사항, 활용 팁 등을 알기 쉽게 정리하여 제공합니다. 모든 정보는 공식 출처를 명시하며, 정확한 내용은 원문 링크를 통해 최종 확인하실 것을 권장합니다."
  },
  {
    q: "정보가 부정확하거나 오류가 있으면 어떻게 하나요?",
    a: "jypark@dooil.net 으로 문의해 주시면 빠르게 확인 후 수정하겠습니다. 공공데이터 변경 사항은 즉시 반영될 수 있도록 노력하고 있습니다."
  },
  {
    q: "광고나 유료 프로그램을 홍보하나요?",
    a: "본 서비스는 특정 민간 업체나 유료 서비스를 홍보하지 않습니다. 소개되는 모든 행사·지원금·프로그램은 정부 및 공공기관이 운영하는 공식 정보입니다. 쿠팡 파트너스 제휴 링크를 통한 제품 안내는 별도로 표시됩니다."
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
    desc: "카드를 클릭하면 신청 방법, 유의사항, 활용 팁이 담긴 상세 안내 글 또는 공식 원문 링크로 이동합니다.",
    icon: "📋"
  },
  {
    step: "04",
    title: "블로그 활용",
    desc: "블로그 탭에서는 각 혜택의 신청 방법, 유의 사항, 활용 팁을 알기 쉽게 정리한 글을 확인할 수 있습니다.",
    icon: "📝"
  },
  {
    step: "05",
    title: "커뮤니티 핫딜 확인",
    desc: "상단 '🔥 핫딜' 메뉴에서 FM코리아·퀘이사존·뽐뿌 등 대한민국 대표 커뮤니티의 최신 핫딜을 한눈에 확인하세요. 가격 비교와 가격 흐름도 함께 제공됩니다.",
    icon: "🔥"
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
            송파INFO는 우리 동네의 활기찬 소식, 흩어져 있는 유용한 공공 혜택, 그리고 대한민국 대표 커뮤니티 핫딜까지 한눈에 모아보는{" "}
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
          <p className="text-gray-600 leading-8 text-lg break-keep mb-4">
            서울 송파구에는 매월 수십 가지의 문화 행사, 지역 축제, 주민 지원 프로그램이 운영되고 있습니다.
            하지만 정보가 여러 기관의 웹사이트에 분산되어 있어 주민들이 실질적인 혜택을 누리지 못하는 경우가 많습니다.
          </p>
          <p className="text-gray-600 leading-8 text-lg break-keep mb-4">
            AI 송파 인포는 공공기관의 공식 정보를 한 곳에 모아 주민이 쉽게 찾고, 바로 신청할 수 있도록
            안내하는 <strong>지역 생활 정보 허브</strong>입니다. 특히 육아 가정, 취업 준비생, 고령층, 소상공인 등
            지원이 필요한 분들이 놓치는 혜택 없이 적시에 신청하실 수 있도록 돕는 것이 목표입니다.
          </p>
          <p className="text-gray-600 leading-8 text-lg break-keep">
            더불어 FM코리아·퀘이사존·뽐뿌·루리웹·개드립·아카라이브 등 국내 주요 커뮤니티의
            <strong> 핫딜 정보</strong>를 3시간마다 자동 수집하여, 가격 비교·가격 흐름 분석과 함께 제공합니다.
            생활 정보와 알뜰 쇼핑 정보를 한 곳에서 확인하세요.
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
              <li>대한민국 공공데이터포털 (data.go.kr) — 정부 복지·지원 서비스 DB</li>
              <li>송파구청 공식 뉴스레터 및 홈페이지 (songpa.go.kr)</li>
              <li>정부24 및 각 부처 공식 사이트 (행정안전부, 복지부, 고용부 등)</li>
              <li>서울시 공공 데이터 포털 (data.seoul.go.kr)</li>
              <li>핫딜 커뮤니티 — FM코리아, 퀘이사존, 뽐뿌, 루리웹, 개드립, 아카라이브 (3시간 주기 자동 수집)</li>
            </ul>
            <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4">
              ※ 행사나 지원 정책의 상세 조건은 반드시 원문 링크를 통해 최종 확인하시기 바랍니다.
              요약·정리된 내용과 실제 정책 사이에 차이가 있을 수 있으므로, 신청 전 공식 안내문을 확인하시기 바랍니다.
            </p>
          </div>
        </section>

        {/* 편집 원칙 */}
        <section className="bg-gradient-to-br from-[#1D428A]/5 to-[#F25C05]/5 rounded-3xl p-8 md:p-12 border border-[#1D428A]/10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center text-sm">✍️</span>
            편집 원칙
          </h2>
          <p className="text-gray-600 leading-8 break-keep mb-6">
            AI 송파 인포는 단순한 데이터 나열이 아닌, <strong>주민의 실생활에 도움이 되는 방식</strong>으로
            정보를 재구성하는 것을 편집 원칙으로 삼고 있습니다.
            각 항목은 신청 대상, 신청 기간, 핵심 혜택, 주의사항을 일목요연하게 정리하여
            처음 접하는 분도 쉽게 이해하고 바로 행동할 수 있도록 제공합니다.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "🔍", title: "정확성 우선", desc: "모든 정보는 공식 기관 원문을 기반으로 하며, 출처를 명시합니다." },
              { icon: "💡", title: "이해하기 쉽게", desc: "어렵고 딱딱한 공공 문서를 주민이 바로 이해할 수 있도록 쉽게 풀어씁니다." },
              { icon: "⚡", title: "신속한 업데이트", desc: "새로운 정보가 등록되면 신속하게 검토·반영하여 최신 상태를 유지합니다." }
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
          <p className="text-gray-500 text-sm mb-6">
            아래 분야의 공공 혜택·행사를 매일 업데이트하여 제공합니다.
            현재 신청 가능한 프로그램을 메인 페이지에서 바로 확인하세요.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: "👶", label: "보육·육아 지원", desc: "출산·보육료 지원, 아이돌봄 서비스" },
              { icon: "🎓", label: "청년·취업 지원", desc: "취업장려금, 직업훈련, 청년수당" },
              { icon: "👴", label: "노인·어르신 복지", desc: "기초연금, 돌봄서비스, 여가 프로그램" },
              { icon: "🏠", label: "주거·임대 지원", desc: "임대주택, 주거급여, 이사비 지원" },
              { icon: "🎭", label: "문화·예술 행사", desc: "공연, 축제, 전시, 체험 프로그램" },
              { icon: "💼", label: "창업·소상공인 지원", desc: "창업자금, 컨설팅, 판로 개척 지원" },
              { icon: "🏥", label: "건강·의료 지원", desc: "무료 건강검진, 의료비 지원" },
              { icon: "📚", label: "교육·학습 프로그램", desc: "평생학습, 무료 강좌, 장학금" },
              { icon: "🤖", label: "AI·디지털 교육", desc: "AI 활용교육, 디지털 역량 강화" },
              { icon: "🔥", label: "대한민국 대표 커뮤니티 핫딜", desc: "FM코리아·퀘이사존·뽐뿌·루리웹 등 3시간 자동 수집" }
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-bold text-gray-700">{item.label}</span>
                </div>
                <p className="text-[11px] text-gray-400 pl-7">{item.desc}</p>
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
            누락된 혜택 제보, 정보 오류 수정 요청, 서비스 개선 의견이 있으시면 언제든지 연락해 주세요.
            주민분들의 피드백이 더 나은 서비스를 만드는 데 큰 도움이 됩니다.
          </p>
          <a
            href="mailto:jypark@dooil.net"
            className="inline-block bg-[#F25C05] hover:bg-[#d94e04] text-white font-black px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            이메일로 문의하기 →
          </a>
        </section>

        {/* 바로가기 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
          <Link href="/hotdeal" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">🔥</p>
            <p className="font-bold text-gray-800">핫딜 모음</p>
            <p className="text-gray-500 text-xs mt-1">3시간마다 자동 수집</p>
          </Link>
          <Link href="/guide" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">🗺️</p>
            <p className="font-bold text-gray-800">생활 가이드</p>
            <p className="text-gray-500 text-xs mt-1">동네 생활 정보</p>
          </Link>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <p className="text-gray-400 text-sm mb-3">© 2026 AI 송파 인포 | 공공데이터 기반 지역 생활 정보 서비스</p>
        <div className="flex justify-center gap-4 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-[#1D428A]">홈</Link>
          <span>|</span>
          <Link href="/blog" className="hover:text-[#1D428A]">블로그</Link>
          <span>|</span>
          <Link href="/hotdeal" className="hover:text-[#F25C05]">🔥 핫딜</Link>
          <span>|</span>
          <Link href="/guide" className="hover:text-[#1D428A]">생활 가이드</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-[#1D428A]">소개</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#1D428A] font-bold">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
