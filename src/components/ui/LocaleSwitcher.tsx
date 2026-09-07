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
  /** 'bar' sits on the glass header. 'panel' sits in the drawer. */
  tone?: 'bar' | 'panel';
  className?: string;
};

const OPTIONS: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'العربية' },
];

export function LocaleSwitcher({ tone = 'bar', className = '' }: Props) {
  const { locale, t } = useLocale();

  /* 'bar' sits on the deep glass header, so the idle state is S1 at 80 percent
     and the active state is a white pill with an S5 label at 14.71:1. */
  const shell = tone === 'bar' ? 'border-navy-50/35' : 'border-hairline w-full';
  const idle = tone === 'bar' ? 'text-navy-50/80 hover:text-white' : 'text-muted';
  const active =
    tone === 'bar' ? 'bg-white text-blue font-semibold' : 'bg-deep text-white font-semibold';
  const height = tone === 'bar' ? 'min-h-[44px]' : 'min-h-[48px] flex-1';
  const focus = tone === 'bar' ? 'focus-ring-ink' : 'focus-ring-light';

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
                className={`w-px self-stretch ${tone === 'bar' ? 'bg-navy-50/35' : 'bg-hairline'}`}
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
