'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

/**
 * The only entrance mechanism on the site.
 *
 * There is no scroll listener here. One IntersectionObserver is created per
 * revealed block, it releases the block as it fires, and the pre-entrance class
 * is added only after support is confirmed, so a page without JavaScript renders
 * in its finished state rather than blank.
 *
 * Two shapes:
 *
 *   <Reveal>            the block is one unit. It rises 32px and fades in, and
 *                       its `index` staggers it against its siblings (a card in
 *                       a row).
 *   <Reveal stack>      the block is a stack of parts. The container does not
 *                       move; each part marked with rc(k) does, one step after
 *                       the last. A section header uses it: the heading is
 *                       rc(0) and lands first, the description is rc(1) and
 *                       follows 90ms behind. See globals.css for the states.
 *
 * Reduced motion: nothing is hidden and nothing moves. The effect returns
 * before the pre-entrance class is ever added.
 */

type RevealProps = {
  children: ReactNode;
  /** Stagger index. Capped at 7 so a long grid never feels broken. */
  index?: number;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Reveal the [data-rc] parts one after another instead of as one block. */
  stack?: boolean;
};

const MAX_STAGGER_INDEX = 7;

/* The longest a reveal can take to finish: the largest stagger delay
   (7 * 60ms), the longest part step (4 * 90ms), and the 560ms of travel, with
   room to spare. After this the element is handed back to its own transitions,
   so a hover is never delayed by the position it revealed in. */
const SETTLE_MS = 1500;

/**
 * Props that mark an element as the k-th part of a stack. Spread it on the
 * element: `<h2 {...rc(0)}>`.
 */
export function rc(k: number): { 'data-rc': string; style: CSSProperties } {
  return { 'data-rc': '', style: { ['--k' as string]: k } as CSSProperties };
}

export function Reveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  id,
  stack = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let settle = 0;
    el.classList.add('is-pre');

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          /* Live first, then pre off in the same frame: the browser sees the
             transition rule and the visible state together, so it animates. */
          target.classList.add('is-live');
          target.classList.remove('is-pre');
          obs.unobserve(target);
          settle = window.setTimeout(() => {
            target.classList.remove('is-live');
            target.classList.add('is-done');
          }, SETTLE_MS);
        }
      },
      /* 0.05, not 0.15: the scope cards are a horizontal carousel on a phone,
         and the next card only shows as an 18 percent sliver. At 0.15 that
         sliver never counted as visible, so it sat blank until swiped to and
         the carousel gave no hint that there was more. */
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <Tag
      id={id}
      ref={ref as never}
      className={`${stack ? 'u-reveal-stack' : 'u-reveal'} ${className}`}
      style={{ ['--i' as string]: Math.min(index, MAX_STAGGER_INDEX) }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
