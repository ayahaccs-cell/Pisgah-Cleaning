'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { MobileDrawer } from './MobileDrawer';
import { useState } from 'react';

/**
 * Single green header.
 *
 * The separate white sub-bar is gone. Working hours, the direct office line and
 * the WhatsApp action are embedded here, on the brand green, with the logo on a
 * white plate at the inline start and the drawer toggle at the inline end.
 *
 * Every value is read from siteConfig, so a change of line or of hours flows
 * through without an edit here.
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
        <div className="container-page flex min-h-[72px] items-center justify-between gap-3 py-2.5 sm:min-h-[84px] sm:gap-5 sm:py-3">
          {/* Logo on a white plate, so the blue mark keeps its contrast. */}
          <a
            href="#top"
            aria-label={siteConfig.company.legalName}
            className="focus-ring-ink flex flex-none items-center rounded-xl bg-white px-2.5 py-1.5 sm:px-3 sm:py-2"
          >
            <Image
              src={siteConfig.company.logo}
              alt={siteConfig.company.legalName}
              width={344}
              height={148}
              priority
              className="h-auto w-[104px] sm:w-[128px] lg:w-[146px]"
            />
          </a>

          {/* Primary links. Centred from xl, in the drawer below that. */}
          <nav
            aria-label={t.nav.primary}
            className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="focus-ring-ink group relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded px-0.5 font-display text-[14.5px] font-medium text-white/85 transition-colors duration-fast ease-feedback hover:text-white"
              >
                {t.nav[link.key]}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 start-1/2 end-1/2 h-0.5 rounded bg-white transition-[inset] duration-standard ease-entrance group-hover:start-0 group-hover:end-0"
                />
              </a>
            ))}
          </nav>

          {/* Contact cluster. Hours are a statement, the number is a link. */}
          <div className="flex flex-none items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 whitespace-nowrap text-[12.5px] text-white/80 lg:inline-flex">
              <ClockIcon size={15} className="text-white/70" />
              {siteConfig.contact.hours.office}
            </span>

            <a
              href={callOfficeHref()}
              aria-label={t.a11y.callOfficeLabel}
              className="focus-ring-ink u-press tap hidden min-h-[44px] items-center gap-2 rounded-full border border-white/30 px-3.5 font-display text-[13.5px] font-semibold text-white transition-colors duration-fast ease-feedback hover:bg-white/10 sm:inline-flex"
            >
              <PhoneIcon size={15} />
              <span dir="ltr" className="tabular-nums">
                {siteConfig.contact.secondaryPhone.display}
              </span>
            </a>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsappGeneric}
              className="focus-ring-ink u-press tap flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white text-[#0F766E] transition-colors duration-fast ease-feedback hover:bg-white/90 sm:h-12 sm:w-12"
            >
              <WhatsAppIcon size={20} />
            </a>

            <LocaleSwitcher tone="bar" className="hidden sm:inline-flex" />

            <Button href="#intake" variant="light" className="hidden xl:inline-flex">
              {t.cta.bookNow}
            </Button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t.a11y.openMenuLabel}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-haspopup="dialog"
              className="focus-ring-ink u-press tap flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/30 xl:hidden sm:h-12 sm:w-12"
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
