import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Stroke-width is a brand token (BRAND §9): 1.5 default. Lucide's strokeWidth is
// an SVG prop, not a CSS var — enforce the token here in one place. Icons inherit
// currentColor; decorative icons are aria-hidden by default.
export const ICON_STROKE_WIDTH = 1.5

interface IconProps extends Omit<ComponentProps<LucideIcon>, 'ref'> {
  icon: LucideIcon
}

export function Icon({
  icon: Glyph,
  size = 16,
  strokeWidth = ICON_STROKE_WIDTH,
  className,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  ...rest
}: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
      aria-hidden={ariaLabel ? undefined : (ariaHidden ?? true)}
      aria-label={ariaLabel}
      {...rest}
    />
  )
}
