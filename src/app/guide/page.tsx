import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "송파구 생활 가이드 · 공공 혜택 신청 완전 정복 | AI 송파 인포",
  description: "서울 송파구 생활 정보와 함께, 대부분의 주민이 놓치는 공공 지원금·혜택을 찾고 신청하는 실전 가이드를 담았습니다.",
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
            서울 송파구에서 알아두면 유용한 생활 정보와 함께,<br />
            대부분의 주민이 놓치는 공공 혜택을 찾고 신청하는 실전 방법을 안내합니다.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* 공공 혜택 실전 가이드 */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 mb-2">공공 혜택, 왜 대부분 놓치는가</h2>
          <p className="text-gray-400 text-sm mb-8">편집팀이 직접 정리한 실전 신청 가이드</p>

          <div className="space-y-8 text-gray-600 leading-8">
            <div>
              <h3 className="text-lg font-black text-gray-800 mb-3">① 흩어진 정보, 찾기 어려운 구조</h3>
              <p>
                서울시, 송파구청, 정부24, 복지로, 워크넷 — 각 기관이 제각각 자신의 혜택만 올리다 보니
                한 사람이 받을 수 있는 모든 지원을 한 번에 파악하는 것이 사실상 불가능합니다.
                실제로 중위소득 50% 이하 4인 가구가 받을 수 있는 공공 지원을 모두 합산하면
                월 150만 원이 넘는 경우도 있지만, 신청하지 않으면 받을 수 없습니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800 mb-3">② 내가 해당하는지 알기 어려운 소득 기준</h3>
              <p>
                "기준 중위소득 60% 이하"라는 문구를 처음 보면 막막합니다. 2026년 기준으로 풀어보면
                4인 가구 월 소득 약 <strong>329만 원 이하</strong>가 여기에 해당합니다. 1인 가구라면
                약 <strong>134만 원 이하</strong>입니다. 건강보험료 납부액을 기준으로 산정하는 경우가 많아
                실제 소득과 다르게 계산될 수 있으니, 신청 전 건강보험공단 홈페이지에서
                본인 납부 보험료를 먼저 확인하는 것이 순서입니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800 mb-3">③ 탈락하는 사람들의 3가지 공통점</h3>
              <ul className="space-y-3">
                {[
                  { label: "서류 한 장 부족", desc: "가족관계증명서, 건강보험료 납부확인서, 재직증명서 등을 사전에 발급받아두지 않아 신청 기한 내에 제출하지 못하는 경우. 정부24에서 미리 한꺼번에 발급받으면 됩니다." },
                  { label: "신청 기간을 놓침", desc: "많은 혜택이 '신청 후 지원'이 아닌 '예산 소진 시 마감' 방식입니다. 특히 청년 관련 사업은 선착순 마감이 많아, 공고가 뜨면 바로 신청하는 것이 원칙입니다." },
                  { label: "거주 요건 미충족", desc: "지원금 신청일 기준으로 주민등록이 해당 구에 되어 있어야 하는 경우가 많습니다. 이사를 앞두고 있다면 전입 신고를 먼저 하고 신청하세요." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4">
                    <span className="shrink-0 w-6 h-6 bg-[#F25C05] text-white rounded-full flex items-center justify-center text-xs font-black">{i + 1}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm mb-1">{item.label}</p>
                      <p className="text-gray-500 text-sm leading-6">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800 mb-3">④ 중복 수혜는 어디까지 가능한가</h3>
              <p>
                같은 성격의 혜택은 중복 수령이 안 됩니다. 예를 들어 서울청년수당과 청년도약계좌는
                동시에 받을 수 있지만, 청년내일저축계좌와 청년희망적금은 중복 불가입니다.
                헷갈린다면 복지로(bokjiro.go.kr) &gt; '복지서비스 모의계산'을 활용하세요.
                내 소득 수준을 입력하면 받을 수 있는 혜택 목록과 중복 가능 여부를 함께 알려줍니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800 mb-3">⑤ 신청부터 입금까지 현실적인 일정</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-4 font-bold text-gray-700">혜택 유형</th>
                      <th className="text-left py-2 font-bold text-gray-700">평균 소요 기간</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ["바우처 (국민행복카드 등)", "신청 후 7~14일"],
                      ["현금 지원 (청년수당 등)", "선정 후 1개월 이내"],
                      ["교육·훈련 프로그램", "선발 심사 후 1~3주"],
                      ["주거 지원 (전세금 보증 등)", "심사 2~6주 + 서류 준비"],
                      ["창업 지원금", "심사·발표·협약까지 2~4개월"],
                    ].map(([type, period], i) => (
                      <tr key={i}>
                        <td className="py-2.5 pr-4 text-gray-600">{type}</td>
                        <td className="py-2.5 font-bold text-[#1D428A]">{period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800 mb-3">⑥ 탈락 후 이의신청하는 법</h3>
              <p>
                탈락 통보를 받았다고 포기하지 마세요. 대부분의 공공 지원은 결과 통보 후
                <strong> 30일 이내</strong>에 이의신청이 가능합니다. 탈락 이유를 담당 부서에 문의하면
                반드시 서면 또는 구두로 설명해야 합니다. 서류 오류가 이유라면 재신청 기회를 주는 경우도 있습니다.
                이의신청서 양식은 해당 기관 홈페이지 민원 서식 코너에서 내려받을 수 있습니다.
              </p>
            </div>
          </div>
        </section>

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
          <Link href="/contact" className="hover:text-[#1D428A]">문의</Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-[#1D428A]">이용약관</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#1D428A]">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
