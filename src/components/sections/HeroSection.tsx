'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { useLocale } from '@/context/LocaleProvider';
import { callOfficeHref, generateWhatsAppLink } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import { VideoModal } from '@/components/ui/VideoModal';
import { ChevronDown, PhoneIcon, PlayIcon } from '@/components/ui/Icons';

/**
 * The framed architectural hero.
 *
 * Not a full bleed banner. The obsidian canvas runs edge to edge and the
 * photograph sits inside a large rounded container inset from it, so the page
 * opens on a composed frame rather than on a wall of image. The floating pill
 * navigation overlaps the top of that frame, which is why the content column
 * carries its own top padding rather than the document carrying it.
 *
 * Desktop is an asymmetric 58 / 42 split: the reading column on the inline
 * start, the spotlight card on the inline end, where the vignette has released
 * and the photograph is still readable.
 *
 * Mobile is not that grid scaled down. It is a single file stack, the vignette
 * runs top to bottom instead of across, and the spotlight card becomes a normal
 * width inline card between the buttons and the client proof grid.
 *
 * Contrast: the vignette holds white type at 17.46:1 on the reading edge and
 * 8.90:1 at the mid stop, measured against the brightest frame the photograph
 * could present. That is why there is no blur behind the copy. The gradient
 * does the work, and glassmorphism stays on the two surfaces allowed to carry
 * it, one of which is the spotlight card below.
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
        {/* ---- The frame. Rounded, clipped, inset from the outer canvas. ---- */}
        <div
          className="hero-frame relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-[24px] shadow-frame lg:rounded-[32px]"
          style={{ backgroundImage: `url(${siteConfig.media.intro.src})` }}
        >
          <div aria-hidden="true" className="hero-vignette absolute inset-0" />

          <div className="relative px-5 pb-10 pt-[104px] sm:px-8 sm:pb-14 sm:pt-[124px] lg:px-12 lg:pb-16 lg:pt-[148px]">
            {/* Mobile is a flex column so the three blocks can be ordered
                independently of the desktop grid. The brief puts the spotlight
                card above the client logos on a phone and inside the left
                column beneath them on a desktop; one DOM order cannot satisfy
                both, so order utilities do it rather than a second tree.

                From lg the grid auto-places: copy into column one row one, the
                spotlight into column two spanning both rows, and the proof
                strip into column one row two, directly under the buttons. */}
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[58fr_42fr] lg:items-center lg:gap-x-12 lg:gap-y-10">
              {/* ---- 1. Headline, subhead, actions ---- */}
              <div className="order-1 min-w-0 lg:order-none">
                <h1 className="max-w-[21ch] font-display text-[clamp(33px,4.4vw,54px)] leading-[1.08] text-white">
                  {t.hero.headlineA}
                  <span className="block">{t.hero.headlineB}</span>
                </h1>

                <p className="mt-6 max-w-[54ch] text-[clamp(15px,1.25vw,17px)] leading-relaxed text-white/80">
                  {t.hero.narrative}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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

                  {/* The quiet third option. A real anchor, not a decoration. */}
                  <a
                    href="#process"
                    className="focus-ring-ink inline-flex min-h-[48px] items-center gap-1.5 rounded text-[13px] font-medium text-white/70 transition-colors duration-fast ease-feedback hover:text-white max-sm:justify-center"
                  >
                    {t.hero.scrollHint}
                    <ChevronDown size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* ---- 2. Spotlight card. One of the two glass surfaces. ---- */}
              <div className="order-2 min-w-0 lg:order-none lg:row-span-2 lg:ps-4">
                <button
                  type="button"
                  onClick={onVideo}
                  aria-label={t.a11y.playVideoLabel}
                  className="focus-ring-ink group glass-spotlight tap block w-full rounded-2xl border border-white/15 p-4 text-start shadow-spotlight transition-colors duration-fast ease-feedback hover:border-white/30"
                >
                  <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-obsidian lg:aspect-[4/5]">
                    <Image
                      src={siteConfig.media.heroSpotlight}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 92vw, 34vw"
                      className="object-cover transition-transform duration-standard ease-entrance group-hover:scale-[1.03]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 end-3 grid h-11 w-11 place-items-center rounded-full bg-white text-emerald transition-transform duration-standard ease-entrance group-hover:scale-105"
                    >
                      <PlayIcon size={13} className="rtl:-scale-x-100" />
                    </span>
                  </span>

                  <span className="mt-4 block">
                    <span className="spec spec-on-ink">{t.hero.videoBadge}</span>
                    <span className="h-ui mt-2 block text-[17px] leading-snug text-white">
                      {t.hero.videoTitle}
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-snug text-white/65">
                      {videoNotice ? t.hero.videoPending : t.hero.videoSub}
                    </span>
                  </span>
                </button>
              </div>

              {/* ---- 3. Client proof. Static, dignified, no marquee. ---- */}
              <div className="order-3 min-w-0 border-t border-white/10 pt-6 lg:order-none lg:self-end">
                <p className="spec spec-on-ink">{t.hero.proofLabel}</p>
                <ul className="mt-5 grid grid-cols-3 items-center gap-x-5 gap-y-6 sm:gap-x-7 lg:flex lg:flex-nowrap lg:gap-x-7 xl:gap-x-9">
                  {proofClients.map((client) => (
                    <li
                      key={client.id}
                      className="flex items-center justify-center lg:justify-start"
                    >
                      <Image
                        src={client.logo}
                        alt={t.clients.names[client.id]}
                        width={siteConfig.clientLogoBox.width}
                        height={siteConfig.clientLogoBox.height}
                        sizes="120px"
                        className="client-mark h-7 w-auto object-contain sm:h-8 lg:h-6 xl:h-7"
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
