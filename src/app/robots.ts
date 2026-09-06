import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

/**
 * Search index configuration. Generated rather than a static file, so the
 * sitemap URL follows siteConfig if the domain ever changes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /* Nothing to hide. There is no cart, no account area and no admin
           surface on this site. */
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteConfig.company.url}/sitemap.xml`,
    host: siteConfig.company.url,
  };
}
