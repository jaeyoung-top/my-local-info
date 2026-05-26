import Header from '@/components/Header';
import { getSortedPostsData } from '../../lib/posts';
import BlogListClient from './BlogListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '송파 이야기 블로그 | AI 송파 인포',
  description: '송파구 행사·지원금·혜택·AI 프로그램의 신청 방법과 실용 가이드를 정리한 블로그입니다.',
};

export default function BlogPage() {
  const posts = getSortedPostsData();
  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans">
      <Header />
      <BlogListClient posts={posts} />
    </div>
  );
}
