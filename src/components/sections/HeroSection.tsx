'use client';

import { useCallback, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { VideoModal } from '@/components/ui/VideoModal';
import { PhoneIcon, PlayIcon } from '@/components/ui/Icons';

/**
 * Hero.
 *
 * The supplied intro photograph fills the panel, centred at every width. Depth
 * comes from background-attachment on desktop pointers only, so there is no
 * scroll listener, no transform loop and no judder on a phone.
 *
 * A G5 scrim, deepened toward the reading edge and releasing into G4 on the
 * far side, keeps the white type above 7:1 over any part of the photograph.
 * The scrim direction flips with dir, so Arabic gets the same contrast on the
 * other side.
 *
 * Bottom padding is deliberately generous: the estimate card overlaps the lower
 * boundary and must not cover the copy above it.
 */

export function HeroSection() {
  const { t, locale } = useLocale();
  const [videoNotice, setVideoNotice] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const heroVideo = siteConfig.media.heroVideos[0];
  const hasVideo = Boolean(heroVideo && heroVideo.url);
  /* A local file plays in the modal. An external link, for example a YouTube
     URL pasted into siteConfig, opens in a new tab instead. */
  const isLocalFile = hasVideo && heroVideo.url.startsWith('/');
  const scopeHref = generateWhatsAppLink('hero', {}, { locale });

  const onVideo = useCallback(() => {
    if (!hasVideo) {
      setVideoNotice(true);
      return;
    }
    if (isLocalFile) {
      setModalOpen(true);
      return;
    }
    window.open(heroVideo.url, '_blank', 'noopener,noreferrer');
  }, [hasVideo, isLocalFile, heroVideo]);

  return (
    <>
    <section
      id="top"
      aria-label={t.a11y.heroLandmark}
      className="hero-parallax relative isolate overflow-hidden"
      style={{ backgroundImage: `url(${siteConfig.media.intro.src})` }}
    >
      <div aria-hidden="true" className="hero-scrim absolute inset-0" />

      <div className="container-page relative">
        {/* Top padding clears the fixed translucent header at every width. */}
        <div className="max-w-[620px] pb-24 pt-[104px] sm:pb-28 sm:pt-[124px] lg:pb-32 lg:pt-[136px]">
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
            /* The ticked G3 as a 20 percent tint over a G5 ground, the same
               construction as the header. Measured over the brightest part of
               the frame: white 6.07:1, G1 4.9:1. */
            className="focus-ring-ink u-press group mt-9 inline-flex cursor-pointer items-center gap-4 rounded-2xl border border-sage-200/30 bg-sage-800/82 bg-gradient-to-b from-sage-400/[0.20] to-sage-400/[0.20] py-3 pe-6 ps-3 text-start shadow-diffuse-ink backdrop-blur-md transition-colors duration-fast ease-feedback supports-[backdrop-filter]:bg-sage-800/76"
          >
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-sage-50 text-deep transition-transform duration-standard ease-entrance group-hover:scale-105">
              <PlayIcon size={13} className="rtl:-scale-x-100" />
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold text-white">
                {t.hero.videoTitle}
              </span>
              <span className="mt-0.5 block text-[13px] text-sage-50">
                {videoNotice ? t.hero.videoPending : t.hero.videoSub}
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>

    {/* Rendered as a sibling of the hero, so no ancestor stacking context or
        overflow rule can clip the fixed overlay. */}
    <VideoModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      src={heroVideo.url}
      poster={heroVideo.poster}
      title={t.hero.videoModalTitle}
      closeLabel={t.a11y.closeVideoLabel}
    />
    </>
  );
}

export default HeroSection;
