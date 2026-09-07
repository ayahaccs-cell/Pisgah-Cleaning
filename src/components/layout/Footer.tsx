'use client';

import Image from 'next/image';
import { formatAddress, siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import {
  callOfficeHref,
  callPrimaryHref,
  generateWhatsAppLink,
  mailHref,
} from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/Icons';

/**
 * Semantic footer.
 *
 * Facility managers read footers, so the registration details, the real street
 * address and the full discipline list all live here. The CR segment renders
 * only when siteConfig.company.crNumber is populated, so no placeholder dashes
 * ever ship.
 */

const SERVICE_LINKS = [
  { href: '#commercial', key: 'commercial' },
  { href: '#residential', key: 'residential' },
  { href: '#specialised', key: 'specialised' },
] as const;

const COMPANY_LINKS = [
  { href: '#about', key: 'about' },
  { href: '#process', key: 'process' },
  { href: '#leadership', key: 'leadership' },
  { href: '#clients', key: 'clients' },
  { href: '#careers', key: 'careers' },
  { href: '#contact', key: 'contact' },
] as const;

export function Footer() {
  const { t, locale } = useLocale();
  const waHref = generateWhatsAppLink('footer', {}, { locale });
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      role="contentinfo"
      aria-label={t.a11y.footerLandmark}
      className="bg-ink text-faint-soft"
    >

      <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4 lg:py-14">
        {/* Identity */}
        <div>
          <Image
            src={siteConfig.company.logoLight}
            alt={siteConfig.company.legalName}
            width={1200}
            height={481}
            sizes="180px"
            className="h-auto w-[180px]"
          />
          <p className="mt-5 max-w-[34ch] font-display text-xl font-medium text-white">
            {t.footer.promise}
          </p>
          <Button
            href={waHref}
            external
            variant="whatsapp"
            className="mt-5"
            aria-label={t.a11y.whatsappGeneric}
          >
            <WhatsAppIcon size={18} />
            {t.cta.whatsapp}
          </Button>
        </div>

        {/* Services */}
        <nav aria-label={t.footer.servicesTitle}>
          <h2 className="font-mono text-[11px] uppercase track-label text-cyan">
            {t.footer.servicesTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {SERVICE_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="focus-ring-ink inline-block rounded text-[15px] transition-colors duration-fast ease-feedback hover:text-white"
                >
                  {t.pillars[link.key].title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label={t.footer.companyTitle}>
          <h2 className="font-mono text-[11px] uppercase track-label text-cyan">
            {t.footer.companyTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {COMPANY_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className="focus-ring-ink inline-block rounded text-[15px] transition-colors duration-fast ease-feedback hover:text-white"
                >
                  {t.footer.quickLinks[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="font-mono text-[11px] uppercase track-label text-cyan">
            {t.footer.contactTitle}
          </h2>
          <ul className="mt-4 space-y-3.5 text-[15px]">
            <li className="flex items-start gap-2.5">
              <PhoneIcon size={16} className="mt-1 flex-none text-cyan" />
              <span className="flex flex-col">
                <a
                  href={callPrimaryHref()}
                  dir="ltr"
                  aria-label={t.a11y.callPrimary}
                  className="focus-ring-ink rounded hover:text-white"
                >
                  {siteConfig.contact.primaryPhone.display}
                </a>
                <a
                  href={callOfficeHref()}
                  dir="ltr"
                  aria-label={t.a11y.callOfficeLabel}
                  className="focus-ring-ink rounded hover:text-white"
                >
                  {siteConfig.contact.secondaryPhone.display}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MailIcon size={16} className="mt-1 flex-none text-cyan" />
              <a
                href={mailHref()}
                aria-label={t.a11y.emailLabel}
                className="focus-ring-ink break-all rounded hover:text-white"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PinIcon size={16} className="mt-1 flex-none text-cyan" />
              <address className="not-italic leading-relaxed">{formatAddress()}</address>
            </li>
            <li className="flex items-start gap-2.5">
              <ClockIcon size={16} className="mt-1 flex-none text-cyan" />
              <span className="flex flex-col">
                <span>{siteConfig.contact.hours.office}</span>
                <span className="text-cyan">{siteConfig.contact.hours.emergency}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Credentials */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5">
          <p className="font-mono text-[11.5px]">
            {`© ${year} ${siteConfig.company.legalName}`}
            {siteConfig.company.crNumber
              ? ` · ${t.footer.crLabel} ${siteConfig.company.crNumber}`
              : ''}
            {` · ${t.footer.establishedLabel} ${siteConfig.company.established} · ${siteConfig.company.country}`}
          </p>
          <p className="spec spec-on-ink">{t.footer.disciplines}</p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
