import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '../lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://songpa-info.com';

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/benefits`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ai-support`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
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
