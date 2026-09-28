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
    clients: 'Clients',
    process: 'How We Work',
    leadership: 'Leadership',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primary: 'Primary navigation',
    mobile: 'Mobile navigation',
  },

  cta: {
    bookNow: 'Book Now',
    inspection: 'Book Survey',
    scopeRequest: 'Request Site Scope',
    whatsapp: 'Chat on WhatsApp',
    callOffice: 'Call Office',
    callNow: 'Call Now',
  },

  hero: {
    headline: 'Commercial & Estate Maintenance.',
    narrative: "Precision care for Bahrain's finest properties.",
    scrollHint: 'Or scroll to explore',
    proofLabel: 'Our clients',
    /* The card carries a title and nothing else now. videoPending stands in
       for the title when siteConfig has no video url, so the slot still says
       something rather than rendering an empty line. */
    videoTitle: 'Work in motion',
    videoPending: 'Awaiting media.heroVideos[0].url',
    videoModalTitle: 'Inside a Pisgah Shift',
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
    },
    fallbackNumber: '[your number]',
    submit: 'Request Site Scope',
    phonePlaceholder: '+973 0000 0000',
  },


  clients: {
    heading: "Trusted with Bahrain's major commercial and private spaces.",
    ratingLabel: 'Properties serviced under ongoing direct agreements',
    spec: 'ONGOING PARTNERSHIPS / BAHRAIN',
    names: {
      waqf: 'Sunni Waqf Directorate',
      silah: 'Silah Gulf',
      talabat: 'Talabat',
      cineco: 'Cineco Cinemas',
      amakin: 'Amakin',
      mosques: 'Mosques across Bahrain',
      liwan: 'Liwan Cinema',
      epix: 'Epix Cinema',
      trax: 'Trax Karting',
      fabyland: 'Fabyland',
      xtreme: 'Xtreme Bowling',
    },
    scopes: {
      waqf: 'Offices in Manama',
      silah: 'NBB Tower and Batelco Tower',
      talabat: '18 stores across Bahrain',
      cineco: 'Juffair Oasis, Seef Mall, Wadi Al Sail',
      amakin: 'Salmaniya Hospital parking',
      mosques: '50+ mosques, daily cleaning',
      liwan: 'Al Liwan Complex',
      epix: 'Dana Mall',
      trax: 'Indoor circuit facility',
      fabyland: 'Dana Mall',
      xtreme: 'Dana Mall',
    },
  },

  journey: {
    heading: 'The Pisgah Standard',
    intro:
      'Three stages run before you owe us anything. We walk the building, we put the scope in writing, then every visit closes on a signed sheet.',
    spec: 'OPERATING PROCEDURE / THREE STAGES',
    cta: 'Schedule Site Survey',
    steps: {
      survey: {
        title: 'Site Walkthrough & Custom Scope',
        body: 'We walk the property alongside your facility lead to assess layout, floor area, and operational hours. We never issue estimates over the phone without seeing the site first.',
        spec: 'ON-SITE ASSESSMENT',
      },
      mobilisation: {
        title: 'Assigned Crews & Equipment Setup',
        body: "Permanent, uniformed Pisgah staff briefed on your facility's safety rules. Teams arrive on a set schedule with our own industrial scrubbers, extractors, and cleaning materials.",
        spec: 'DIRECT DEPLOYMENT',
      },
      signoff: {
        title: 'Supervisor Inspection & Sign-Off',
        body: 'Every shift closes with an on-site supervisor review against your agreed checklist. Work is signed off directly with your team so standards remain consistent.',
        spec: 'DAILY VERIFICATION',
      },
    },
  },

  pillars: {
    heading: 'One contract, three divisions.',
    intro:
      'One contract covers daily cleaning, deep machine treatments and the technical work that follows a repair. One supervisor signs for all of it, so there is no vendor to chase when a job crosses a trade.',
    spec: 'THREE DIVISIONS / ONE POINT OF ACCOUNTABILITY',
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
      summary:
        'Machine and chemical work, run by crews trained on the exact equipment, including the technical treatments that follow a repair.',
      spec: 'DIVISION C / MACHINE AND CHEMICAL',
      items: [
        'Single-disc rotary scrubbing and marble crystallisation',
        'Low-moisture carpet extraction',
        'Upholstery shampooing and mattress steam sanitising',
        'Post-construction acid wash and grout restoration',
        'Facade and internal glass cleaning',
        'Food-grade degreasing and oven detailing',
        'Water tank cleaning and chlorination',
        'Post-repair make-good and remedial finishes',
      ],
    },
  },

  packages: {
    heading: 'Scoped after site inspection.',
    intro:
      'Find the scale that fits your property below, then let us walk the site. Every layout is different, a three-bedroom villa or a commercial office space requires a custom scope before we talk numbers.',
    spec: 'PRICED ON INSPECTION',
    tierLabel: 'Service scope',
    coverageLabel: 'Standard coverage',
    deploymentLabel: 'Deployment',
    scopes: {
      apartments: {
        name: 'Residential Apartments',
        covers: [
          'Studio to 3+ bedrooms available',
          'Living hall and dining areas',
          'Kitchen and bathrooms included',
          'Custom configurations on request',
        ],
        deployment: '1 to 3 cleaners / 3 to 5 hrs',
      },
      commercial: {
        name: 'Commercial Facilities',
        covers: [
          'Multi-floor office spaces and towers',
          'Common areas and reception lobbies',
          'Restrooms and pantries',
          'Scheduled facility care',
        ],
        deployment: 'Custom team deployed per site scale',
      },
      upholstery: {
        name: 'Sofa & Upholstery Care',
        covers: [
          'Fabric and leather deep extraction',
          'Stain treatment and sanitization',
          'Sectionals, sofas, and armchairs',
          'Dining chair detailing',
        ],
        deployment: '1 specialized technician / 2 to 3 hrs',
      },
      carpet: {
        name: 'Carpet Shampooing & Extraction',
        covers: [
          'Rotary deep shampooing',
          'High-suction moisture extraction',
          'Rug restoration and refresh',
          'Odor and spot neutralization',
        ],
        deployment: '1 to 2 technicians / Scale-dependent',
      },
      deepClean: {
        name: 'Specialized Deep Cleaning',
        covers: [
          'Post-renovation or move-in and move-out',
          'High-dusting and fixture detailing',
          'Heavy-duty grease and scale removal',
          'Full interior sanitization reset',
        ],
        deployment: '2 to 4 cleaners / Full-day shift allocation',
      },
    },
  },

  consultation: {
    heading: 'Planning a commercial cleaning contract or facility scope?',
    body: 'Our operations team conducts complimentary on-site surveys across Bahrain. We inspect the building, record square footage, and deliver a transparent written proposal within 24 to 48 hours.',
    primaryCta: 'Book Site Walkthrough',
    secondaryCta: 'Call Operations',
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
      aqeel: {
        name: 'Aqeel Thasim',
        role: 'Sales Coordinator',
        note: 'Manages commercial client onboarding, service coordination, and on-site facility survey assessments across Bahrain.',
      },
    },
  },

  footer: {
    promise: 'Assuring you of our best services, at all times.',
    servicesTitle: 'Services',
    companyTitle: 'Company',
    contactTitle: 'Contact',
    addressLabel: 'Office',
    disciplines: 'Commercial cleaning - Residential care - Specialised treatments - Facility housekeeping',
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
    callPrimary: 'Call the Pisgah operations line',
    callOfficeLabel: 'Call the Pisgah office line',
    emailLabel: 'Email Pisgah',
    emailOperationsLabel: 'Email the Pisgah operations desk',
    whatsappGeneric: 'Open WhatsApp to request a site survey',
    whatsappEstimate: 'Open WhatsApp with your property and service selections filled in',
    whatsappDivision: 'Open WhatsApp to request a site scope for this division',
    whatsappPackage: 'Open WhatsApp to book a survey for this service scope',
    whatsappConsultation: 'Open WhatsApp to book a site walkthrough',
    playVideoLabel: 'Play the Pisgah site video',
    closeVideoLabel: 'Close the video',
  },
};

/**
 * The shape every locale must satisfy. Deliberately not const asserted, so
 * translations are checked for structure rather than for matching the English
 * literals.
 */
export type Dictionary = typeof en;
export default en;
