import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Pisgah design tokens.
 *
 * ---------------------------------------------------------------------------
 * Blue palette, approved September 2026. Six shades, applied as a vertical
 * flow: lightest at the top of the page, deepest at the bottom.
 *
 *   S1  #C1E8FF   navy-50    header and hero glass, text on deep surfaces
 *   S2  #7DA0CA   navy-200   accents and interactive marks on deep surfaces
 *   S3  #5483B3   navy-400   rules, markers, hairline accents, active states
 *   S4  #325884   navy-600   primary action fill, accent labels on light
 *   S5  #052659   navy-800   deep section surfaces and contrasting panels
 *   S6  #021024   navy-950   footer, baseline, and the hero scrim
 *
 * Contrast, measured rather than assumed (WCAG 2.1):
 *   white on S4        7.33:1   primary button label            pass AA
 *   white on S5       14.71:1                                   pass AAA
 *   white on S6       19.05:1                                   pass AAA
 *   S1 on S5          11.38:1   body copy on deep panels        pass AAA
 *   S1 on S6          14.75:1                                   pass AAA
 *   S2 on S6           7.03:1   accents and focus ring on deep  pass AA
 *   S4 on white        7.33:1   accent labels on light ground   pass AA
 *   S3 on white        3.98:1   NON TEXT ONLY. Rules, markers,
 *                               borders and focus rings, never
 *                               a small label on a light ground.
 *   white on S2        2.71:1   never used. S2 carries dark type only.
 *   white on S3        3.98:1   never used, which is why the primary
 *                               button fills with S4 and not S3.
 *
 * That last pair is the one deviation from the brief worth naming: S2 and S3
 * were requested as primary action fills, but neither clears 4.5:1 with a white
 * label. They drive the interactive accents instead, and the button fill steps
 * one shade deeper to S4, hovering deeper still to S5.
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
        /* The six palette shades, addressable by name. */
        navy: {
          50: '#C1E8FF',
          200: '#7DA0CA',
          400: '#5483B3',
          600: '#325884',
          800: '#052659',
          950: '#021024',
        },

        /* The vertical ground ramp. Each light section sits one step deeper
           than the one above it, which is what produces the gradual descent
           without a single scroll listener or a page-height gradient. */
        ground: {
          1: '#FFFFFF',
          2: '#F6FCFF',
          3: '#EFF9FF',
          4: '#E7F6FF',
          5: '#E0F4FF',
        },

        /* Semantic aliases. Components address these, so a future palette
           revision happens here and nowhere else. */
        ink: '#021024',        // S6, deepest surfaces and body type
        deep: '#325884',       // S4, primary action fill
        blue: '#052659',       // S5, primary hover. Darker, not lighter, so the
                               // white label climbs from 7.33:1 to 14.71:1
        cyan: '#7DA0CA',       // S2, accents on deep surfaces only
        teal: '#5483B3',       // S3, rules, markers and hairline accents
        graphite: '#3D5A80',
        mist: '#DCE7F2',       // borders and image placeholders
        paper: '#F6FCFF',      // ground 2, the page default
        whatsapp: '#25D366',   // brand mark, deliberately outside the palette
        body: '#021024',       // 19.05:1 on white
        muted: '#3D5A80',      // 7.06:1 on white, 6.24:1 on the deepest ground
        faint: '#526E8F',      // 5.27:1 on white, 4.65:1 on the deepest ground
        'faint-soft': '#8FA3BC', // 5.70:1 on S5, 7.38:1 on S6. On deep only
        hairline: '#D7E6F4',
        'hairline-soft': '#E8F2FB',
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
        nav: '0 10px 30px rgba(2,16,36,.10), 0 2px 6px rgba(2,16,36,.06)',
        card: '0 1px 2px rgba(2,16,36,.05), 0 2px 8px rgba(2,16,36,.05)',
        lifted: '0 14px 34px rgba(2,16,36,.12), 0 3px 8px rgba(2,16,36,.07)',
        intake:
          '0 30px 70px rgba(2,16,36,.13), 0 10px 24px rgba(2,16,36,.08), 0 1px 2px rgba(2,16,36,.05)',
        badge: '0 12px 32px rgba(2,16,36,.15), 0 2px 6px rgba(2,16,36,.08)',
        frame: '0 30px 70px rgba(2,16,36,.22), 0 6px 18px rgba(2,16,36,.10)',
        deep: '0 8px 22px rgba(50,88,132,.30)',
        cyan: '0 12px 28px rgba(84,131,179,.36)',
        drawer: '0 0 50px rgba(2,16,36,.24)',
        /* Multi-stop diffuse elevation. Three offsets at low alpha read as
           depth; a single large blur reads as a default Tailwind shadow. */
        diffuse:
          '0 1px 1px rgba(2,16,36,.04), 0 4px 8px rgba(2,16,36,.04), 0 12px 24px rgba(2,16,36,.05)',
        'diffuse-lg':
          '0 1px 1px rgba(2,16,36,.05), 0 6px 14px rgba(2,16,36,.06), 0 18px 36px rgba(2,16,36,.07), 0 40px 72px rgba(2,16,36,.06)',
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
          '0%': { boxShadow: '0 0 0 0 rgba(125,160,202,.55)' },
          '70%': { boxShadow: '0 0 0 7px rgba(125,160,202,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(125,160,202,0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
      ringColor: {
        focus: '#325884',       // 7.33:1 on white
        'focus-ink': '#7DA0CA', // 7.03:1 on S6, 5.43:1 on S5
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
          backgroundColor: 'rgba(2,16,36,.58)',
          border: '1px solid rgba(193,232,255,.22)',
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
