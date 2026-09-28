'use client';

import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Leadership and operational accountability.
 *
 * Named people, ruled by hairlines. No rounded avatar circles and no icon
 * badges: a frame, a rule, and the name.
 *
 * The frame is a short 4:3 landscape capped at 144px, not the tall portrait it
 * was. Four portrait boxes in a row left a column of dead space above four
 * short names and pushed the section past a screen for no gain.
 *
 * Where no photograph has been supplied the card falls back to typographic
 * initials. A stock portrait is never substituted for a named real employee.
 *
 * A light canvas section. The dark architecture frames the page at the hero,
 * the client register, the emergency band and the footer; the operational
 * middle, this section included, runs on the warm light ground.
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
    <section
      id="leadership"
      aria-labelledby="leadership-heading"
      className="section-rhythm bg-canvas"
    >
      <div className="container-page">
        <Reveal className="headline-light grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="spec spec-cyan">{t.leadership.spec}</p>
            <h2
              id="leadership-heading"
              className="mt-5 text-[clamp(27px,3.2vw,40px)] font-bold leading-[1.12] tracking-tight"
            >
              {t.leadership.heading}
            </h2>
            <span aria-hidden="true" className="rule-stroke mt-5" />
          </div>
          <p className="max-w-[52ch] text-[16.5px] leading-relaxed text-muted lg:col-span-6">
            {t.leadership.intro}
          </p>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-x-7">
          {siteConfig.leadership.map((member, index) => {
            const copy = t.leadership.members[member.id];
            return (
              <Reveal as="li" key={member.id} index={index} className="group">
                <div className="relative mb-4 aspect-[4/3] max-h-36 overflow-hidden rounded-xl border border-hairline bg-mist shadow-card sm:max-h-40">
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
                      className="grid h-full w-full place-items-center text-[clamp(24px,4vw,32px)] font-bold tracking-tight text-ink/25"
                    >
                      {initialsOf(copy.name)}
                    </span>
                  )}
                </div>

                <div className="hair-light-t flex items-baseline gap-3 pt-4">
                  <span className="numeral text-[14px] leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="spec">{copy.role}</span>
                </div>

                <h3 className="h-ui mt-2.5 text-[18px] leading-snug text-ink">
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
