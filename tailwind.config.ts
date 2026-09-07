import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Pisgah design tokens.
 *
 * ---------------------------------------------------------------------------
 * Botanical green palette, approved September 2026. Five shades, applied as a
 * vertical flow: lightest at the top of the page, deepest at the bottom.
 *
 *   G1  #E3EED4   sage-50    pale mint canvas. Section grounds, pill fills,
 *                            soft card backdrops, body copy on deep surfaces
 *   G2  #AEC3B0   sage-200   soft mineral sage. Card outlines, dividers,
 *                            inactive icon strokes, fills on deep surfaces
 *   G3  #6B9071   sage-400   the ticked primary anchor. Header tint, chevrons,
 *                            badge numerals, markers, rules, active states
 *   G4  #375534   sage-600   rich moss. Primary button fill, deep section
 *                            surfaces, accent labels on light ground
 *   G5  #0F2A1D   sage-800   deep forest. Footer, drawer, hero scrim, baseline
 *
 * Contrast, measured rather than assumed (WCAG 2.1):
 *   white on G4        8.36:1   primary button label            pass AAA
 *   white on G5       15.34:1                                   pass AAA
 *   G1 on G4           6.95:1   body copy on deep surfaces      pass AA
 *   G1 on G5          12.74:1                                   pass AAA
 *   G5 on G2           8.20:1   the pale accent button on deep  pass AAA
 *   G4 on white        8.36:1   accent labels on light ground   pass AA
 *   G3 on white        3.59:1   NON TEXT AND LARGE TEXT ONLY
 *   G3 on G5           4.27:1   below AA for small text
 *   white on G3        3.59:1   never used
 *   G5 on G3           4.27:1   never used for a button label
 *
 * The deviation worth naming: G3 is the ticked brand anchor, and the brief put
 * it on the primary buttons. No label clears 4.5:1 on it. White measures
 * 3.59:1, and even G5, the darkest shade in the palette, reaches only 4.27:1,
 * which is a five percent shortfall rather than a rounding error. So the
 * primary fill steps one shade deeper to G4 and hovers deeper still to G5, and
 * G3 does everything else the brief asked of it: the translucent header tint,
 * chevrons, active badges, markers, rules, borders and the large display
 * numerals, all of which are either non-text or above the 24px large-text
 * threshold where the 3:1 rule applies. Change `deep` below to '#6B9071' if
 * you would rather have the ticked colour on the fill and accept 4.27:1.
 *
 * Font families resolve through CSS variables that are redefined under
 * [dir="rtl"] in globals.css, so the Arabic stack swaps in automatically for
 * every utility without a single conditional class in a component.
 * ---------------------------------------------------------------------------
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* The five palette shades, addressable by name. */
        sage: {
          50: '#E3EED4',
          200: '#AEC3B0',
          400: '#6B9071',
          600: '#375534',
          800: '#0F2A1D',
        },

        /* The vertical ground ramp, white stepping toward G1. Each light
           section sits one step deeper than the one above it, which produces
           the gradual descent without a scroll listener or a page-height
           gradient. */
        ground: {
          1: '#FFFFFF',
          2: '#F9FBF6',
          3: '#F3F8ED',
          4: '#EEF4E4',
          5: '#E8F1DC',
        },

        /* Semantic aliases. Components address these, so a palette revision
           happens here and nowhere else. */
        ink: '#0F2A1D',        // G5, deepest surfaces, body type, button hover
        deep: '#375534',       // G4, primary action fill, accent labels
        blue: '#375534',       // G4, deep section surfaces. Kept as an alias so
                               // the section components did not need renaming
        cyan: '#AEC3B0',       // G2, fills and strokes on deep surfaces
        teal: '#6B9071',       // G3, the ticked anchor. Rules, markers,
                               // chevrons, active states, display numerals
        graphite: '#3F5B41',
        mist: '#D5E2D6',       // borders and image placeholders
        paper: '#F9FBF6',      // ground 2, the page default
        whatsapp: '#25D366',   // brand mark, deliberately outside the palette
        body: '#0F2A1D',       // 15.34:1 on white
        muted: '#3F5B41',      // 7.54:1 on white, 6.48:1 on the deepest ground
        faint: '#4F6E52',      // 5.70:1 on white, 4.90:1 on the deepest ground
        'faint-soft': '#C3D3C4', // 5.35:1 on G4, 9.81:1 on G5. Deep only. G2
                                 // itself is 4.47:1 on G4, just below AA, so
                                 // the metadata tint is lifted toward G1
        hairline: '#D3E0D4',
        'hairline-soft': '#E7EEE7',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },
      maxWidth: {
        container: '1200px',
        measure: '68ch',
      },
      borderRadius: {
        card: '16px',
        frame: '22px',
      },
      boxShadow: {
        nav: '0 10px 30px rgba(15,42,29,.10), 0 2px 6px rgba(15,42,29,.06)',
        card: '0 1px 2px rgba(15,42,29,.05), 0 2px 8px rgba(15,42,29,.05)',
        lifted: '0 14px 34px rgba(15,42,29,.12), 0 3px 8px rgba(15,42,29,.07)',
        intake:
          '0 30px 70px rgba(15,42,29,.13), 0 10px 24px rgba(15,42,29,.08), 0 1px 2px rgba(15,42,29,.05)',
        badge: '0 12px 32px rgba(15,42,29,.15), 0 2px 6px rgba(15,42,29,.08)',
        frame: '0 30px 70px rgba(15,42,29,.22), 0 6px 18px rgba(15,42,29,.10)',
        deep: '0 8px 22px rgba(55,85,52,.30)',
        cyan: '0 12px 28px rgba(107,144,113,.38)',
        drawer: '0 0 50px rgba(15,42,29,.24)',
        /* Multi-stop diffuse elevation. Three offsets at low alpha read as
           depth; a single large blur reads as a default Tailwind shadow. */
        diffuse:
          '0 1px 1px rgba(15,42,29,.04), 0 4px 8px rgba(15,42,29,.04), 0 12px 24px rgba(15,42,29,.05)',
        'diffuse-lg':
          '0 1px 1px rgba(15,42,29,.05), 0 6px 14px rgba(15,42,29,.06), 0 18px 36px rgba(15,42,29,.07), 0 40px 72px rgba(15,42,29,.06)',
        'diffuse-ink':
          '0 1px 1px rgba(0,0,0,.20), 0 8px 20px rgba(0,0,0,.22), 0 28px 56px rgba(0,0,0,.20)',
      },
      spacing: {
        rhythm: 'clamp(80px, 9vw, 120px)',
        'rhythm-sm': 'clamp(56px, 6vw, 84px)',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        standard: '350ms',
        deliberate: '500ms',
      },
      transitionTimingFunction: {
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        feedback: 'cubic-bezier(0.2, 0, 0, 1)',
        exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      backdropBlur: {
        glass: '14px',
        panel: '18px',
      },
      keyframes: {
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(107,144,113,.60)' },
          '70%': { boxShadow: '0 0 0 7px rgba(107,144,113,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(107,144,113,0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
      ringColor: {
        focus: '#375534',       // 8.36:1 on white
        'focus-ink': '#AEC3B0', // 8.20:1 on G5, 4.47:1 on G4
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addComponents }) => {
      addUtilities({
        /* Glassmorphism, always paired with a solid fallback colour so text
           stays legible where backdrop-filter is unsupported. */
        '.glass-badge': {
          backgroundColor: 'rgba(255,255,255,.68)',
          border: '1px solid rgba(255,255,255,.88)',
          backdropFilter: 'blur(14px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
        },
        '.glass-panel': {
          backgroundColor: 'rgba(255,255,255,.86)',
          border: '1px solid rgba(255,255,255,.95)',
          backdropFilter: 'blur(18px) saturate(1.35)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.35)',
        },
        '.glass-ghost': {
          backgroundColor: 'rgba(255,255,255,.62)',
          border: '1px solid rgba(255,255,255,.9)',
          backdropFilter: 'blur(12px) saturate(1.25)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.25)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(15,42,29,.58)',
          border: '1px solid rgba(227,238,212,.22)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
        /* Composite only. Never animate layout properties. */
        '.transform-gpu': { transform: 'translateZ(0)' },
        '.tap': {
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        },
        /* Latin tracking utilities that are neutralised under RTL by globals.css. */
        '.track-label': { letterSpacing: '0.13em' },
        '.track-eyebrow': { letterSpacing: '0.15em' },
      });

      addComponents({
        /* One container for every section, so headers, card edges and text
           columns land on the same grid. max-w-7xl with the 4 / 6 / 8 padding
           scale. */
        '.container-page': {
          width: '100%',
          maxWidth: '80rem',
          marginInline: 'auto',
          paddingInline: '1rem',
          '@media (min-width: 640px)': { paddingInline: '1.5rem' },
          '@media (min-width: 1024px)': { paddingInline: '2rem' },
        },
      });
    }),
  ],
};

export default config;
