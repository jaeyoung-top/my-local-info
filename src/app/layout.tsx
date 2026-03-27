import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: "송파구 생활 정보 알리미",
  description: "우리 동네의 생생한 행사, 축제 및 지원금 소식을 전해드립니다.",
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
      <body className="min-h-full flex flex-col font-[var(--font-noto-sans-kr)]">{children}</body>
    </html>
  );
}
