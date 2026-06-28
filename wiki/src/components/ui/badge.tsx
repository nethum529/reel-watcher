import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn Badge, re-themed (DESIGN §6.3). rounded-full, sans label. Selected
// state carries a second channel (a check icon, added by the caller).
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-sans text-sm font-medium leading-none transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-muted-foreground',
        selected: 'border-primary bg-accent-subtle text-primary',
      },
      size: {
        default: 'px-3 py-1',
        sm: 'px-2 py-0.5 text-xs',
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
