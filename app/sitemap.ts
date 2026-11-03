import type { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/app/lib/db';
import { SITE_URL } from '@/app/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/deadlines`, changeFrequency: 'hourly', priority: 0.9 },
    ...subjects.map((s) => ({
      url: `${SITE_URL}/subjects/${s.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...deadlines.map((d) => ({
      url: `${SITE_URL}/deadlines/${d.id}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];
}
