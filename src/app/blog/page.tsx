import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default function BlogList() {
  const allPostsData = getSortedPostsData();

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

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-[#1D428A] mb-8 border-b-4 border-[#1D428A] inline-block pb-2">송파 이야기 블로그</h1>
        
        <div className="grid gap-6">
          {allPostsData.length === 0 ? (
            <p className="text-gray-500">아직 등록된 게시글이 없습니다.</p>
          ) : (
            allPostsData.map(({ slug, title, date, summary, category }) => (
              <Link href={`/blog/${slug}`} key={slug} className="block bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    {category && <span className="bg-[#1D428A] text-white text-[10px] font-black px-2 py-1 rounded">{category}</span>}
                    <span className="text-gray-400 text-sm font-bold">{date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                  <p className="text-gray-500">{summary}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
