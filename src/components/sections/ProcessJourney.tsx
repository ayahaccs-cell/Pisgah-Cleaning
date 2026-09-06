'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
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
    image: '/media/journey-survey.jpg',
    /* Widths narrow as the sequence advances, which is what makes the column
       read as a timeline rather than as a stack. */
    frame: 'aspect-[21/9] w-full',
    indent: '',
    title: 'text-[clamp(24px,2.6vw,32px)]',
  },
  {
    key: 'mobilisation',
    image: '/media/journey-mobilisation.jpg',
    frame: 'aspect-[16/9] w-full lg:w-[84%]',
    indent: 'lg:ms-[8%]',
    title: 'text-[clamp(21px,2.1vw,26px)]',
  },
  {
    key: 'signoff',
    image: '/media/journey-signoff.jpg',
    frame: 'aspect-[16/9] w-full lg:w-[70%]',
    indent: 'lg:ms-[16%]',
    title: 'text-[clamp(20px,1.9vw,24px)]',
  },
] as const;

export function ProcessJourney() {
  const { t, locale } = useLocale();
  const ctaHref = generateWhatsAppLink('journey', {}, { locale });

  return (
    <section id="process" aria-labelledby="process-heading" className="section-rhythm bg-paper">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Heading rail */}
        <Reveal className="headline-light lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="spec spec-cyan">{t.journey.spec}</p>
            <h2
              id="process-heading"
              className="mt-5 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.04]"
            >
              {t.journey.heading}
            </h2>
            <span aria-hidden="true" className="rule-stroke mt-7" />
            <p className="mt-6 max-w-[46ch] text-[16.5px] leading-relaxed text-muted">
              {t.journey.intro}
            </p>
            <div className="mt-8 hidden lg:block">
              <Button
                href={ctaHref}
                external
                variant="primary"
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
                as="li"
                key={step.key}
                index={index}
                className={`group block pt-10 first:pt-0 ${
                  index > 0 ? 'hair-light-t mt-10' : ''
                }`}
              >
                <div className={step.indent}>
                  <div className="flex items-baseline gap-5">
                    <span className="numeral text-[clamp(28px,3vw,38px)] leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="spec">{copy.spec}</span>
                  </div>

                  <h3 className={`mt-4 max-w-[24ch] font-display font-bold ${step.title}`}>
                    {copy.title}
                  </h3>

                  <p className="mt-3.5 max-w-[58ch] text-[16px] leading-relaxed text-muted">
                    {copy.body}
                  </p>

                  <div
                    className={`mt-7 overflow-hidden rounded-[14px] bg-mist shadow-diffuse ${step.frame}`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={step.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover transition-transform duration-standard ease-entrance group-hover:scale-[1.02]"
                      />
                    </div>
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
            variant="primary"
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
