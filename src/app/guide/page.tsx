import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "송파구 생활 가이드 | AI 송파 인포",
  description: "서울 송파구의 행정동, 주요 시설, 교통, 복지 서비스 등 송파구 생활에 꼭 필요한 정보를 한눈에 정리했습니다.",
};

const dongs = [
  { name: "잠실동", desc: "롯데월드, 석촌호수, 잠실종합운동장 등 송파 대표 명소가 밀집된 중심지", highlight: "잠실역(2·8호선)" },
  { name: "송파동·가락동", desc: "가락시장(농산물·수산물 도매), 방이동 먹자골목 등 생활 편의 인프라 우수", highlight: "가락시장역(8호선)" },
  { name: "문정동·장지동", desc: "가든파이브 복합쇼핑몰, 법조단지, 위례신도시 접근성 좋은 신흥 주거지", highlight: "문정역·장지역(8호선)" },
  { name: "거여동·마천동", desc: "청정 자연환경과 조용한 주거환경, 남한산성 등산로 근접, 상대적으로 저렴한 주거비", highlight: "거여역·마천역(5호선)" },
  { name: "오금동·방이동", desc: "올림픽공원 인근, 방이동 생태경관보전지역, 체육·문화 인프라 풍부", highlight: "오금역(3·5호선)" },
  { name: "풍납동·천호동 접경", desc: "풍납토성(백제 유적), 한강변 자전거도로, 천호공원 근접 주거지", highlight: "풍납토성역(5호선)" },
];

const welfare = [
  {
    category: "출산·보육",
    icon: "👶",
    items: [
      "첫만남이용권 — 출생아 1인당 200만 원 바우처 지급",
      "부모급여 — 만 0세 월 100만 원 / 만 1세 월 50만 원",
      "송파구 출산 축하금 — 둘째 이상 출산 시 구비 추가 지원",
      "아이돌봄서비스 — 가정 방문 돌봄, 소득 구간별 지원",
      "공동육아나눔터 — 송파구 내 5개소 운영, 무료 이용 가능",
    ]
  },
  {
    category: "청년 지원",
    icon: "🎓",
    items: [
      "서울청년수당 — 미취업 청년(19~34세) 월 50만 원, 6개월 지원",
      "청년 취업사관학교 — IT·디지털·디자인 무료 직업훈련",
      "청년 월세 지원 — 보증금 없이 월세 거주 청년, 월 20만 원 최대 12개월",
      "송파구 청년 창업지원 — 초기 창업 공간 및 멘토링 프로그램",
    ]
  },
  {
    category: "어르신 복지",
    icon: "👴",
    items: [
      "기초연금 — 65세 이상 소득하위 70%, 최대 월 33만 4천 원",
      "노인맞춤돌봄서비스 — 안전확인·생활지원·가사지원 서비스",
      "경로당 — 송파구 내 200여 개 운영, 무료 식사·여가 프로그램",
      "노인 일자리 — 공익활동·사회서비스 등 다양한 유형, 월 27만 원~",
      "어르신 무료 건강검진 — 송파구 보건소, 연 1회 종합검진",
    ]
  },
  {
    category: "장애인 지원",
    icon: "♿",
    items: [
      "장애인 활동지원서비스 — 일상생활·사회활동 지원",
      "장애인 이동지원 — 특별교통수단 바우처택시 운행",
      "장애인 취업성공패키지 — 취업 훈련·알선·수당 패키지 지원",
      "발달장애인 주간활동서비스 — 낮 시간 활동 프로그램 지원",
    ]
  },
];

const facilities = [
  { name: "송파구청", address: "가락로 190", phone: "02-2147-2114", desc: "민원, 행정 서비스 전반" },
  { name: "송파보건소", address: "오금로 216", phone: "02-2147-3000", desc: "예방접종, 건강검진, 방문건강관리" },
  { name: "송파구립도서관", address: "올림픽로 326(잠실)", phone: "02-2147-2940", desc: "열람·대출, 평생학습 강좌" },
  { name: "가락시장", address: "양재대로 932", phone: "02-3435-1000", desc: "새벽 경매, 소비자 직거래 가능" },
  { name: "올림픽공원", address: "올림픽로 424", phone: "02-410-1114", desc: "88잔디마당, 몽촌토성, 각종 공연" },
  { name: "서울 아산병원", address: "올림픽로 43길 88", phone: "1688-7575", desc: "3차 의료기관, 응급의료센터 운영" },
];

