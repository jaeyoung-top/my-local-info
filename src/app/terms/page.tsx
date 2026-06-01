import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | AI 송파 인포",
  description: "AI 송파 인포 서비스 이용약관입니다.",
};

const sections = [
  {
    title: "제1조 (목적)",
    content: `이 약관은 박재영(이하 "운영자")이 운영하는 AI 송파 인포(songpa-info.com, 이하 "서비스")의 이용 조건과 절차, 운영자와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (서비스의 성격)",
    content: `본 서비스는 서울특별시 송파구 주민 및 대한민국 국민을 대상으로 공공기관 공개 데이터, 지역 뉴스, 커뮤니티 정보를 수집·정리하여 제공하는 개인 운영 정보 큐레이션 서비스입니다. 운영자는 정보 제공의 정확성을 위해 노력하나, 공공 정책·지원금의 최종 조건은 반드시 해당 공공기관 공식 채널을 통해 확인하시기 바랍니다.`,
  },
  {
    title: "제3조 (이용자의 의무)",
    content: `이용자는 다음 행위를 하여서는 안 됩니다.\n① 본 서비스에 게시된 콘텐츠를 운영자의 동의 없이 무단으로 복제·배포·상업적으로 이용하는 행위\n② 서비스 운영을 방해하거나 서버에 과도한 부하를 주는 행위\n③ 타인의 권리를 침해하거나 법령에 위반되는 행위`,
  },
  {
    title: "제4조 (콘텐츠의 저작권)",
    content: `본 서비스에서 제공하는 편집 콘텐츠(안내문, 가이드, 블로그 글 등)의 저작권은 운영자에게 있습니다. 단, 공공기관의 공개 데이터를 기반으로 한 내용은 해당 공공기관에 원저작권이 있습니다. 인용 시 반드시 출처를 명시하시기 바랍니다.`,
  },
  {
    title: "제5조 (면책 조항)",
    content: `① 운영자는 천재지변, 서버 장애, 공공데이터 변경 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.\n② 이용자가 서비스 내 정보를 토대로 한 의사결정(지원금 신청, 상품 구매 등)의 결과에 대해 운영자는 법적 책임을 지지 않습니다. 중요한 사항은 반드시 해당 공공기관 또는 전문가에게 직접 확인하시기 바랍니다.\n③ 본 서비스에 포함된 쿠팡 파트너스 링크를 통한 구매 시 운영자에게 소정의 수수료가 지급될 수 있습니다.`,
  },
  {
    title: "제6조 (광고)",
    content: `본 서비스는 Google AdSense 및 쿠팡 파트너스 제휴 마케팅을 통해 광고 수익을 얻습니다. 광고 콘텐츠는 운영자의 편집 방침과 무관하며, 광고 클릭 여부는 이용자의 자유로운 선택에 달려 있습니다.`,
  },
  {
    title: "제7조 (개인정보 처리)",
    content: `이용자의 개인정보 수집·이용·보호에 관한 사항은 별도의 개인정보처리방침에 따릅니다.`,
  },
  {
    title: "제8조 (약관의 변경)",
    content: `운영자는 필요한 경우 본 약관을 변경할 수 있으며, 변경 시 서비스 내 공지사항을 통해 고지합니다. 변경된 약관은 공지 후 7일이 지난 시점부터 효력이 발생합니다.`,
  },
  {
    title: "제9조 (준거법 및 관할)",
    content: `본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련된 분쟁은 운영자의 소재지를 관할하는 법원을 제1심 법원으로 합니다.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans">
      <Header color="blue" />

      <header className="bg-white border-b border-gray-200 py-14 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-3">이용약관</h1>
          <p className="text-gray-400 text-sm">시행일: 2026년 1월 1일 · 최종 수정: 2026년 6월 1일</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
          {sections.map((sec) => (
            <section key={sec.title}>
              <h2 className="text-base font-black text-gray-800 mb-3">{sec.title}</h2>
              <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">{sec.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 flex gap-3 justify-center flex-wrap text-xs text-gray-400">
          <Link href="/" className="hover:text-[#1D428A]">홈</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-[#1D428A]">서비스 소개</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#1D428A]">개인정보처리방침</Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-[#1D428A]">문의하기</Link>
        </div>
      </main>
    </div>
  );
}
