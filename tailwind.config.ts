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
        /* Reference palette, approved September 2026.
           Deep teal primary on a crisp white and slate ground.
           Contrast measured: accent on white 5.47:1, white on accent 5.47:1,
           accent-hover on white 7.58:1, slate on white 17.85:1. */
        ink: '#0F172A',        // slate 900, dark contrast surfaces and type
        deep: '#0F766E',       // teal 700, primary action fill
        blue: '#115E59',       // teal 800, primary hover. Darker, not lighter,
                               // so white label stays above 4.5:1
        cyan: '#2DD4BF',       // teal 400, accents on dark surfaces only
        teal: '#0D9488',       // teal 600, rules, markers and hairline accents
        graphite: '#475569',   // slate 600
        mist: '#E2E8F0',       // slate 200, borders and image placeholders
        paper: '#F8FAFC',      // slate 50, page ground
        emerald: '#10B981',    // status indicator only
        whatsapp: '#25D366',
        body: '#0F172A',
        muted: '#475569',      // 7.58:1 on white
        faint: '#64748B',      // 4.76:1 on white, 4.55:1 on the ground. AA for small text
        'faint-soft': '#94A3B8', // decorative and on-dark metadata only
        hairline: '#E2E8F0',
        'hairline-soft': '#F1F5F9',
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
        nav: '0 10px 30px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.05)',
        card: '0 1px 2px rgba(15,23,42,.05), 0 2px 8px rgba(15,23,42,.05)',
        lifted: '0 14px 34px rgba(15,23,42,.11), 0 3px 8px rgba(15,23,42,.06)',
        intake:
          '0 30px 70px rgba(15,23,42,.12), 0 10px 24px rgba(15,23,42,.07), 0 1px 2px rgba(15,23,42,.05)',
        badge: '0 12px 32px rgba(15,23,42,.14), 0 2px 6px rgba(15,23,42,.07)',
        frame: '0 30px 70px rgba(15,23,42,.20), 0 6px 18px rgba(15,23,42,.09)',
        deep: '0 8px 22px rgba(15,118,110,.28)',
        cyan: '0 12px 28px rgba(13,148,136,.34)',
        drawer: '0 0 50px rgba(15,23,42,.22)',
        /* Multi-stop diffuse elevation. Three offsets at low alpha read as
           depth; a single large blur reads as a default Tailwind shadow. */
        diffuse:
          '0 1px 1px rgba(15,23,42,.04), 0 4px 8px rgba(15,23,42,.04), 0 12px 24px rgba(15,23,42,.05)',
        'diffuse-lg':
          '0 1px 1px rgba(15,23,42,.05), 0 6px 14px rgba(15,23,42,.06), 0 18px 36px rgba(15,23,42,.07), 0 40px 72px rgba(15,23,42,.06)',
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
        focus: '#0F766E',       // 5.47:1 on white
        'focus-ink': '#34D399', // 9.29:1 on slate 900
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
          backgroundColor: 'rgba(15,23,42,.58)',
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
