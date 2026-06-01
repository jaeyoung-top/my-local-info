import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 | AI 송파 인포",
  description: "AI 송파 인포 운영팀에 문의하세요. 정보 오류 제보, 서비스 개선 의견, 제휴 문의를 받고 있습니다.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans">
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-14 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[#F25C05] font-black text-xs tracking-widest uppercase mb-3 inline-block">Contact</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">문의하기</h1>
          <p className="text-gray-500 text-base leading-relaxed break-keep">
            정보 오류 제보, 서비스 개선 의견, 누락된 혜택 제보를 환영합니다.<br />
            이메일로 문의 주시면 확인 후 빠르게 답변드립니다.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* 운영자 정보 */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6">운영자 정보</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-20 font-bold text-gray-400">서비스명</span>
              <span>AI 송파 인포 (songpa-info.com)</span>
            </div>
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-20 font-bold text-gray-400">운영자</span>
              <span>박재영</span>
            </div>
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-20 font-bold text-gray-400">이메일</span>
              <a href="mailto:jaeyoungpark@dooil.net" className="text-[#1D428A] font-bold hover:underline">
                jaeyoungpark@dooil.net
              </a>
            </div>
            <div className="flex gap-4 items-start">
              <span className="shrink-0 w-20 font-bold text-gray-400">소재지</span>
              <span>서울특별시 송파구</span>
            </div>
          </div>
        </section>

        {/* 문의 유형 */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6">문의 유형별 안내</h2>
          <div className="space-y-5">
            {[
              {
                icon: "🔍",
                title: "정보 오류 제보",
                desc: "지원금 금액, 신청 기간, 자격 요건 등에 오류가 있을 경우 알려주세요. 확인 후 즉시 수정합니다.",
              },
              {
                icon: "💡",
                title: "누락 혜택 제보",
                desc: "아직 등록되지 않은 지원금·행사·혜택 정보가 있다면 공식 출처 링크와 함께 제보해 주세요.",
              },
              {
                icon: "✍️",
                title: "서비스 개선 의견",
                desc: "더 나은 서비스를 위한 제안이나 불편한 점을 자유롭게 보내주세요.",
              },
              {
                icon: "🤝",
                title: "제휴 및 협업 문의",
                desc: "콘텐츠 제휴, 공공기관 협업, 기타 비즈니스 문의는 이메일로 연락해 주세요.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-6">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 이메일 CTA */}
        <div className="bg-gradient-to-r from-[#1D428A] to-[#1a3668] rounded-2xl p-8 text-white text-center">
          <p className="font-black text-xl mb-2">📬 이메일로 문의하기</p>
          <p className="text-white/70 text-sm mb-5">
            평일 기준 1~2일 내 답변드립니다.
          </p>
          <a
            href="mailto:jaeyoungpark@dooil.net"
            className="inline-block bg-[#F25C05] hover:bg-[#d94e04] text-white font-black px-8 py-3.5 rounded-xl transition-all hover:scale-105 text-sm"
          >
            jaeyoungpark@dooil.net
          </a>
        </div>

        {/* 바로가기 */}
        <div className="flex gap-3 justify-center flex-wrap text-xs text-gray-400">
          <Link href="/" className="hover:text-[#1D428A]">홈</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-[#1D428A]">서비스 소개</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#1D428A]">개인정보처리방침</Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-[#1D428A]">이용약관</Link>
        </div>

      </main>
    </div>
  );
}
