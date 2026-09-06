'use client';

import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';

/**
 * Landmark client strip.
 *
 * Typographic, monochrome, and separated by hairlines rather than boxed. A
 * logo wall shouts; a name list set quietly reads as a matter of record, which
 * is the stronger claim on an account like Cineco or Silah Gulf.
 *
 * Names render until an account gives written permission and a logo path is
 * added to siteConfig.clients. Nothing else in this component changes.
 */

export function ClientStrip() {
  const { t } = useLocale();

  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="bg-ink py-rhythm-sm text-[#94A3B8]"
    >
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <p className="spec spec-on-ink">{t.clients.spec}</p>
          <h2
            id="clients-heading"
            className="mt-5 max-w-[22ch] font-display text-[clamp(19px,1.9vw,24px)] font-semibold leading-snug text-white"
          >
            {t.clients.heading}
          </h2>
          <span aria-hidden="true" className="rule-stroke-ink mt-6 block h-[1.5px] w-full" />
          <p className="spec spec-on-ink mt-5">{t.clients.ratingLabel}</p>
        </div>

        {/* Two column register on desktop, hairline ruled. Not a logo wall. */}
        <ul className="lg:col-span-8 lg:columns-2 lg:gap-14">
          {siteConfig.clients.map((client, index) => (
            <li
              key={client.id}
              className={`flex items-baseline gap-5 break-inside-avoid py-3.5 opacity-[.66] transition-opacity duration-fast ease-feedback hover:opacity-100 ${
                index === 0 ? '' : 'hair-t'
              }`}
            >
              <span className="numeral text-[12px] leading-none text-teal/80">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-display text-[16px] font-semibold leading-snug text-white">
                  {client.name}
                </span>
                {client.detail ? (
                  <span className="spec spec-on-ink mt-1">{client.detail}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ClientStrip;
