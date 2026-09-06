'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { NAV_LINKS } from './Navbar';

/**
 * Slide-out menu.
 *
 * Enters from the inline end, which is the right in LTR and the left in RTL.
 * The panel is positioned with inset-inline-end and translated on a sign that
 * follows the reading direction, so no second layout exists for Arabic.
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
        className={`fixed inset-0 z-[190] bg-ink/55 u-surface-out ${
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
        className={`fixed inset-y-0 end-0 z-[200] flex w-[min(88%,360px)] flex-col overflow-y-auto bg-white p-[18px] shadow-drawer u-surface-out transform-gpu ${
          open ? 'u-surface-in' : ''
        }`}
        style={{ transform: open ? 'translateX(0)' : hidden }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <Image
            src={siteConfig.company.logo}
            alt={siteConfig.company.legalName}
            width={344}
            height={148}
            className="h-auto w-[126px]"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.a11y.closeMenuLabel}
            className="focus-ring-light u-press tap flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-hairline bg-white text-xl leading-none text-ink"
          >
            &#10005;
          </button>
        </div>

        {/* Direct actions are pinned above the links, not below them. */}
        <div className="mb-4 grid gap-2.5">
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
          <Button
            href={callPrimaryHref()}
            variant="primary"
            size="block"
            className="min-h-[52px]"
            aria-label={t.a11y.callPrimary}
          >
            <PhoneIcon size={17} />
            <span dir="ltr">{siteConfig.contact.primaryPhone.display}</span>
          </Button>
        </div>

        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[12.5px] font-medium text-muted">
          <ClockIcon size={14} className="flex-none text-deep" />
          {siteConfig.contact.hours.office}
        </p>

        <nav aria-label={t.nav.mobile} className="flex flex-col border-t border-hairline-soft pt-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={onClose}
              className="focus-ring-light flex min-h-[52px] items-center rounded border-b border-hairline-soft font-display text-base font-medium text-body"
            >
              {t.nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="mt-[18px] pt-2">
          <LocaleSwitcher tone="panel" className="w-full" />
        </div>
      </aside>
    </>
  );
}

export default MobileDrawer;
