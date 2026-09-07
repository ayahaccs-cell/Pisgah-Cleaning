'use client';

import { useLocale } from '@/context/LocaleProvider';
import {
  CinemaIcon,
  MosqueIcon,
  RetailIcon,
  ShieldCheckIcon,
  StarIcon,
  TowerIcon,
} from '@/components/ui/Icons';

/**
 * Trust and credibility bar.
 *
 * Sits directly beneath the floating estimate card. Three blocks divided by
 * hairlines: a rating claim, four monochrome sector marks, and the induction
 * guarantee.
 *
 * The sector marks are drawn as 1.5px strokes rather than client logos, because
 * a trademarked mark may only be shown once that account has given written
 * permission. A sector is a fact about the work; a logo is somebody else's
 * property.
 */

const SECTORS = [
  { key: 'retail', Icon: RetailIcon },
  { key: 'cinemas', Icon: CinemaIcon },
  { key: 'mosques', Icon: MosqueIcon },
  { key: 'towers', Icon: TowerIcon },
] as const;

export function TrustBar() {
  const { t } = useLocale();

  return (
    <section aria-label={t.trust.ratingTitle} className="bg-paper pb-10 pt-8 sm:pb-14 sm:pt-10">
      <div className="container-page">
        <div className="grid items-center gap-7 rounded-2xl border border-hairline-soft bg-white px-5 py-6 shadow-diffuse sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,0.9fr)] lg:gap-10">
          {/* Rating */}
          <div>
            <div className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                /* The one warm note on the page. A rating row is read as a
                   rating because the stars are amber, and amber sits naturally
                   beside botanical green; recolouring them would make the
                   claim quieter, not more on-brand. Change to text-teal if you
                   would rather it went. */
                <StarIcon key={index} size={15} className="text-[#F59E0B]" />
              ))}
            </div>
            <p className="mt-2.5 max-w-[28ch] font-display text-[15.5px] font-semibold leading-snug text-ink">
              {t.trust.ratingTitle}
            </p>
            <p className="spec mt-1.5">{t.trust.ratingSub}</p>
          </div>

          <span aria-hidden="true" className="hidden h-14 w-px bg-hairline lg:block" />

          {/* Sector marks */}
          <div>
            <p className="spec">{t.trust.sectorsLabel}</p>
            <ul className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-4">
              {SECTORS.map(({ key, Icon }) => (
                <li
                  key={key}
                  className="flex items-center gap-2.5 text-faint transition-colors duration-fast ease-feedback hover:text-ink"
                >
                  <Icon size={22} />
                  <span className="text-[13px] font-medium">{t.trust.sectors[key]}</span>
                </li>
              ))}
            </ul>
          </div>

          <span aria-hidden="true" className="hidden h-14 w-px bg-hairline lg:block" />

          {/* Guarantee */}
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 flex-none text-deep">
              <ShieldCheckIcon size={26} />
            </span>
            <p className="max-w-[30ch] text-[14px] font-medium leading-snug text-ink">
              {t.trust.guarantee}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
