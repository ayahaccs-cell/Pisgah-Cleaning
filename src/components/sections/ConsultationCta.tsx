'use client';

import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';

/**
 * Commercial consultation strip.
 *
 * Replaces the 24/7 emergency call-out band. That section promised round the
 * clock plumbing response, which no longer matches what the company publishes:
 * the schedule is one line now, Sat to Thu, and the technical division came off
 * the site two versions ago. A claim the operation cannot keep is worse than no
 * claim, so the band became what the page actually needs at this point in the
 * scroll, which is a second, calmer route into the survey.
 *
 * Low profile by design. It is a single band with a heading, one paragraph and
 * two buttons; no eyebrow, no rule, no radial, no status dot.
 */

export function ConsultationCta() {
  const { t, locale } = useLocale();
  const href = generateWhatsAppLink('consultation', {}, { locale });

  return (
    <section
      id="consultation"
      aria-labelledby="consultation-heading"
      className="bg-obsidian py-14 text-faint-soft sm:py-16"
    >
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2
              id="consultation-heading"
              className="max-w-[24ch] text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.18] tracking-tight text-white"
            >
              {t.consultation.heading}
            </h2>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed">
              {t.consultation.body}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Button
              href={href}
              external
              variant="primary"
              size="lg"
              className="max-sm:w-full"
              aria-label={t.a11y.whatsappConsultation}
            >
              <WhatsAppIcon size={18} />
              {t.consultation.primaryCta}
            </Button>
            <Button
              href={callPrimaryHref()}
              variant="outline"
              size="lg"
              className="max-sm:w-full"
              aria-label={t.a11y.callPrimary}
            >
              <PhoneIcon size={17} />
              {t.consultation.secondaryCta}
            </Button>
          </div>
        </div>

        {/* The number itself, so the strip answers "who do I ring" without a
            click. Latin order is forced inside an Arabic page. */}
        <p className="mt-8 border-t border-white/10 pt-5 text-[13px]">
          <a
            href={callPrimaryHref()}
            dir="ltr"
            aria-label={t.a11y.callPrimary}
            className="focus-ring-ink rounded font-semibold tabular-nums text-white transition-colors duration-fast ease-feedback hover:text-emerald"
          >
            {siteConfig.contact.primaryPhone.display}
          </a>
          <span className="spec spec-on-ink ms-4 inline-block">
            {siteConfig.contact.hours.office}
          </span>
        </p>
      </div>
    </section>
  );
}

export default ConsultationCta;