const transport = [
  { line: "2호선", stations: "잠실·신천·종합운동장", color: "#00A84D", desc: "강남·홍대·신촌 직결" },
  { line: "3호선", stations: "오금·수서·대청", color: "#EF7C1C", desc: "강남·종로 방면" },
  { line: "5호선", stations: "거여·마천·오금·개롱·굽은다리·명일", color: "#996CAC", desc: "김포공항 직결" },
  { line: "8호선", stations: "잠실·석촌·송파·가락시장·문정·장지", color: "#E51D23", desc: "복정·모란 방면" },
  { line: "9호선", stations: "올림픽공원·방이·둔촌오류", color: "#C8A535", desc: "급행 — 김포공항·여의도 30분대" },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      <Header color="blue" />

      <header className="bg-gradient-to-br from-[#1D428A] to-[#0d1f3c] py-16 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-white/60 font-bold text-xs tracking-widest uppercase mb-4 inline-block">Songpa-gu Living Guide</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">송파구 생활 가이드</h1>
          <p className="text-white/80 text-lg font-medium break-keep">
            서울 송파구에서 알아두면 유용한 생활 정보를 한눈에 정리했습니다.
            행정·복지·교통·의료 정보까지 이웃처럼 안내해 드립니다.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* 송파구 소개 */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-4">송파구는 어떤 동네인가요?</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-8">
            <p>
              서울특별시 송파구는 한강 남쪽, 서울 동남권에 위치한 자치구로 면적 약 33.9㎢, 인구 약 66만 명의
              서울에서 <strong>인구가 가장 많은 자치구</strong> 중 하나입니다. 행정동은 총 26개동으로 구성되어 있습니다.
            </p>
            <p>
              잠실종합운동장, 롯데월드, 석촌호수, 올림픽공원 등 서울을 대표하는 문화·관광·체육 인프라가 밀집해 있으며,
              가락농수산물도매시장, 문정법조타운, IT 기업 집적지 등 경제 중심지로서의 기능도 갖추고 있습니다.
            </p>
            <p>
              백제 초기 왕성인 <strong>풍납토성</strong>과 <strong>몽촌토성</strong>이 위치해 있어
              2000년 이상의 역사를 품은 동네이기도 합니다.
              1988년 서울올림픽 주요 시설이 위치했던 지역으로, 한국 근현대사의 상징적인 공간이기도 합니다.
            </p>
          </div>
        </section>

        {/* 주요 행정동 */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-2">주요 행정동 특징</h2>
          <p className="text-gray-500 text-sm mb-6">거주지 선택 또는 이사 계획 시 참고하세요.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {dongs.map((dong) => (
              <div key={dong.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-gray-800 text-lg">{dong.name}</h3>
                  <span className="text-[11px] bg-[#1D428A]/10 text-[#1D428A] font-bold px-2 py-1 rounded-full">{dong.highlight}</span>
                </div>
                <p className="text-gray-500 text-sm leading-6">{dong.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 교통 */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-2">지하철 노선 안내</h2>
          <p className="text-gray-500 text-sm mb-6">송파구를 지나는 5개 노선으로 서울 전역 접근이 편리합니다.</p>
          <div className="space-y-3">
            {transport.map((t) => (
              <div key={t.line} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <span
                  className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-sm text-center leading-tight"
                  style={{ backgroundColor: t.color }}
                >
                  {t.line}
                </span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.stations}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 복지 서비스 */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-2">생애주기별 주요 복지 서비스</h2>
          <p className="text-gray-500 text-sm mb-6">
            아래 정보는 대표적인 복지 제도를 소개한 것입니다.
            정확한 신청 자격·금액은 <strong>복지로(bokjiro.go.kr)</strong> 또는 송파구청에서 확인하세요.
          </p>
          <div className="space-y-6">
            {welfare.map((w) => (
              <div key={w.category} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">{w.icon}</span>
                  {w.category}
                </h3>
                <ul className="space-y-2">
                  {w.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 leading-6">
                      <span className="text-[#F25C05] font-bold shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 주요 시설 */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-2">알아두면 유용한 주요 시설</h2>
          <p className="text-gray-500 text-sm mb-6">주요 공공시설 연락처 및 위치 안내입니다.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <div key={f.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="font-black text-gray-800 mb-1">{f.name}</p>
                <p className="text-xs text-gray-400 mb-2">{f.desc}</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>📍 {f.address}</p>
                  <p>📞 {f.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 송파구 유용한 앱·사이트 */}
        <section>
          <h2 className="text-2xl font-black text-gray-800 mb-6">송파구민이라면 알아두세요</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "복지로", url: "bokjiro.go.kr", desc: "내가 받을 수 있는 복지 서비스를 한 번에 조회·신청" },
              { title: "정부24", url: "gov.kr", desc: "각종 민원 서류 온라인 발급·신청" },
              { title: "서울복지포털", url: "wis.seoul.go.kr", desc: "서울시 복지 서비스 통합 안내" },
              { title: "송파구청", url: "songpa.go.kr", desc: "송파구 공식 행사·구정 소식·민원 안내" },
              { title: "워크넷", url: "work.go.kr", desc: "일자리 검색, 취업지원 서비스" },
              { title: "국민건강보험", url: "nhis.or.kr", desc: "건강보험료 조회, 건강검진 안내" },
            ].map((site) => (
              <div key={site.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#1D428A]/10 rounded-lg flex items-center justify-center shrink-0 text-[#1D428A] font-black text-xs">
                  {site.title.slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{site.title} <span className="text-gray-400 font-normal text-xs">({site.url})</span></p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-5">{site.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#1D428A] to-[#1a3668] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-black mb-2">지금 받을 수 있는 혜택을 확인하세요</h2>
          <p className="text-white/70 mb-6 text-sm">매일 업데이트되는 송파구 행사·지원금·AI 프로그램 정보</p>
          <Link
            href="/"
            className="inline-block bg-[#F25C05] hover:bg-[#d94e04] text-white font-black px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            혜택 바로 확인하기 →
          </Link>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <p className="text-gray-400 text-sm mb-2">본 가이드의 시설 정보·복지 내용은 참고용이며, 정확한 정보는 해당 기관에 직접 문의하시기 바랍니다.</p>
        <p className="text-gray-400 text-sm mb-3">© 2026 AI 송파 인포</p>
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#1D428A]">홈</Link>
          <span>|</span>
          <Link href="/blog" className="hover:text-[#1D428A]">블로그</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-[#1D428A]">소개</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#1D428A]">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
