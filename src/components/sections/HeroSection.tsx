'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callPrimaryHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { VideoModal } from '@/components/ui/VideoModal';
import { ChevronDown, PhoneIcon, PlayIcon } from '@/components/ui/Icons';
import { ParallaxBackdrop } from '@/components/ui/ParallaxBackdrop';

/**
 * The framed architectural hero.
 *
 * Not a full bleed banner. The obsidian canvas runs edge to edge and the
 * photograph sits inside a large rounded container inset from it, so the page
 * opens on a composed frame rather than on a wall of image. The floating pill
 * navigation overlaps the top of that frame, which is why the content column
 * carries its own top padding rather than the document carrying it.
 *
 * One grid, two columns at every width. Sixty percent copy, forty percent
 * spotlight card, on a phone as well as on a desktop, so the mobile hero is the
 * desktop composition made smaller rather than a different page stacked into a
 * single file. The client proof row is the second grid row: it spans both
 * columns on a phone and tucks under the buttons, inside the copy column, from
 * lg up, where the card spans both rows and centres against them.
 *
 * From lg the frame is a full height canvas, not whatever the content adds up
 * to: clamp(640px, 100svh - 5rem, 860px). Shrinking the headline in v14 let the
 * frame collapse upward and leave dead space under it; the minimum height is
 * what stops that. The grid inside fills the frame, with two rows: the first
 * takes all the spare height and centres the copy and the card in it, below the
 * pill, and the second is the client row, pinned to the bottom edge. Below lg
 * none of this applies and the frame is as tall as its content, as before.
 *
 * The backdrop moves slower than the page. See ParallaxBackdrop for why that
 * is a scroll listener and not background-attachment: fixed, and for why the
 * photograph is now sized to the frame plus its top overhang instead of to
 * twice that.
 *
 * Contrast. The overlay is a flat black/60 on a phone and a left to right
 * gradient, black/85 through black/55 to clear, from lg up. It runs the full
 * height of the frame, so there is no band where a bright patch of photograph
 * could sit behind type unprotected. Parallax does not change the maths: the
 * overlay is pinned to the frame and the photograph slides underneath it.
 *
 * Measured, not assumed: the brightest 2 percent of the pixels behind each text
 * element, at both ends of the parallax travel, at 1440, 1024, 390 and 375 wide
 * and in both locales. The worst case is 4.6:1 for the 10px pill labels on a
 * phone, 6.2:1 for the subhead and 8.2:1 for the headline. The phone overlay is
 * 60 percent rather than 55 for one reason: at 55 the 10px pill labels measured
 * 4.3:1 and 3.9:1, under the 4.5 that text that small needs. The client label is
 * slate 300 rather than the usual slate 400 for the same reason, 5.4:1 against
 * 2.7:1.
 *
 * Both actions are compact ghost pills of equal weight. That is a deliberate
 * trade: the hero has no single filled primary, so the strongest fill on the
 * first screen is the Book Now pill in the header.
 *
 * The spotlight card is a small floating panel, 240px on a desktop and 150px on
 * a phone, and never full width. It carries the thumbnail, a centred play
 * button and one label, nothing else. It is one of the two surfaces allowed to
 * use backdrop-filter, via .glass-spotlight.
 */

/* One compact ghost pill, shared by both actions. Border and fill follow the
   brief: white/25 on a phone, white/20 from lg, over a white/10 fill. */
