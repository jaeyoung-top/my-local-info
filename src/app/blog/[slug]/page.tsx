import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

      <main className="max-w-4xl mx-auto px-4 md:px-8">
        <article className="bg-[#FFFFFF] rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#f5ece1] p-8 md:p-16">
          <header className="mb-14">
            {postData.category && (
              <span className="bg-[#FFF0E6] text-[#F25C05] text-[14px] font-black tracking-wide px-4 py-1.5 rounded-full inline-block mb-6">
                {postData.category}
              </span>
            )}
            <h1 className="text-[32px] md:text-[42px] font-black text-[#1e293b] mb-6 leading-[1.3] break-keep tracking-tight">
              {postData.title}
            </h1>
            <div className="text-[#94a3b8] font-medium text-[15px]">
              <time>{postData.date}</time>
            </div>
          </header>
          
          <div className="prose max-w-none text-[#475569] leading-[2] tracking-normal text-[16px] md:text-[17px]
            prose-headings:text-[#1e293b] prose-headings:font-black prose-headings:mt-20 prose-headings:mb-8 prose-headings:tracking-tight
            prose-h2:text-[22px] prose-h3:text-[20px]
            prose-p:mb-12 prose-p:leading-[2.2]
            prose-a:text-[#F25C05] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#1e293b] prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mt-4 prose-ul:mb-8 prose-li:marker:text-[#cbd5e1] prose-li:my-4 prose-li:pl-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {postData.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
