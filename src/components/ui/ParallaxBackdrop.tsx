'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * The hero backdrop, moving slower than the page.
 *
 * ---------------------------------------------------------------------------
 * This is the one scroll listener on the site, and it is deliberate.
 *
 * Every other entrance on this codebase runs on IntersectionObserver precisely
 * so that nothing reads scroll position on the main thread. Parallax cannot be
 * expressed that way: it needs a continuous value, not a threshold. So the
 * listener exists, and it is built to cost as little as a listener can:
 *
 *   1. It is passive, so it never blocks the compositor from scrolling.
 *   2. It coalesces into one requestAnimationFrame. Fifty scroll events
 *      between two frames still produce exactly one write.
 *   3. It is only attached while the frame is on screen. An IntersectionObserver
 *      subscribes it on entry and unsubscribes it on exit, so scrolling through
 *      the rest of the page does no parallax work at all.
 *   4. The only thing it writes is a translate3d on one element. No layout is
 *      read except one getBoundingClientRect per frame, and nothing repaints:
 *      the transform is composited.
 *
 * What it is not: background-attachment: fixed. That is the usual one-line
 * answer and it is the wrong one here. iOS Safari does not honour it inside a
 * clipped, rounded container, which is exactly what this hero is, and where it
 * is honoured it repaints the whole layer on every frame rather than
 * compositing it. The previous build had it behind a desktop-and-fine-pointer
 * media query for that reason; this replaces it outright.
 *
 * Reduced motion: the effect does not run at all. No listener is attached and
 * no transform is written, so the backdrop is simply a static cover image.
 *
 * Desktop (lg and up) is a second mode of the same listener, not a second
 * listener. The pointer is a wheel or a trackpad there, and a wheel delivers
 * scroll in coarse steps, so a layer pinned 1:1 to scrollY moves in the same
 * steps and reads as rigid. From 1024px the layer is therefore eased towards
 * its target inside a requestAnimationFrame loop (see GLIDE below): it still
 * ends exactly where the scroll position says it should, but it arrives with
 * weighted deceleration rather than in one hop. The loop runs only while the
 * layer is still travelling and stops itself when it has settled, so an idle
 * page does no work. Below 1024px none of this exists: the original coalesced
 * single write per frame, at the original speed, is untouched.
 * ---------------------------------------------------------------------------
 */

type Props = {
  /** Path under /public. */
  src: string;
  /**
   * Classes for the photograph itself, used to steer object-position per
   * breakpoint so the subject lands on the side of the frame the copy is not.
   */
  imageClassName?: string;
  /**
   * Fraction of the frame height the backdrop travels across the full scroll
   * of the frame. 0.18 reads as depth without the image visibly sliding.
   */
  speed?: number;
  /**
   * The same measure from lg up. 0.30 means the photograph travels 30 percent
   * of the distance the page scrolls, so against the copy and the card in the
   * foreground it drifts at 0.7 of scroll speed, which is the separation the
   * brief asked for. 0.18 (the phone value) was inside the range a wheel scroll
   * hides.
   */
  desktopSpeed?: number;
  /**
   * From lg up, how far below the frame's top edge the photograph starts at
   * rest, as a fraction of the frame height. The layer still overhangs the
   * frame by the full OVERHANG, so travel is unchanged; the photograph simply
   * begins part way down the layer, and its top edge fades into the frame's
   * obsidian instead of ending in a hard line.
   *
   * This exists for framing. Without it, the top fifth of the photograph sits
   * above the frame at rest, and the operator's head is in that fifth, so on a
   * desktop it disappears behind the navigation pill. Insetting the photograph
   * brings the head down into view without touching speed or overhang.
   */
  desktopInset?: number;
};

/* The layer is taller than the frame and starts above it, so travel can never
   expose an edge.

   Overhang must exceed `speed`, and by enough to matter. At 0.20 against a
   speed of 0.18 the margin at full travel is two percent of the frame height,
   measured at 11px on an 560px frame, which is inside the range where a
   rounded corner's antialiasing can show a hairline. 0.26 puts the margin at
   eight percent and leaves headroom to raise `speed` later without coming back
   to this constant.

   The layer used to be `1 + 2 * OVERHANG` tall, an equal overhang above and
   below. Only the top is ever needed: travel is downward only, so the layer's
   bottom edge moves away from the frame's bottom edge and never toward it. The
   spare 26 percent underneath did nothing except make the photograph 152
   percent of the frame's height, so object-fit: cover zoomed it half again and
   cropped the subject to a torso. The layer is now `1 + OVERHANG + BLEED`
   tall. BLEED is a small cushion under the frame's bottom edge so a fractional
   pixel at rest can never show a seam. */
const OVERHANG = 0.26;
const BLEED = 0.04;

/* Why raising the desktop speed to 0.30 does not expose an edge, although it
   is now larger than OVERHANG.

   Only the part of the frame below the top of the viewport can be seen. When
   the frame has scrolled by a fraction p of its height, the viewport's top edge
   sits p * height down the frame, and the layer's top edge sits at
   (speed * p - OVERHANG) * height. The layer covers what is visible so long as
   that is above p * height, and it is for every p in 0..1 whenever speed < 1:
   the spare above the visible edge is (OVERHANG + (1 - speed) * p) * height, at
   least 26 percent of the frame at every point of travel. The bottom edge only
   moves away from the frame's bottom, so it can never come up into view. The
   old "overhang must exceed speed" rule guarded against a case that cannot
   happen.

   Scaling the layer up (scale 1.08) was considered for the same purpose and
   rejected: object-fit cover would then crop a further four percent off every
   side of a photograph whose subject is already framed to the pixel, and the
   headroom it buys is headroom this arithmetic shows is not needed. */

