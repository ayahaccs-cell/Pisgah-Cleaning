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

## Mobile drawer glass (v6.1)

Scope note first: this pass touched two files, `src/components/layout/MobileDrawer.tsx`
and the `panel` branch of `src/components/ui/LocaleSwitcher.tsx`. That tone is used in
the drawer and nowhere else, and the `bar` branch that the desktop header uses is
byte-identical to v6. Desktop navigation, alignment and spacing are unchanged. The
component is `MobileDrawer.tsx`, not `MobileNav.tsx`; there is no `Header.tsx` in this
tree, the header is `Navbar.tsx`.

**Panel.** The solid white sheet is gone. It is now S5 at 85 percent with
`backdrop-blur-xl`, with a more opaque S5 underneath as the fallback where
`backdrop-filter` is unsupported, so the panel is never see-through on an older engine.
The leading edge is `border-s border-navy-50/15`, not `border-l`, so the hairline lands
on the left in English and on the right in Arabic with no override.

**Backdrop.** `bg-ink/60 backdrop-blur-sm`. S6 rather than black, so the dim matches the
palette rather than muddying it.

**Logo.** Switched from `company.logo` to `company.logoLight`, the white knockout on
transparency, which is what the header already uses. No plate, no border, no fill.

**Close button.** A translucent circle: `bg-white/10` with a `border-navy-50/20` hairline
and a white glyph, hovering to `bg-white/20`.

**Links.** White at 16px, hovering to S1 `#C1E8FF`, with `border-navy-50/15` dividers
replacing the grey hairlines. Tap targets stay at 52px.

**Contact stack.** Three steps of emphasis rather than two:

1. WhatsApp, brand green
2. The 24/7 line, S3 fill with S6 type
3. The office line, transparent with a white hairline

Both numbers are read from `siteConfig.contact`, and each carries `dir="ltr"` so the
digits do not reverse under RTL. Labels reuse the existing `cta.callNow` and
`cta.callOffice` keys, so no dictionary key was added and parity stays at 202 nodes.

The schedule sits under the stack in S1 at 80 percent, `text-xs`.

**Language pill.** Active is S2 `#7DA0CA` carrying S6 type; inactive is `bg-white/10`
with white at 85 percent inside a `border-navy-50/20` shell.

### Contrast on a translucent surface

A translucent panel has no fixed colour, so every ratio was measured against the
composite in the worst case, which is the drawer opened over a white section: the S6
backdrop at 60 percent, then the S5 panel at 85 percent on top of that.

```
composite panel surface   #14315E
white                     12.88:1   links, headings, button labels
S1 #C1E8FF                 9.97:1
S1 at 80 percent           6.95:1   the schedule line
S2 pill fill               4.75:1   selected language, visible as a shape
S3 button fill             3.23:1   passes SC 1.4.11 for a control boundary
```

Two choices follow from those numbers. The 24/7 button carries S6 type rather than
white, because white on S3 is only 3.98:1. And the language pill's active state is S2
rather than S3: the brief offered either, but S3 as a fill drops the ink label to 4.79:1
and the pill itself to 3.23:1 against the panel, while S2 gives 7.03:1 and 4.75:1.

Every focus ring inside the panel is `focus-ring-ink`. The S4 ring that serves light
grounds measures 2.01:1 against S5 and would disappear here.

### RTL

Verified by rendering the drawer at 390px in both directions. The panel enters from the
inline end, so it slides in from the right in English and the left in Arabic; the border
follows to the opposite edge; the logo, close button, link alignment, schedule and pill
order all mirror; and the two phone numbers stay in Latin order inside their `dir="ltr"`
spans.

## Botanical green theme (v7)

The blue palette is gone. Every colour on the site now comes from the five
supplied botanical green shades.

| Token | Hex | Role |
| --- | --- | --- |
| `sage-50` | `#E3EED4` | G1 pale mint canvas. Section grounds, pill fills, soft card backdrops, body copy on deep surfaces |
| `sage-200` | `#AEC3B0` | G2 soft mineral sage. Card outlines, dividers, inactive strokes, fills on deep surfaces |
| `sage-400` | `#6B9071` | G3 the ticked primary anchor. Header tint, chevrons, badge numerals, markers, rules, active states |
| `sage-600` | `#375534` | G4 rich moss. Primary button fill, deep section surfaces, accent labels on light |
| `sage-800` | `#0F2A1D` | G5 deep forest. Footer, drawer, hero scrim, baseline |

Semantic aliases carry these into components: `ink` is G5, `deep` and `blue` are
G4, `cyan` is G2, `teal` is G3. Components address the aliases, which is why a
five-shade repalette was a token edit plus a scale rename rather than a
component-by-component rewrite.

