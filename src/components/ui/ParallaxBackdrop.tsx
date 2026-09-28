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

export function ParallaxBackdrop({ src, imageClassName = '', speed = 0.18 }: Props) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const frame = layer?.parentElement;
    if (!layer || !frame) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameRequest = 0;
    let queued = false;
    let listening = false;

    function paint() {
      queued = false;
      if (!layer || !frame) return;
      const rect = frame.getBoundingClientRect();
      const height = rect.height || 1;
      /* 0 while the frame's top edge is at or below the viewport top, 1 once
         the frame has travelled its own height past it. */
      const progress = Math.min(1, Math.max(0, -rect.top / height));
      const shift = progress * speed * height;
      layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      frameRequest = window.requestAnimationFrame(paint);
    }

    function listen(on: boolean) {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        paint();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
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
    };
  }, [speed]);

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
      {/* The photograph fills its layer edge to edge. priority because this is
          the largest paint on the first screen. */}
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
  );
}

export default ParallaxBackdrop;
