# Pisgah Cleaning Co. W.L.L.

Production codebase for pisgahcleaning.com. Next.js App Router, TypeScript, Tailwind CSS.
Facility care, residential care, deep treatments and technical maintenance across the Kingdom of Bahrain since 2008.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run guardrails # phone, pricing and dash rules
npm run validate   # dictionary, config, asset and import integrity
```

`npm run verify` chains all five gates in order and stops at the first failure:

```
guardrails -> validate -> typecheck -> lint -> build
```

## Build gates

Two zero-dependency scripts run before every build, wired into `prebuild` so a violation cannot reach a deploy even if someone skips a step.

**`scripts/guardrails.mjs`** fails on:

1. **A phone literal outside `src/config/siteConfig.ts`.** Every number, email and address is imported.
2. **Any pricing.** No currency, no rate, no minimum hours, in English or Arabic. Every call to action routes to a complimentary survey.
3. **An em dash or en dash** in any source file, in any language. Standard hyphens only.

**`scripts/validate-dictionary.mjs`** fails on:

1. A `t.<path>` used in a component that does not exist in `en.ts`.
2. Any structural difference between `en.ts` and `ar.ts`, including array lengths.
3. A `siteConfig.<path>` used in a component that does not exist.
4. A `/media/...` asset referenced in source but missing from `public/media`.
5. A local import pointing at a file that is not on disk.

That second script exists because a stale component referencing a removed dictionary key once passed every local check and failed on Vercel. TypeScript catches it, but only after `npm install`. This runs in about a second with no dependencies, so it is safe in a pre-commit hook.

## Where things live

```
src/
  config/siteConfig.ts        Single source of truth. Contact, divisions, packages, clients, leadership, media.
  locales/en.ts               Defines the dictionary shape.
  locales/ar.ts               Typed as the English shape, so a missing key is a build failure.
  locales/index.ts            getDictionary, directionOf, isLocale.
  lib/whatsapp.ts             generateWhatsAppLink and the reference tokens.
  context/LocaleProvider.tsx  Sets lang and dir on the document element.
  app/globals.css             Fonts, motion tokens, RTL rules, reduced motion protocol.
  components/layout/          Navbar, MobileDrawer, MobilePinnedBar, Footer.
  components/sections/        Hero, ClientStrip, ProcessJourney, ServicePillars,
                              PackageSelector, EmergencyCallout, LeadershipSection.
  components/ui/              Button, Icons, LocaleSwitcher, Reveal.
