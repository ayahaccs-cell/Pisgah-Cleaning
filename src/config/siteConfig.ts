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
  id: 'commercial' | 'residential' | 'specialised';
  /** Reference token appended to every WhatsApp message from this division. */
  ref: string;
};

export type PackageTier = {
  id: 'apartments' | 'commercial' | 'upholstery' | 'carpet' | 'deepClean';
  ref: string;
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
    /** Full colour mark, for white and light surfaces. */
    logo: '/media/pisgah-logo.png',
    /** White knockout with transparency, for dark and photographic surfaces. */
    logoLight: '/media/logo.png',
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
    /* Updated by the client, September 2026. The primary number is the one
       every call to action reaches, including the WhatsApp engine; the
       secondary sits beside it in the footer and contact block. */
    primaryPhone: {
      display: '+973 33512244',
      dial: '+97333512244',
      wa: '97333512244',
    } satisfies PhoneNumber,
    secondaryPhone: {
      display: '+973 33524411',
      dial: '+97333524411',
      wa: null,
    } satisfies PhoneNumber,
    email: 'pisgahcleaning123@gmail.com',
    /** Operations inbox, shown alongside the general address in the footer. */
    emailOperations: 'operations.pisgah@gmail.com',
    address: {
      building: 'Building 77',
      road: 'Road 905',
      block: 'Block 309',
      unit: 'No. 31',
      city: 'Manama',
      country: 'Kingdom of Bahrain',
    } satisfies PostalAddress,
    hours: {
      /* One schedule. The 24/7 emergency line was retired with the emergency
         section, so there is no second set of hours to contradict this one. */
      office: 'Sat to Thu, 09:00 to 17:00',
      /** Schema.org openingHours, for the LocalBusiness payload. */
      schema: ['Sa-Th 09:00-17:00'],
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
  ] as const satisfies readonly Division[],

  /**
   * Service scopes, replacing the five residential size tiers.
   *
   * The `featured` flag is gone with them. It rendered a "most requested" label,
   * which was a claim about demand that nothing on file supports; the five
   * scopes are five different jobs rather than five rungs of one ladder, so
   * there is no top of the list to mark.
   */
  packages: [
    { id: 'apartments', ref: 'WEB-PKG-APT' },
    { id: 'commercial', ref: 'WEB-PKG-COM' },
    { id: 'upholstery', ref: 'WEB-PKG-UPH' },
    { id: 'carpet', ref: 'WEB-PKG-CRP' },
    { id: 'deepClean', ref: 'WEB-PKG-DEEP' },
  ] as const satisfies readonly PackageTier[],

  /**
   * Client names only. A trademarked mark is displayed for an account only once
   * written permission from that account is on file, at which point a logo path
   * is added here and the strip renders it in place of the name.
   */
  /**
   * Retained accounts, supplied by the client September 2026 together with the
   * marks themselves. The name and the scope line are localised, so only the
   * id and the artwork live here.
   *
   * Every file in /media/clients is a white silhouette on transparency,
   * prepared from the supplied artwork at a uniform 240 by 72 box so the proof
   * row needs no per-logo sizing. `proof` marks the six that appear in the
   * hero strip; the rest carry the register further down the page.
   *
   * These are third party trademarks, displayed on the client's instruction.
   * Written permission per account is the client's to hold, not the site's.
   */
  clients: [
    { id: 'waqf', logo: '/media/clients/waqf.png', proof: true },
    { id: 'silah', logo: '/media/clients/silah.png', proof: true },
    { id: 'talabat', logo: '/media/clients/talabat.png', proof: true },
    { id: 'cineco', logo: '/media/clients/cineco.png', proof: true },
    { id: 'amakin', logo: '/media/clients/amakin.png', proof: true },
    { id: 'liwan', logo: '/media/clients/liwan.png', proof: false },
    { id: 'epix', logo: '/media/clients/epix.png', proof: true },
    { id: 'trax', logo: '/media/clients/trax.png', proof: false },
    { id: 'fabyland', logo: '/media/clients/fabyland.png', proof: false },
    { id: 'xtreme', logo: '/media/clients/xtreme.png', proof: false },
    /* Last, deliberately. The register is read top down and the corporate and
       commercial accounts are what a facilities manager is scanning for; the
       mosque contract is the largest by count and the least like the rest, so
       it closes the list rather than interrupting it. */
    { id: 'mosques', logo: '/media/clients/mosque.png', proof: false },
  ],

  /** Every mark is prepared to the same box, so this is declared once. */
  clientLogoBox: { width: 240, height: 72 },

  leadership: [
    { id: 'george', photo: null },
    { id: 'shajan', photo: null },
    { id: 'najeer', photo: null },
    { id: 'aqeel', photo: null },
  ] as const satisfies readonly LeadershipMember[],

  media: {
    /**
     * The hero video. A local file plays in the modal; an external link opens
     * in a new tab instead. Swap the url to change what the card plays, with no
     * code change anywhere else.
     */
    heroVideos: [
      { poster: '/media/pisgah-shift-poster.jpg', url: '/media/pisgah-shift.mp4' },
    ] as HeroVideo[],
    /* Client photography, supplied September 2026. */
    intro: {
      src: '/media/intro-hero.jpg',
      width: 905,
      height: 509,
    },
    /* The single featured operational frame in the hero spotlight card. It now
       has its own file rather than borrowing a process frame, so the two can
       be art directed independently. */
    heroSpotlight: '/media/hero-spotlight.jpg',
    /* Stage 01 and stage 03 were rephotographed in September 2026: a branded
       checklist being filled during a walkthrough, and a two-person close-of-
       work check at a mirror. Both arrived portrait and were cropped to the
       same 4:3 box the mobilisation frame already used, because the three
       frames share one height cap in the timeline and a portrait source
       letterboxes badly inside it.

       Stage 02 is untouched, on instruction. */
    process: {
      survey: '/media/process-01.jpg',
      mobilisation: '/media/process-02-mobilisation.jpg',
      handover: '/media/process-03.jpg',
    },
    /* One frame per service scope, each on its own file rather than borrowing a
       process frame. Four are now genuinely role specific. Deep cleaning is the
       exception noted below. */
    scopes: {
      apartments: '/media/scope-residential.jpg',
      commercial: '/media/scope-commercial.jpg',
      upholstery: '/media/scope-upholstery.jpg',
      carpet: '/media/scope-carpet.jpg',
      deepClean: '/media/scope-deepclean.jpg',
    },
    /**
     * Scopes whose frame is not yet a dedicated shot. Replace the path above
     * and delete the id from this list.
     *
     *   deepClean  shares its source negative with the hero spotlight card.
     *              The two sit far apart on the page and the hero crop is
     *              wider and vignetted, so it does not read as a repeat, but
     *              it is still one photograph doing two jobs. Wanted: a
     *              post-renovation or move-out reset with high-dusting or
     *              grease work visible.
     */
    scopesAwaitingPhotography: ['deepClean'] as string[],
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

/**
 * Address as a single line, used by the footer and the JSON-LD payload.
 *
 * The unit and the building are one clause, not two: "No. 31 Building 77"
 * rather than "Building 77, No. 31", which is how the client writes it and how
 * it is signed at the door.
 */
export function formatAddress(): string {
  const a = siteConfig.contact.address;
  return [`${a.unit} ${a.building}`, a.road, a.block, a.city, a.country].join(', ');
}
