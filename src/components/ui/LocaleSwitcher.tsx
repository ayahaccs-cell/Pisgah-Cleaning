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

     'bar' is the header: a white pill with a G4 label, 8.36:1.
     'panel' is the drawer: a G2 pill with G5 type, 8.20:1, and the pill fill
     itself measures 6.88:1 against the drawer glass so the selected state is
     visible as a shape and not only as a colour. The ticked G3 was the other
     option, but G3 as a fill drops even a G5 label to 4.27:1, below AA.

     'panel' takes the ink ring rather than the light ring, because the G4 ring
     that serves white grounds measures 1.83:1 against G5. */
  const shell = tone === 'bar' ? 'border-sage-200/35' : 'border-sage-200/25 w-full';
  const idle =
    tone === 'bar'
      ? 'text-sage-50/80 hover:text-white'
      : 'bg-white/10 text-white/85 hover:text-white';
  const active =
    tone === 'bar' ? 'bg-white text-deep font-semibold' : 'bg-cyan text-ink font-semibold';
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
              tone === 'bar' ? 'bg-sage-200/35' : 'bg-sage-200/25'
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