### The deviation worth naming

The brief put the ticked G3 `#6B9071` on the primary buttons. No label clears
4.5:1 on it:

```
white on G3   3.59:1   fails
G5 on G3      4.27:1   fails, and G5 is the darkest shade in the palette
white on G4   8.36:1   passes AAA
white on G5  15.34:1   passes AAA
```

4.27:1 is a five percent shortfall, not a rounding error, so the primary fill
steps one shade deeper to G4 and hovers deeper still to G5. G3 does everything
else the brief asked of it, and more of it than the blue build gave its
equivalent shade: the translucent header tint at the exact 22 percent
requested, the video badge tint, chevrons, the active accordion border, the
featured tier border, the selected ring, list markers, rules, and the display
numerals on the process steps, the tiers and the division letters.

Those numerals are the interesting case. G3 measures 3.59:1 on white and 3.08:1
on the deepest light ground, which clears the 3:1 large-text threshold at 24px
and above but not the 4.5:1 small-text threshold. So `.numeral-accent` carries
G3 and is applied only where the numeral is display sized, `.numeral` carries
G4 for everything else, and the division letters moved from 22px to 24px so
they sit above the threshold rather than just under it. Change `deep` in
`tailwind.config.ts` to `'#6B9071'` if you would rather have the ticked colour
on the button fill and accept 4.27:1.

The WhatsApp button keeps its brand green `#25D366`. It is now the one
saturated note on a botanical page and it does read as a foreign object, which
is the point of a brand mark: people scan for that specific green. Say the word
and it becomes the pale G2 fill with the same glyph.

The amber rating stars stayed. Amber sits naturally beside botanical green, and
a rating row is read as a rating because the stars are amber.

### Vertical flow, lightest at the top

| Section | Surface |
| --- | --- |
| Header | G3 at 22 percent over a G5 ground, `backdrop-blur-md` |
| Hero | G5 scrim, releasing into G4 on the far side |
| Estimate card | white, G2 border at 50 percent, G3 field hover |
| Trust bar | `ground-2` `#F9FBF6` |
| Landmark contracts | G4 `#375534` |
| Process stages | `ground-3` `#F3F8ED`, G3 badge numerals, G2 frame borders |
| Divisions | `ground-4` `#EEF4E4`, open card lifts to a G1 backdrop in a G3 border |
| Residential tiers | `ground-5` `#E8F1DC`, G3 featured border, G3 selected ring |
| Emergency | G4 |
| Leadership | G4 to G5 gradient |
| Footer | G5 `#0F2A1D` |

The service accordion changed direction from v6. The brief asked for an active
header in G5 type with a G3 chevron, so the open card no longer inverts to a
dark panel: it lifts to a pale G1 backdrop inside a G3 border, type stays G5 in
both states, and the chevron is the only element that changes hue. Closed cards
are white with a G1 tint on hover.

Text colours were measured against the ground each one actually sits on. The
tightest pairs: `faint` `#4F6E52` on the deepest light ground is 4.90:1, and
`faint-soft` `#C3D3C4` on G4 is 5.35:1. Both pass AA for small text. That
second token is G2 lifted toward G1 on purpose: G2 itself measures 4.47:1 on
G4, just under the line, so the metadata tint is one step lighter than the
swatch while the borders and strokes stay on G2 exactly.

Focus rings stay surface-aware: G4 on light ground (8.36:1) and G2 on deep
ground (8.20:1 on G5, 4.47:1 on G4). Neither clears 3:1 on both.

### Header and drawer glass

Both are built the same way, and both keep the tint the brief asked for while
adding a ground under it. The header is G3 at 22 percent over G5; measured with
the bar crossing the brightest part of the hero frame, white reads 7.67:1 and
G1 reads 6.37:1. The video badge uses the same construction at 20 percent. The
drawer is G5 at 85 percent over a G5 scrim at 60 percent, where white reads
12.86:1 and G1 10.68:1 in the worst case. A tint alone at those opacities
inherits whatever the photograph is doing behind it, which is not a contrast
ratio at all; the ground is what makes it one.

`themeColor` in `app/layout.tsx` is now `#0F2A1D`.

## Architectural redesign (v8)

A presentation layer redesign against the JPC reference. Routing, localisation,
the WhatsApp survey engine, the video modal and every verified contact string
are untouched; what changed is the surface.

### What was preserved, deliberately

`/` and `/ar` as two real server rendered routes. The dictionary architecture and
the `typeof en` contract on `ar.ts`. `generateWhatsAppLink` and every reference
token. The zero pricing rule. The contact block, the schedule and the JSON-LD
built from it. The video modal and its focus trap. `MobilePinnedBar.tsx` is
absent from the tree and is still listed in `scripts/prune-legacy.mjs`, so a
stale checkout that reintroduces it self-heals before the build runs.

