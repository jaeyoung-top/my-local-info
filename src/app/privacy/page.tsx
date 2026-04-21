import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | AI 송파 인포",
  description: "AI 송파 인포의 개인정보처리방침을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-12 px-6 mb-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#1D428A] font-black text-sm tracking-widest uppercase mb-4 inline-block">Privacy Policy</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">개인정보처리방침</h1>
          <p className="text-gray-500 text-sm">시행일: 2026년 1월 1일 &nbsp;|&nbsp; 최종 수정일: 2026년 4월 21일</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-24 space-y-8">

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">1. 개요</h2>
          <p className="text-gray-600 leading-8">
            <strong>AI 송파 인포</strong>(이하 "본 사이트")는 개인정보보호법 및 관련 법령을 준수하며, 이용자의 개인정보를 보호합니다.
            본 방침은 본 사이트가 어떤 정보를 수집하고, 어떻게 활용하는지 투명하게 안내합니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">2. 수집하는 정보</h2>
          <p className="text-gray-600 leading-8 mb-4">
            본 사이트는 이용자로부터 직접 개인정보(이름, 이메일 등)를 수집하지 않습니다. 다만, 서비스 운영을 위해 아래와 같은 정보가 자동으로 수집될 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>방문 기록(IP 주소, 방문 날짜/시간, 페이지 URL)</li>
            <li>브라우저 종류 및 운영체제</li>
            <li>유입 경로(검색어, 이전 페이지)</li>
            <li>쿠키(Cookie) 및 유사 추적 기술을 통한 데이터</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">3. 정보 수집 목적</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 leading-8">
            <li>웹사이트 방문 통계 분석 및 서비스 개선</li>
            <li>이용자에게 관련성 높은 광고 제공 (Google AdSense)</li>
            <li>서비스 오류 진단 및 보안 유지</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">4. 쿠키(Cookie) 정책</h2>
          <p className="text-gray-600 leading-8 mb-4">
            쿠키는 웹사이트가 이용자의 브라우저에 저장하는 소량의 데이터 파일입니다. 본 사이트는 서비스 품질 향상 및 맞춤형 광고 제공을 위해 쿠키를 사용합니다.
          </p>
          <div className="bg-blue-50 rounded-xl p-5 space-y-3">
            <p className="font-bold text-gray-700">사용 중인 쿠키 종류</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
              <li><strong>필수 쿠키:</strong> 사이트 정상 작동을 위한 기술적 쿠키</li>
              <li><strong>분석 쿠키:</strong> Google Analytics — 방문자 통계 수집 (익명 처리)</li>
              <li><strong>광고 쿠키:</strong> Google AdSense — 이용자 관심사 기반 맞춤 광고 제공</li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm mt-4 leading-7">
            브라우저 설정에서 쿠키를 비활성화할 수 있으며, 이 경우 일부 기능이 정상 작동하지 않을 수 있습니다.
            Google의 광고 쿠키 사용을 거부하려면{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1D428A] font-semibold underline"
            >
              Google 광고 설정
            </a>
            에서 변경하실 수 있습니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">5. 제3자 서비스 이용</h2>
          <p className="text-gray-600 leading-8 mb-4">본 사이트는 아래의 제3자 서비스를 이용하며, 각 서비스는 독립적인 개인정보처리방침을 적용합니다.</p>
          <div className="space-y-4">
            {[
              {
                name: "Google AdSense",
                desc: "구글이 제공하는 광고 플랫폼으로, 쿠키를 사용하여 이용자의 관심사에 맞는 광고를 표시합니다.",
                link: "https://policies.google.com/privacy",
                linkText: "Google 개인정보처리방침"
              },
              {
                name: "Google Analytics",
                desc: "웹사이트 트래픽 분석 도구로, 방문자 통계를 수집하여 서비스 개선에 활용합니다. 수집 데이터는 익명으로 처리됩니다.",
                link: "https://policies.google.com/privacy",
                linkText: "Google 개인정보처리방침"
              },
              {
                name: "쿠팡 파트너스",
                desc: "쿠팡의 제휴 마케팅 프로그램으로, 본 사이트를 통한 쿠팡 구매 시 소정의 수수료가 지급될 수 있습니다. 이용자 구매 데이터는 쿠팡 정책에 따라 처리됩니다.",
                link: "https://www.coupang.com/np/landing/privacyPolicy.pang",
                linkText: "쿠팡 개인정보처리방침"
              }
            ].map((service) => (
              <div key={service.name} className="border border-gray-100 rounded-xl p-5">
                <p className="font-bold text-gray-800 mb-1">{service.name}</p>
                <p className="text-gray-600 text-sm leading-7">{service.desc}</p>
                <a href={service.link} target="_blank" rel="noopener noreferrer" className="text-[#1D428A] text-sm font-semibold underline mt-1 inline-block">
                  {service.linkText} →
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">6. 개인정보 보유 기간</h2>
          <p className="text-gray-600 leading-8">
            자동 수집되는 방문 로그 및 통계 데이터는 Google Analytics의 기본 보유 정책(최대 26개월)에 따릅니다.
            광고 관련 쿠키는 Google AdSense 정책에 따라 관리됩니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">7. 이용자의 권리</h2>
          <p className="text-gray-600 leading-8 mb-4">이용자는 다음의 권리를 가집니다.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>개인정보 처리 현황 열람 요청</li>
            <li>개인정보 처리 정지 요청</li>
            <li>광고 맞춤화 거부 (Google 광고 설정에서 직접 변경)</li>
            <li>브라우저를 통한 쿠키 삭제 및 거부</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">8. 미성년자 보호</h2>
          <p className="text-gray-600 leading-8">
            본 사이트는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
            만 14세 미만 아동은 보호자의 동의 없이 본 사이트를 이용하는 것을 권장하지 않습니다.
          </p>
        </section>

        <section className="bg-gradient-to-br from-[#1D428A]/5 to-[#F25C05]/5 rounded-2xl p-8 border border-[#1D428A]/10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">9. 개인정보 보호 책임자 및 문의</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>서비스명:</strong> AI 송파 인포</p>
            <p><strong>운영자:</strong> 개인 운영 서비스</p>
            <p>
              <strong>이메일:</strong>{" "}
              <a href="mailto:jypark@dooil.net" className="text-[#1D428A] font-semibold underline">
                jypark@dooil.net
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-4 leading-7">
              개인정보 관련 문의, 열람, 정정·삭제, 처리 정지 요청 등은 위 이메일로 연락주시기 바랍니다.
              개인정보보호 관련 추가 문의는{" "}
              <a
                href="https://www.privacy.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D428A] underline"
              >
                개인정보보호위원회 (privacy.go.kr)
              </a>
              에서도 도움받으실 수 있습니다.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">10. 방침 변경 안내</h2>
          <p className="text-gray-600 leading-8">
            본 개인정보처리방침은 법령 변경이나 서비스 정책 변경에 따라 수정될 수 있습니다.
            변경 시 본 페이지를 통해 공지하며, 변경된 방침은 게시된 날로부터 효력이 발생합니다.
          </p>
        </section>

      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <p className="text-gray-400 text-sm">© 2026 AI 송파 인포 | data.go.kr & Google Gemini 기반</p>
      </footer>
    </div>
  );
}
