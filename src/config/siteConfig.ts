/**
 * Pisgah Cleaning Co. W.L.L. - single source of truth.
 *
 * Every business fact lives here. Components import from this file and hold
 * no literal contact strings of their own.
 *
 * Two rules are enforced by lint and must never be broken here or anywhere else:
 *  1. No Bahraini phone literal exists outside this file.
 *  2. No price, rate, currency or minimum booking figure exists anywhere in the
 *     application. Pricing is quoted only after an on-site survey.
 */

export type PhoneNumber = {
  /** Formatted for display. Always rendered inside dir="ltr". */
  display: string;
  /** tel: target, full international form. */
  dial: string;
  /** wa.me target, digits only, no plus sign. Null when the line has no WhatsApp. */
  wa: string | null;
};

export type PostalAddress = {
  building: string;
  road: string;
  block: string;
  unit: string;
  city: string;
  country: string;
};

export type Division = {
  id: 'commercial' | 'residential' | 'specialised' | 'technical';
  /** Reference token appended to every WhatsApp message from this division. */
  ref: string;
};

export type PackageTier = {
  id: 'studio' | 'oneBhk' | 'twoBhk' | 'threeBhk' | 'fourBhk';
  ref: string;
  /** Marks the tier that carries the outlined border. Never a coloured fill. */
  featured: boolean;
};

export type LeadershipMember = {
  id: string;
  /** Present only when a real photograph has been supplied. Never a stock person. */
  photo: string | null;
};

export type HeroVideo = {
  poster: string;
  /** Owner editable. The slot renders only when this is a non empty string. */
  url: string;
};

export const siteConfig = {
  company: {
    legalName: 'Pisgah Cleaning Co. W.L.L.',
    shortName: 'Pisgah',
    established: '2008',
    country: 'Kingdom of Bahrain',
    /** Populated before domain deployment. The credentials line hides while empty. */
    crNumber: '',
    domain: 'pisgahcleaning.com',
    url: 'https://pisgahcleaning.com',
    logo: '/media/pisgah-logo.png',
  },

  seo: {
    /** Absolute path to the social share image. 1200x630. */
    ogImage: '/media/og-cover.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image' as const,
    /** Canonical route for each locale. Both are real, server rendered routes. */
    routes: { en: '/', ar: '/ar' } as const,
  },

  contact: {
    primaryPhone: {
      display: '+973 33797932',
      dial: '+97333797932',
      wa: '97333797932',
    } satisfies PhoneNumber,
    secondaryPhone: {
      display: '+973 34696997',
      dial: '+97334696997',
      wa: null,
    } satisfies PhoneNumber,
    email: 'george2099@gmail.com',
    address: {
      building: 'Building 77',
      road: 'Road 905',
      block: 'Block 309',
      unit: 'No. 31',
      city: 'Manama',
      country: 'Kingdom of Bahrain',
    } satisfies PostalAddress,
    hours: {
      /** Confirmed by the client, September 2026. */
      office: 'Sun to Thu, 07:00 to 19:00',
      emergency: '24/7 emergency call-out',
      /** Schema.org openingHours, for the LocalBusiness payload in the footer. */
      schema: ['Su-Th 07:00-19:00'],
    },
    areaServed: 'Kingdom of Bahrain',
    /**
     * TO CONFIRM before launch. These are Manama city-level coordinates, not a
     * survey pin on Building 77. Replace with the exact position from Google
     * Maps so the LocalBusiness entry places correctly in local search.
     */
    geo: {
      latitude: 26.2285,
      longitude: 50.586,
      precision: 'city' as 'city' | 'exact',
    },
  },

  divisions: [
    { id: 'commercial', ref: 'WEB-SRV-COMMERCIAL' },
    { id: 'residential', ref: 'WEB-SRV-RESIDENTIAL' },
    { id: 'specialised', ref: 'WEB-SRV-SPECIALISED' },
    { id: 'technical', ref: 'WEB-SRV-TECHNICAL' },
  ] as const satisfies readonly Division[],

  packages: [
    { id: 'studio', ref: 'WEB-PKG-STUDIO', featured: false },
    { id: 'oneBhk', ref: 'WEB-PKG-1BHK', featured: false },
    { id: 'twoBhk', ref: 'WEB-PKG-2BHK', featured: true },
    { id: 'threeBhk', ref: 'WEB-PKG-3BHK', featured: false },
    { id: 'fourBhk', ref: 'WEB-PKG-4BHK', featured: false },
  ] as const satisfies readonly PackageTier[],

  /**
   * Client names only. A trademarked mark is displayed for an account only once
   * written permission from that account is on file, at which point a logo path
   * is added here and the strip renders it in place of the name.
   */
  clients: [
    { id: 'cineco', name: 'Cineco Cinemas', detail: 'Seef Mall and Wadi Al Sail', logo: null },
    { id: 'talabat', name: 'Talabat Fakroo Tower', detail: null, logo: null },
    { id: 'silah', name: 'Silah Gulf', detail: null, logo: null },
    { id: 'epix', name: 'Epix Cinemas', detail: 'Dana Mall', logo: null },
    { id: 'waqf', name: 'Sunni Waqf Directorate', detail: null, logo: null },
    { id: 'nis', name: 'The New Indian School', detail: null, logo: null },
  ],

  leadership: [
    { id: 'george', photo: null },
    { id: 'shajan', photo: null },
    { id: 'najeer', photo: null },
    { id: 'santosh', photo: null },
  ] as const satisfies readonly LeadershipMember[],

  media: {
    /** Paste a link here to light up the hero video slot. No redeploy of code required. */
    heroVideos: [
      { poster: '/media/shift-poster.jpg', url: '' },
    ] as HeroVideo[],
    /* Client photography, supplied September 2026. */
    intro: {
      src: '/media/intro-hero.jpg',
      width: 905,
      height: 509,
    },
    process: {
      survey: '/media/process-01-survey.jpg',
      mobilisation: '/media/process-02-mobilisation.jpg',
      signoff: '/media/process-03-signoff.jpg',
    },
    /* One shot per residential tier. Tiers still awaiting their own photograph
       reuse the carpet extraction frame, which is marked below. */
    tiers: {
      studio: '/media/tier-studio.jpg',
      oneBhk: '/media/tier-1bhk.jpg',
      twoBhk: '/media/tier-2bhk.jpg',
      threeBhk: '/media/tier-3bhk.jpg',
      fourBhk: '/media/tier-4bhk.jpg',
    },
    /* Tier slots still showing the stand-in frame. Replace and remove the id. */
    tiersAwaitingPhotography: ['oneBhk', 'twoBhk', 'threeBhk', 'fourBhk'] as string[],
  },

  /**
   * Survey first policy. There is deliberately no price, rate, currency or
   * minimum hours key in this object. If a figure needs a currency beside it,
   * it belongs in the internal rate sheet and not in this codebase.
   */
  policy: {
    showPricing: false as const,
  },

  stats: {
    established: '2008',
    yearsOnSite: '15+',
    landmarkContracts: '15+',
    serviceLines: '9',
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Address as a single line, used by the footer and the JSON-LD payload. */
export function formatAddress(): string {
  const a = siteConfig.contact.address;
  return [a.building, a.road, a.block, a.unit, a.city, a.country].join(', ');
}
