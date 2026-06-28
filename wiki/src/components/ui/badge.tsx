import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn Badge, re-themed to brutalism (DESIGN §8.3): SQUARE (radius 0), hard
// 1px border, flat fill. Default = neutral chip; selected = the one place a tag
// may take the Orchid fill (acting as the single selected punch) with jet text —
// the caller adds a check icon as the required second channel.
export const badgeVariants = cva(
  'inline-flex items-center gap-1 border font-sans text-xs font-medium uppercase leading-none tracking-[0.04em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-muted-foreground',
        selected: 'border-border bg-primary text-primary-foreground',
      },
      size: {
        default: 'px-2.5 py-1',
        sm: 'px-2 py-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
