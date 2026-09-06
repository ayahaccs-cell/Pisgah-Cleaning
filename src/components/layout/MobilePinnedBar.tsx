'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';

/**
 * Mobile only pinned contact bar.
 *
 * Appears once the hero fold has cleared, observed through a sentinel rather
 * than a scroll listener. Its height is reserved by a permanent spacer in the
 * footer, so appearing costs zero layout shift.
 */

export function MobilePinnedBar() {
  const { t, locale } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const waHref = generateWhatsAppLink('mobileBar', {}, { locale });

  return (
    <nav
      aria-label={t.a11y.utilityLandmark}
      className={`fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-ink/95 backdrop-blur-glass safe-bottom transition-transform duration-standard ease-entrance transform-gpu xl:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-2 px-2.5 py-2">
        <a
          href={callOfficeHref()}
          aria-label={t.a11y.callOfficeLabel}
          className="focus-ring-ink u-press flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-deep font-display text-[14px] font-semibold text-white tap"
        >
          <PhoneIcon size={16} />
          {t.cta.callOffice}
          <span className="sr-only" dir="ltr">
            {siteConfig.contact.secondaryPhone.display}
          </span>
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.a11y.whatsappGeneric}
          className="focus-ring-ink u-press flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp font-display text-[14px] font-semibold text-[#06301A] tap"
        >
          <WhatsAppIcon size={16} />
          {t.cta.whatsappSurvey}
        </a>
      </div>
    </nav>
  );
}

export default MobilePinnedBar;
