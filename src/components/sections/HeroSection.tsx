'use client';

import { useCallback, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { PhoneIcon, PlayIcon } from '@/components/ui/Icons';

/**
 * Hero.
 *
 * The supplied intro photograph fills the panel, centred at every width. Depth
 * comes from background-attachment on desktop pointers only, so there is no
 * scroll listener, no transform loop and no judder on a phone.
 *
 * A slate scrim at 60 percent, deepened toward the reading edge, keeps the
 * white type above 7:1 over any part of the photograph. The scrim direction
 * flips with dir, so Arabic gets the same contrast on the other side.
 *
 * Bottom padding is deliberately generous: the estimate card overlaps the lower
 * boundary and must not cover the copy above it.
 */

export function HeroSection() {
  const { t, locale } = useLocale();
  const [videoNotice, setVideoNotice] = useState(false);

  const heroVideo = siteConfig.media.heroVideos[0];
  const hasVideo = Boolean(heroVideo && heroVideo.url);
  const scopeHref = generateWhatsAppLink('hero', {}, { locale });

  const onVideo = useCallback(() => {
    if (!hasVideo) {
      setVideoNotice(true);
      return;
    }
    window.open(heroVideo.url, '_blank', 'noopener,noreferrer');
  }, [hasVideo, heroVideo]);

  return (
    <section
      id="top"
      aria-label={t.a11y.heroLandmark}
      className="hero-parallax relative isolate overflow-hidden"
      style={{ backgroundImage: `url(${siteConfig.media.intro.src})` }}
    >
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />

      <div className="container-page relative">
        <div className="max-w-[620px] pb-24 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
          <h1 className="font-display text-[clamp(38px,6.4vw,68px)] font-extrabold leading-[1.02] text-white">
            {t.hero.headline}
          </h1>

          <p className="mt-5 max-w-[52ch] text-[clamp(15.5px,1.35vw,17.5px)] leading-relaxed text-white/85">
            {t.hero.narrative}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
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

          {/* Floating video card, anchored to the inline start of the content
              column at the base of the hero. */}
          <button
            type="button"
            onClick={onVideo}
            aria-label={t.a11y.playVideoLabel}
            className="focus-ring-ink u-press glass-dark mt-9 inline-flex items-center gap-4 rounded-2xl py-3 pe-6 ps-3 text-start shadow-diffuse-ink"
          >
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-white text-[#0F766E] transition-transform duration-standard ease-entrance">
              <PlayIcon size={13} className="rtl:-scale-x-100" />
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold text-white">
                {t.hero.videoTitle}
              </span>
              <span className="mt-0.5 block text-[13px] text-white/75">
                {videoNotice ? t.hero.videoPending : t.hero.videoSub}
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