### Palette

| Token | Hex | Role |
| --- | --- | --- |
| `obsidian` | `#0A0E14` | outer canvas, framed hero, client register, emergency band, footer, drawer |
| `carbon` | `#121820` | the two elevated dark surfaces: pill nav and spotlight card |
| `canvas` | `#F8F9FA` | light section ground |
| `white` | `#FFFFFF` | cards on the light ground |
| `ink` | `#0F172A` | type on light surfaces |
| `emerald` | `#0D7A5F` | primary fill, accent labels, markers, chevrons |
| `emerald-deep` | `#0A5F4A` | the hover state |
| `slate 400` | `#94A3B8` | metadata on dark surfaces |

**No deviation was needed this time.** The previous three palettes all put a
mid-tone on the primary button and none of them carried a label at 4.5:1. This
accent does: white on `#0D7A5F` is 5.29:1, and the hover steps darker to
7.64:1. The brand colour is on the button exactly as specified.

Measured, against the ground each colour actually sits on:

```
white on emerald        5.29:1   primary button label       pass AA
white on emerald-deep   7.64:1   hover
emerald on white        5.29:1   accent labels on light     pass AA
emerald on canvas       5.02:1                              pass AA
emerald on emerald-soft 4.61:1   the open accordion card    pass AA
ink on canvas          16.94:1                              pass AAA
white on obsidian      19.34:1                              pass AAA
slate 400 on obsidian   7.54:1   metadata on dark           pass AA
slate 400 on carbon     6.96:1                              pass AA
emerald on obsidian     3.65:1   NON TEXT ONLY on dark
```

That last line is the one constraint: the accent is a border, a stroke or a
control boundary on dark surfaces, never a label. Focus rings stay surface
aware for the same reason.

### Typography

Instrument Serif for editorial headlines, Plus Jakarta Sans for every interface
string, Amiri and IBM Plex Sans Arabic for the same two roles under RTL. The
mono face is retired; `.spec` metadata is now tracked uppercase Plus Jakarta
Sans, and sequence numerals are set in the serif.

Instrument Serif ships one weight. Every `font-bold` and `font-extrabold` was
removed from display headings, because a browser asked for a bold it does not
have will synthesise one, and a smeared serif is worse than no serif. Card
titles and other interface headings moved to `.h-ui`, which is the sans at 600.

### The framed hero

The obsidian canvas runs edge to edge; the photograph sits inside a rounded
container inset from it, with the pill navigation overlapping its top edge.
Desktop is a 58 / 42 split. Legibility comes from a directional vignette, not
a blur: white type measures 17.46:1 on the reading edge and 8.90:1 at the mid
stop, against the brightest frame the photograph could present.

Mobile is not that grid scaled down. The vignette runs top to bottom, the
column is single file, and the three blocks are reordered so the spotlight card
sits between the buttons and the logo grid, which is the order the brief
specified for a phone but not for a desktop. One DOM tree, order utilities,
no duplicated markup.

### Glassmorphism, restricted

Blur now exists in exactly two utilities, `.glass-pill` and `.glass-spotlight`,
both declared in `tailwind.config.ts` and each named for the single element it
dresses. Every other blur surface in the codebase was removed: the drawer is a
solid obsidian panel, the video scrim is solid, the old `.glass-badge`,
`.glass-panel`, `.glass-ghost` and `.glass-dark` utilities are gone, and the
painted radial that sat behind every section headline is gone with them. Both
remaining utilities ship an opaque fallback for engines without
`backdrop-filter`.

### Client proof

Eleven accounts, supplied with their marks. Each mark was prepared as a white
silhouette on transparency at a uniform 240 by 72 box, so the strip needs no
per-logo sizing and no filter chain at render time: the component sets opacity
and nothing else.

Three needed more than a straight alpha whiten, and each was checked by eye
rather than by rule. Epix is a light wordmark on a dark slab, so the pale
pixels are kept and the plate dropped. Trax has a white X knocked out of a red
box, so near-white is made transparent first and the X survives as a counter.
Xtreme Bowling is multi-colour 3D lettering that flattened into an unreadable
blob, so it is rendered from its dark outlines only.

The hero strip carries six wordmarks. The register carries all eleven with a
localised name and scope line, because six marks read as one row only when they
share a horizontal axis, and the Waqf emblem and the mosque glyph do not.

Names and scopes are localised in both dictionaries; only the id and the
artwork live in `siteConfig`. These are third party trademarks displayed on the
client's instruction, and written permission per account is the client's to
hold.

