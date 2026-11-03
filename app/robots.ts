import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /login không chặn ở đây: cần để Google đọc được thẻ noindex của trang.
      disallow: ['/dashboard', '/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
