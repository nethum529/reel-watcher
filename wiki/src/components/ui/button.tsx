import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn Button, re-themed to Swiss Brutalism (DESIGN §8.5): square corners,
// hard 2px borders, flat fills, NO shadow. Tailwind v4 gates `hover:` behind
// @media (hover:hover), so no hover-only affordance on touch. Focus is the
// global :focus-visible ring (index.css). Accent TEXT uses --accent-ink; base
// Orchid (--primary) is fill-only and always carries jet --primary-foreground.
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'border-2 border-border bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed',
        secondary:
          'border-2 border-border bg-card text-foreground hover:bg-accent',
        ghost:
          'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        link: 'bg-transparent text-accent-ink underline-offset-4 decoration-2 hover:underline',
      },
      size: {
        default: 'h-11 px-4',
        // sm = tighter horizontal footprint only; height stays ≥44px (BRAND §10).
        sm: 'min-h-11 px-3',
        icon: 'min-h-11 min-w-11',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
