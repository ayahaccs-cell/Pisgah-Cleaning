import type { Viewport } from 'next';
import './globals.css';

/**
 * Document shell only.
 *
 * Metadata, structured data and the locale provider live in each locale route,
 * so /  and /ar are independently crawlable with their own hreflang pair.
 * The dir attribute here is the English default; the Arabic route overrides it
 * before first paint.
 */

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
