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
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">게시글을 찾을 수 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3748] font-sans">
      <div className="bg-[#F25C05] text-white py-2 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm font-bold">
          <div className="flex gap-6">
            <Link href="/" className="cursor-pointer hover:underline">홈</Link>
            <Link href="/blog" className="cursor-pointer hover:underline">블로그</Link>
            <span className="cursor-pointer hover:underline">송파소식지</span>
            <span className="cursor-pointer hover:underline">구정안내</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <header className="mb-10 text-center border-b pb-8">
            {postData.category && (
              <span className="bg-[#F25C05] text-white text-xs font-black px-3 py-1 rounded inline-block mb-4">
                {postData.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{postData.title}</h1>
            <div className="text-gray-400 font-medium">
              <time>{postData.date}</time>
            </div>
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex gap-2 justify-center mt-4">
                {postData.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </header>
          
          <div className="prose prose-lg prose-blue max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {postData.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