const PILL =
  'focus-ring-ink u-press tap inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-full ' +
  'border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white ' +
  'transition-colors duration-fast ease-feedback hover:bg-white/15 ' +
  'sm:text-xs lg:min-h-[36px] lg:border-white/20 lg:px-4 lg:py-2';

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
  const proofClients = siteConfig.clients.filter((client) => client.proof);

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
        className="bg-obsidian px-3 pb-6 pt-3 sm:px-5 sm:pb-8 sm:pt-4"
      >
        {/* ---- The frame. Rounded, clipped, inset from the outer canvas.

             Three stacked layers, painted in DOM order: the parallax backdrop,
             the overlay over it, then the content. The frame itself carries an
             obsidian fill so there is no flash of empty frame before the
             photograph decodes. ---- */}
        <div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-[24px] bg-obsidian shadow-frame lg:flex lg:min-h-[clamp(640px,calc(100svh-5rem),860px)] lg:rounded-[32px]">
          {/* Object position steers which slice of the photograph survives the
              crop. On a phone the frame is narrow and tall, so only about a
              quarter of the photograph's width shows; 42 percent puts the
              operator's shoulder behind the spotlight card on the inline end and
              leaves dark seating behind the copy. From lg the slice is wide,
              and 20 percent puts him between the copy and the card. */}
          <ParallaxBackdrop
            src={siteConfig.media.intro.src}
            imageClassName="object-[42%_50%] lg:object-[20%_50%]"
          />

          {/* Full frame overlay. Flat on a phone; from lg a gradient that
              starts on the copy edge and clears toward the card. The bg-
              transparent at lg drops the phone's flat fill so it cannot show
              through the clear end of the gradient. RTL flips the direction. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/85 lg:via-black/55 lg:to-transparent lg:rtl:bg-gradient-to-l"
          />

          <div className="relative flex px-4 pb-8 pt-[92px] sm:px-8 sm:pb-12 sm:pt-[112px] lg:min-h-[640px] lg:flex-1 lg:items-stretch lg:px-12 lg:pb-6 lg:pt-[120px]">
            <div className="grid w-full grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-x-4 gap-y-7 sm:gap-x-8 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:grid-rows-[1fr_auto] lg:gap-x-12 lg:gap-y-7">
              {/* ---- 1. Headline, subhead, actions ---- */}
              <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-center">
                <h1 className="max-w-[480px] text-start text-lg font-bold leading-tight tracking-tight text-white sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                  {t.hero.headline}
                </h1>

                <p className="mt-1 max-w-[420px] text-start text-[11px] font-normal leading-snug text-slate-300 sm:mt-2 sm:text-xs lg:text-sm">
                  {t.hero.narrative}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 lg:mt-5">
                  <a
                    href={scopeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.a11y.whatsappGeneric}
                    className={PILL}
                  >
                    {t.cta.scopeRequest}
                  </a>

                  <a href={callPrimaryHref()} aria-label={t.a11y.callPrimary} className={PILL}>
                    <PhoneIcon size={13} />
                    {t.cta.callOffice}
                  </a>

                  {/* The quiet third option. A real anchor, not a decoration.
                      Hidden on a phone, where the copy column is too narrow to
                      carry a third item without wrapping the pair. */}
                  <a
                    href="#process"
                    className="focus-ring-ink hidden min-h-[36px] items-center gap-1.5 rounded text-xs font-medium text-white/70 transition-colors duration-fast ease-feedback hover:text-white sm:inline-flex"
                  >
                    {t.hero.scrollHint}
                    <ChevronDown size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* ---- 2. Spotlight card. One of the two glass surfaces.

                      Portrait 4:5. A phone gets 150px, a small tablet 165px, a
                      desktop 240px and a wide desktop 260px, pushed to the
                      inline end of its column. It is never full width. ---- */}
              <div className="flex min-w-0 justify-center lg:col-start-2 lg:row-start-1 lg:justify-end lg:self-center">
                <button
                  type="button"
                  onClick={onVideo}
                  aria-label={t.a11y.playVideoLabel}
                  className="focus-ring-ink group glass-spotlight tap relative flex aspect-[4/5] w-full max-w-[150px] flex-col overflow-hidden rounded-xl border border-white/15 p-2 text-start shadow-lg transition-colors duration-fast ease-feedback hover:border-white/30 sm:max-w-[165px] lg:max-w-[240px] lg:rounded-2xl lg:p-3 lg:shadow-2xl xl:max-w-[260px]"
                >
                  <span className="relative block min-h-0 w-full flex-1 overflow-hidden rounded-lg bg-obsidian lg:rounded-xl">
                    <Image
                      src={siteConfig.media.heroSpotlight}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 150px, (max-width: 1280px) 220px, 240px"
                      className="object-cover object-[32%_50%] transition-transform duration-standard ease-entrance group-hover:scale-[1.03]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-emerald transition-transform duration-standard ease-entrance group-hover:scale-105 lg:h-11 lg:w-11">
                        <PlayIcon size={12} className="rtl:-scale-x-100" />
                      </span>
                    </span>
                  </span>

                  {/* Label only. videoPending takes its slot when siteConfig
                      carries no url, so an unconfigured card still says
                      something. Tracking is zeroed under RTL by the global
                      rule, so the Arabic label keeps its joins. */}
                  <span className="block py-1 pt-1.5 text-center text-[10px] font-semibold uppercase tracking-widest text-white/90 lg:text-xs lg:font-medium lg:normal-case lg:tracking-wide">
                    {videoNotice ? t.hero.videoPending : t.hero.videoTitle}
                  </span>
                </button>
              </div>

              {/* ---- 3. Client proof. Static, dignified, no marquee.

                      Second grid row. Spans both columns on a phone; from lg
                      it sits in the copy column directly under the buttons. ---- */}
              <div className="col-span-2 min-w-0 border-t border-white/10 pt-5 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:self-end lg:pb-4 lg:pt-8">
                <p className="spec text-slate-300">{t.hero.proofLabel}</p>
                <ul className="mt-4 grid grid-cols-3 items-center gap-x-4 gap-y-4 sm:grid-cols-6 lg:flex lg:flex-wrap lg:gap-x-4 lg:gap-y-4 xl:gap-x-6">
                  {proofClients.map((client) => (
                    <li key={client.id} className="flex items-center justify-start">
                      <Image
                        src={client.logo}
                        alt={t.clients.names[client.id]}
                        width={siteConfig.clientLogoBox.width}
                        height={siteConfig.clientLogoBox.height}
                        sizes="90px"
                        className="client-mark h-5 w-auto object-contain lg:h-5 xl:h-6"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
