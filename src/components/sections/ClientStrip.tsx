'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { Reveal, rc } from '@/components/ui/Reveal';

/**
 * The client register. A dark architectural band.
 *
 * The hero proof strip carries six marks as a quiet signal. This section is
 * the full record: every retained account, its mark, and the scope line that
 * says what Pisgah actually holds there. Names and scopes are localised; only
 * the id and the artwork live in siteConfig.
 *
 * The marks are prepared as white silhouettes on transparency at a uniform box,
 * so this component sets opacity and nothing else. No filter chain, no colour
 * correction per logo, and no auto-scrolling marquee: a register that scrolls
 * itself reads as decoration rather than as a matter of record.
 */

export function ClientStrip() {
  const { t } = useLocale();

  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="section-rhythm bg-obsidian text-faint-soft"
    >
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal stack className="lg:col-span-4">
            <p {...rc(0)} className="spec spec-on-ink">{t.clients.spec}</p>
            <h2
              {...rc(0)}
              id="clients-heading"
              className="mt-5 max-w-[20ch] text-[clamp(25px,2.8vw,34px)] font-semibold leading-[1.14] tracking-tight text-white"
            >
              {t.clients.heading}
            </h2>
            <span {...rc(1)} aria-hidden="true" className="rule-stroke-ink mt-6 block h-[1.5px] w-full" />
            <p {...rc(1)} className="spec spec-on-ink mt-5">{t.clients.ratingLabel}</p>
          </Reveal>

          {/* A ruled register, two columns on a wide screen. Not a logo wall. */}
          <ul className="grid gap-x-10 border-t border-white/10 lg:col-span-8 lg:grid-cols-2">
            {siteConfig.clients.map((client, index) => (
              <Reveal
                as="li"
                key={client.id}
                index={index}
                className="flex items-center gap-5 border-b border-white/10 py-4"
              >
                <span className="flex h-9 w-[92px] flex-none items-center justify-center">
                  <Image
                    src={client.logo}
                    alt=""
                    width={siteConfig.clientLogoBox.width}
                    height={siteConfig.clientLogoBox.height}
                    sizes="92px"
                    className="client-mark max-h-9 w-auto object-contain"
                  />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="h-ui text-[15px] leading-snug text-white">
                    {t.clients.names[client.id]}
                  </span>
                  <span className="spec spec-on-ink mt-1">{t.clients.scopes[client.id]}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ClientStrip;