tailwind.config.ts            Colour, type, shadow, motion and glass tokens.
scripts/guardrails.mjs        Phone, pricing and dash rules.
scripts/validate-dictionary.mjs  Dictionary, config, asset and import integrity.
```

## Changing business facts

Everything is one edit in `src/config/siteConfig.ts`.

- **Phone, email, address, hours** live under `contact`. Change the line and the whole site follows, including the WhatsApp destination and the LocalBusiness JSON-LD.
- **CR number** is an empty string. Populate `company.crNumber` before domain deployment and the credentials line in the footer starts rendering it. While it is empty, nothing is shown, so no placeholder ships.
- **Hero video.** Paste a link into `media.heroVideos[0].url`. The slot in the hero renders only when that string is non empty.
- **Client logos.** `clients[].logo` is `null` for every account. Names render until an account gives written permission, at which point add a logo path. Nothing else changes.
- **Leadership photographs.** `leadership[].photo` is `null`. The cards fall back to typographic initials. A stock portrait is never substituted for a named real employee.

## Language

`LocaleProvider` sets `lang` and `dir` on the document element, and every layout uses CSS logical properties, so Arabic is the same layout read in the other direction rather than a second stylesheet.

Arabic is a connected script, so `globals.css` forces `letter-spacing: 0` on every element under `[dir="rtl"]`. No Latin tracking rule can reach it. The font stacks are swapped through CSS variables in one place, so every Tailwind `font-display`, `font-sans` and `font-mono` utility picks up IBM Plex Sans Arabic automatically.

Fonts are delivered from the Google Fonts CDN via `@import` in `globals.css`, as specified. To self host later, replace that import with `next/font/google` and set the same three CSS variables. Nothing else changes.

## Motion

Tokens live in `globals.css` and in `tailwind.config.ts`: four durations (100, 200, 350, 500ms), three curves (entrance, feedback, exit), and displacement values so no component invents its own offset.

Only `transform` and `opacity` animate. There is no scroll listener anywhere on the site. Entrances use one `IntersectionObserver` per element that releases as it fires, and the pre-entrance class is added by script only after support is confirmed, so a page without JavaScript renders in its finished state.

`prefers-reduced-motion: reduce` collapses durations and removes travel while preserving state, visibility and all colour feedback.

## Editorial pass (de-AI refinement)

The baseline build was refactored for visual and verbal specificity. Nothing in `siteConfig.ts`, the route structure or `lib/whatsapp.ts` was altered.

**Copy.** Every claim now names a method or a piece of equipment: single-disc rotary scrubbing and marble crystallisation, low-moisture carpet extraction, post-construction acid wash and grout restoration, food-grade degreasing, supervisor-signed inspection sheets on every visit. The hero states direct W.L.L. employment with no day-labour dispatching and no subcontractors. Fifteen dead dictionary keys were removed; `en.ts` and `ar.ts` now carry 190 keys each in identical order.

**Layout.** `ServicePillars` is a 60/40 split: Commercial is a single ink panel across three of five columns, and the three secondary divisions sit beside it as hairline separated rows rather than three more boxes. `ProcessJourney` is an asymmetric timeline with a sticky heading rail and three entries that step inward (0, 8, 16 percent) and shrink in type scale as the sequence advances. Section padding moved to `clamp(80px, 9vw, 120px)` via `.section-rhythm`.

**Surfaces.** `.surface-ink` and the `.hair-*` classes give `1px solid rgb(255 255 255 / 0.08)` hairlines instead of borders. Three multi-stop shadows replace flat elevation: `shadow-diffuse`, `shadow-diffuse-lg`, `shadow-diffuse-ink`. `.headline-light` paints a soft radial behind each section headline.

**Icons.** Every rounded-square icon badge is gone. Sequences use IBM Plex Mono numerals (`.numeral`), divisions use mono letters A to D, list markers are 1.5px teal strokes, and `.rule-stroke` draws a two-tone 1.5px rule that mirrors under RTL.

**Type contrast.** Headlines run to `clamp(28px, 3.6vw, 44px)` at weight 700 with tight leading, against `.spec` metadata at 10.5px, `0.14em` tracking, uppercase, in muted slate with a cyan variant. Under RTL `.spec` drops to 12px and loses the uppercase transform, because neither device does anything for Arabic.

## Production hardening (v3, launch build)

**Bilingual routes.** `/` and `/ar` are both real, server rendered routes with their own metadata, canonical URL, OpenGraph and Twitter payloads, and LocalBusiness JSON-LD. The language switcher is two links between them, not a client side toggle, so the Arabic page is crawlable, shareable and bookmarkable. `app/robots.ts` and `app/sitemap.ts` generate their files from `siteConfig`, and the sitemap carries the hreflang pair.

**Structured data.** `lib/seo.ts` builds the `LocalBusiness` graph strictly from `siteConfig`: legal name, telephone, email, postal address, opening hours, two contact points and the four divisions. The CR `identifier` is emitted only when `company.crNumber` holds a value, and the `geo` block only when `contact.geo.precision` is `exact`, so neither an empty identifier nor a city centroid can reach search results.

**Focus visibility.** WCAG 2.1 SC 1.4.11 requires a focus indicator at 3:1 against its surroundings. Measured on this palette, Deep Blue `#02547E` is 8.16:1 on white but 1.83:1 on Ink Navy, and emerald `#34D399` is 7.79:1 on Ink Navy but 1.92:1 on white. Neither works everywhere, so the ring colour follows the surface: `.focus-ring-light` on light grounds, `.focus-ring-ink` on Ink Navy, `.focus-ring-field` on form controls.