`scripts/validate-dictionary.mjs` was extended for this: the asset rule now
accepts a subdirectory and also scans `siteConfig.ts`, so a typo in any of the
eleven logo paths fails the build instead of shipping a silent 404. Proven with
a regression probe; asset coverage went from 14 paths to 25.

### Section rhythm

Dark at the edges, light through the operational middle.

| Section | Surface |
| --- | --- |
| Hero, framed | obsidian, with the pill and spotlight in carbon |
| Estimate card | canvas, white card |
| Trust bar | canvas |
| Client register | obsidian |
| Process, divisions, tiers | canvas, white cards, emerald accents |
| Emergency | obsidian |
| Leadership | canvas |
| Footer | obsidian |

The estimate card no longer floats up over the hero. It used to overlap a full
bleed banner; against a rounded frame a white card straddling the clipped
corner read as a mistake, so it opens the light canvas instead.

## Typography unification and hero rebalance (v9)

### One typeface, site wide

The serif is gone. `--font-display` and `--font-body` now both resolve to Plus
Jakarta Sans in Latin and to IBM Plex Sans Arabic under RTL, declared once in
`globals.css`. Instrument Serif, Cormorant Garamond and Amiri are out of the
font import entirely, so there is no second face for a component to reach for
even by accident.

Every heading is `font-bold` with `tracking-tight`, stated explicitly on the
component rather than only inherited, so a reader can see the weight without
opening `globals.css`. `.h-ui` remains for card titles at 600, same family,
same tracking discipline. Sequence numerals moved off the serif and now carry
the 01 / 02 / 03 rhythm through scale, tabular figures and the accent colour.

Arabic heading leading eased from 1.28 to 1.34, because a bold sans at these
sizes sets tighter than the serif it replaced.

No component references `font-display` any more. The audit greps clean for
`serif`, `font-mono`, Instrument, Cormorant and Amiri across `src/` and the
Tailwind config.

### Hero rebalance

The headline dropped to `text-3xl lg:text-4xl xl:text-5xl font-bold
tracking-tight`. The spotlight card was filling its 42 percent column and
competing with the headline for the fold; it is now `p-3`, capped at 320px on
desktop and pushed to the inline end of that column, with the preview reduced
from a 4:5 portrait to a 3:2 landscape.

One deliberate difference from the brief: on a phone the card runs the full
column width rather than the 280px cap. There is no headline beside it there to
crowd, and a 280px card in a 390px viewport reads as an undersized thumbnail
rather than as the "normal width inline card" the mobile section asks for. The
320px desktop cap is exactly as specified.

### New photography

| File | Frame |
| --- | --- |
| `intro-hero.jpg` | Cinema auditorium, mopping between seat rows. 16:9, 1800px |
| `process-01-survey.jpg` | Cineco lobby walk-through. 4:3, 1200px |
| `process-02-mobilisation.jpg` | Kitchen unit, cabinet interiors. 4:3, 1200px |
| `process-03-handover.jpg` | Concession counter, supervisor at station. 4:3, 1200px |
| `hero-spotlight.jpg` | Rotary polishing, recut to 3:2 for the smaller card |

Two of the supplied files carried EXIF orientation, so they were transposed
before cropping; read cold they are landscape and would have been cropped
across the wrong axis. All three process frames now share one `aspect-[4/3]`
box with `rounded-xl` corners and a hairline border.

`process-03-signoff.jpg` was renamed to `process-03-handover.jpg`, and the old
path was added to `scripts/prune-legacy.mjs` so a stale checkout self-heals.
The dictionary key `journey.steps.signoff` is unchanged; it names the step, not
the file.

The spotlight card also stopped borrowing a process frame and has its own file,
so the two can be art directed independently.

### Trust banner removed

`TrustBar.tsx` is deleted, along with its entry in `HomePage`, the whole
`trust` block in both dictionaries (parity now 220 nodes each side), and the
seven icons that only it used: Retail, Cinema, Mosque, Tower, Star, ShieldCheck
and Shield. `Icons.tsx` went from 6093 to 3552 bytes. The component path is
listed in `prune-legacy.mjs` for the same self-healing reason.

It carried a star rating, a sector list and a guarantee line. The hero proof
strip and the client register now make all three of those claims with named
accounts and scopes attached, so the banner was a second, weaker version of the
same argument sitting directly under the estimate card.

The estimate card keeps its own `bg-canvas pb-2 pt-12` band and the next
section opens on the same ground, so there is no leftover margin or empty
container where the banner used to be.

### Division copy

Division summaries and coverage lists unified to `text-sm font-normal
leading-relaxed text-muted`, matching each other and the paragraph under the
section heading.

## Contact overhaul, navigation sync and mobile restructure (v10)

### Contact data, changed at the single source

