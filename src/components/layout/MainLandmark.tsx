'use client';

import type { ReactNode } from 'react';
import { useLocale } from '@/context/LocaleProvider';

/**
 * The main landmark, labelled in the active language so a screen reader
 * announces it correctly in both directions.
 *
 * id="main" is the skip link target. tabIndex -1 lets the skip link move real
 * focus here rather than only moving the scroll position, which is what makes
 * the shortcut usable with a keyboard.
 */
export function MainLandmark({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  return (
    <main id="main" tabIndex={-1} aria-label={t.a11y.mainLandmark} className="focus:outline-none">
      {children}
    </main>
  );
}

export default MainLandmark;
