'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, callPrimaryHref, mailHref } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, MailIcon, PhoneIcon } from '@/components/ui/Icons';
import { MobileDrawer } from './MobileDrawer';

/**
 * Top utility strip plus main navigation.
 *
 * Utility strip: three labelled contact items on white, matching the reference
 * composition. Every value is read from siteConfig, so a change of line or
 * address flows through here without an edit.
 *
 * Main navigation: logo on the inline start, links centred, a pill call to
 * action on the inline end. Below 1280px the links and the pill collapse into
 * the drawer, and the call pill stays visible because a facilities buyer with a
 * burst pipe should never have to open a menu to find a phone number.
 */

export const NAV_LINKS = [
  { href: '#commercial', key: 'commercial' },
  { href: '#residential', key: 'residential' },
  { href: '#specialised', key: 'specialised' },
  { href: '#technical', key: 'technical' },
  { href: '#process', key: 'process' },
  { href: '#leadership', key: 'leadership' },
] as const;

export function Navbar() {
  const { t } = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  /* Sticky shrink without a scroll listener: a sentinel at the top of the page
     is observed, and the header condenses when it leaves the viewport. */
  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setCondensed(!entry.isIntersecting), {
      rootMargin: '-120px 0px 0px 0px',
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="nav-sentinel" aria-hidden="true" className="absolute inset-x-0 top-0 h-px" />

      {/* Top utility strip */}
      <section
        aria-label={t.a11y.utilityLandmark}
        className="relative z-[60] hidden border-b border-hairline-soft bg-white md:block"
      >
        <div className="container-page flex min-h-[64px] flex-wrap items-center justify-between gap-x-8 gap-y-2 py-2">
          <ul className="flex flex-wrap items-center gap-x-9 gap-y-2">
            <li>
              <a
                href={mailHref()}
                aria-label={t.a11y.emailLabel}
                className="focus-ring-light group flex items-center gap-3 rounded-lg py-1"
              >
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full bg-paper text-deep"
                >
                  <MailIcon size={16} />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="spec">{t.util.mailLabel}</span>
                  <span className="text-[13.5px] font-semibold text-ink transition-colors duration-fast ease-feedback group-hover:text-deep">
                    {siteConfig.contact.email}
                  </span>
                </span>
              </a>
            </li>

            <li className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 flex-none place-items-center rounded-full bg-paper text-deep"
              >
                <ClockIcon size={16} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="spec">{t.util.hoursLabel}</span>
                <span className="text-[13.5px] font-semibold text-ink">
                  {siteConfig.contact.hours.office}
                </span>
              </span>
            </li>

            <li>
              <a
                href={callPrimaryHref()}
                aria-label={t.a11y.callPrimary}
                className="focus-ring-light group flex items-center gap-3 rounded-lg py-1"
              >
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full bg-paper text-deep"
                >
                  <PhoneIcon size={16} />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="spec">{t.util.callAnytime}</span>
                  <span
                    dir="ltr"
                    className="text-[13.5px] font-semibold text-ink transition-colors duration-fast ease-feedback group-hover:text-deep"
                  >
                    {siteConfig.contact.primaryPhone.display}
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <LocaleSwitcher tone="panel" className="w-auto" />
        </div>
      </section>

      {/* Main navigation */}
      <div className="container-page sticky top-0 z-[55] pt-3 md:pt-4">
        <header
          role="banner"
          aria-label={t.a11y.headerLandmark}
          className={`flex items-center justify-between gap-4 rounded-full border border-hairline-soft bg-white px-4 shadow-nav transition-all duration-standard ease-entrance sm:px-6 ${
            condensed ? 'min-h-[64px] py-2' : 'min-h-[76px] py-2.5'
          }`}
        >
          <a
            href="#top"
            className="focus-ring-light flex flex-none items-center rounded-lg"
            aria-label={siteConfig.company.legalName}
          >
            <Image
              src={siteConfig.company.logo}
              alt={siteConfig.company.legalName}
              width={344}
              height={148}
              priority
              className={`h-auto w-[118px] transition-all duration-standard ease-entrance sm:w-[142px] ${
                condensed ? 'lg:w-[132px]' : 'lg:w-[158px]'
              }`}
            />
          </a>

          <nav
            aria-label={t.nav.primary}
            className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="focus-ring-light group relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-0.5 py-2.5 font-display text-[14.5px] font-medium text-muted transition-colors duration-fast ease-feedback hover:text-deep"
              >
                {t.nav[link.key]}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1.5 start-1/2 end-1/2 h-0.5 rounded bg-teal transition-[inset] duration-standard ease-entrance group-hover:start-0 group-hover:end-0"
                />
              </a>
            ))}
          </nav>

          <div className="flex flex-none items-center gap-2.5">
            {/* Direct call pill. Stays visible at every width. */}
            <a
              href={callPrimaryHref()}
              aria-label={t.a11y.callPrimary}
              className="focus-ring-light u-press tap hidden min-h-[48px] items-center gap-2.5 rounded-full border border-hairline px-4 font-display text-[14px] font-semibold text-ink transition-colors duration-fast ease-feedback hover:border-deep hover:text-deep sm:inline-flex"
            >
              <PhoneIcon size={16} className="text-deep" />
              <span dir="ltr" className="tabular-nums">
                {siteConfig.contact.primaryPhone.display}
              </span>
            </a>

            <Button href="#intake" variant="primary" className="hidden xl:inline-flex">
              {t.cta.bookNow}
            </Button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t.a11y.openMenuLabel}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-haspopup="dialog"
              className="focus-ring-light u-press tap flex h-12 w-12 flex-none items-center justify-center rounded-full border border-hairline bg-white xl:hidden"
            >
              <span
                aria-hidden="true"
                className="relative block h-0.5 w-5 rounded bg-ink before:absolute before:-top-1.5 before:start-0 before:block before:h-0.5 before:w-5 before:rounded before:bg-ink before:content-[''] after:absolute after:top-1.5 after:start-0 after:block after:h-0.5 after:w-5 after:rounded after:bg-ink after:content-['']"
              />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile utility line. Hours as a statement, the office line as a link
          beside it, so nothing reads as a link that is not one. */}
      <div className="container-page md:hidden">
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full bg-paper px-4 py-2.5 text-[13px]">
          <span className="inline-flex items-center gap-2 font-medium text-muted">
            <ClockIcon size={14} className="text-deep" />
            {siteConfig.contact.hours.office}
          </span>
          <a
            href={callOfficeHref()}
            aria-label={t.a11y.callOfficeLabel}
            dir="ltr"
            className="focus-ring-light inline-flex min-h-[36px] items-center gap-2 rounded-full font-semibold tabular-nums text-deep"
          >
            <PhoneIcon size={14} />
            {siteConfig.contact.secondaryPhone.display}
          </a>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Navbar;
