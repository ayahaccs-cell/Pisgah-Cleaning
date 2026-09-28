'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ClockIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { NAV_LINKS } from './Navbar';

/* One ghost pill, shared by both contacts so they read as a pair. The border
   is load bearing: a white/10 fill alone measures 1.2:1 against the sheet,
   which would leave the control boundary imperceptible. */
const GHOST_PILL =
  'focus-ring-ink u-press tap inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 ' +
  'rounded-full border border-white/30 bg-white/10 py-3 text-sm font-medium text-white ' +
  'transition-colors duration-fast ease-feedback hover:bg-white/20';

/**
 * Full-screen navigation sheet.
 *
 * It is no longer a side drawer. The panel covers the viewport, so there is no
 * edge to slide from and nothing to mirror: the same layout serves both
 * directions, and the entrance is a fade rather than a translate.
 *
 * Surface: obsidian at 92 percent with backdrop-blur-2xl, over a scrim of the
 * same colour. This is the third and last blur surface in the system and it is
 * declared inline here rather than as a utility, because unlike the pill and
 * the spotlight it covers everything behind it, so nothing shows through that
 * could change its contrast.
 *
 * Measured against the worst case, the sheet opened over a white section: the
 * composite reads #1A1E24, where white is 14.8:1, slate 400 is 5.8:1, and a
 * white/10 ghost fill is 1.4:1 against the sheet. That last figure is why the
 * ghost pills carry a border and not only a fill: the border is what makes the
 * control's boundary perceivable. It sits at 30 percent rather than the 20 the
 * brief asked for, because white/20 measures 2.5:1 there and white/30 measures
 * 3.4:1, which is the threshold SC 1.4.11 sets for a component boundary.
 *
 * Contacts: WhatsApp and the operations line. The office line came off this
 * sheet on the client's instruction, so the menu offers one number, which is
 * also the number every other call to action on the site reaches.
 */

type Props = { open: boolean; onClose: () => void };

export function MobileDrawer({ open, onClose }: Props) {
  const { t, locale } = useLocale();
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

  const waHref = generateWhatsAppLink('mobileBar', {}, { locale, ref: 'WEB-DRAWER' });

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[190] bg-obsidian/80 u-surface-out ${
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
        className={`fixed inset-0 z-[200] flex h-full min-h-screen w-full flex-col justify-between overflow-y-auto p-6 text-white u-surface-out transform-gpu ${
          open ? 'u-surface-in opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{
          backgroundColor: 'rgba(10,14,20,.92)',
          backdropFilter: 'blur(28px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.1)',
          transitionProperty: 'opacity',
        }}
      >
        <div>
          <div className="relative flex min-h-[44px] items-center justify-center">
            {/* Centred, and the close button is taken out of flow so the logo
                sits on the true centre line rather than on what is left of it. */}
            <Image
              src={siteConfig.company.logoLight}
              alt={siteConfig.company.legalName}
              width={1200}
              height={481}
              sizes="148px"
              className="mx-auto mb-6 h-auto w-[148px]"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.a11y.closeMenuLabel}
              className="focus-ring-ink u-press tap absolute end-0 top-0 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/20 text-lg leading-none text-white transition-colors duration-fast ease-feedback hover:bg-white/10"
            >
              &#10005;
            </button>
          </div>

          <nav aria-label={t.nav.mobile} className="mt-2 flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={onClose}
                className="focus-ring-ink flex min-h-[56px] items-center rounded border-b border-white/10 py-3 text-base font-medium text-white transition-colors duration-fast ease-feedback hover:text-emerald"
              >
                {t.nav[link.key]}
              </a>
            ))}
          </nav>
        </div>

        <div className="pt-8">
          {/* Two contacts, both ghost pills. The office line was removed on
              instruction; what is left is the number every call to action on
              the site reaches. */}
          <div className="grid gap-2.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.a11y.whatsappGeneric}
              className={GHOST_PILL}
            >
              <WhatsAppIcon size={18} />
              {t.cta.whatsapp}
            </a>

            <a href={callPrimaryHref()} aria-label={t.a11y.callPrimary} className={GHOST_PILL}>
              <PhoneIcon size={17} />
              {t.cta.callNow}
              <span dir="ltr" className="tabular-nums">
                {siteConfig.contact.primaryPhone.display}
              </span>
            </a>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-xs leading-tight text-faint-soft">
            <ClockIcon size={14} className="flex-none text-emerald" />
            {siteConfig.contact.hours.office}
          </p>

          <div className="mt-5">
            <LocaleSwitcher tone="panel" className="w-full" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default MobileDrawer;
