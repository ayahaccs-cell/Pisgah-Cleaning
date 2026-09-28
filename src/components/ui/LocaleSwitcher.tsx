'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import type { Locale } from '@/locales';

/**
 * EN | العربية.
 *
 * Real links between two real routes, not a client side toggle. That is what
 * makes the Arabic page crawlable, shareable and bookmarkable, and it means the
 * browser back button behaves the way a visitor expects.
 *
 * The active option is marked with aria-current, and each link carries an
 * hrefLang plus an explicit label in its own language.
 */

type Props = {
  /** 'bar' sits on the glass header. 'panel' sits in the glass drawer. */
  tone?: 'bar' | 'panel';
  className?: string;
};

const OPTIONS: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'العربية' },
];

export function LocaleSwitcher({ tone = 'bar', className = '' }: Props) {
  const { locale, t } = useLocale();

  /* Both tones sit on a deep translucent surface, so both are built the same
     way: a G1 idle label and a filled active pill carrying dark type.

     'bar' is the pill nav: a white chip with an emerald label at 5.29:1.
     'panel' is the drawer: an emerald chip with a white label, also 5.29:1,
     and the chip itself is 3.65:1 against the obsidian panel, which clears
     the 3:1 threshold for a control.

     Both take the ink ring, because the emerald ring that serves white
     grounds measures 3.65:1 against obsidian: fine for a border, not the
     clearest choice for a focus indicator on a dark surface. */
  const shell = tone === 'bar' ? 'border-white/20' : 'border-white/15 w-full';
  const idle =
    tone === 'bar'
      ? 'text-white/80 hover:text-white'
      : 'bg-white/10 text-white/85 hover:text-white';
  const active =
    tone === 'bar' ? 'bg-white text-emerald font-semibold' : 'bg-emerald text-white font-semibold';
  const height = tone === 'bar' ? 'min-h-[44px]' : 'min-h-[48px] flex-1';
  const focus = 'focus-ring-ink';

  return (
    <div
      role="group"
      aria-label={t.a11y.languageGroup}
      className={`inline-flex items-center overflow-hidden rounded-full border ${shell} ${className}`}
    >
      {OPTIONS.map((option, index) => {
        const isActive = locale === option.code;
        return (
          <span key={option.code} className="contents">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`w-px self-stretch ${
              tone === 'bar' ? 'bg-white/20' : 'bg-white/15'
            }`}
              />
            )}
            <Link
              href={siteConfig.seo.routes[option.code]}
              hrefLang={option.code}
              lang={option.code}
              aria-current={isActive ? 'true' : undefined}
              aria-label={
                option.code === 'ar' ? t.a11y.switchToArabic : t.a11y.switchToEnglish
              }
              className={`u-press tap flex min-w-[48px] items-center justify-center px-3 text-[11px] font-semibold tracking-wider ${height} ${focus} ${
                isActive ? active : idle
              }`}
            >
              {option.label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default LocaleSwitcher;
