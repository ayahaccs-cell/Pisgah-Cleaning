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
 * Glass construction: the ticked G3 #6B9071 as a 22 percent tint over a G5
 * ground, with backdrop-blur-md. The brief asked for G3 at 20 to 25 percent,
 * and that tint is exactly what is here; the ground under it is the addition.
 * A tint alone at that opacity inherits whatever the photograph is doing
 * behind it, and the hero frame runs from a dark lobby to a bright window
 * inside one image, so white type over it would measure anywhere from 2:1 to
 * 14:1 depending on scroll position. Over a G5 ground the same tint holds
 * white at 7.67:1 and G1 at 6.37:1 in the worst case, which is the bar
 * crossing the brightest part of the frame. Drop the ground layer if you would
 * rather have the plain wash and accept the legibility cost.
 *
 * The logo is the white knockout on transparency. No plate, no border, no fill
 * behind it. Its zone is flex-none with its own inline-end margin, so the
 * navigation can never slide under it at any width or in either language.
 *
 * Baseline: every zone is a direct items-center child of one row, and the
 * operating schedule is absolutely positioned under the phone number rather
 * than stacked above it in flow. That is what keeps the number, the WhatsApp
 * button, the navigation links and the language pill on one centre axis while
 * still tucking the schedule beneath the number.
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
        /* background-color carries the G5 ground and the no-backdrop-filter
           fallback; background-image carries the flat G3 tint on top of it.
           Two different properties, so neither overwrites the other. */
        className="fixed inset-x-0 top-0 z-[60] border-b border-sage-200/20 bg-sage-800/88 bg-gradient-to-b from-sage-400/[0.22] to-sage-400/[0.22] text-white backdrop-blur-md supports-[backdrop-filter]:bg-sage-800/70"
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
                className="focus-ring-ink group relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-0.5 font-display text-xs font-medium text-white/85 transition-colors duration-fast ease-feedback hover:text-sage-50 xl:text-sm"
              >
                {t.nav[link.key]}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 start-1/2 end-1/2 h-0.5 rounded bg-white transition-[inset] duration-standard ease-entrance group-hover:start-0 group-hover:end-0"
                />
              </a>
            ))}
          </nav>

          {/* ---- Zone 3: utility. One centre axis, schedule out of flow. ---- */}
          <div className="flex flex-none flex-nowrap items-center gap-2 sm:gap-2.5">
            {/* The wrapper is only as tall as the phone link, because the
                schedule below it is absolutely positioned. That is what keeps
                the number itself on the same axis as the navigation rather
                than pushed up by the line beneath it. */}
            <div className="relative hidden flex-none flex-col items-end sm:flex">
              <a
                href={callOfficeHref()}
                aria-label={t.a11y.callOfficeLabel}
                className="focus-ring-ink inline-flex items-center gap-1.5 whitespace-nowrap rounded text-xs font-semibold leading-tight text-white transition-colors duration-fast ease-feedback hover:text-sage-50"
              >
                <PhoneIcon size={14} className="flex-none text-sage-200" />
                <span dir="ltr" className="tabular-nums">
                  {siteConfig.contact.secondaryPhone.display}
                </span>
              </a>

              {/* end-0 rather than right-0, so it tucks under the number on the
                  correct side in Arabic with no second rule. */}
              <span className="absolute end-0 top-full mt-1 inline-flex items-center gap-1 whitespace-nowrap text-[10px] leading-tight tracking-normal text-sage-50/80">
                <ClockIcon size={11} className="flex-none" />
                {siteConfig.contact.hours.office}
              </span>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsappGeneric}
              className="focus-ring-ink u-press tap flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-deep transition-colors duration-fast ease-feedback hover:bg-sage-50 sm:h-9 sm:w-9"
            >
              <WhatsAppIcon size={18} />
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
