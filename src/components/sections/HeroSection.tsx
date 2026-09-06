'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { callOfficeHref } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { PhoneIcon, PlayIcon } from '@/components/ui/Icons';

/**
 * Hero.
 *
 * A single full-bleed media panel with a slate scrim, white type on the inline
 * start, and the floating glass video card over the media. The estimate card
 * that overlaps the lower boundary is a separate component, so the hero can be
 * reordered without dragging the intake form with it.
 *
 * Depth is CSS only. No Three.js, no WebGL, no canvas, no scroll listener.
 * The scrim is direction aware, so in Arabic the darkest edge follows the text.
 */

export function HeroSection() {
  const { t, locale } = useLocale();
  const heroRef = useRef<HTMLElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [lit, setLit] = useState(false);
  const [videoNotice, setVideoNotice] = useState(false);

  const heroVideo = siteConfig.media.heroVideos[0];
  const hasVideo = Boolean(heroVideo && heroVideo.url);
  const scopeHref = generateWhatsAppLink('hero', {}, { locale });

  /* Cursor spotlight, fine pointers only. Writes two custom properties and
     nothing else, coalesced through requestAnimationFrame. */
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
      className="relative isolate mt-4 overflow-hidden rounded-[28px] md:mx-[clamp(16px,4vw,28px)]"
    >
      {/* Media */}
      <Image
        src={siteConfig.media.heroWide.src}
        alt={t.hero.portraitAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      <div
        ref={spotRef}
        aria-hidden="true"
        className={`hero-spotlight pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ease-entrance ${
          lit ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative px-[clamp(20px,5vw,64px)] pb-[clamp(40px,7vw,84px)] pt-[clamp(48px,8vw,96px)]">
        <div className="max-w-[640px]">
          <p className="spec text-[#7DE0D2]">{t.hero.eyebrow}</p>

          <h1 className="mt-5 font-display text-[clamp(38px,6.6vw,72px)] font-extrabold leading-[1.02] text-white">
            {t.hero.headline}
          </h1>

          <p className="mt-6 max-w-[54ch] text-[clamp(15.5px,1.35vw,17.5px)] leading-relaxed text-white/85">
            {t.hero.narrative}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={scopeHref}
              external
              variant="primary"
              size="lg"
              aria-label={t.a11y.whatsappGeneric}
              className="max-sm:w-full"
            >
              {t.cta.scopeRequest}
            </Button>

            <Button
              href={callOfficeHref()}
              variant="outline"
              size="lg"
              aria-label={t.a11y.callOfficeLabel}
              className="max-sm:w-full"
            >
              <PhoneIcon size={17} />
              {t.cta.callOffice}
            </Button>
          </div>

          {/* Floating glass video card, over the media panel. */}
          <button
            type="button"
            onClick={onVideo}
            aria-label={t.a11y.playVideoLabel}
            className="focus-ring-ink u-press glass-dark mt-10 inline-flex items-center gap-4 rounded-2xl py-3 pe-6 ps-3 text-start shadow-diffuse-ink"
          >
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-teal text-[#04231F] transition-transform duration-standard ease-entrance">
              <PlayIcon size={13} className="rtl:-scale-x-100" />
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold text-white">
                {t.hero.videoTitle}
              </span>
              <span className="mt-0.5 block text-[13px] text-white/70">
                {videoNotice ? t.hero.videoPending : t.hero.videoSub}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Watched by the pinned bar. No scroll listener anywhere. */}
      <div id="hero-sentinel" aria-hidden="true" className="absolute bottom-0 h-px w-full" />
    </section>
  );
}

export default HeroSection;
