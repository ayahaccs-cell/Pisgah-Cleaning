'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, callPrimaryHref, mailHref } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { StatusDot } from '@/components/ui/Icons';
import { MobileDrawer } from './MobileDrawer';

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
    const io = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: '-120px 0px 0px 0px', threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="nav-sentinel" aria-hidden="true" className="absolute inset-x-0 top-0 h-px" />

      {/* Utility strip */}
      <section
        aria-label={t.a11y.utilityLandmark}
        className="relative z-[60] bg-ink text-[#B9CFD8]"
      >
        <div className="container-page flex min-h-[48px] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[11.5px]">
              <StatusDot />
              <b className="font-medium text-[#DDEBF2]">{t.util.emergency}</b>
              <a
                href={callPrimaryHref()}
                dir="ltr"
                aria-label={t.a11y.callPrimary}
                className="focus-ring-ink rounded text-cyan hover:text-[#5FC6F2]"
              >
                {siteConfig.contact.primaryPhone.display}
              </a>
            </span>
            <span className="hidden whitespace-nowrap font-mono text-[11.5px] text-[#8FAEBA] sm:inline-flex sm:items-center sm:gap-2">
              {t.util.office}
              <a
                href={callOfficeHref()}
                dir="ltr"
                aria-label={t.a11y.callOfficeLabel}
                className="focus-ring-ink rounded text-cyan hover:text-[#5FC6F2]"
              >
                {siteConfig.contact.secondaryPhone.display}
              </a>
            </span>
            <a
              href={mailHref()}
              aria-label={t.a11y.emailLabel}
              className="focus-ring-ink hidden rounded font-mono text-[11.5px] text-cyan hover:text-[#5FC6F2] lg:inline"
            >
              {siteConfig.contact.email}
            </a>
            <span className="hidden font-mono text-[11.5px] text-[#8FAEBA] lg:inline">
              {siteConfig.contact.hours.office}
            </span>
          </div>
          <LocaleSwitcher tone="bar" />
        </div>
      </section>

      {/* Header */}
      <div className="container-page sticky top-0 z-[55] mt-3.5">
        <header
          role="banner"
          aria-label={t.a11y.headerLandmark}
          className={`flex items-center justify-between gap-4 rounded-card bg-white px-3.5 shadow-nav transition-all duration-standard ease-entrance sm:px-5 ${
            condensed ? 'min-h-[64px] py-2' : 'min-h-[76px] py-3'
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
              className={`h-auto w-[124px] transition-all duration-standard ease-entrance sm:w-[150px] ${
                condensed ? 'lg:w-[140px]' : 'lg:w-[168px]'
              }`}
            />
          </a>

          <nav aria-label={t.nav.primary} className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex xl:gap-5">
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

          <Button href="#intake" variant="primary" className="hidden flex-none xl:inline-flex">
            {t.cta.survey}
          </Button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t.a11y.openMenuLabel}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            aria-haspopup="dialog"
            className="focus-ring-light u-press tap flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-hairline bg-white xl:hidden"
          >
            <span aria-hidden="true" className="relative block h-0.5 w-5 rounded bg-ink before:absolute before:-top-1.5 before:start-0 before:block before:h-0.5 before:w-5 before:rounded before:bg-ink before:content-[''] after:absolute after:top-1.5 after:start-0 after:block after:h-0.5 after:w-5 after:rounded after:bg-ink after:content-['']" />
          </button>
        </header>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Navbar;
