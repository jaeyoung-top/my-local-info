import Link from 'next/link';
import { marked } from 'marked';
import { getPostData, getAllPostSlugs } from '../../../lib/posts';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

import { Metadata } from 'next';

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = getPostData(resolvedParams.slug);

  if (!postData) {
    return {
      title: "게시글을 찾을 수 없습니다.",
    };
  }

  return {
    title: postData.title,
    description: postData.summary || postData.content.substring(0, 150),
  };
}

export default async function BlogPost({ params }: Params) {
  const resolvedParams = await params;
  const postData = getPostData(resolvedParams.slug);

  if (!postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F2]">
        <h1 className="text-2xl font-bold">게시글을 찾을 수 없습니다.</h1>
      </div>
    );
  }

  // Markdown을 HTML로 변환 (빌드 시점에 실행됨)
  const htmlContent = marked.parse(postData.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postData.title,
    "datePublished": postData.date,
    "description": postData.summary,
    "author": {
      "@type": "Organization",
      "name": "송파구 생활 정보"
    },
    "publisher": {
      "@type": "Organization",
      "name": "송파구 생활 정보"
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#334155] font-sans selection:bg-[#F25C05] selection:text-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="py-6 px-4 md:px-8 max-w-5xl mx-auto flex justify-between items-center border-b border-[#f5ece1]/50 mb-6">
        <div className="flex gap-4">
          <Link href="/blog" className="text-[#F25C05] font-black tracking-tight text-lg flex items-center gap-1 hover:text-[#d34b00] transition-colors">
            ← 블로그 목록
          </Link>
          <Link href="/about" className="text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors pt-1">
            소개
          </Link>
        </div>
        <Link href="/" className="text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors">
          홈으로
        </Link>
      </header>

      <main className="max-w-[880px] mx-auto px-4 md:px-8">
        <article className="bg-[#FCF8F3] rounded-[36px] overflow-hidden shadow-[0_2px_18px_-4px_rgba(0,0,0,0.04)] mb-20">
          <header className="px-8 md:px-[60px] py-[50px] md:py-[60px]">
            {postData.category && (
              <span className="bg-[#FFF0E6] text-[#F25C05] text-[13.5px] font-[800] tracking-wide px-4 py-[6px] rounded-full inline-block mb-6">
                {postData.category}
              </span>
            )}
            <h1 className="text-[34px] md:text-[44px] font-[800] text-[#111827] mb-[22px] leading-[1.35] break-keep tracking-[-0.02em]">
              {postData.title}
            </h1>
            <div className="flex justify-between items-center text-[#94a3b8] font-medium text-[15px]">
              <time>{postData.date}</time>
              <span className="text-xs">최종 업데이트: {postData.date}</span>
            </div>
          </header>
          
          <div className="bg-white rounded-t-[36px] px-8 md:px-[60px] py-[50px] md:py-[64px]">
            <div 
              className="blog-article max-w-none text-[#475569]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            
            {/* 본문 하단 광고 */}
            <AdBanner />
            <CoupangBanner />
            
            {/* E-E-A-T Footer */}
            <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-400 space-y-4">
              <p className="leading-relaxed">
                이 글은 공공데이터포털(<a href="http://data.go.kr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">data.go.kr</a>)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.
              </p>
              {postData.source && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-bold text-gray-500 mr-2">🔗 원문 출처:</span>
                  <a href={postData.source} target="_blank" rel="noopener noreferrer" className="text-[#F25C05] hover:underline break-all">
                    {postData.source}
                  </a>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
