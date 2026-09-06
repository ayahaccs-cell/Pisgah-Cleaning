# Deployment verification

Pisgah Cleaning Co. W.L.L. Next.js 14 App Router. Target: Vercel.

## 1. Local verification, in order

```bash
npm install
npm run verify     # guardrails, then typecheck, then lint, then build
```

`npm run verify` runs the four gates in sequence and stops at the first failure. `prebuild` also runs the guardrails, so `npm run build` alone cannot ship a violation.

Expected results:

| Gate | Command | Expected |
| --- | --- | --- |
| Guardrails | `npm run guardrails` | `Guardrails passed. No phone literals, no pricing, no long dashes.` |
| Types | `npm run typecheck` | No output, exit 0 |
| Lint | `npm run lint` | `No ESLint warnings or errors` |
| Build | `npm run build` | Two static routes prerendered, plus `robots.txt` and `sitemap.xml` |

Expected route table from `next build`:

```
Route (app)
┌ ○ /                      static
├ ○ /ar                    static
├ ○ /robots.txt            static
└ ○ /sitemap.xml           static
```

If `/` or `/ar` shows as dynamic, a server-only API crept into a page. Both should be static.

## 2. Deploy to Vercel

```bash
npx vercel            # preview
npx vercel --prod     # production
```

Or connect the repository in the Vercel dashboard. Framework preset: **Next.js**. Build command, output directory and install command are all detected. There are no environment variables to set: this site has no database, no API keys, no analytics SDK and no payment provider.

After the first production deploy, point `pisgahcleaning.com` and `www.pisgahcleaning.com` at the project in **Settings, Domains**, and set the apex as primary with `www` redirecting to it.

## 3. Post-deploy checks

Run these against the live domain before announcing the site.

**Routes and indexing**

- `https://pisgahcleaning.com/` returns 200 and renders in English.
- `https://pisgahcleaning.com/ar` returns 200 and renders in Arabic, right to left, with no flash of left to right on first paint.
- `https://pisgahcleaning.com/robots.txt` lists the sitemap URL.
- `https://pisgahcleaning.com/sitemap.xml` lists both routes with an hreflang pair.
- View source on each route and confirm `<link rel="canonical">` and the `hreflang` alternates point at the right pair.

**Structured data**

- Paste each URL into the Google Rich Results Test and the Schema Markup Validator.
- The `LocalBusiness` block should show name, telephone, email, address, opening hours and two contact points.
- `identifier` (CR) appears only once `company.crNumber` is filled in.
- `geo` appears only once `contact.geo.precision` is set to `exact`. See section 5.

**WhatsApp routing**

Open each and confirm the correct pre-filled message and reference token:

| Where | Token |
| --- | --- |
| Hero secondary button | `WEB-HERO` |
| Estimate bar | `WEB-EST` |
| Service division links | `WEB-SRV-COMMERCIAL` and siblings |
| Package tier buttons | `WEB-PKG-STUDIO` and siblings |
| Emergency band | `WEB-EMG` |
| Mobile pinned bar | `WEB-BAR` |
| Mobile drawer | `WEB-DRAWER` |
| Footer launcher | `WEB-FOOT` |

Test on a real handset. Desktop opens WhatsApp Web, which is expected.

**Accessibility**

- Tab from the top of the page. The first stop is **Skip to content**; it should be visible and land focus on `<main>`.
- Tab through the whole page and confirm every stop shows a visible ring. Rings are Deep Blue on light surfaces and emerald on Ink Navy surfaces.
- Run axe DevTools or Lighthouse accessibility on both routes. Target 100, minimum 95.
- Turn on the OS reduce-motion setting and reload. Everything must still be readable, with no element stuck at `opacity: 0`.
- Check the mobile drawer with a keyboard: focus is trapped, Escape closes, focus returns to the burger.

**Performance**

- Lighthouse mobile on `/`. Targets: LCP under 2.0s, CLS under 0.02, TBT under 150ms.
- Confirm the pinned bottom bar appearing causes no layout shift. The footer reserves 76px for it.

## 4. Landmark and heading structure

Each route exposes: `banner` (header), `region` (utility strip), `navigation` (primary, mobile, footer services, footer company, pinned bar), `main`, `contentinfo` (footer). Every landmark is labelled in the active language.

Heading order is `h1` (hero) then `h2` per section then `h3` per card. There are no skipped levels.

## 5. Before you announce the site

Three values in `src/config/siteConfig.ts` are deliberately incomplete, and each one hides its own UI rather than rendering a placeholder:

1. **`company.crNumber`** is an empty string. The footer credentials line and the JSON-LD `identifier` both omit it until it is filled in.
2. **`contact.geo`** holds Manama city-level coordinates with `precision: 'city'`. The JSON-LD `geo` block is not emitted at that setting. Replace the pair with the exact position of Building 77 from Google Maps and set `precision: 'exact'`, then redeploy. Publishing a city centroid as your business location harms local ranking rather than helping it.
3. **`media.heroVideos[0].url`** is empty, so the hero video badge shows its pending state. Paste a link and redeploy.

Also outstanding: real photography for the five slots in `public/media`, leadership portraits, written permission before any client logo replaces a client name, and WhatsApp Business registration on the primary line with an away message for outside office hours.

## 6. Rollback

Vercel keeps every deployment. In the dashboard, open **Deployments**, find the last good one and choose **Promote to Production**. No database migration or cache purge is involved, because the site holds no state.
