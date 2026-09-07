'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/Reveal';
import { ChevronDown, ChevronRight } from '@/components/ui/Icons';

/**
 * Three divisions, as a single-panel accordion.
 *
 * Commercial is open on load because it carries the contract revenue. Opening
 * Residential or Specialised closes whatever was open, so the section never
 * grows past one expanded panel and the page below it stays reachable.
 *
 * The panel is a real button and a real region, wired with aria-expanded and
 * aria-controls. Closed panels are removed from the tree rather than hidden
 * with opacity, so a screen reader and a Tab key both agree with what is on
 * screen.
 *
 * There is no height animation. Animating height forces layout on every frame
 * and produces exactly the jarring shift this section was meant to remove, so
 * the panel simply appears and the chevron rotates.
 */

const LETTERS = { commercial: 'A', residential: 'B', specialised: 'C' } as const;

type DivisionId = (typeof siteConfig.divisions)[number]['id'];

export function ServicePillars() {
  const { t, locale } = useLocale();
  const [openId, setOpenId] = useState<DivisionId>('commercial');

  return (
    <section id="services" aria-labelledby="services-heading" className="section-rhythm bg-white">
      <div className="container-page">
        <Reveal className="headline-light max-w-[62ch]">
          <p className="spec spec-cyan">{t.pillars.spec}</p>
          <h2
            id="services-heading"
            className="mt-5 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.04]"
          >
            {t.pillars.heading}
          </h2>
          <span aria-hidden="true" className="rule-stroke mt-5" />
          <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{t.pillars.intro}</p>
        </Reveal>

        <div className="mt-8 flex flex-col gap-3">
          {siteConfig.divisions.map((division, index) => {
            const copy = t.pillars[division.id];
            const isOpen = openId === division.id;
            const panelId = `division-panel-${division.id}`;
            const buttonId = `division-button-${division.id}`;
            const href = generateWhatsAppLink('division', { Division: copy.title }, {
              locale,
              ref: division.ref,
            });

            return (
              <Reveal
                as="article"
                key={division.id}
                id={division.id}
                index={index}
                className={`scroll-mt-28 overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-standard ease-entrance ${
                  isOpen
                    ? 'border-deep/40 bg-white shadow-diffuse-lg'
                    : 'border-hairline bg-paper/60 shadow-diffuse hover:border-deep/25'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(division.id)}
                    className="focus-ring-light tap flex w-full items-center gap-4 px-5 py-5 text-start sm:gap-6 sm:px-7 sm:py-6"
                  >
                    <span className="numeral flex-none text-[22px] leading-none sm:text-[26px]">
                      {LETTERS[division.id]}
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="spec spec-cyan">{copy.spec}</span>
                      <span className="mt-1.5 font-display text-[18px] font-bold leading-snug text-ink sm:text-[21px]">
                        {copy.title}
                      </span>
                      {!isOpen && (
                        <span className="mt-1.5 line-clamp-2 text-[14.5px] leading-snug text-muted">
                          {copy.summary}
                        </span>
                      )}
                    </span>

                    {/* Rotation is on the block axis, so it needs no RTL flip. */}
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 flex-none place-items-center rounded-full border transition-transform duration-standard ease-entrance ${
                        isOpen
                          ? 'rotate-180 border-deep/30 bg-deep/10 text-deep'
                          : 'border-hairline bg-white text-muted'
                      }`}
                    >
                      <ChevronDown size={17} />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-5 pb-6 sm:px-7 sm:pb-7"
                  >
                    <span aria-hidden="true" className="hair-light-t mb-5 block" />

                    <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-muted">
                      {copy.summary}
                    </p>

                    <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {copy.items.map((item) => (
                        <li
                          key={item}
                          className="relative ps-4 text-[14.5px] leading-snug text-muted"
                        >
                          <span aria-hidden="true" className="bullet-dot" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.a11y.whatsappDivision}
                      className="focus-ring-light u-glide-host mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full font-display text-[14.5px] font-semibold text-deep transition-colors duration-fast ease-feedback hover:text-blue"
                    >
                      {t.cta.scopeRequest}
                      <ChevronRight size={14} className="u-glide" />
                    </a>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicePillars;
