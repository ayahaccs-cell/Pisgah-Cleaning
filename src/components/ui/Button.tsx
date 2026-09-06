'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * The only button in the system.
 *
 * Every call to action on this site is a link, because there is no form
 * endpoint and no checkout. `ref` is required on WhatsApp actions by the
 * WhatsAppAction wrapper, not here, so a plain navigation link stays simple.
 */

type Variant = 'primary' | 'ghost' | 'glass' | 'whatsapp' | 'teal' | 'outline' | 'light';
type Size = 'md' | 'lg' | 'block';

const BASE =
  'u-press tap inline-flex items-center justify-center gap-2.5 rounded-full font-display font-semibold ' +
  'border border-transparent text-center no-underline min-h-[48px] transform-gpu';

/* Focus ring colour follows the surface the button sits on, because no single
   hue clears 3:1 against both white and Ink Navy. See globals.css. */
const FOCUS: Record<Variant, string> = {
  primary: 'focus-ring-light',
  ghost: 'focus-ring-light',
  glass: 'focus-ring-light',
  whatsapp: 'focus-ring-light',
  teal: 'focus-ring-ink',
  outline: 'focus-ring-ink',
  light: 'focus-ring-ink',
};

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-deep text-white shadow-deep hover:bg-blue hover:shadow-cyan',
  ghost: 'bg-transparent text-body border-hairline hover:border-teal hover:text-blue',
  glass: 'glass-ghost text-ink hover:bg-white/80',
  whatsapp: 'bg-whatsapp text-[#06301A] shadow-[0_8px_20px_rgba(37,211,102,.28)] hover:bg-[#22C55E]',
  teal: 'bg-teal text-[#04231F] hover:bg-[#14B8A6]',
  outline: 'bg-transparent text-white border-white/70 hover:border-white hover:bg-white/10',
  /* On the green header. White fill, brand green label. */
  light: 'bg-white text-deep hover:bg-white/90',
};

const SIZES: Record<Size, string> = {
  md: 'px-5 text-[15px]',
  lg: 'px-7 text-base',
  block: 'w-full px-5 text-[15px]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

type PressProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export function Button(props: LinkProps | PressProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${FOCUS[variant]} ${className}`;

  if ('href' in props && props.href) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <a href={href} className={classes} {...target} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as PressProps;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