| Field | Value |
| --- | --- |
| Primary phone | `+973 33512244` - header, drawer, hero, WhatsApp engine, consultation strip |
| Secondary phone | `+973 33524411` - footer only, beside the primary |
| Email | `pisgahcleaning123@gmail.com` |
| Operations email | `operations.pisgah@gmail.com` |
| Address | `No. 31 Building 77, Road 905, Block 309, Manama, Kingdom of Bahrain` |
| Hours | `Sat to Thu, 09:00 to 17:00`, and nothing else |

All of it lives in `siteConfig`; no component holds a literal, which is what
`scripts/guardrails.mjs` enforces on every build. `formatAddress` now joins the
unit and building as one clause, because that is how the client writes it.

`hours.emergency` is deleted, not emptied. The footer line that rendered it is
gone, the `a11y.callPrimary` label no longer says "24/7 emergency line", and
the emergency `ContactPoint` with `hoursAvailable: '24/7'` came out of the
LocalBusiness JSON-LD. Structured data that keeps promising round the clock
response after the section promising it was deleted is worse than no structured
data: search results would go on making the claim on the company's behalf.

### Emergency band replaced

`EmergencyCallout.tsx` is deleted, `ConsultationCta.tsx` takes its slot, and
the `emergency` dictionary block is replaced by `consultation` in both locales.
The WhatsApp context moved with it: `WEB-EMG` is now `WEB-CONSULT`, with a new
opening line in each language.

It is a low-profile strip: heading, one paragraph, two buttons, and the number
with the schedule beside it on a hairline. No eyebrow, no rule, no radial, no
status dot.

### Navigation

A `Clients` tab sits between `Specialised` and `How We Work`, pointing at
`#clients`. Six labels needed slightly tighter nav gaps before the xl collapse
point; the collapse threshold itself is unchanged.

**Accordion sync.** The three division links point at the ids of the accordion
cards themselves, and `ServicePillars` watches the hash: arriving at
`#residential` scrolls there and opens Division B, and every division is a
real, shareable URL. Two listeners, because one is not enough:

- `hashchange`, for navigating between divisions;
- a delegated `click` on `a[href^="#"]`, because re-clicking the link for the
  division already in the URL changes nothing and therefore fires no
  `hashchange` at all.

Still no scroll listener anywhere on the site.

### Mobile drawer

Full screen, `inset-0`, obsidian at 92 percent with `backdrop-blur-2xl` over a
scrim of the same colour. No edge to slide from, so the entrance is a fade and
there is nothing left to mirror: the same layout serves both directions.

Logo centred at the top with the close button taken out of flow, so the logo
sits on the true centre line rather than on what is left of it after the button.
Links are hairline-ruled at 56px. The contact pair drops to two ghost pills:
WhatsApp and the operations line. The office line came off this sheet on
instruction.

### Mobile hero

Centred headline at `text-2xl sm:text-3xl`, centred subhead at `text-xs
sm:text-sm`, both returning to start-aligned from `lg`. The block order is now
headline, subhead, spotlight card, actions, client proof, done with `order`
utilities on the flex column so the desktop grid is untouched: the actions
block sits in column one row two there, directly under the copy.

Both hero actions are ghost pills of equal weight.

### Two measured deviations

**Ghost button borders.** The brief specified `border-white/25` on the hero and
`border-white/20` in the drawer. Measured against the surfaces they actually sit
on, those give the control boundary 2.2:1 and 2.5:1, below the 3:1 that SC
1.4.11 asks of a component boundary. They ship at `/40` and `/30`, which measure
3.4:1 in both places. The labels themselves were never in doubt at 13:1 and
16:1. One notch each, and both still read unmistakably as ghosts.

**Hierarchy, flagged not fixed.** Two equal ghost buttons means the hero has no
single filled primary drawing the eye to one action, so the strongest fill on
the first screen is now the Book Now pill in the header. That is the requested
look, and it is one word to revert: switch the first hero `Button` back to
`variant="primary"`.

### Leadership

Card 04 is now Aqeel Thasim, Sales Coordinator, with the supplied bio in both
locales; the `santosh` id was renamed to `aqeel` throughout. The frame above
each name dropped from a tall portrait to a 4:3 landscape capped at 144px
(160px from sm). Four portrait boxes left a column of dead space above four
short names and pushed the section past a screen for no gain.

### Process frames

All three steps share one box: `aspect-[16/10] max-h-64 w-full`, `rounded-xl`,
hairline border. The per-step width taper is gone; the inward indent still
carries the sequence, and the titles are now one size rather than three.

## Parallax, safe area and natural photo frames (v11)

### Hero parallax

The backdrop moves at 0.18 of scroll speed inside the frame, so the photograph
lags the headline and the frame reads as having depth.