/* Desktop easing. The layer chases its target with an exponential ease whose
   time constant is GLIDE seconds: it closes 63 percent of the remaining gap in
   that time, and the step is scaled by real elapsed time, so it feels the same
   on a 60 Hz panel and a 120 Hz one. 0.085 s is long enough to smooth a wheel's
   coarse steps into a glide and short enough that a fast fling trails by only a
   few dozen pixels. This is a decay, not a spring: nothing overshoots, because
   an overshooting background would poke the layer's edge back into view. */
const GLIDE = 0.085;

/* The furthest, as a share of the frame height, the eased layer may trail its
   target. It only ever matters when the page jumps up (the Home key, a click on
   an anchor to the top): the layer would otherwise hang low for a few hundred
   milliseconds and leave the top of the frame dark while it climbs back. Capped
   at five percent, the worst case is a short soft fade, never a gap. */
const MAX_LAG = 0.05;

export function ParallaxBackdrop({
  src,
  imageClassName = '',
  speed = 0.18,
  desktopSpeed = 0.3,
  desktopInset = 0.07,
}: Props) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const frame = layer?.parentElement;
    if (!layer || !frame) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wide = window.matchMedia('(min-width: 1024px)');

    let frameRequest = 0;
    let glideRequest = 0;
    let queued = false;
    let gliding = false;
    let listening = false;
    let current = 0;
    let lastTime = 0;

    function write(px: number) {
      if (!layer) return;
      layer.style.transform = `translate3d(0, ${px.toFixed(2)}px, 0)`;
    }

    /* Below 1024px. Exactly the original path: read once, write once, in the
       frame the scroll event asked for. */
    function paint() {
      queued = false;
      if (!layer || !frame) return;
      const rect = frame.getBoundingClientRect();
      const height = rect.height || 1;
      /* 0 while the frame's top edge is at or below the viewport top, 1 once
         the frame has travelled its own height past it. */
      const progress = Math.min(1, Math.max(0, -rect.top / height));
      const shift = progress * speed * height;
      write(shift);
    }

    /* From 1024px. Reads where the layer should be, moves the layer part of the
       way there, and asks for another frame only if it has not arrived. */
    function glide(now: number) {
      glideRequest = 0;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const height = rect.height || 1;
      const progress = Math.min(1, Math.max(0, -rect.top / height));
      const target = progress * desktopSpeed * height;

      /* Clamp the step: a tab that was in the background returns with a huge
         elapsed time, which would otherwise be read as one enormous stride. */
      const dt = lastTime ? Math.min(0.064, Math.max(0.001, (now - lastTime) / 1000)) : 1 / 60;
      lastTime = now;

      current += (target - current) * (1 - Math.exp(-dt / GLIDE));
      const reach = MAX_LAG * height;
      if (current > target + reach) current = target + reach;

      if (Math.abs(target - current) < 0.05) {
        current = target;
        write(current);
        gliding = false;
        lastTime = 0;
        return;
      }
      write(current);
      glideRequest = window.requestAnimationFrame(glide);
    }

    function onScroll() {
      if (wide.matches) {
        if (gliding) return;
        gliding = true;
        glideRequest = window.requestAnimationFrame(glide);
        return;
      }
      if (queued) return;
      queued = true;
      frameRequest = window.requestAnimationFrame(paint);
    }

    /* Put the layer exactly on its target, with no easing: on entry, and when a
       resize or a rotation can have changed both the height and the mode. */
    function settle() {
      window.cancelAnimationFrame(glideRequest);
      window.cancelAnimationFrame(frameRequest);
      gliding = false;
      queued = false;
      lastTime = 0;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const height = rect.height || 1;
      const progress = Math.min(1, Math.max(0, -rect.top / height));
      current = progress * (wide.matches ? desktopSpeed : speed) * height;
      write(current);
    }

    function onResize() {
      if (wide.matches) settle();
      else onScroll();
    }

    function listen(on: boolean) {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        settle();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        window.cancelAnimationFrame(glideRequest);
        gliding = false;
        lastTime = 0;
      }
    }

    const observer = new IntersectionObserver((entries) => {
      listen(entries[0]?.isIntersecting ?? false);
    });
    observer.observe(frame);

    return () => {
      observer.disconnect();
      listen(false);
      window.cancelAnimationFrame(frameRequest);
      window.cancelAnimationFrame(glideRequest);
    };
  }, [speed, desktopSpeed]);

  /* Where the photograph's top edge sits inside the layer from lg, as a share
     of the layer's own height: the overhang, plus the inset, over the layer. */
  const photoTop = ((OVERHANG + desktopInset) / (1 + OVERHANG + BLEED)) * 100;

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 will-change-transform"
      style={{
        top: `-${OVERHANG * 100}%`,
        height: `${(1 + OVERHANG + BLEED) * 100}%`,
      }}
    >
      {/* The photograph fills its box edge to edge. On a phone the box is the
          whole layer. From lg it starts part way down and fades in at its top
          edge (.parallax-photo-fade), so the inset reads as the dark ceiling
          continuing upward rather than as a boundary. priority because this is
          the largest paint on the first screen. */}
      <div
        className="parallax-photo-fade absolute inset-x-0 bottom-0 top-0 lg:top-[var(--photo-top)]"
        style={{ ['--photo-top' as string]: `${photoTop.toFixed(3)}%` }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          quality={80}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      </div>
    </div>
  );
}

export default ParallaxBackdrop;
