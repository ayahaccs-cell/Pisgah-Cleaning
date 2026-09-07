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

## Video modal (v5.3)

The Sneak Peek card opens a modal that plays `/public/media/pisgah-shift.mp4` with native
controls. Playback stops and resets on every exit path: the close button, the Escape key,
and a tap on the backdrop.

`siteConfig.media.heroVideos[0]` drives it. A path starting with `/` plays in the modal;
anything else, for example a YouTube URL, opens in a new tab instead. One edit changes the
behaviour, no component knows the difference.

**Encoding.** The supplied `.mov` was HEVC, 1080x1920, 60fps, 30MB. Re-encoded to H.264
High, yuv420p, 720x1280 at 30fps, CRF 24, AAC 128k, with `+faststart` so the moov atom sits
in the first bytes and playback begins before the file has finished downloading. Result is
4.5MB for 18 seconds.

**Aspect ratio.** The footage is portrait 9:16. A fixed `aspect-video` frame would have
letterboxed it with heavy bars, so the frame reads the real ratio from `loadedmetadata` and
matches it. Replace the file with a landscape clip and the frame follows, no code change.

## Header (v5.3)

Three zones inside one `max-w-7xl` container:

| Zone | Behaviour |
| --- | --- |
| Logo | `flex-none` with `pe-6 xl:pe-8`. Nothing can slide under it at any width. |
| Navigation | `min-w-0 flex-1`, `text-xs lg:text-sm`, `gap-3 xl:gap-5`. Shrinks before it collides. |
| Contact | `flex-none`. Hours at `text-[11px]`, office line at `text-xs` behind a `border-s` divider, WhatsApp, language toggle, Book Now. |

The collapse threshold is `xl` (1280px). A 13 or 14 inch laptop reports 1280 to 1512 CSS
pixels, and six link labels plus a full contact cluster do not fit comfortably below that,
so those machines get the drawer rather than collided text. The divider uses `border-s`, so
it lands on the correct side in Arabic with no override.

## Translucent header and service accordion (v5.4)

**Logo.** `/public/media/logo.png` is the supplied white knockout on transparency, trimmed
and resized to 1200px. It renders with no plate, no border and no fill behind it.
`siteConfig.company.logo` remains the full colour mark for white surfaces such as the
mobile drawer; `siteConfig.company.logoLight` is the knockout, used on the header and the
footer.

**Header.** Fixed, `bg-emerald-950/40` with `backdrop-blur-md` and a
`border-emerald-500/20` hairline, so the hero photograph reads from the very top of the
page. A more opaque `bg-emerald-950/75` sits underneath as the fallback where
`backdrop-filter` is unsupported, which keeps the white text legible over a bright frame.
The hero carries matching top padding to clear it, and `html` gets `scroll-padding-top` so
every in-page anchor stops below the bar rather than under it.

Note: the Tailwind config previously overrode `emerald` with a single hex, which removed
the whole emerald ramp and would have made `bg-emerald-950` a no-op. The token is now an
object with a `DEFAULT` plus the 400 / 500 / 800 / 900 / 950 stops.

**Technical Maintenance removed.** Gone from the navigation, the footer service list,
`siteConfig.divisions`, the `Division` union type, the intake service scopes, and both
locale dictionaries. Its treatments that still belong on the page (water tank cleaning and
chlorination, post-repair make-good) fold into Division C. Headline and spec now read three
divisions, not four.

**Service accordion.** One panel open at a time, Commercial open on load. Each header is a
real `button` with `aria-expanded` and `aria-controls`; each panel is a labelled `region`.
The chevron rotates on the block axis, which is direction neutral and needs no RTL flip.
See v5.5 below for the toggle and transition behaviour that supersedes the original
unmounted-panel approach.

## Header spacing, accordion toggle and card typography (v5.5)

**Operating hours.** Changed at the single source. `siteConfig.contact.hours.office` is now
`Sat to Thu, 09:00 to 17:00` and `hours.schema` is `['Sa-Th 09:00-17:00']`. The
`openingHoursSpecification` in `src/lib/seo.ts` was updated to match, so the structured data
and the rendered header cannot disagree. No component holds a literal time string.

