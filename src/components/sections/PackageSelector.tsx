'use client';

import Image from 'next/image';
import { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/ui/Icons';

/**
 * Service scope selector.
 *
 * Five distinct scopes of work, not five rungs of one residential ladder.
 * Coverage and deployment are published. The figure is not, anywhere, in any
 * form. Selecting a scope carries it into the WhatsApp message, which is how
 * demand is measured without publishing rates.
 *
 * The featured flag is gone with the tiers. It rendered a "most requested"
 * label, which was a claim about demand that nothing on file supports, and
 * five different jobs have no top of the list to mark. The selected card still
 * takes an accent ring, because that is state rather than a claim.
 *
 * The line that used to sit under each button, "priced after survey, never
 * over the phone", is gone too. The section heading and the intro now say it
 * once at the top instead of five times down the row.
 */

export function PackageSelector() {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="packages" aria-labelledby="packages-heading" className="section-rhythm bg-canvas">
      <div className="container-page">
        <Reveal className="headline-light grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="spec spec-cyan">{t.packages.spec}</p>
            <h2
              id="packages-heading"
              className="mt-5 text-[clamp(27px,3.2vw,40px)] font-bold leading-[1.12] tracking-tight"
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
          {siteConfig.packages.map((scope, index) => {
            const copy = t.packages.scopes[scope.id];
            const isSelected = selected === scope.id;
            const href = generateWhatsAppLink(
              'package',
              {
                [t.packages.tierLabel]: copy.name,
                [t.packages.coverageLabel]: copy.covers.join(', '),
                [t.packages.deploymentLabel]: copy.deployment,
              },
              { locale, ref: scope.ref },
            );

            return (
              <Reveal
                as="article"
                key={scope.id}
                index={index}
                className={`group u-lift flex w-[82%] flex-none snap-start flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-card transition-shadow hover:shadow-lifted sm:w-auto ${
                  isSelected ? 'ring-2 ring-emerald' : ''
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
                  <Image
                    src={siteConfig.media.scopes[scope.id]}
                    alt={copy.name}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1280px) 45vw, 20vw"
                    className="object-cover transition-transform duration-standard ease-entrance group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                <span className="numeral numeral-accent text-[26px] leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span aria-hidden="true" className="hair-light-t mt-4 block" />

                <h3 className="h-ui mt-4 text-[18px] leading-snug">
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

                {/* Same sans stack, same size and colour as the coverage list
                    above, so the two blocks read as one card rather than as a
                    body list with a machine readout stapled underneath. */}
                <div className="hair-light-t mt-5 pt-4">
                  <p className="spec">{t.packages.deploymentLabel}</p>
                  <p className="mt-1.5 text-[14.5px] font-normal leading-snug text-muted">
                    {copy.deployment}
                  </p>
                </div>

                {/* Where a price would sit. The obsidian fill reads as the
                    quiet member of the button family: filled enough to be
                    obviously pressable at 19:1, dark enough not to compete
                    with the emerald primaries elsewhere on the page. */}
                <div className="mt-auto pt-6">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSelected(scope.id)}
                    onFocus={() => setSelected(scope.id)}
                    aria-label={t.a11y.whatsappPackage}
                    className="focus-ring-light u-press tap flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-obsidian px-4 text-center text-[13px] font-medium text-white transition-colors duration-fast ease-feedback hover:bg-carbon"
                  >
                    <WhatsAppIcon size={16} />
                    {t.cta.inspection}
                  </a>
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
