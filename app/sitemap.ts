import type { MetadataRoute } from 'next';
import { getPostSlugs } from '@/lib/content';

const SITE_URL = 'https://akaushik.org';

// Home is the highest-authority page (everything links to it). Indexes
// (`/work`, `/writing`) and detail pages get slightly lower priority so
// search engines prefer surfacing the landing page in SERPs for branded
// queries.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const caseSlugs = getPostSlugs('case-studies');
  const writingSlugs = getPostSlugs('writing');

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const caseEntries: MetadataRoute.Sitemap = caseSlugs.map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const writingEntries: MetadataRoute.Sitemap = writingSlugs.map((slug) => ({
    url: `${SITE_URL}/writing/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...caseEntries, ...writingEntries];
}
