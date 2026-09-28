import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Pisgah design tokens.
 *
 * ---------------------------------------------------------------------------
 * Obsidian architectural system, approved September 2026. Dark sections frame
 * the page at the top and bottom; the operational middle runs on a warm light
 * canvas. The rhythm is deliberate: prestige at the edges, hygiene in the
 * working sections.
 *
 *   obsidian  #0A0E14   outer canvas, framed hero, client proof, footer, drawer
 *   carbon    #121820   elevated dark surfaces: the pill nav and the spotlight
 *   canvas    #F8F9FA   light section ground
 *   white     #FFFFFF   cards on the light ground
 *   ink       #0F172A   type on light surfaces
 *   emerald   #0D7A5F   the accent. Primary fill, accent labels, markers
 *   slate 400 #94A3B8   metadata on dark surfaces
 *
 * Contrast, measured rather than assumed (WCAG 2.1):
 *   white on emerald       5.29:1   primary button label      pass AA
 *   emerald on white       5.29:1   accent labels on light    pass AA
 *   emerald on canvas      5.02:1                             pass AA
 *   white on emerald-deep  7.64:1   the hover state
 *   ink on canvas         16.94:1                             pass AAA
 *   white on obsidian     19.34:1                             pass AAA
 *   white on carbon       17.84:1                             pass AAA
 *   slate 400 on obsidian  7.54:1   metadata on dark          pass AA
 *   slate 400 on carbon    6.96:1                             pass AA
 *   emerald on obsidian    3.65:1   NON TEXT ONLY on dark. Borders, icon
 *                                   strokes and focus rings, never a label.
 *
 * Unlike the three palettes before it, this accent needs no deviation: the
 * supplied emerald carries a white label at 5.29:1, so the primary button is
 * filled with the brand colour exactly as specified and hovers darker.
 *
 * Typography. One family, site wide. Plus Jakarta Sans carries every heading,
 * label and paragraph in Latin; IBM Plex Sans Arabic carries all three under
 * RTL. `display` and `sans` both resolve to the same CSS variable, so a
 * heading and the paragraph beneath it cannot disagree, and there is no second
 * face for a component to reach for. The swap happens in one place in
 * globals.css, so no component carries a conditional font class.
 * ---------------------------------------------------------------------------
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* The dark architecture. */
        obsidian: '#0A0E14',
        carbon: '#121820',

        /* The light canvas and its cards. */
        canvas: '#F8F9FA',

        /* The accent ramp. */
        emerald: {
          DEFAULT: '#0D7A5F',
          deep: '#0A5F4A',   // hover. 7.64:1 with white
          soft: '#E6F2EE',   // tint for pills and markers on the light canvas
        },

        /* Semantic aliases. Components address these, so a palette revision
           happens here and nowhere else. */
        ink: '#0F172A',        // type on light surfaces
        deep: '#0D7A5F',       // primary action fill
        blue: '#0A5F4A',       // primary hover, darker not lighter
        cyan: '#94A3B8',       // metadata and strokes on dark surfaces
        teal: '#0D7A5F',       // rules, markers, accent hairlines
        graphite: '#475569',
        mist: '#E2E6EA',       // image placeholders
        paper: '#F8F9FA',      // the light section ground
        whatsapp: '#25D366',   // brand mark, deliberately outside the palette
        body: '#0F172A',       // 16.94:1 on the canvas
        muted: '#475569',      // 7.19:1 on the canvas
        faint: '#5A6B7B',      // 5.21:1 on the canvas, 5.49:1 on white
        'faint-soft': '#94A3B8', // 7.54:1 on obsidian, 6.96:1 on carbon
        hairline: '#E2E6EA',
        'hairline-soft': '#EEF1F3',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
      },
      fontSize: {
        eyebrow: ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.16em' }],
      },
      maxWidth: {
        container: '1200px',
        measure: '68ch',
      },
      borderRadius: {
        card: '16px',
        frame: '28px',
        'frame-lg': '32px',
      },
      boxShadow: {
        /* Architectural elevation. Flat, tight, no coloured glows. */
        card: '0 1px 2px rgba(10,14,20,.05), 0 2px 8px rgba(10,14,20,.05)',
        lifted: '0 12px 28px rgba(10,14,20,.10), 0 2px 6px rgba(10,14,20,.06)',
        intake: '0 24px 56px rgba(10,14,20,.10), 0 4px 12px rgba(10,14,20,.06)',
        frame: '0 40px 90px rgba(10,14,20,.45)',
        pill: '0 8px 28px rgba(10,14,20,.38)',
        spotlight: '0 24px 60px rgba(10,14,20,.55)',
        drawer: '0 0 50px rgba(10,14,20,.50)',
        diffuse:
          '0 1px 1px rgba(10,14,20,.04), 0 4px 8px rgba(10,14,20,.04), 0 12px 24px rgba(10,14,20,.05)',
        'diffuse-lg':
          '0 1px 1px rgba(10,14,20,.05), 0 6px 14px rgba(10,14,20,.06), 0 18px 36px rgba(10,14,20,.07)',
        'diffuse-ink': '0 20px 48px rgba(0,0,0,.45)',
        /* Kept as aliases so no component breaks; both are flat now. */
        nav: '0 8px 28px rgba(10,14,20,.38)',
        badge: '0 12px 28px rgba(10,14,20,.14)',
        deep: '0 6px 18px rgba(13,122,95,.24)',
        cyan: '0 10px 24px rgba(13,122,95,.30)',
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
          '0%': { boxShadow: '0 0 0 0 rgba(13,122,95,.55)' },
          '70%': { boxShadow: '0 0 0 7px rgba(13,122,95,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(13,122,95,0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
      ringColor: {
        focus: '#0D7A5F',       // 5.29:1 on white
        'focus-ink': '#94A3B8', // 7.54:1 on obsidian
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addComponents }) => {
      addUtilities({
        /* ------------------------------------------------------------------
           Glassmorphism is restricted by design rule to exactly two places:
           the floating pill navigation and the hero spotlight card. These two
           utilities are the only blur surfaces in the system, and they are
           named for the single element each one dresses. Nothing else in the
           codebase may use backdrop-filter.
           ------------------------------------------------------------------ */
        '.glass-pill': {
          backgroundColor: 'rgba(18,24,32,.92)',
          backdropFilter: 'blur(12px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
          '@supports (backdrop-filter: blur(1px))': {
            backgroundColor: 'rgba(18,24,32,.82)',
          },
        },
        '.glass-spotlight': {
          backgroundColor: 'rgba(18,24,32,.95)',
          backdropFilter: 'blur(14px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.15)',
          '@supports (backdrop-filter: blur(1px))': {
            backgroundColor: 'rgba(18,24,32,.90)',
          },
        },
        /* Composite only. Never animate layout properties. */
        '.transform-gpu': { transform: 'translateZ(0)' },
        '.tap': {
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        },
        /* Latin tracking utilities that are neutralised under RTL. */
        '.track-label': { letterSpacing: '0.14em' },
        '.track-eyebrow': { letterSpacing: '0.16em' },
      });

      addComponents({
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
