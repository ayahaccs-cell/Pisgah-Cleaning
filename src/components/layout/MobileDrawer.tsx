'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { NAV_LINKS } from './Navbar';

/**
 * Slide-out menu. Frosted deep forest glass.
 *
 * Enters from the inline end, which is the right in LTR and the left in RTL.
 * The panel is positioned with inset-inline-end and translated on a sign that
 * follows the reading direction, so no second layout exists for Arabic. Its
 * leading edge is border-s, not border-l, so the hairline lands on the left in
 * English and on the right in Arabic with no override.
 *
 * Surface: G5 at 85 percent with backdrop-blur-xl, over a G5 scrim at 60
 * percent that carries its own light blur. A more opaque G5 sits underneath as
 * the fallback where backdrop-filter is unsupported, so the panel is never
 * see-through on an older engine.
 *
 * Contrast, measured against the worst case, which is the drawer opened over a
 * white section:
 *
 *   composite panel surface   #1D372B
 *   white                     12.86:1
 *   G1 #E3EED4                10.68:1
 *   G1 at 80 percent           7.41:1
 *   G2 fill vs the panel       6.88:1
 *   G3 accent vs the panel     3.58:1   passes SC 1.4.11 for a control, and
 *                                       is therefore used on strokes and
 *                                       indicators rather than on type
 *
 * Every ring inside the panel is focus-ring-ink, because the G4 ring that
 * serves light grounds measures 1.83:1 against G5 and would vanish here.
 *
 * Nothing here is shared with the desktop header except NAV_LINKS and the
 * LocaleSwitcher 'panel' tone, and that tone is used in this file and nowhere
 * else, so the desktop bar is untouched by this refactor.
 */

type Props = { open: boolean; onClose: () => void };

export function MobileDrawer({ open, onClose }: Props) {
  const { t, dir, locale } = useLocale();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  /* Body scroll lock and focus handling. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Escape closes, and focus is trapped inside the panel while it is open. */
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const hidden = dir === 'rtl' ? 'translateX(-100%)' : 'translateX(100%)';
  const waHref = generateWhatsAppLink('mobileBar', {}, { locale, ref: 'WEB-DRAWER' });

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[190] bg-ink/60 backdrop-blur-sm u-surface-out ${
          open ? 'visible opacity-100 u-surface-in' : 'invisible opacity-0'
        }`}
        style={{ transitionProperty: 'opacity, visibility' }}
      />

      <aside
        id="mobile-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.mobile}
        aria-hidden={!open}
        className={`fixed inset-y-0 end-0 z-[200] flex w-[min(88%,360px)] flex-col overflow-y-auto border-s border-sage-200/15 bg-ink/95 p-[18px] text-white shadow-drawer backdrop-blur-xl u-surface-out transform-gpu supports-[backdrop-filter]:bg-ink/85 ${
          open ? 'u-surface-in' : ''
        }`}
        style={{ transform: open ? 'translateX(0)' : hidden }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          {/* The white knockout on transparency, the same file the header uses.
              No plate, no border, no fill behind it. */}
          <Image
            src={siteConfig.company.logoLight}
            alt={siteConfig.company.legalName}
            width={1200}
            height={481}
            sizes="126px"
            className="h-auto w-[126px]"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.a11y.closeMenuLabel}
            className="focus-ring-ink u-press tap flex h-11 w-11 flex-none items-center justify-center rounded-full border border-sage-200/20 bg-white/10 text-lg leading-none text-white transition-colors duration-fast ease-feedback hover:bg-white/20"
          >
            &#10005;
          </button>
        </div>

        {/* Direct actions are pinned above the links, not below them. Three
            steps of emphasis: WhatsApp, the 24/7 line, then the office line. */}
        <div className="grid gap-2.5">
          <Button
            href={waHref}
            external
            variant="whatsapp"
            size="block"
            className="min-h-[52px]"
            aria-label={t.a11y.whatsappGeneric}
          >
            <WhatsAppIcon size={18} />
            {t.cta.whatsapp}
          </Button>

          {/* The pale G2 fill carrying G5 type at 8.20:1, exactly as on the
              emergency section button. The ticked G3 is not used as a fill
              anywhere a label sits on it. */}
          <Button
            href={callPrimaryHref()}
            variant="teal"
            size="block"
            className="min-h-[52px]"
            aria-label={t.a11y.callPrimary}
          >
            <PhoneIcon size={17} />
            {t.cta.callNow}
            <span dir="ltr" className="tabular-nums">
              {siteConfig.contact.primaryPhone.display}
            </span>
          </Button>

          <Button
            href={callOfficeHref()}
            variant="outline"
            size="block"
            className="min-h-[52px]"
            aria-label={t.a11y.callOfficeLabel}
          >
            <PhoneIcon size={17} />
            {t.cta.callOffice}
            <span dir="ltr" className="tabular-nums">
              {siteConfig.contact.secondaryPhone.display}
            </span>
          </Button>
        </div>

        <p className="mt-4 inline-flex items-center gap-2 text-xs leading-tight text-sage-50/80">
          <ClockIcon size={14} className="flex-none text-teal" />
          {siteConfig.contact.hours.office}
        </p>

        <nav
          aria-label={t.nav.mobile}
          className="mt-5 flex flex-col border-t border-sage-200/15 pt-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={onClose}
              className="focus-ring-ink flex min-h-[52px] items-center rounded border-b border-sage-200/10 py-3 font-display text-base font-medium text-white transition-colors duration-fast ease-feedback hover:text-sage-50"
            >
              {t.nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="mt-5 pt-1">
          <LocaleSwitcher tone="panel" className="w-full" />
        </div>
      </aside>
    </>
  );
}

export default MobileDrawer;