**Header layout.** The bar is `justify-between` with three flex-none zones. The logo zone
carries its own inline-end margin (`me-6 sm:me-8 lg:me-10`) and the nav its own `pe-6`, so
the two can never collide at any width or in either language; the old below-`xl` spacer div
is gone. The utility zone is now a two-line stack: the office number and the WhatsApp button
on line one, the schedule beneath at `text-[10px]` in `text-emerald-200/80` with
`tracking-normal`. Both the number and the schedule are hidden below `sm`, where the drawer
carries them instead.

**Landmark copy.** `clients.heading` is now exactly `15+ landmark contracts across Bahrain.`
in English and the matching single sentence in Arabic.

**Accordion is a true toggle.** `openId` is `DivisionId | null` and the handler is
`setOpenId(prev => prev === division.id ? null : division.id)`, so clicking an open header
or its chevron collapses it and all three panels can be closed at once.

The open and close transition is `grid-template-rows: 0fr` to `1fr` on a wrapper whose child
clips with `overflow-hidden`. That interpolates smoothly without a JavaScript `scrollHeight`
measurement and without a hard-coded `max-height` that would clip the longest panel
(Specialised runs to eight items). The panel now stays mounted, so it is hidden from
assistive technology with `aria-hidden` and pulled out of the Tab order with `tabIndex={-1}`
on its only focusable child, which keeps the keyboard order matching the screen exactly as
the unmounted version did. `prefers-reduced-motion` already zeroes every transition duration
globally, so the panel snaps open for those users.

The division summary now lives only in the header, unclamping when the panel opens, instead
of appearing both clamped in the header and in full inside the panel. That removes a
duplicate reading for screen readers and a reflow at the moment of expansion.

**Tier card typography.** The indicative crew line in `PackageSelector` dropped `font-mono`
and `tabular-nums` and now matches the standard coverage list directly above it exactly:
`text-[14.5px] font-normal leading-snug text-muted`. One deviation from the brief, flagged
for you to overrule: the brief asked for `text-xs`, which is 12px, but the coverage list it
is being unified with is 14.5px, so matching it at 14.5px is what actually makes the two
blocks read as one. If you want the crew line smaller than the list, say so and it becomes
`text-xs` in one edit.

**Dictionary.** `pillars.expandLabel`, `pillars.collapseLabel` and `pillars.leadLabel` were
removed from both locales. They were never referenced by a component, and `aria-expanded`
already carries the state. Parity holds at 202 nodes each side.

## Blue palette overhaul and header baseline (v6)

The teal and emerald palette is gone. Every colour on the site now comes from
the six supplied blue shades, applied as a vertical flow.

### The six shades

| Token | Hex | Role |
| --- | --- | --- |
| `navy-50` | `#C1E8FF` | S1. Header and hero glass, body copy on deep surfaces |
| `navy-200` | `#7DA0CA` | S2. Accents, focus rings and numerals on deep surfaces |
| `navy-400` | `#5483B3` | S3. Rules, markers, hairline accents, hover borders |
| `navy-600` | `#325884` | S4. Primary action fill, accent labels on light ground |
| `navy-800` | `#052659` | S5. Deep section surfaces and contrasting panels |
| `navy-950` | `#021024` | S6. Footer, baseline, hero scrim |

The semantic aliases components actually use map onto these: `deep` is S4,
`blue` is S5, `cyan` is S2, `teal` is S3, `ink` is S6. That indirection is why
this refactor touched tokens rather than three hundred class names.

### The one deviation from the brief, and why

The brief put S2 `#7DA0CA` and S3 `#5483B3` on the primary action buttons.
Measured against a white label:

```
white on S2   2.71:1    fails AA and AA large
white on S3   3.98:1    fails AA for a 15px button label
white on S4   7.33:1    passes AA and AAA large
white on S5  14.71:1    passes AAA
```

