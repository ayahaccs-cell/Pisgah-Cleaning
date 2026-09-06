import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleProvider';
import { HomePage } from '@/components/HomePage';
import { SkipLink } from '@/components/layout/SkipLink';
import { breadcrumbJsonLd, buildMetadata, localBusinessJsonLd } from '@/lib/seo';

/** English canonical route. */
export const metadata: Metadata = buildMetadata('en');

export default function Page() {
  return (
    <LocaleProvider initialLocale="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd('en')) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('en')) }}
      />
      <SkipLink />
      <HomePage />
    </LocaleProvider>
  );
}
