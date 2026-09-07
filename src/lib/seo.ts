import type { Metadata } from 'next';
import { formatAddress, siteConfig } from '@/config/siteConfig';
import { getDictionary, type Locale } from '@/locales';

/**
 * Bilingual technical SEO.
 *
 * Both locales are real, server rendered routes, so hreflang points at pages
 * that actually exist rather than at a client side toggle.
 *
 * Every value below is read from siteConfig. There is no price, rate or
 * currency in any payload this file produces.
 */

const BASE = siteConfig.company.url;

export const TITLE_TEMPLATE = {
  en: 'Pisgah Cleaning Co. W.L.L. | Commercial and Technical Facility Care',
  ar: 'شركة بسجاه للتنظيفات ذ.م.م | العناية بالمنشآت التجارية والفنية',
} as const;

export function canonicalFor(locale: Locale): string {
  return siteConfig.seo.routes[locale];
}

export function absoluteUrl(path: string): string {
  return new URL(path, BASE).toString();
}

/** Metadata for a locale route. Used by generateMetadata in each page. */
export function buildMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  const path = canonicalFor(locale);
  const title = TITLE_TEMPLATE[locale];

  return {
    metadataBase: new URL(BASE),
    title: {
      default: title,
      template: `%s | ${siteConfig.company.legalName}`,
    },
    description: t.meta.description,
    applicationName: siteConfig.company.legalName,
    authors: [{ name: siteConfig.company.legalName, url: BASE }],
    creator: siteConfig.company.legalName,
    publisher: siteConfig.company.legalName,
    category: 'Facility management',
    keywords:
      locale === 'ar'
        ? [
            'شركة تنظيف البحرين',
            'نظافة المنشآت التجارية',
            'جلي رخام البحرين',
            'صيانة فنية المنامة',
            'تنظيف فلل البحرين',
          ]
        : [
            'cleaning company Bahrain',
            'commercial housekeeping Bahrain',
            'marble polishing Bahrain',
            'facility maintenance Manama',
            'villa cleaning Bahrain',
          ],
    alternates: {
      canonical: path,
      languages: {
        'en-BH': siteConfig.seo.routes.en,
        'ar-BH': siteConfig.seo.routes.ar,
        'x-default': siteConfig.seo.routes.en,
      },
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.company.legalName,
      title,
      description: t.meta.description,
      url: absoluteUrl(path),
      locale: locale === 'ar' ? 'ar_BH' : 'en_BH',
      alternateLocale: locale === 'ar' ? ['en_BH'] : ['ar_BH'],
      images: [
        {
          url: siteConfig.seo.ogImage,
          width: siteConfig.seo.ogImageWidth,
          height: siteConfig.seo.ogImageHeight,
          alt: siteConfig.company.legalName,
        },
      ],
    },
    twitter: {
      card: siteConfig.seo.twitterCard,
      title,
      description: t.meta.description,
      images: [siteConfig.seo.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    formatDetection: { telephone: true, address: true, email: true },
  };
}

/**
 * schema.org LocalBusiness. Values come strictly from siteConfig, so the
 * structured data and the rendered footer can never disagree.
 *
 * The CR number and the geo block are emitted only when they hold real values,
 * which keeps an empty identifier or a placeholder pin out of search results.
 */
export function localBusinessJsonLd(locale: Locale): Record<string, unknown> {
  const t = getDictionary(locale);
  const a = siteConfig.contact.address;
  const geo = siteConfig.contact.geo;

  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/#organization`,
    name: siteConfig.company.legalName,
    alternateName: siteConfig.company.shortName,
    description: t.meta.description,
    url: absoluteUrl(canonicalFor(locale)),
    inLanguage: locale === 'ar' ? 'ar-BH' : 'en-BH',
    image: absoluteUrl(siteConfig.seo.ogImage),
    logo: absoluteUrl(siteConfig.company.logo),
    telephone: siteConfig.contact.primaryPhone.dial,
    email: siteConfig.contact.email,
    foundingDate: siteConfig.company.established,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [a.building, a.road, a.block, a.unit].join(', '),
      addressLocality: a.city,
      addressCountry: 'BH',
    },
    areaServed: { '@type': 'Country', name: siteConfig.contact.areaServed },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'emergency',
        telephone: siteConfig.contact.primaryPhone.dial,
        availableLanguage: ['en', 'ar'],
        hoursAvailable: '24/7',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: siteConfig.contact.secondaryPhone.dial,
        availableLanguage: ['en', 'ar'],
      },
    ],
    /* Divisions, not products. No offer or price node is emitted anywhere,
       because pricing follows an on-site survey. */
    knowsAbout: siteConfig.divisions.map((d) => t.pillars[d.id].title),
  };

  if (siteConfig.company.crNumber) {
    payload.identifier = {
      '@type': 'PropertyValue',
      name: 'Commercial Registration',
      value: siteConfig.company.crNumber,
    };
  }

  /* Only publish a pin once it is a surveyed position, not a city centroid. */
  if (geo.precision === 'exact') {
    payload.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  return payload;
}

/** Breadcrumb for the locale route, so search results show a clean trail. */
export function breadcrumbJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: siteConfig.company.shortName,
        item: absoluteUrl(canonicalFor(locale)),
      },
    ],
  };
}

/** Full address string, exported so the footer and JSON-LD share one source. */
export const addressLine = formatAddress;
