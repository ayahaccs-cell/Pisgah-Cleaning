import { en, type Dictionary } from './en';
import { ar } from './ar';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const LOCALES: readonly Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function directionOf(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'ar';
}

export type { Dictionary };
export { en, ar };
