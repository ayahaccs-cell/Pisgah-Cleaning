'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Leadership and operational accountability.
 *
 * Named people, ruled by hairlines and numbered in mono. No rounded avatar
 * circles and no icon badges: a portrait frame, a rule, and the name.
 *
 * Where no photograph has been supplied the card falls back to typographic
 * initials. A stock portrait is never substituted for a named real employee.
 */

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export function LeadershipSection() {
  const { t } = useLocale();

  return (
    <section id="leadership" aria-labelledby="leadership-heading" className="section-rhythm bg-white">
      <div className="container-page">
        <Reveal className="headline-light grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="spec spec-cyan">{t.leadership.spec}</p>
            <h2
              id="leadership-heading"
              className="mt-5 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.04]"
            >
              {t.leadership.heading}
            </h2>
            <span aria-hidden="true" className="rule-stroke mt-7" />
          </div>
          <p className="max-w-[52ch] text-[16.5px] leading-relaxed text-muted lg:col-span-6">
            {t.leadership.intro}
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {siteConfig.leadership.map((member, index) => {
            const copy = t.leadership.members[member.id];
            return (
              <Reveal as="li" key={member.id} index={index} className="group">
                <div className="relative aspect-square overflow-hidden rounded-[12px] bg-paper shadow-diffuse lg:aspect-[3/4]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={copy.name}
                      fill
                      sizes="(max-width: 1024px) 45vw, 22vw"
                      className="object-cover transition-[filter,transform] duration-standard ease-entrance group-hover:saturate-[.92]"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-full w-full place-items-center font-display text-[clamp(30px,6vw,44px)] font-extrabold text-mist"
                    >
                      {initialsOf(copy.name)}
                    </span>
                  )}
                </div>

                <div className="hair-light-t mt-5 flex items-baseline gap-3 pt-4">
                  <span className="numeral text-[12px] leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="spec">{copy.role}</span>
                </div>

                <h3 className="mt-2.5 font-display text-[19px] font-semibold leading-snug">
                  {copy.name}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{copy.note}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default LeadershipSection;