`ParallaxBackdrop.tsx` holds the whole mechanism, and it is **the only scroll
listener on the site**. Every other entrance runs on IntersectionObserver
specifically so that nothing reads scroll position on the main thread; parallax
cannot be expressed that way, because it needs a continuous value rather than a
threshold. So the listener exists, and it is built to cost as little as one can:

- **passive**, so it never blocks the compositor;
- **coalesced into one requestAnimationFrame** - sixty scroll events between two
  frames produce exactly one write, verified in a browser probe;
- **attached only while the frame is on screen**, subscribed and unsubscribed by
  an IntersectionObserver, so scrolling the rest of the page does no parallax
  work at all;
- **composite-only** - one `getBoundingClientRect` read and one `translate3d`
  write per frame. No layout, no paint.

`background-attachment: fixed` was removed rather than kept as a desktop path.
iOS Safari does not honour it inside a clipped, rounded container, which is
exactly what this hero is, and where it is honoured it repaints the layer every
frame instead of compositing it.

Under `prefers-reduced-motion` no listener is attached and no transform is
written: the backdrop is a static cover image.

**Geometry.** The layer is 152 percent of the frame height, offset up by 26
percent, so travel can never expose an edge. Overhang has to exceed speed, and
the first attempt at 20 percent against a speed of 0.18 left only two percent
margin at full travel - about 11px on a 560px frame, inside the range where a
rounded corner's antialiasing shows a hairline. At 26 percent the margin is
eight percent. Probed at 1440 and 390 wide across the full scroll range: the
layer covers the frame at every position.

**Vignette.** The far end is lighter, as asked. The reading band is not. A
uniform lightening to `0.90 / 0.70 / transparent` put the ghost button border at
2.9:1 against its own fill, under the 3:1 SC 1.4.11 wants for a control
boundary, so the release was moved outward instead of applied across the width.
Final stops `0.94 / 0.88 at 38 percent / 0.66 at 64 percent / 0.24`, where white
is 17.1:1 at the start and 14.2:1 at 38 percent, and the ghost border holds
3.1:1.

### Mobile drawer safe area

Height is `100dvh`, not `100vh` and not `100%`. On a phone those differ by the
height of the browser toolbar, and `vh` reports the toolbar-collapsed figure, so
a sheet sized in `vh` puts its bottom row under Safari's chrome until you
scroll. `dvh` tracks the live viewport.

That is only half of it. The home indicator on a notched phone sits *inside* the
dynamic viewport, so the bottom padding is
`calc(2.5rem + env(safe-area-inset-bottom, 0px))` rather than a flat value. The
language switcher and the schedule are the two things that were being clipped,
and they are the two things at the bottom of that column.

Link rows compressed to 48px at `py-2` / `sm:py-2.5`. Six links plus the logo,
two contact pills, the schedule and the language switcher now fit one small
phone viewport without scrolling, which is the point of compressing them.

### Process frames

The fixed ratio is gone. `aspect-[16/10]` was cropping ceilings, floors and side
equipment out of photographs whose whole subject is the room. The box now takes
each photograph's own proportions and only caps how tall it may get:
`h-auto max-h-[360px] object-contain`, `sm:max-h-[420px] sm:object-cover`. All
three share that cap, which is what keeps the steps uniform now that the ratio
no longer does.

The images moved from `fill` to intrinsic `width`/`height`, because a filled
image needs a parent with a definite height and this parent deliberately no
longer has one.

### Already in place from v10, verified not regressed

The `Clients` tab between `Specialised` and `How We Work`; the accordion sync on
`hashchange` plus a delegated click; the centred mobile hero at `text-2xl
sm:text-3xl` with its four ordered blocks; both hero actions as matching ghost
pills.

## Copy pass and scope card overhaul (v12)

A content release. Nothing shipped in v11 was touched: the parallax listener
and its overhang constant, the drawer's `100dvh` plus safe-area padding, the
natural `object-contain` process frames, the drawer glass, the centred logo and
the accordion sync are all verified in place.

### Hero

Headline is now one line, "Commercial & Estate Maintenance.", and the subhead
one sentence. Three words where there were nine, so the scale steps up a notch
at every breakpoint (`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl`) and the
measure narrows to 16ch: a short headline set small in a large frame reads as
an accident, and the stacked three-line block is what holds the column the old
four-line headline used to fill.

The video card is down to a title. The category badge and the descriptive line
are both gone, along with their dictionary keys. `videoPending` now takes the
title slot when `siteConfig` carries no video url, so an unconfigured card
still says something rather than rendering an empty line.

The client strip label is "Our clients", still on `.spec spec-on-ink`, which is
the system class for exactly the style the brief describes: uppercase, tracked,
600, slate 400 on a dark ground.

### Ongoing partnerships

