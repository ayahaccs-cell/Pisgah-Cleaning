/**
 * English dictionary. This file defines the shape; ar.ts is typed against it,
 * so a missing Arabic key fails the build rather than leaking English into an
 * Arabic page.
 *
 * Punctuation rule: hyphens only. No em dash, no en dash, in any language.
 * Zero pricing rule: no currency, rate or figure with money beside it.
 */

export const en = {
  meta: {
    title: 'Pisgah Cleaning Co. W.L.L. | Facility care in Bahrain since 2008',
    description:
      'Commercial housekeeping, residential care, deep treatments and technical maintenance across the Kingdom of Bahrain. Directly employed crews, scopes written after an on-site survey.',
  },

  util: {
    skipToContent: 'Skip to content',
  },

  nav: {
    commercial: 'Commercial',
    residential: 'Residential',
    specialised: 'Specialised',
    technical: 'Technical Maintenance',
    process: 'How We Work',
    leadership: 'Leadership',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primary: 'Primary navigation',
    mobile: 'Mobile navigation',
  },

  cta: {
    bookNow: 'Book Now',
    inspection: 'Book Complimentary Inspection',
    scopeRequest: 'Request Site Scope',
    whatsapp: 'Chat on WhatsApp',
    callOffice: 'Call Office',
    callNow: 'Call Now',
  },

  hero: {
    headline: 'Cleaning Made Simple',
    narrative:
      "Since 2008 we have held the floors of Bahrain's landmark malls, cinemas, schools, mosques, and villas that cannot afford a closed day. Directly employed, uniformed Pisgah W.L.L. crews with zero subcontractors.",
    videoTitle: 'Sneak Peek',
    videoSub: 'Inside a Pisgah Shift',
    videoPending: 'Awaiting media.heroVideos[0].url',
  },

  intake: {
    title: 'Get your free estimate today!',
    note: 'No pricing online. Every scope is quoted after we walk the property.',
    category: 'Property Category',
    scope: 'Service Scope',
    phone: 'Mobile or WhatsApp Number',
    assurances: {
      free: 'Survey is complimentary',
      noObligation: 'No obligation',
      inHouse: 'Directly employed crews',
    },
    categories: {
      commercial: 'Commercial Facility',
      retail: 'Retail',
      villa: 'Private Villa',
      apartment: 'Apartment',
    },
    scopes: {
      routine: 'Routine Housekeeping',
      deep: 'Deep Treatment and Marble',
      movein: 'Move-in Turnaround',
      technical: 'Technical Maintenance',
    },
    fallbackNumber: '[your number]',
    submit: 'Request Site Scope',
    phonePlaceholder: '+973 0000 0000',
  },

  trust: {
    ratingTitle: 'Top Rated Commercial and Villa Care in Bahrain',
    ratingSub: 'Retained on landmark contracts since 2008',
    sectorsLabel: 'Sectors we hold',
    sectors: {
      retail: 'Retail Malls',
      cinemas: 'Cinemas',
      mosques: 'Mosques',
      towers: 'Corporate Towers',
    },
    guarantee: 'Direct Pisgah Induction - Zero Subcontractors Guarantee',
  },

  clients: {
    heading: '15+ landmark contracts across Bahrain, renewed year after year since 2008.',
    ratingLabel: 'Accounts held under continuous contract',
    spec: 'ACTIVE ACCOUNTS / KINGDOM OF BAHRAIN',
  },

  journey: {
    heading: 'The Pisgah Standard',
    intro:
      'Three stages run before you owe us anything. We walk the building, we put the scope in writing, then every visit closes on a signed sheet.',
    spec: 'OPERATING PROCEDURE / THREE STAGES',
    cta: 'Book My Survey',
    steps: {
      survey: {
        title: 'Site survey and written scope',
        body: 'We walk the building with your facilities lead, count fixtures and hard-floor area, and record your operating hours. Nothing is quoted from a phone call.',
        spec: '45 TO 90 MIN ON SITE',
      },
      mobilisation: {
        title: 'Supervised mobilisation',
        body: 'Named crews, inducted to your site rules, with our own single-disc scrubbers, extractors and transport dispatched on a fixed roster.',
        spec: 'NAMED CREW / FIXED ROSTER',
      },
      signoff: {
        title: 'Supervisor-signed handover',
        body: 'Every visit closes on a supervisor-signed inspection sheet, and the scope is reviewed with you on a schedule rather than on complaint.',
        spec: 'SIGNED INSPECTION SHEET',
      },
    },
  },

  pillars: {
    heading: 'One contract, four divisions.',
    intro:
      'One contract covers cleaning, plumbing, electrical, painting and pest control. One supervisor signs for all of it, so there is no vendor to chase when a job crosses a trade.',
    spec: 'FOUR DIVISIONS / ONE POINT OF ACCOUNTABILITY',
    leadLabel: 'Primary division',
    commercial: {
      title: 'Commercial and facility care',
      summary:
        'Daily housekeeping for buildings that cannot close. Fixed crews, fixed rosters, and a supervisor-signed inspection sheet on every visit.',
      spec: 'DIVISION A / DAILY CONTRACT',
      items: [
        'Retail malls, showrooms and stores',
        'Corporate towers and offices',
        'Cinemas and entertainment venues',
        'Schools, institutes and mosques',
        'Common areas and back-of-house',
        'Supervisor-signed inspection sheets each visit',
      ],
    },
    residential: {
      title: 'Residential and property care',
      summary: 'Villas, compounds and landlord turnarounds, on a schedule you set.',
      spec: 'DIVISION B / SCHEDULED VISITS',
      items: [
        'Private luxury villas and family homes',
        'Apartment blocks and compounds',
        'Scheduled housekeeping visits',
        'Move-in and move-out cleaning',
        'Post-handover preparation',
        'Landlord turnaround packages',
      ],
    },
    specialised: {
      title: 'Deep and specialised treatments',
      summary: 'Machine and chemical work, run by crews trained on the exact equipment.',
      spec: 'DIVISION C / MACHINE AND CHEMICAL',
      items: [
        'Single-disc rotary scrubbing and marble crystallisation',
        'Low-moisture carpet extraction',
        'Upholstery shampooing and mattress steam sanitising',
        'Post-construction acid wash and grout restoration',
        'Facade and internal glass cleaning',
        'Food-grade degreasing and oven detailing',
      ],
    },
    technical: {
      title: 'Technical and maintenance services',
      summary: 'The in-house division that keeps the building itself running.',
      spec: 'DIVISION D / IN-HOUSE TRADES',
      items: [
        'Plumbing repairs and emergency call-outs',
        'Electrical fault finding and rectification',
        'Internal and external painting',
        'Water tank cleaning, chlorination and pumps',
        'Civil, floor and ceiling repairs',
        'Planned preventive maintenance',
      ],
    },
  },

  packages: {
    heading: 'Five tiers, priced after we see the property.',
    intro:
      'Find the tier that matches your home, then we survey it. Coverage and crew size are published here. The figure is not, because a three bedroom villa is never the same job twice.',
    spec: 'RESIDENTIAL / SURVEY BEFORE SCOPE',
    priceLine: 'Priced after survey - never over the phone.',
    tierLabel: 'Package tier',
    coverageLabel: 'Standard coverage',
    crewLabel: 'Indicative crew',
    featuredLabel: 'Most requested',
    tiers: {
      studio: {
        name: 'Studio / Single Room',
        covers: ['1 main room', '1 bathroom', 'Open kitchenette', 'Balcony'],
        crew: '1 cleaner',
        duration: '2 to 3 hrs',
      },
      oneBhk: {
        name: '1 BHK Apartment',
        covers: ['1 bedroom', 'Living hall', '1 to 2 bathrooms', 'Standard kitchen'],
        crew: '1 to 2 cleaners',
        duration: '3 to 4 hrs',
      },
      twoBhk: {
        name: '2 BHK Apartment',
        covers: ['2 bedrooms', 'Living hall and dining', '2 bathrooms', 'Closed kitchen'],
        crew: '2 cleaners',
        duration: '4 to 5 hrs',
      },
      threeBhk: {
        name: '3 BHK Apartment / Villa',
        covers: ['3 bedrooms', 'Living hall and dining', '3 bathrooms', 'Kitchen and balconies'],
        crew: '2 to 3 cleaners',
        duration: '5 to 6 hrs',
      },
      fourBhk: {
        name: '4 BHK / Luxury Villa',
        covers: ['4+ bedrooms', 'Multiple halls', "Maid's room", '4+ bathrooms and large kitchen'],
        crew: '3 to 4 cleaners',
        duration: 'Full day',
      },
    },
  },

  emergency: {
    eyebrow: '24/7 EMERGENCY CALL-OUT',
    heading: 'Burst pipe, blocked drain or a spill before opening hours?',
    body: 'Plumbing failures do not keep office hours. Our teams and transport are equipped to respond across Bahrain, day or night.',
    coverage: 'Plumbing / Electrical / Water tanks / Spill response',
    spec: 'CALL-OUT / ISLAND WIDE / ANY HOUR',
  },

  leadership: {
    heading: 'The people who answer the phone.',
    intro:
      'You deal directly with the people who own the outcome. Issues close in hours, on a phone call, without an escalation path.',
    spec: 'DIRECT MANAGEMENT / NAMED CONTACTS',
    members: {
      george: {
        name: 'George Jacob',
        role: 'Founder, Director and General Manager',
        note: 'Invested in the perfect execution of every project we undertake.',
      },
      shajan: {
        name: 'Shajan Mathew',
        role: 'Manager',
        note: '18+ years of industry experience directing day-to-day operations.',
      },
      najeer: {
        name: 'Najeer Abdul Nazer',
        role: 'Operations Co-ordinator',
        note: 'Leads implementation of cleaning operations across all sites.',
      },
      santosh: {
        name: 'Santosh K',
        role: 'Supervisor',
        note: 'Coordinates and standardises service quality on the ground.',
      },
    },
  },

  footer: {
    promise: 'Assuring you of our best services, at all times.',
    servicesTitle: 'Services',
    companyTitle: 'Company',
    contactTitle: 'Contact',
    addressLabel: 'Office',
    disciplines: 'Cleaning - Facility maintenance - Plumbing - Electrical - Painting - Pest control',
    crLabel: 'CR',
    rights: 'All rights reserved.',
    establishedLabel: 'Established',
    quickLinks: {
      about: 'About Pisgah',
      process: 'How We Work',
      leadership: 'Leadership',
      clients: 'Clients',
      careers: 'Careers',
      contact: 'Contact',
    },
  },

  a11y: {
    languageGroup: 'Language',
    mainLandmark: 'Main content',
    headerLandmark: 'Site header',
    footerLandmark: 'Site footer and company details',
    heroLandmark: 'Introduction and survey request',
    switchToEnglish: 'View this page in English',
    switchToArabic: 'عرض هذه الصفحة بالعربية',
    openMenuLabel: 'Open the navigation menu',
    closeMenuLabel: 'Close the navigation menu',
    callPrimary: 'Call the 24/7 emergency line',
    callOfficeLabel: 'Call the Pisgah office line',
    emailLabel: 'Email Pisgah',
    whatsappGeneric: 'Open WhatsApp to request a site survey',
    whatsappEstimate: 'Open WhatsApp with your property and service selections filled in',
    whatsappDivision: 'Open WhatsApp to request a site scope for this division',
    whatsappPackage: 'Open WhatsApp to book a complimentary inspection for this tier',
    whatsappEmergency: 'Open WhatsApp to report an emergency',
    playVideoLabel: 'Play the Pisgah site video',
  },
};

/**
 * The shape every locale must satisfy. Deliberately not const asserted, so
 * translations are checked for structure rather than for matching the English
 * literals.
 */
export type Dictionary = typeof en;
export default en;
