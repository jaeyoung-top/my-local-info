import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  preload: false,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI 송파 인포",
  "url": "https://songpa-info.com",
  "description": "송파구 & 서울 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보"
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://songpa-info.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "블로그",
      "item": "https://songpa-info.com/blog"
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL("https://songpa-info.com"),
  title: "AI 송파 인포 | 행사·혜택·지원금 안내",
  description: "송파구 & 서울 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "AI 송파 인포 | 행사·혜택·지원금 안내",
    description: "송파구 & 서울 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://songpa-info.com",
    siteName: "AI 송파 인포",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-4233694153840183"}`}
          crossOrigin="anonymous"
        />
        {process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== "나중에_입력" && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="json-ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-noto-sans-kr)]">{children}</body>
    </html>
  );
}
