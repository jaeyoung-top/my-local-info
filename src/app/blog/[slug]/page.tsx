import Link from 'next/link';
import { marked } from 'marked';
import { getPostData, getAllPostSlugs } from '../../../lib/posts';

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
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

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#334155] font-sans selection:bg-[#F25C05] selection:text-white pb-20">
      <header className="py-6 px-4 md:px-8 max-w-5xl mx-auto flex justify-between items-center border-b border-[#f5ece1]/50 mb-6">
        <Link href="/blog" className="text-[#F25C05] font-black tracking-tight text-lg flex items-center gap-1 hover:text-[#d34b00] transition-colors">
          ← 블로그 목록
        </Link>
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
            <div className="text-[#94a3b8] font-medium text-[15px]">
              <time>{postData.date}</time>
            </div>
          </header>
          
          <div className="bg-white rounded-t-[36px] px-8 md:px-[60px] py-[50px] md:py-[64px]">
            <div 
              className="blog-article max-w-none text-[#475569]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
