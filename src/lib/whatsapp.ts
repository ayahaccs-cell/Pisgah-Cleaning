/**
 * The contextual WhatsApp engine.
 *
 * There is no cart, no checkout, no form endpoint and no chat widget script on
 * this site. Every call to action is an anchor whose href is built here.
 *
 * The destination number is read from siteConfig, so changing the line is a one
 * word edit in one file.
 */

import { siteConfig } from '@/config/siteConfig';
import type { Locale } from '@/locales';

/** Reference tokens. Each one tells you which part of the site produced a lead. */
export const WA_REFS = {
  hero: 'WEB-HERO',
  estimate: 'WEB-EST',
  journey: 'WEB-JOURNEY',
  division: 'WEB-SRV',
  package: 'WEB-PKG',
  deep: 'WEB-DEEP',
  emergency: 'WEB-EMG',
  mobileBar: 'WEB-BAR',
  footer: 'WEB-FOOT',
} as const;

export type WhatsAppContext = keyof typeof WA_REFS | (string & {});

type Options = {
  locale?: Locale;
  /** Overrides the token derived from the context, for per item tokens. */
  ref?: string;
};

const OPENINGS: Record<Locale, Record<string, string>> = {
  en: {
    hero: 'Hi Pisgah, I would like to arrange an on-site survey for my property.',
    estimate: 'Hi Pisgah, I would like to request an on-site survey.',
    journey: 'Hi Pisgah, I would like to start with a site survey.',
    division: 'Hi Pisgah, I would like a tailored scope for this service.',
    package: 'Hi Pisgah, I would like to book a complimentary inspection.',
    deep: 'Hi Pisgah, I would like a tailored scope for a deep treatment.',
    emergency: 'URGENT - Pisgah technical call-out required.',
    mobileBar: 'Hi Pisgah, I would like to arrange a site survey.',
    footer: 'Hi Pisgah, I would like to speak to your team about a contract.',
  },
  ar: {
    hero: 'مرحباً بسجاه، أرغب في ترتيب معاينة موقعية لعقاري.',
    estimate: 'مرحباً بسجاه، أرغب في طلب معاينة موقعية.',
    journey: 'مرحباً بسجاه، أرغب في البدء بمعاينة الموقع.',
    division: 'مرحباً بسجاه، أرغب في نطاق عمل مخصص لهذه الخدمة.',
    package: 'مرحباً بسجاه، أرغب في حجز معاينة مجانية للعقار.',
    deep: 'مرحباً بسجاه، أرغب في نطاق عمل مخصص لمعالجة عميقة.',
    emergency: 'عاجل - مطلوب فريق طوارئ فني من بسجاه.',
    mobileBar: 'مرحباً بسجاه، أرغب في ترتيب معاينة موقعية.',
    footer: 'مرحباً بسجاه، أرغب في التحدث مع فريقكم بخصوص عقد خدمة.',
  },
};

const REF_LABEL = 'Ref';

/**
 * Strips characters that would corrupt a WhatsApp message body or let a value
 * from an input field impersonate a new line of the payload.
 */
function sanitise(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 160);
}

function openingFor(context: WhatsAppContext, locale: Locale): string {
  const table = OPENINGS[locale] ?? OPENINGS.en;
  const key = String(context).split(':')[0];
  return table[key] ?? table.estimate;
}

function refFor(context: WhatsAppContext, override?: string): string {
  if (override) return override;
  const [base, suffix] = String(context).split(':');
  const root = WA_REFS[base as keyof typeof WA_REFS] ?? 'WEB';
  return suffix ? `${root}-${suffix.toUpperCase()}` : root;
}

/**
 * Builds an encoded wa.me URL with a context specific, pre-filled message.
 *
 * @example
 *   generateWhatsAppLink('estimate', { Property: '3 BHK', Service: 'Deep clean' })
 *   generateWhatsAppLink('package:3BHK', { Package: '3 BHK Apartment / Villa' })
 */
export function generateWhatsAppLink(
  context: WhatsAppContext,
  payload: Record<string, string> = {},
  options: Options = {},
): string {
  const locale = options.locale ?? 'en';
  const number = siteConfig.contact.primaryPhone.wa;

  const lines: string[] = [openingFor(context, locale)];

  const fields = Object.entries(payload)
    .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
    .map(([label, value]) => `${sanitise(label)}: ${sanitise(value)}`);

  if (fields.length > 0) {
    lines.push('', ...fields);
  }

  lines.push('', `${REF_LABEL}: ${refFor(context, options.ref)}`);

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** The message body on its own, for previewing what will be sent. */
export function previewWhatsAppMessage(
  context: WhatsAppContext,
  payload: Record<string, string> = {},
  options: Options = {},
): string {
  const url = generateWhatsAppLink(context, payload, options);
  return decodeURIComponent(url.split('?text=')[1] ?? '');
}

/** tel: href for the primary emergency line. */
export function callPrimaryHref(): string {
  return `tel:${siteConfig.contact.primaryPhone.dial}`;
}

/** tel: href for the office line. */
export function callOfficeHref(): string {
  return `tel:${siteConfig.contact.secondaryPhone.dial}`;
}

/** mailto: href for the published address. */
export function mailHref(): string {
  return `mailto:${siteConfig.contact.email}`;
}
