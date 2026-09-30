'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { Reveal, rc } from '@/components/ui/Reveal';
import { ChevronRight } from '@/components/ui/Icons';

/**
 * The Pisgah Standard.
 *
 * Not three identical boxes. An architectural timeline: a sticky heading rail
 * on the inline start, and three entries on the inline end that step inward and
 * shrink in type scale as the sequence progresses. The numerals are IBM Plex
 * Mono set into the type, not badges in rounded squares.
 */

const STEPS = [
  {
    key: 'survey',
    image: siteConfig.media.process.survey,
    /* The widths used to narrow as the sequence advanced, which made a
       timeline of the column but left the three images visibly mismatched.
       Uniformity won: one box, one crop, for all three steps. The inward
       indent still carries the sequence. */
    indent: '',
    title: 'text-[clamp(21px,2.1vw,26px)]',
  },
  {
    key: 'mobilisation',
    image: siteConfig.media.process.mobilisation,
    indent: 'lg:ms-[7%]',
    title: 'text-[clamp(21px,2.1vw,26px)]',
  },
  {
    key: 'signoff',
    image: siteConfig.media.process.handover,
    indent: 'lg:ms-[14%]',
    title: 'text-[clamp(21px,2.1vw,26px)]',
  },
] as const;

export function ProcessJourney() {
  const { t, locale } = useLocale();
  const ctaHref = generateWhatsAppLink('journey', {}, { locale });

  return (
    <section id="process" aria-labelledby="process-heading" className="section-rhythm bg-canvas">
      <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Heading rail */}
        <Reveal stack className="headline-light lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p {...rc(0)} className="spec spec-cyan">{t.journey.spec}</p>
            <h2
              {...rc(0)}
              id="process-heading"
              className="mt-5 text-[clamp(27px,3.2vw,40px)] font-semibold leading-[1.12] tracking-tight"
            >
              {t.journey.heading}
            </h2>
            <span {...rc(1)} aria-hidden="true" className="rule-stroke mt-5" />
            <p {...rc(1)} className="mt-5 max-w-[46ch] text-pretty text-[16.5px] leading-relaxed text-muted">
              {t.journey.intro}
            </p>
            <div {...rc(2)} className="mt-6 hidden lg:block">
              <Button
                href={ctaHref}
                external
                variant="dark"
                className="u-glide-host"
                aria-label={t.a11y.whatsappGeneric}
              >
                {t.journey.cta}
                <ChevronRight size={15} className="u-glide" />
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <ol className="lg:col-span-8">
          {STEPS.map((step, index) => {
            const copy = t.journey.steps[step.key];
            return (
              <Reveal
                stack
                as="li"
                key={step.key}
                className={`group block pt-7 first:pt-0 ${
                  index > 0 ? 'hair-light-t mt-7' : ''
                }`}
              >
                <div className={step.indent}>
                  <div {...rc(0)} className="flex items-baseline gap-5">
                    <span className="numeral numeral-accent text-[clamp(28px,3vw,38px)] leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="spec spec-cyan">{copy.spec}</span>
                  </div>

                  <h3 {...rc(1)} className={`h-ui mt-4 max-w-[24ch] ${step.title}`}>
                    {copy.title}
                  </h3>

                  <p {...rc(2)} className="mt-3.5 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-muted">
                    {copy.body}
                  </p>

                  {/* No fixed ratio. The box takes the photograph's own
                      proportions and only caps how tall it may get, so a shot
                      whose whole point is the room does not lose its ceiling.
                      All three share that one cap, at every width, which is
                      what keeps the steps uniform now that the ratio no longer
                      does. All three sources are 4:3, so nothing is cropped at
                      phone widths at all; the cap only bites on a desktop.

                      Intrinsic width and height rather than `fill`, because a
                      filled image needs a parent with a definite height and
                      this parent no longer has one. */}
                  <div {...rc(3)} className="mt-5 overflow-hidden rounded-xl border border-hairline bg-mist shadow-card">
                    <Image
                      src={step.image}
                      alt=""
                      width={1200}
                      height={900}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="h-auto max-h-[360px] w-full object-contain transition-transform duration-standard ease-entrance group-hover:scale-[1.02] sm:object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <div className="lg:hidden">
          <Button
            href={ctaHref}
            external
            variant="dark"
            size="block"
            className="u-glide-host"
            aria-label={t.a11y.whatsappGeneric}
          >
            {t.journey.cta}
            <ChevronRight size={15} className="u-glide" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProcessJourney;
