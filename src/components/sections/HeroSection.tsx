'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import {
  generateWhatsAppLink,
  previewWhatsAppMessage,
} from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { ChevronRight, PlayIcon, StatusDot, WhatsAppIcon } from '@/components/ui/Icons';
import type { Dictionary } from '@/locales';

/**
 * Hero fold.
 *
 * True 50/50 split above 1024px: copy on the inline start, technician portrait
 * on the inline end, estimate card overlapping the bottom edge. Stacks only
 * below 768px. Both columns are grid tracks with no explicit placement, so RTL
 * mirrors the whole composition without a second layout.
 *
 * Depth is CSS only. No Three.js, no WebGL, no canvas, no scroll listener.
 */

type CategoryKey = keyof Dictionary['intake']['categories'];
type ScopeKey = keyof Dictionary['intake']['scopes'];

const CATEGORY_KEYS: CategoryKey[] = ['commercial', 'retail', 'villa', 'apartment'];
const SCOPE_KEYS: ScopeKey[] = ['routine', 'deep', 'movein', 'technical'];

export function HeroSection() {
  const { t, locale } = useLocale();
  const heroRef = useRef<HTMLElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const [category, setCategory] = useState<CategoryKey>('commercial');
  const [scope, setScope] = useState<ScopeKey>('routine');
  const [phone, setPhone] = useState('+973 ');
  const [lit, setLit] = useState(false);
  const [videoNotice, setVideoNotice] = useState(false);

  const heroVideo = siteConfig.media.heroVideos[0];
  const hasVideo = Boolean(heroVideo && heroVideo.url);

  /* Cursor spotlight. Bound only on fine pointers, so touch devices never
     attach the listener at all. Writes two custom properties and nothing else. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const hero = heroRef.current;
    const spot = spotRef.current;
    if (!hero || !spot) return;

    function onMove(event: PointerEvent) {
      if (frameRef.current !== null) return;
      const { clientX, clientY } = event;
      frameRef.current = window.requestAnimationFrame(() => {
        const rect = hero!.getBoundingClientRect();
        spot!.style.setProperty('--mx', `${clientX - rect.left}px`);
        spot!.style.setProperty('--my', `${clientY - rect.top}px`);
        frameRef.current = null;
      });
    }

    const enter = () => setLit(true);
    const leave = () => setLit(false);

    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerenter', enter);
    hero.addEventListener('pointerleave', leave);
    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerenter', enter);
      hero.removeEventListener('pointerleave', leave);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const contactNumber = useMemo(() => {
    const trimmed = phone.trim();
    return trimmed && trimmed !== '+973' ? trimmed : t.intake.fallbackNumber;
  }, [phone, t.intake.fallbackNumber]);

  const estimatePayload = useMemo(
    () => ({
      [t.intake.category]: t.intake.categories[category],
      [t.intake.scope]: t.intake.scopes[scope],
      [t.intake.phone]: contactNumber,
    }),
    [t, category, scope, contactNumber],
  );

  const estimateHref = generateWhatsAppLink('estimate', estimatePayload, { locale });
  const estimatePreview = previewWhatsAppMessage('estimate', estimatePayload, { locale });
  const heroHref = generateWhatsAppLink('hero', {}, { locale });

  const onVideo = useCallback(() => {
    if (!hasVideo) {
      setVideoNotice(true);
      return;
    }
    window.open(heroVideo.url, '_blank', 'noopener,noreferrer');
  }, [hasVideo, heroVideo]);

  return (
    <section
      ref={heroRef}
      id="top"
      aria-label={t.a11y.heroLandmark}
      className="hero-ground relative isolate overflow-hidden pb-[clamp(150px,17vw,210px)] pt-[clamp(34px,5vw,60px)]"
    >
      <div
        ref={spotRef}
        aria-hidden="true"
        className={`hero-spotlight pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ease-entrance ${
          lit ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="container-page relative z-10 grid items-center gap-6 md:grid-cols-2 md:gap-[clamp(24px,4vw,56px)]">
        {/* Copy column */}
        <div className="order-1">
          <p className="spec spec-cyan">{t.hero.eyebrow}</p>

          <h1 className="mt-[18px] max-w-[19ch] font-display text-[clamp(30px,4.05vw,50px)] font-extrabold">
            {t.hero.headline}
          </h1>

          <span aria-hidden="true" className="rule-stroke mt-7 max-w-[420px]" />

          <p className="mt-6 max-w-[52ch] text-[clamp(16px,1.35vw,17.5px)] leading-relaxed text-muted">
            {t.hero.narrative}
          </p>

          {/* Operational marks. Mono specs on 1.5px strokes, not icon chips. */}
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[t.hero.marks.years, t.hero.marks.employment, t.hero.marks.fleet].map((mark) => (
              <li key={mark} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-[1.5px] w-5 flex-none bg-teal" />
                <span className="spec">{mark}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="#intake" variant="primary" size="lg" className="max-md:w-full">
              {t.cta.survey}
              <ChevronRight size={15} className="u-glide" />
            </Button>
            <Button
              href={heroHref}
              external
              variant="glass"
              size="lg"
              className="u-glide-host max-md:w-full"
              aria-label={t.a11y.whatsappGeneric}
            >
              <WhatsAppIcon size={18} className="text-cyan" />
              {t.cta.whatsapp}
              <span dir="ltr" className="font-mono text-[13.5px] font-medium text-blue">
                {siteConfig.contact.primaryPhone.display}
              </span>
            </Button>
          </div>
        </div>

        {/* Portrait column with ambient depth */}
        <div className="relative isolate order-2 flex w-full max-w-[520px] flex-col md:mx-0 max-md:mx-auto">
          <div aria-hidden="true" className="hero-bloom pointer-events-none absolute -inset-y-[10%] -inset-x-[12%] z-0" />

          {/* Video slot. Renders only when a URL has been supplied. */}
          <button
            type="button"
            onClick={onVideo}
            aria-label={t.a11y.playVideoLabel}
            className="focus-ring-ink u-press glass-dark z-[3] mb-3.5 inline-flex items-center gap-2.5 self-start rounded-full py-2 pe-4 ps-2 shadow-badge sm:absolute sm:top-[clamp(16px,3vw,28px)] sm:start-[clamp(-10px,-1vw,0px)] sm:mb-0"
          >
            <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-teal text-[#06282E] transition-transform duration-standard ease-entrance">
              <PlayIcon size={12} className="rtl:-scale-x-100" />
            </span>
            <span className="text-start">
              <span className="block font-display text-[12.5px] font-semibold text-[#EAF4F8]">
                {t.hero.videoTitle}
              </span>
              <span className="spec spec-on-ink mt-0.5 block">
                {videoNotice ? t.hero.videoPending : t.hero.videoSub}
              </span>
            </span>
          </button>

          <div className="relative z-[1] aspect-[4/5] overflow-hidden rounded-frame bg-mist shadow-diffuse-lg max-sm:aspect-[3/4]">
            <Image
              src={siteConfig.media.heroPortrait.src}
              alt={t.hero.portraitAlt}
              width={siteConfig.media.heroPortrait.width}
              height={siteConfig.media.heroPortrait.height}
              priority
              sizes="(max-width: 768px) 90vw, 46vw"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating glass trust badge */}
          <div className="glass-badge u-lift z-[3] mt-3.5 flex items-center gap-3 rounded-2xl px-[18px] py-3 shadow-diffuse-lg sm:absolute sm:bottom-[clamp(16px,3vw,30px)] sm:end-[clamp(-10px,-1vw,0px)] sm:mt-0 sm:max-w-[min(88%,330px)] sm:rounded-full">
            <StatusDot />
            <span className="font-display text-[13.5px] font-semibold leading-snug text-ink">
              {t.hero.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Overlapping quick estimate bar */}
      <div className="container-page relative z-[40] mt-[clamp(-140px,-14vw,-96px)]">
        <section
          id="intake"
          role="region"
          aria-labelledby="intake-title"
          className="glass-panel rounded-[18px] p-[clamp(20px,2.8vw,30px)] shadow-intake"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h2 id="intake-title" className="font-display text-[clamp(19px,2vw,23px)] font-bold">
              {t.intake.title}
            </h2>
            <span className="spec max-w-[42ch]">{t.intake.note}</span>
          </div>

          <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="hero-category" className="spec mb-2 block">
                {t.intake.category}
              </label>
              <select
                id="hero-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="select-field min-h-[48px] w-full rounded-xl border border-hairline bg-white px-3.5 py-3 text-base text-body focus-ring-field transition-[border-color,box-shadow] duration-150 ease-feedback"
              >
                {CATEGORY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t.intake.categories[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hero-scope" className="spec mb-2 block">
                {t.intake.scope}
              </label>
              <select
                id="hero-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value as ScopeKey)}
                className="select-field min-h-[48px] w-full rounded-xl border border-hairline bg-white px-3.5 py-3 text-base text-body focus-ring-field transition-[border-color,box-shadow] duration-150 ease-feedback"
              >
                {SCOPE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t.intake.scopes[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hero-phone" className="spec mb-2 block">
                {t.intake.phone}
              </label>
              <input
                id="hero-phone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-hairline bg-white px-3.5 py-3 text-base text-body focus-ring-field transition-[border-color,box-shadow] duration-150 ease-feedback"
              />
            </div>

            {/* An anchor, not a submit. There is no endpoint to fail. */}
            <Button
              href={estimateHref}
              external
              variant="primary"
              size="block"
              aria-label={t.a11y.whatsappEstimate}
            >
              <WhatsAppIcon size={18} />
              {t.cta.getScope}
            </Button>
          </div>

          <div className="mt-5 rounded-[12px] border border-ink/[0.07] bg-paper/70 px-4 py-4">
            <span className="spec">{t.intake.preview}</span>
            <p className="mt-2 whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-muted">
              {estimatePreview}
            </p>
          </div>

          <ul className="hair-light-t mt-4 flex flex-wrap items-center gap-x-7 gap-y-2 pt-4">
            {[t.intake.assurances.free, t.intake.assurances.noObligation, t.intake.assurances.inHouse].map(
              (item) => (
                <li key={item} className="spec inline-flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-[1.5px] w-4 flex-none bg-teal" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </section>
      </div>

      {/* Watched by the pinned bar. Zero cost, no scroll listener. */}
      <div id="hero-sentinel" aria-hidden="true" className="absolute bottom-0 h-px w-full" />
    </section>
  );
}

export default HeroSection;
