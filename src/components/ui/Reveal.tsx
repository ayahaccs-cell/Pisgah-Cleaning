'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * The only entrance mechanism on the site.
 *
 * There is no scroll listener anywhere. One IntersectionObserver is created,
 * it releases each element as it fires, and the pre-entrance class is added
 * only after support is confirmed, so a page without JavaScript renders in its
 * finished state rather than blank.
 */

type RevealProps = {
  children: ReactNode;
  /** Stagger index. Capped at 7 so a long grid never feels broken. */
  index?: number;
  as?: ElementType;
  className?: string;
  id?: string;
};

const MAX_STAGGER_INDEX = 7;

export function Reveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    el.classList.add('is-pre');

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.remove('is-pre');
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref as never}
      className={`u-reveal ${className}`}
      style={{ ['--i' as string]: Math.min(index, MAX_STAGGER_INDEX) }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
