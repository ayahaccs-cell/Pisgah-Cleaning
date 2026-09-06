'use client';

import { useLocale } from '@/context/LocaleProvider';

/**
 * Skip to main content.
 *
 * Visually hidden until focused, then the first thing a keyboard user reaches.
 * Anchored with logical inset so it lands on the correct side in both
 * directions.
 */
export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-deep px-5 py-3 font-display text-[15px] font-semibold text-white focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:z-[300] focus-visible:start-4 focus-visible:shadow-diffuse-lg focus-ring-light"
    >
      {t.util.skipToContent}
    </a>
  );
}

export default SkipLink;
