'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import {
  DEFAULT_LOCALE,
  directionOf,
  getDictionary,
  type Dictionary,
  type Direction,
  type Locale,
} from '@/locales';

/**
 * Locale context.
 *
 * Each locale is a real route, so the URL is the single source of truth for
 * language. There is no stored preference to fall out of sync with the address
 * bar, and no hydration mismatch: the server renders the locale the route asks
 * for, and this provider only mirrors it onto the document element.
 */

type LocaleContextValue = {
  locale: Locale;
  dir: Direction;
  t: Dictionary;
  /** The path of the other locale, for the language switcher. */
  otherLocale: Locale;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const locale = initialLocale;
  const dir = directionOf(locale);

  /* Mirrors the route onto <html>, which is what drives every logical property
     and the Arabic font stack in globals.css. The Arabic route also sets these
     before first paint, so this is a confirmation rather than a correction. */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', locale);
    root.setAttribute('dir', dir);
  }, [locale, dir]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir,
      t: getDictionary(locale),
      otherLocale: locale === 'en' ? 'ar' : 'en',
    }),
    [locale, dir],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside a LocaleProvider');
  return ctx;
}