So the button fill steps one shade deeper to S4 and hovers deeper still to S5,
which is the same rule the teal build used: the primary action gets more
legible under the pointer, not less. S2 and S3 do everything else the brief
asked of them - interactive accents, hover borders, active states, chevrons,
numerals, rules and the emergency call button, which carries S6 type on an S3
fill at 4.79:1 rather than white at 3.98:1.

A second, smaller deviation: the header glass is an S1 sheen at 16 percent over
an S6 ground, not S1 alone at 15 to 20 percent. A light wash at that opacity
inherits whatever the photograph is doing behind it, and the hero frame runs
from a dark lobby to a bright window inside one image, so white type over it
would measure anywhere from 2:1 to 14:1 depending on scroll position. The
layered version keeps the sky-blue glass reading and holds the white label
above 12:1 everywhere. Both layers are on one line in `Navbar.tsx` if you would
rather have the wash.

The amber rating stars in the trust bar were left alone. They are not part of
the palette being replaced, and a rating row reads as a rating because the
stars are amber. `text-teal` is a one-word change if you want them gone.

### Vertical flow, lightest at the top

Light sections step down through a five-stop ground ramp, and the deep sections
step from S5 to S6, so the page darkens as it is scrolled without a single
scroll listener or a page-height gradient.

| Section | Surface |
| --- | --- |
| Header | S1 sheen over S6, `backdrop-blur-md` |
| Hero | S6 scrim releasing into S5 on the far side |
| Estimate card | white, S3 hairline border |
| Trust bar | `ground-2` `#F6FCFF` |
| Landmark contracts | S5 `#052659` |
| Process stages | `ground-3` `#EFF9FF`, S4 subheadings, S3 frame borders |
| Divisions | `ground-4` `#E7F6FF`, open panel inverts to the S5 contrasting panel |
| Residential tiers | `ground-5` `#E0F4FF`, S4 featured border, S3 selected ring |
| Emergency | S5 |
| Leadership | S5 to S6 gradient |
| Footer | S6 `#021024` |

Every text colour was measured against the ground it actually sits on, not
against white. The tightest pairs on the page: `faint` `#526E8F` on the deepest
light ground is 4.65:1, and `faint-soft` `#8FA3BC` on S5 is 5.70:1. Both pass
AA for small text. Body text on deep surfaces is white or S1 throughout, at
11:1 or better.

Focus rings stay surface-aware, as they were: S4 on light ground (7.33:1) and
S2 on deep ground (7.03:1 on S6, 5.43:1 on S5). Neither hue clears 3:1 on both,
which is why there is no single ring colour.

`.numeral` moved from S3 to S4. The 12px numerals in the leadership grid and
the client register are small text, and S3 measures 3.98:1 on a light ground.
`.numeral-on-deep` is the S2 variant for deep panels.

### Header baseline

The phone number, the WhatsApp button, the navigation links and the EN /
العربية pill now sit on one centre axis. The fix is that the operating schedule
is absolutely positioned under the number (`absolute end-0 top-full`) instead of
being stacked above it in flow, so the wrapper is only as tall as the phone link
and `items-center` centres the number itself rather than the pair. `end-0`
rather than `right-0` means it tucks under the number on the correct side in
Arabic with no second rule.

Horizontal separation is unchanged from v5.5 and still holds: the logo zone owns
`me-6 sm:me-8 lg:me-10`, the nav owns `pe-6`, and all three zones are
`flex-none` children of one `justify-between` row.

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
| `pisgah-shift.mp4` | Sneak Peek modal | Client footage, re-encoded to web H.264. |
| `pisgah-shift-poster.jpg` | Modal poster frame | Pulled from the video at 3 seconds. |
| `logo.png` | Header and footer | Supplied white knockout, transparent. |

`pisgah-logo.png` is the supplied artwork, trimmed and transparent.

## Still to confirm

- `company.crNumber` is empty.
- Client logo permissions for Cineco, Talabat Fakroo Tower, Silah Gulf, Epix Cinemas, Sunni Waqf Directorate and The New Indian School.
- Leadership photographs.
- WhatsApp Business registration on the primary line, with an away message outside office hours.