New eyebrow, headline and status line. The mosque contract moved to the bottom
of the register: it is the largest account by count and the least like the rest,
so it closes the list rather than interrupting the run of corporate and
commercial names a facilities manager is scanning for.

### Five service scopes

The five residential size tiers are gone. They were five rungs of one ladder;
these are five different jobs. Ids, WhatsApp reference tokens and image mapping
all changed with them:

| Card | Id | Ref | Frame |
| --- | --- | --- | --- |
| 01 Residential Apartments | `apartments` | `WEB-PKG-APT` | borrowed |
| 02 Commercial Facilities | `commercial` | `WEB-PKG-COM` | borrowed |
| 03 Sofa & Upholstery Care | `upholstery` | `WEB-PKG-UPH` | its own |
| 04 Carpet Shampooing & Extraction | `carpet` | `WEB-PKG-CRP` | its own |
| 05 Specialized Deep Cleaning | `deepClean` | `WEB-PKG-DEEP` | borrowed |

Two of the five have genuinely matching photography. `tier-studio.jpg` is a sofa
being treated and `tier-1bhk.jpg` is a rotary machine on a rug, so those go to
Upholstery and Carpet exactly. The other three carried the same duplicated
carpet frame, which would have put a rug machine on a card about office towers;
they borrow a process frame with the right subject instead, and
`media.scopesAwaitingPhotography` now names the three and the shot each one
needs. The three duplicate files were deleted and added to `prune-legacy.mjs`.

`crew` and `duration` collapsed into one `deployment` string, because "custom
team deployed per site scale" is not a crew count and a duration.

**Two things were removed rather than restyled.** The "priced after survey,
never over the phone" line under every button is gone: the section heading and
the intro now say it once at the top instead of five times down the row. And the
`featured` flag is gone with the tiers, along with its "most requested" label,
which was a claim about demand that nothing on file supports. The selected card
still takes an accent ring, because that is state rather than a claim.

Card buttons read "Book Survey" on an obsidian fill with a white hairline. White
on `#0A0E14` is 19.34:1, and the fill against the white card is the same
figure, so the boundary is unmistakable without the border doing any work. It
reads as the quiet member of the button family: obviously pressable, and not
competing with the emerald primaries elsewhere on the page.

### Dictionary

Eight keys retired across both locales: `hero.headlineA`, `hero.headlineB`,
`hero.videoBadge`, `hero.videoSub`, `packages.priceLine`,
`packages.featuredLabel`, `packages.crewLabel`, and the whole `packages.tiers`
tree, replaced by `packages.scopes`. Parity holds at 211 nodes each side, and
the sweep confirms none of the retired keys is referenced anywhere.

`cta.inspection` is now "Book Survey"; `a11y.whatsappPackage` no longer says
"complimentary inspection for this tier".

## Process copy and dedicated scope photography (v13)

Two jobs: retire the last of the copy that reads like a brochure and give every
image slot on the page a file of its own.

### The Pisgah Standard, stages 01 to 03

The three steps were written as claims about a method. They are now written as
what a contractor says on the phone: what happens, who is there, and what you
get at the end of it.

| Stage | Spec | Title |
| --- | --- | --- |
| 01 | ON-SITE ASSESSMENT | Site Walkthrough & Custom Scope |
| 02 | DIRECT DEPLOYMENT | Assigned Crews & Equipment Setup |
| 03 | DAILY VERIFICATION | Supervisor Inspection & Sign-Off |

The specs changed shape as well as wording. They used to be measurements
(`45 TO 90 MIN ON SITE`, `NAMED CREW / FIXED ROSTER`) which invited the reader
to hold us to a stopwatch on a survey that varies by building. They are now
labels for the stage, which is what a spec line is for.

Both locales moved together. Arabic is a translation of the new English, not of
the old, so `تقييم ميداني` sits over stage 01 rather than the retired minute
count. Parity holds at 211 nodes each side.

`journey.cta` is now "Schedule Site Survey" (`حدد موعد معاينة الموقع`). It is an
instruction rather than a possessive, and it names the thing being scheduled.

### A dark variant, rather than a fourth dark button

The CTA was an emerald `primary`. On a light section that already carries the
emerald numerals and spec rules, it was the loudest object on the screen for an
action that sits at the end of a three-stage read.

`Button` gains a `dark` variant: `bg-obsidian text-white border-white/20
hover:bg-carbon`. That is the same surface treatment the five scope card buttons
already use inline, so the two now read as one family. White on `#0A0E14` is
19.34:1, and the hover to carbon holds 16.4:1. The scope cards keep their own
classes because they set a smaller label; only the surface is shared. Both the
sticky desktop rail and the mobile block button switched.

### Process imagery

