import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      {/* 1. 최상단 네비게이션 바 (통일된 스타일) */}
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-16 px-6 mb-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#F25C05] font-black text-sm tracking-widest uppercase mb-4 inline-block">About Songpa INFO</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 drop-shadow-sm">서비스 소개</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed break-keep">
            송파INFO는 우리 동네의 활기찬 소식과 흩어져 있는 유용한 공공 혜택을 한눈에 모아보는 <strong>생활 정보 큐레이션 서비스</strong>입니다.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid gap-12">
          {/* 섹션 1: 운영 목적 */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
               <span className="w-8 h-8 bg-[#1D428A] text-white rounded-lg flex items-center justify-center text-sm">🎯</span>
               운영 목적
            </h2>
            <p className="text-gray-600 leading-8 text-lg break-keep">
              지역 주민들이 실질적으로 누릴 수 있는 다양한 혜택과 즐길 수 있는 행사 정보를 누락 없이 전달하기 위해 시작되었습니다. 바쁜 일상 속에서 송파구청과 공공기관의 소중한 정보들이 묻히지 않도록, 가장 최신의 정보를 선별하여 제공합니다.
            </p>
          </section>

          {/* 섹션 2: 데이터 출처 및 투명성 */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
               <span className="w-8 h-8 bg-[#F25C05] text-white rounded-lg flex items-center justify-center text-sm">📊</span>
               데이터 출처 및 투명성
            </h2>
            <div className="space-y-6 text-gray-600 leading-8">
              <p>본 서비스에서 제공하는 모든 정보는 다음과 같은 신뢰할 수 있는 공식 출처를 기반으로 합니다:</p>
              <ul className="list-disc list-inside space-y-2 font-medium">
                <li>대한민국 공공데이터포털 (data.go.kr)</li>
                <li>송파구청 공식 뉴스레터 및 홈페이지 (songpa.go.kr)</li>
              </ul>
              <p className="text-sm text-gray-400">※ 행사나 지원 정책의 상세 조건은 반드시 원문 링크를 통해 최종 확인하시기 바랍니다.</p>
            </div>
          </section>

          {/* 섹션 3: AI 기술 활용 방식 */}
          <section className="bg-gradient-to-br from-[#1D428A]/5 to-[#F25C05]/5 rounded-3xl p-8 md:p-12 border border-[#1D428A]/10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
               <span className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center text-sm">🤖</span>
               AI 기술 활용 방식
            </h2>
            <p className="text-gray-600 leading-8 break-keep">
              송파INFO는 수많은 공공데이터 중 주민들에게 꼭 필요한 핵심만을 요약하고, 친숙한 블로그 형태로 전달하기 위해 <strong>Gemini AI 기술</strong>을 활용하고 있습니다. AI는 정보를 분석하고 읽기 쉽게 가공하는 역할을 수행하며, 모든 글은 공공데이터 원문의 팩트를 기반으로 생성됩니다.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <p className="text-gray-400 text-sm">© 2026 송파구 생활 정보 알리미 (송파INFO) | data.go.kr & Google Gemini 기반</p>
      </footer>
    </div>
  );
}
