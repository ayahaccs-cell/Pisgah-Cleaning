import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleProvider';
import { HomePage } from '@/components/HomePage';
import { SkipLink } from '@/components/layout/SkipLink';
import { breadcrumbJsonLd, buildMetadata, localBusinessJsonLd } from '@/lib/seo';

/** Arabic canonical route. Same composition, read in the other direction. */
export const metadata: Metadata = buildMetadata('ar');

/**
 * Sets dir and lang before first paint, so the Arabic route never renders a
 * frame of left to right layout while React hydrates. Two attribute writes, no
 * library, and it is inert once LocaleProvider takes over.
 */
const SET_DIRECTION =
  "document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');";

export default function ArabicPage() {
  return (
    <LocaleProvider initialLocale="ar">
      <script dangerouslySetInnerHTML={{ __html: SET_DIRECTION }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('ar')) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('ar')) }}
      />
      <SkipLink />
      <HomePage />
    </LocaleProvider>
  );
}
