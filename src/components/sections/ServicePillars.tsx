'use client';

import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/Reveal';
import { ChevronRight } from '@/components/ui/Icons';

/**
 * Four divisions, weighted.
 *
 * Commercial carries the contract revenue, so it takes a 60/40 share of the
 * section as a single ink panel. The three secondary divisions sit beside it as
 * hairline separated rows rather than as three more boxes, which is what stops
 * the section reading as a four up template grid.
 *
 * Division markers are IBM Plex Mono letters set into the type. There are no
 * icon badges anywhere in this section.
 */

const LETTERS = { commercial: 'A', residential: 'B', specialised: 'C', technical: 'D' } as const;

export function ServicePillars() {
  const { t, locale } = useLocale();
  const [lead, ...secondary] = siteConfig.divisions;
  const leadCopy = t.pillars[lead.id];

  const leadHref = generateWhatsAppLink('division', { Division: leadCopy.title }, {
    locale,
    ref: lead.ref,
  });

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

        <div className="mt-8 grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Primary division, three fifths of the row. */}
          <Reveal
            as="article"
            id={lead.id}
            className="u-lift group scroll-mt-28 rounded-[18px] surface-ink p-7 shadow-diffuse-ink sm:p-9 lg:col-span-3"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="numeral text-[clamp(30px,3.4vw,42px)] leading-none">
                {LETTERS[lead.id]}
              </span>
              <span className="spec spec-on-ink text-end">{t.pillars.leadLabel}</span>
            </div>

            <span aria-hidden="true" className="rule-stroke-ink mt-7 block h-[1.5px] w-full" />

            <h3 className="mt-7 max-w-[18ch] font-display text-[clamp(24px,2.7vw,34px)] font-bold text-white">
              {leadCopy.title}
            </h3>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-[#CBD5E1]">
              {leadCopy.summary}
            </p>
            <p className="spec spec-on-ink mt-5">{leadCopy.spec}</p>

            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {leadCopy.items.map((item) => (
                <li
                  key={item}
                  className="relative ps-4 text-[15px] leading-snug text-[#CBD5E1]"
                >
                  <span aria-hidden="true" className="bullet-dot bullet-dot-on-ink" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={leadHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsappDivision}
              className="focus-ring-ink u-glide-host mt-9 rounded-full inline-flex min-h-[48px] items-center gap-2.5 font-display text-[15px] font-semibold text-teal transition-colors duration-fast ease-feedback hover:text-cyan"
            >
              {t.cta.scopeRequest}
              <ChevronRight size={14} className="u-glide" />
            </a>
          </Reveal>

          {/* Secondary divisions, two fifths, as hairline separated rows. */}
          <div className="lg:col-span-2">
            {secondary.map((division, index) => {
              const copy = t.pillars[division.id];
              const href = generateWhatsAppLink('division', { Division: copy.title }, {
                locale,
                ref: division.ref,
              });

              return (
                <Reveal
                  as="article"
                  key={division.id}
                  id={division.id}
                  index={index + 1}
                  className={`group scroll-mt-28 py-7 first:pt-0 ${
                    index > 0 ? 'hair-light-t' : ''
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="numeral text-[22px] leading-none text-blue">
                      {LETTERS[division.id]}
                    </span>
                    <span className="spec">{copy.spec}</span>
                  </div>

                  <h3 className="mt-3 font-display text-[20px] font-bold">{copy.title}</h3>
                  <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {copy.summary}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {copy.items.map((item, itemIndex) => (
                      <li
                        key={item}
                        className={`relative ps-4 text-[14.5px] leading-snug text-muted ${
                          itemIndex > 3
                            ? 'lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-[max-height,opacity] lg:duration-standard lg:ease-entrance lg:group-hover:max-h-14 lg:group-hover:opacity-100 lg:group-focus-within:max-h-14 lg:group-focus-within:opacity-100'
                            : ''
                        }`}
                      >
                        <span aria-hidden="true" className="bullet-dot bullet-dot-soft" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.a11y.whatsappDivision}
                    className="focus-ring-light u-glide-host mt-5 rounded-full inline-flex min-h-[48px] items-center gap-2 font-display text-[14.5px] font-semibold text-deep transition-colors duration-fast ease-feedback hover:text-blue"
                  >
                    {t.cta.scopeRequest}
                    <ChevronRight size={13} className="u-glide" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicePillars;
