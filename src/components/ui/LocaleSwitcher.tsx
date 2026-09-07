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

  /* Both tones now sit on a deep translucent surface, so both are built the
     same way: an S1 idle label and a filled active pill carrying dark type.

     'bar' is the header: a white pill with an S5 label, 14.71:1.
     'panel' is the drawer: an S2 pill with S6 type, 7.03:1, and the pill fill
     itself measures 4.75:1 against the drawer glass so the selected state is
     visible as a shape and not only as a colour. S3 was the other option in
     the brief, but S3 as a fill drops the ink label to 4.79:1 and the pill
     itself to 3.23:1 against the panel, so S2 is the safer of the two.

     'panel' takes the ink ring rather than the light ring, because the S4 ring
     that serves white grounds measures 2.01:1 against S5. */
  const shell = tone === 'bar' ? 'border-navy-50/35' : 'border-navy-50/20 w-full';
  const idle =
    tone === 'bar'
      ? 'text-navy-50/80 hover:text-white'
      : 'bg-white/10 text-white/85 hover:text-white';
  const active =
    tone === 'bar' ? 'bg-white text-blue font-semibold' : 'bg-cyan text-ink font-semibold';
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
              tone === 'bar' ? 'bg-navy-50/35' : 'bg-navy-50/20'
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
              className={`u-press tap flex min-w-[48px] items-center justify-center px-3 font-mono text-[11px] ${height} ${focus} ${
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
