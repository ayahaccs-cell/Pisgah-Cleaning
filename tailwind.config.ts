import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Pisgah design tokens.
 *
 * Every colour below was sampled from the supplied logo artwork or the Company
 * Profile 2026 deck. No colour is invented, and nothing outside this palette is
 * permitted in a component.
 *
 * Font families resolve through CSS variables that are redefined under
 * [dir="rtl"] in globals.css, so the Arabic stack swaps in automatically for
 * every utility without a single conditional class in a component.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F2A35',        // profile deck dark panel
        deep: '#02547E',       // logo P stem, primary action
        blue: '#096DA1',       // wordmark, links and hovers
        cyan: '#19A0DE',       // logo swoosh, highlights only
        teal: '#35B4C6',       // profile accent, survey CTA and rules
        graphite: '#4E4E4E',   // squeegee, monochrome client marks
        mist: '#DCE5E8',       // borders and dividers
        paper: '#F2F6F7',      // page ground, never pure white
        emerald: '#10B981',    // status indicator only
        whatsapp: '#25D366',
        body: '#12303B',
        muted: '#4A6570',
        faint: '#56707C',      // 5.24:1 on white, 4.82:1 on paper. AA for small text.
        'faint-soft': '#7C939C', // decorative only, never for text
        hairline: '#D7E1E5',
        'hairline-soft': '#E6EDEF',
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
        nav: '0 10px 30px rgba(15,42,53,.10), 0 2px 6px rgba(15,42,53,.06)',
        card: '0 1px 2px rgba(15,42,53,.05), 0 2px 8px rgba(15,42,53,.05)',
        lifted: '0 14px 34px rgba(15,42,53,.12), 0 3px 8px rgba(15,42,53,.07)',
        intake:
          '0 24px 60px rgba(15,42,53,.14), 0 8px 20px rgba(15,42,53,.08), 0 1px 2px rgba(15,42,53,.06)',
        badge: '0 12px 32px rgba(15,42,53,.16), 0 2px 6px rgba(15,42,53,.08)',
        frame: '0 30px 70px rgba(15,42,53,.22), 0 6px 18px rgba(15,42,53,.10)',
        deep: '0 8px 22px rgba(2,84,126,.30)',
        cyan: '0 10px 26px rgba(25,160,222,.32)',
        drawer: '0 0 50px rgba(15,42,53,.24)',
        /* Multi-stop diffuse elevation. Three offsets at low alpha read as
           depth; a single large blur reads as a default Tailwind shadow. */
        diffuse:
          '0 1px 1px rgba(15,42,53,.04), 0 4px 8px rgba(15,42,53,.04), 0 12px 24px rgba(15,42,53,.05)',
        'diffuse-lg':
          '0 1px 1px rgba(15,42,53,.05), 0 6px 14px rgba(15,42,53,.06), 0 18px 36px rgba(15,42,53,.07), 0 40px 72px rgba(15,42,53,.06)',
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
          '0%': { boxShadow: '0 0 0 0 rgba(16,185,129,.5)' },
          '70%': { boxShadow: '0 0 0 7px rgba(16,185,129,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
      ringColor: {
        focus: '#02547E',      // on light surfaces
        'focus-ink': '#34D399', // emerald 400, on Ink Navy surfaces
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
          backgroundColor: 'rgba(15,42,53,.62)',
          border: '1px solid rgba(255,255,255,.22)',
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
        '.container-page': {
          width: '100%',
          maxWidth: '1200px',
          marginInline: 'auto',
          paddingInline: 'clamp(16px, 4vw, 28px)',
        },
      });
    }),
  ],
};

export default config;