**Contrast corrections.** `.spec` metadata moved from `#7C939C` (3.23:1 on white, below AA for text this size) to `#56707C` (5.24:1 on white, 4.82:1 on the paper ground). `.spec-cyan` moved to `#166F97` (5.59:1) and `.spec-on-ink` to `#7D9CA8` (5.13:1 on Ink Navy). The footer discipline line moved off `#5F7F8B`, which measured 3.49:1.

**Landmarks and labels.** `banner`, `region`, `navigation`, `main` and `contentinfo` are all present and labelled in the active language. A skip link is the first tab stop and moves real focus to `<main>` rather than only scrolling. Every phone, email, WhatsApp and menu control carries an explicit `aria-label` in both dictionaries. The mobile drawer is a labelled `dialog` with `aria-modal`, a focus trap and Escape to close.

**CTA label.** `cta.scopeRequest` is now `Request Site Scope` / `اطلب نطاق عمل للموقع`.

See `DEPLOYMENT.md` for the verification sequence and the post-deploy checklist.

## Reference refactor and photography pass (v5)

**Header.** One green bar at `#0F766E`. The separate white sub-bar is gone; working hours, the direct office line, a WhatsApp action, the language switcher and the drawer toggle all live inside it, with the logo on a white plate so the blue mark keeps its contrast. The `ESTABLISHED 2008` eyebrow was removed from the hero, since the logo already carries it.

**Hero.** The supplied intro photograph fills the panel through `.hero-parallax`. Depth uses `background-attachment: fixed`, opted into only at `min-width: 1024px` with a fine pointer, and dropped under reduced motion, so there is still no scroll listener and no judder on a phone. A direction-aware slate scrim holds white type above 7:1. The video card sits at the base of the content column reading `Sneak Peek` over `Inside a Pisgah Shift`.

**Rhythm and alignment.** `.section-rhythm` is now 40px, 64px from `sm`, 80px from `lg`, replacing a clamp that ran to 120px. `.container-page` is `max-w-7xl` with the `1rem / 1.5rem / 2rem` padding scale, so every header, card edge and text column lands on one grid. The estimate card overlaps the hero by a fixed `-3.5rem / -4rem / -5rem` rather than a viewport clamp, which is what removes the dead band beneath the hero.

**Sticky bottom bar removed.** `MobilePinnedBar.tsx` is deleted along with its footer spacer. Conversion now runs through the header, the hero buttons and the estimate card.

**Bullets.** Every dash marker is a dot. `.bullet-dot` for stacked lists (with `-soft` and `-on-ink` variants) and `.bullet-inline` for the assurance row, all anchored with `inset-inline-start` so they mirror in Arabic.

**Photography.** Client shots replace every placeholder. See the asset table below.

## Assets to replace

Client photography supplied September 2026 is now in place.

| File | Used by | Source |
| --- | --- | --- |
| `intro-hero.jpg` | Hero background | Tower lobby, vacuuming, WTC through the window |
| `process-01-survey.jpg` | Journey step 01 | Office desk detail |
| `process-02-mobilisation.jpg` | Journey step 02 | Carpet extraction with the rotary machine |
| `process-03-signoff.jpg` | Journey step 03 | Upholstery rotary and spray |
| `tier-studio.jpg` | Studio tier | Upholstery rotary, portrait crop |
| `tier-1bhk.jpg`, `tier-2bhk.jpg`, `tier-3bhk.jpg`, `tier-4bhk.jpg` | Remaining tiers | **Stand-in.** All four reuse the carpet extraction frame until tier-specific shots exist. The ids are listed in `siteConfig.media.tiersAwaitingPhotography`; remove an id once its real photograph is dropped in. |
| `og-cover.jpg` | Social share card | Generated from the brand palette. Replace with a photograph. |

`pisgah-logo.png` is the supplied artwork, trimmed and transparent.

## Still to confirm

- `company.crNumber` is empty.
- Client logo permissions for Cineco, Talabat Fakroo Tower, Silah Gulf, Epix Cinemas, Sunni Waqf Directorate and The New Indian School.
- Leadership photographs.
- WhatsApp Business registration on the primary line, with an away message outside office hours.