Stage 01 and stage 03 were rephotographed. Stage 02 is untouched, on
instruction.

| Stage | File | Frame |
| --- | --- | --- |
| 01 | `process-01.jpg` | Gloved hands filling a Pisgah-branded checklist in a furnished living room |
| 02 | `process-02-mobilisation.jpg` | Unchanged. Kitchen unit, cabinet interiors |
| 03 | `process-03.jpg` | Two-person close-of-work check, squeegee on a bedroom mirror |

Both new files arrived portrait, 1125x1398 and 784x1353, and both were cropped
to the 4:3 box the mobilisation frame already uses. That is a deviation from the
"render naturally without forced cropping" instruction and it is deliberate: the
three frames share one height cap in the timeline, and a 0.58 portrait dropped
into a `w-full h-auto max-h-[360px] object-contain` box letterboxes to side bars
wider than the photograph. Cropping to the common ratio was the only way to keep
the three steps uniform, which is the older decision this brief asked not to
regress.

The cap is now a flat `max-h-[360px]` at every width, as specified; the
`sm:max-h-[420px]` step from v11 is gone. With all three sources at 4:3, nothing
crops at phone widths at all - a 350px column gives a 262px frame, under the cap
- and the cap only bites on a desktop, where `object-cover` keeps the middle 73
percent.

Both files carried EXIF orientation and were transposed before cropping. Read
cold they report landscape and would have been cut across the wrong axis. This
is the third photography drop where that has been true.

### Scope card photography

All five cards now have a dedicated file. None borrows a process frame.

| Card | File | Frame |
| --- | --- | --- |
| 01 Residential Apartments | `scope-residential.jpg` | Wet marble extraction, empty villa room |
| 02 Commercial Facilities | `scope-commercial.jpg` | Numatic scrubber-dryer in a cinema lobby |
| 03 Sofa & Upholstery Care | `scope-upholstery.jpg` | Rotary polisher and spray on a green velvet sofa |
| 04 Carpet Shampooing & Extraction | `scope-carpet.jpg` | Rotary machine on a patterned rug |
| 05 Specialized Deep Cleaning | `scope-deepclean.jpg` | Single-disc rotary, empty room |

The container was already `aspect-[4/3]` with `object-cover` inside a
`rounded-2xl overflow-hidden` card, which is what the brief asks for, so the
frames did not change; only the sources did. Every file is cut to 1200x900 so
the five cards align across the row at any breakpoint.

Five photographs were supplied for seven slots. Cards 04 and 05 are therefore
cut from earlier drops rather than from this one. Card 04 is a genuine match and
needs nothing. Card 05 shares its source negative with the hero spotlight card;
the two sit far apart on the page and the hero crop is wider and vignetted, so
it does not read as a repeat, but it is still one photograph doing two jobs.
`media.scopesAwaitingPhotography` is down from three ids to one, `deepClean`,
with the shot it needs named in the comment beside it.

### Retired

`process-01-survey.jpg`, `process-03-handover.jpg`, `tier-studio.jpg` and
`tier-1bhk.jpg` were deleted and added to `scripts/prune-legacy.mjs`, so a
checkout that unpacks this release over the last one heals itself. The
dictionary keys `journey.steps.survey`, `.mobilisation` and `.signoff` are
unchanged; they name the step, not the file.

## Assets to replace

Client photography supplied September 2026 is now in place.

| File | Used by | Source |
| --- | --- | --- |
| `intro-hero.jpg` | Hero background | Tower lobby, vacuuming, WTC through the window |
| `hero-spotlight.jpg` | Hero spotlight card | Single-disc rotary, empty room. Shares its negative with `scope-deepclean.jpg`. |
| `process-01.jpg` | Journey step 01 | Branded checklist being filled, living room |
| `process-02-mobilisation.jpg` | Journey step 02 | Kitchen unit, cabinet interiors |
| `process-03.jpg` | Journey step 03 | Squeegee on a bedroom mirror, two operators |
| `scope-residential.jpg` | Scope card 01 | Wet marble extraction, empty villa room |
| `scope-commercial.jpg` | Scope card 02 | Scrubber-dryer in a cinema lobby |
| `scope-upholstery.jpg` | Scope card 03 | Rotary and spray on a velvet sofa |
| `scope-carpet.jpg` | Scope card 04 | Rotary machine on a patterned rug |
| `scope-deepclean.jpg` | Scope card 05 | **Shared frame.** Cut from the same negative as `hero-spotlight.jpg`. Listed in `siteConfig.media.scopesAwaitingPhotography`; remove the id once a post-renovation or move-out reset is shot. |
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
- One more photograph: a post-renovation or move-out deep clean, with high-dusting or grease work visible, to free scope card 05 from the hero spotlight negative.
