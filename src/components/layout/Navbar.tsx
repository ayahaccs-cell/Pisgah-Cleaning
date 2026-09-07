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
 * Translucent header, three zones.
 *
 * The bar floats over the hero photograph rather than sitting above it, so the
 * image reads from the very top of the page. It is fixed, and the hero carries
 * matching top padding to clear it.
 *
 * The logo is the white knockout on transparency. No plate, no border, no fill
 * behind it. Its zone is flex-none with its own inline-end padding, so the
 * navigation can never slide under it at any width or in either language.
 *
 * Collapse threshold is xl (1280px). A 13 or 14 inch laptop reports 1280 to
 * 1512 CSS pixels, and five link labels plus a full contact cluster do not fit
 * comfortably below that, so those machines get the drawer instead of clipped
 * text.
 *
 * Dividers use border-s, not border-l, so they land on the correct side in
 * Arabic with no override.
 */

export const NAV_LINKS = [
  { href: '#commercial', key: 'commercial' },
  { href: '#residential', key: 'residential' },
  { href: '#specialised', key: 'specialised' },
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
        className="fixed inset-x-0 top-0 z-[60] border-b border-emerald-500/20 bg-emerald-950/75 text-white backdrop-blur-md supports-[backdrop-filter]:bg-emerald-950/40"
      >
        <div className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:min-h-[76px] sm:px-6">
          {/* ---- Zone 1: logo. Transparent, unboxed, never shares its space. ---- */}
          <div className="flex flex-none items-center me-6 sm:me-8 lg:me-10">
            <a
              href="#top"
              aria-label={siteConfig.company.legalName}
              className="focus-ring-ink flex items-center rounded-lg"
            >
              <Image
                src={siteConfig.company.logoLight}
                alt={siteConfig.company.legalName}
                width={1200}
                height={481}
                priority
                sizes="(max-width: 640px) 132px, (max-width: 1280px) 152px, 172px"
                className="h-auto w-[132px] sm:w-[152px] xl:w-[172px]"
              />
            </a>
          </div>

          {/* ---- Zone 2: navigation. Shrinks before it collides. ---- */}
          <nav
            aria-label={t.nav.primary}
            className="hidden min-w-0 flex-1 items-center justify-center gap-3 pe-6 xl:flex xl:gap-5"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="focus-ring-ink group relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-0.5 font-display text-xs font-medium text-white/85 transition-colors duration-fast ease-feedback hover:text-white xl:text-sm"
              >
                {t.nav[link.key]}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 start-1/2 end-1/2 h-0.5 rounded bg-white transition-[inset] duration-standard ease-entrance group-hover:start-0 group-hover:end-0"
                />
              </a>
            ))}
          </nav>

          {/* ---- Zone 3: utility. Two lines, so it stays narrow. ---- */}
          <div className="flex flex-none flex-nowrap items-center gap-2 sm:gap-3">
            {/* Line 1: number beside the WhatsApp button.
                Line 2: the schedule, sitting under the number. */}
            <div className="flex flex-none flex-col items-end gap-0.5">
              <div className="flex flex-nowrap items-center gap-2 sm:gap-2.5">
                <a
                  href={callOfficeHref()}
                  aria-label={t.a11y.callOfficeLabel}
                  className="focus-ring-ink hidden items-center gap-1.5 whitespace-nowrap rounded text-xs font-semibold leading-tight text-white transition-colors duration-fast ease-feedback hover:text-white/80 sm:inline-flex"
                >
                  <PhoneIcon size={14} className="flex-none text-white/60" />
                  <span dir="ltr" className="tabular-nums">
                    {siteConfig.contact.secondaryPhone.display}
                  </span>
                </a>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.a11y.whatsappGeneric}
                  className="focus-ring-ink u-press tap flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/95 text-[#0F766E] transition-colors duration-fast ease-feedback hover:bg-white sm:h-9 sm:w-9"
                >
                  <WhatsAppIcon size={18} />
                </a>
              </div>

              <span className="hidden items-center gap-1 whitespace-nowrap text-[10px] leading-tight tracking-normal text-emerald-200/80 sm:inline-flex">
                <ClockIcon size={11} className="flex-none" />
                {siteConfig.contact.hours.office}
              </span>
            </div>

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
