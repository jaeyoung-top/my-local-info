import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '../lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-local-info-48r.pages.dev';

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
  ];

  const postSlugs = getAllPostSlugs();
  const postRoutes = postSlugs.map((post) => ({
    url: `${baseUrl}/blog/${post.params.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...postRoutes];
}
