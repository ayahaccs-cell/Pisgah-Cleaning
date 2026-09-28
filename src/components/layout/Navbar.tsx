'use client';

import Image from 'next/image';
import { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { MobileDrawer } from './MobileDrawer';

/**
 * Floating pill navigation.
 *
 * The bar is no longer a full width strip. It is a carbon pill, inset from the
 * page edge and overlapping the top of the framed hero, which is what gives
 * the composition its architectural read. The pill is one of exactly two
 * surfaces in the system permitted to use backdrop-filter; .glass-pill in
 * tailwind.config.ts is the only place its blur is defined, and it ships an
 * opaque fallback for engines without backdrop-filter support.
 *
 * Measured over the brightest frame the hero photograph can present, the pill
 * holds white nav labels at 9.51:1 and the slate metadata at 4.61:1.
 *
 * Three zones, unchanged from the previous build because the collision
 * behaviour was already right: logo, navigation, utility. The logo zone owns
 * its inline-end margin and the navigation owns its inline-end padding, so the
 * two cannot meet at any width or in either language.
 *
 * Baseline: the operating schedule is absolutely positioned under the phone
 * number rather than stacked above it in flow, so the number, the WhatsApp
 * button, the navigation links and the language pill share one centre axis.
 *
 * Collapse threshold is xl (1280px). A 13 or 14 inch laptop reports 1280 to
 * 1512 CSS pixels, and five link labels plus a full contact cluster do not fit
 * comfortably below that, so those machines get the drawer instead of clipped
 * text.
 */

/**
 * One list, rendered by the pill nav and the drawer alike.
 *
 * The three division hrefs are the ids of the accordion cards themselves, not
 * of the section wrapper. That is deliberate: ServicePillars watches the hash
 * and opens the matching division, so a nav click scrolls to the services and
 * expands the right panel in one move, and the same URL is shareable.
 */
export const NAV_LINKS = [
  { href: '#commercial', key: 'commercial' },
  { href: '#residential', key: 'residential' },
  { href: '#specialised', key: 'specialised' },
  { href: '#clients', key: 'clients' },
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
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] px-3 pt-5 sm:px-5 sm:pt-6"
      >
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="glass-pill pointer-events-auto flex min-h-[60px] items-center justify-between gap-4 rounded-full border border-white/10 px-4 py-2 text-white shadow-pill sm:min-h-[64px] sm:px-6">
            {/* ---- Zone 1: logo. Transparent, unboxed, never shares its space. ---- */}
            <div className="me-5 flex flex-none items-center sm:me-7 lg:me-9">
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
                  sizes="(max-width: 640px) 112px, (max-width: 1280px) 128px, 146px"
                  className="h-auto w-[112px] sm:w-[128px] xl:w-[146px]"
                />
              </a>
            </div>

            {/* ---- Zone 2: navigation. Shrinks before it collides. ---- */}
            <nav
              aria-label={t.nav.primary}
              className="hidden min-w-0 flex-1 items-center justify-center gap-3.5 pe-5 xl:flex xl:gap-5"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="focus-ring-ink group relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-0.5 text-[13px] font-medium text-white/85 transition-colors duration-fast ease-feedback hover:text-white"
                >
                  {t.nav[link.key]}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1.5 start-1/2 end-1/2 h-px rounded bg-white transition-[inset] duration-standard ease-entrance group-hover:start-0 group-hover:end-0"
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
                  href={callPrimaryHref()}
                  aria-label={t.a11y.callPrimary}
                  className="focus-ring-ink inline-flex items-center gap-1.5 whitespace-nowrap rounded text-xs font-semibold leading-tight text-white transition-colors duration-fast ease-feedback hover:text-white/80"
                >
                  <PhoneIcon size={14} className="flex-none text-faint-soft" />
                  <span dir="ltr" className="tabular-nums">
                    {siteConfig.contact.primaryPhone.display}
                  </span>
                </a>

                {/* end-0 rather than right-0, so it tucks under the number on
                    the correct side in Arabic with no second rule. */}
                <span className="absolute end-0 top-full mt-1 inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-medium leading-tight tracking-normal text-faint-soft">
                  <ClockIcon size={11} className="flex-none" />
                  {siteConfig.contact.hours.office}
                </span>
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.a11y.whatsappGeneric}
                className="focus-ring-ink u-press tap flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-fast ease-feedback hover:bg-white/20 sm:h-9 sm:w-9"
              >
                <WhatsAppIcon size={18} />
              </a>

              <LocaleSwitcher tone="bar" className="hidden sm:inline-flex" />

              <Button href="#intake" variant="primary" size="md" className="hidden xl:inline-flex">
                {t.cta.bookNow}
              </Button>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={t.a11y.openMenuLabel}
                aria-expanded={drawerOpen}
                aria-controls="mobile-drawer"
                aria-haspopup="dialog"
                className="focus-ring-ink u-press tap flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/20 xl:hidden"
              >
                <span
                  aria-hidden="true"
                  className="relative block h-px w-5 rounded bg-white before:absolute before:-top-1.5 before:start-0 before:block before:h-px before:w-5 before:rounded before:bg-white before:content-[''] after:absolute after:top-1.5 after:start-0 after:block after:h-px after:w-5 after:rounded after:bg-white after:content-['']"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Navbar;
