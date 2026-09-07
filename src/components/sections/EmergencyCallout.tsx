'use client';

import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { PhoneIcon, StatusDot, WhatsAppIcon } from '@/components/ui/Icons';

/**
 * 24/7 emergency call-out.
 *
 * The only loud element on the site, and the only one that breaks the container
 * rhythm. Urgency is carried by contrast and type scale. No red, no shake, no
 * alarm colour, no siren icon.
 */

export function EmergencyCallout() {
  const { t, locale } = useLocale();
  const href = generateWhatsAppLink('emergency', {}, { locale });

  return (
    <section
      id="emergency"
      aria-labelledby="emergency-heading"
      className="section-rhythm relative isolate overflow-hidden bg-blue text-navy-50"
    >
      {/* Soft radial lighting behind the headline. Painted, never animated. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-[520px] w-[820px] -translate-y-1/3"
        style={{
          insetInlineStart: '-160px',
          background:
            'radial-gradient(46% 50% at 34% 46%, rgba(125,160,202,.26), rgba(193,232,255,.08) 48%, transparent 74%)',
        }}
      />

      <div className="container-page grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="spec spec-on-ink inline-flex items-center gap-2.5">
            <StatusDot />
            {t.emergency.eyebrow}
          </p>

          <h2
            id="emergency-heading"
            className="mt-6 max-w-[20ch] font-display text-[clamp(28px,4vw,46px)] font-bold leading-[1.03] text-white"
          >
            {t.emergency.heading}
          </h2>

          <span aria-hidden="true" className="rule-stroke-ink mt-6 block h-[1.5px] w-full max-w-[460px]" />

          <p className="mt-6 max-w-[58ch] text-[16.5px] leading-relaxed">{t.emergency.body}</p>

          <p className="spec spec-on-ink mt-6">{t.emergency.coverage}</p>
        </div>

        <div className="lg:col-span-5">
          <p className="spec spec-on-ink">{t.emergency.spec}</p>

          <a
            href={callPrimaryHref()}
            dir="ltr"
            aria-label={t.a11y.callPrimary}
            className="focus-ring-ink mt-4 block rounded font-display text-[clamp(32px,4.6vw,48px)] font-extrabold leading-none tabular-nums text-cyan underline-offset-[6px] transition-[text-underline-offset] duration-fast ease-feedback hover:underline hover:underline-offset-[10px]"
          >
            {siteConfig.contact.primaryPhone.display}
          </a>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              href={callPrimaryHref()}
              variant="teal"
              size="lg"
              className="max-sm:w-full"
              aria-label={t.a11y.callPrimary}
            >
              <PhoneIcon size={17} />
              {t.cta.callNow}
            </Button>
            <Button
              href={href}
              external
              variant="outline"
              size="lg"
              className="max-sm:w-full"
              aria-label={t.a11y.whatsappEmergency}
            >
              <WhatsAppIcon size={18} />
              {t.cta.whatsapp}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmergencyCallout;
