import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

/**
 * Both locales are real routes, so both are listed with an hreflang pair.
 * Add a URL here when a new route ships; nothing else needs to change.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.company.url;
  const lastModified = new Date();

  const languages = {
    'en-BH': `${base}${siteConfig.seo.routes.en}`,
    'ar-BH': `${base}${siteConfig.seo.routes.ar}`,
  };

  return [
    {
      url: `${base}${siteConfig.seo.routes.en}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${base}${siteConfig.seo.routes.ar}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
