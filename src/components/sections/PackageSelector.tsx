'use client';

import Image from 'next/image';
import { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/ui/Icons';

/**
 * Residential package selector.
 *
 * Coverage and crew size are published. The figure is not, anywhere, in any
 * form. Selecting a tier carries it into the WhatsApp message, which is how
 * demand is measured without publishing rates.
 *
 * Tiers are numbered in IBM Plex Mono and separated by hairlines. There is no
 * icon, no ribbon and no coloured fill on the featured tier: it is marked by a
 * single hairline in Deep Blue and a mono label.
 */

export function PackageSelector() {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="packages" aria-labelledby="packages-heading" className="section-rhythm bg-paper">
      <div className="container-page">
        <Reveal className="headline-light grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="spec spec-cyan">{t.packages.spec}</p>
            <h2
              id="packages-heading"
              className="mt-5 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.04]"
            >
              {t.packages.heading}
            </h2>
            <span aria-hidden="true" className="rule-stroke mt-5" />
          </div>
          <p className="text-[16.5px] leading-relaxed text-muted lg:col-span-5">
            {t.packages.intro}
          </p>
        </Reveal>

        {/* Snap carousel on a phone, five columns on a wide desktop. */}
        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [overscroll-behavior-x:contain] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-5">
          {siteConfig.packages.map((tier, index) => {
            const copy = t.packages.tiers[tier.id];
            const isSelected = selected === tier.id;
            const href = generateWhatsAppLink(
              'package',
              {
                [t.packages.tierLabel]: copy.name,
                [t.packages.coverageLabel]: copy.covers.join(', '),
                [t.packages.crewLabel]: `${copy.crew} ${copy.duration}`,
              },
              { locale, ref: tier.ref },
            );

            return (
              <Reveal
                as="article"
                key={tier.id}
                index={index}
                className={`group u-lift flex w-[82%] flex-none snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-diffuse transition-shadow hover:shadow-diffuse-lg sm:w-auto ${
                  tier.featured
                    ? 'border border-deep/70 ring-1 ring-inset ring-deep/15'
                    : 'border border-ink/[0.07]'
                } ${isSelected ? 'ring-2 ring-teal' : ''}`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
                  <Image
                    src={siteConfig.media.tiers[tier.id]}
                    alt={copy.name}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1280px) 45vw, 20vw"
                    className="object-cover transition-transform duration-standard ease-entrance group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="numeral text-[26px] leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {tier.featured ? (
                    <span className="spec text-deep">{t.packages.featuredLabel}</span>
                  ) : null}
                </div>

                <span aria-hidden="true" className="hair-light-t mt-4 block" />

                <h3 className="mt-4 font-display text-[19px] font-bold leading-snug">
                  {copy.name}
                </h3>

                <p className="spec mt-5">{t.packages.coverageLabel}</p>
                <ul className="mt-3 space-y-2.5">
                  {copy.covers.map((room) => (
                    <li key={room} className="relative ps-4 text-[14.5px] leading-snug text-muted">
                      <span aria-hidden="true" className="bullet-dot" />
                      {room}
                    </li>
                  ))}
                </ul>

                <div className="hair-light-t mt-5 pt-4">
                  <p className="spec">{t.packages.crewLabel}</p>
                  <p className="mt-1.5 font-mono text-[12.5px] tabular-nums text-body">
                    {copy.crew} / {copy.duration}
                  </p>
                </div>

                {/* Where a price would sit. */}
                <div className="mt-auto pt-6">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSelected(tier.id)}
                    onFocus={() => setSelected(tier.id)}
                    aria-label={t.a11y.whatsappPackage}
                    className="focus-ring-light u-press flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-deep px-4 text-center font-display text-[14.5px] font-semibold text-white shadow-deep hover:bg-blue hover:shadow-cyan tap"
                  >
                    <WhatsAppIcon size={16} />
                    {t.cta.inspection}
                  </a>
                  <p className="spec mt-3 text-center">{t.packages.priceLine}</p>
                </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PackageSelector;
