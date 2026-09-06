'use client';

import Image from 'next/image';
import { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { MobileDrawer } from './MobileDrawer';

/**
 * Green header, three zones.
 *
 * Left is the logo. It is flex-none with its own inline-end padding, so the
 * navigation can never slide under it however long the link labels become in
 * either language.
 *
 * Centre is the navigation. It is min-w-0 and flex-1, which lets it shrink
 * rather than push into its neighbours.
 *
 * Right is the contact cluster: hours, the office line, WhatsApp, the language
 * toggle and the primary action. Also flex-none.
 *
 * The collapse threshold is xl, which is 1280px. A 13 or 14 inch laptop is
 * typically 1280 to 1512 CSS pixels wide, and six link labels plus a full
 * contact cluster do not fit comfortably below that, so those machines get the
 * drawer instead of collided text.
 *
 * Dividers use border-s, not border-l, so they land on the correct side in
 * Arabic without an override.
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
  const { t, locale } = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const waHref = generateWhatsAppLink('hero', {}, { locale, ref: 'WEB-HEADER' });

  return (
    <>
      <header
        role="banner"
        aria-label={t.a11y.headerLandmark}
        className="sticky top-0 z-[60] bg-deep text-white shadow-nav"
      >
        <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center px-4 py-2.5 sm:min-h-[80px] sm:px-6">
          {/* ---- Zone 1: logo. Never shrinks, never shares its space. ---- */}
          <div className="flex flex-none items-center pe-6 xl:pe-8">
            <a
              href="#top"
              aria-label={siteConfig.company.legalName}
              className="focus-ring-ink flex items-center rounded-xl bg-white px-2.5 py-1.5 sm:px-3 sm:py-2"
            >
              <Image
                src={siteConfig.company.logo}
                alt={siteConfig.company.legalName}
                width={344}
                height={148}
                priority
                className="h-auto w-[100px] sm:w-[118px] xl:w-[132px]"
              />
            </a>
          </div>

          {/* ---- Zone 2: navigation. Shrinks before it collides. ---- */}
          <nav
            aria-label={t.nav.primary}
            className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex xl:gap-5"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="focus-ring-ink group relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-0.5 font-display text-xs font-medium tracking-normal text-white/85 transition-colors duration-fast ease-feedback hover:text-white lg:text-sm"
              >
                {t.nav[link.key]}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 start-1/2 end-1/2 h-0.5 rounded bg-white transition-[inset] duration-standard ease-entrance group-hover:start-0 group-hover:end-0"
                />
              </a>
            ))}
          </nav>

          {/* Spacer that only exists below xl, so the contact cluster still
              sits at the inline end once the navigation is hidden. */}
          <div className="flex-1 xl:hidden" />

          {/* ---- Zone 3: contact, language, action. ---- */}
          <div className="flex flex-none items-center gap-2 sm:gap-3">
            {/* Compact contact block, hairline divided. */}
            <div className="hidden items-center gap-3 lg:flex">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] leading-tight text-white/80">
                <ClockIcon size={14} className="flex-none text-white/60" />
                {siteConfig.contact.hours.office}
              </span>

              <a
                href={callOfficeHref()}
                aria-label={t.a11y.callOfficeLabel}
                className="focus-ring-ink inline-flex items-center gap-1.5 whitespace-nowrap rounded border-s border-white/30 ps-3 text-xs font-semibold leading-tight text-white transition-colors duration-fast ease-feedback hover:text-white/80"
              >
                <PhoneIcon size={14} className="flex-none text-white/60" />
                <span dir="ltr" className="tabular-nums">
                  {siteConfig.contact.secondaryPhone.display}
                </span>
              </a>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsappGeneric}
              className="focus-ring-ink u-press tap flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-[#0F766E] transition-colors duration-fast ease-feedback hover:bg-white/90 sm:h-11 sm:w-11"
            >
              <WhatsAppIcon size={19} />
            </a>

            <LocaleSwitcher tone="bar" className="hidden sm:inline-flex" />

            <Button href="#intake" variant="light" size="md" className="hidden xl:inline-flex">
              {t.cta.bookNow}
            </Button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t.a11y.openMenuLabel}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-haspopup="dialog"
              className="focus-ring-ink u-press tap flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/30 sm:h-11 sm:w-11 xl:hidden"
            >
              <span
                aria-hidden="true"
                className="relative block h-0.5 w-5 rounded bg-white before:absolute before:-top-1.5 before:start-0 before:block before:h-0.5 before:w-5 before:rounded before:bg-white before:content-[''] after:absolute after:top-1.5 after:start-0 after:block after:h-0.5 after:w-5 after:rounded after:bg-white after:content-['']"
              />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Navbar;
