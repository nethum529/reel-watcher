import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

// The hard rule (DESIGN §8.6): a 2px --border line — the brutalist structural
// seam that divides the reading column from slides and major list groups.
// Decorative by default (presentation role).
export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-0.5 w-full' : 'h-full w-0.5',
        className,
      )}
      {...props}
    />
  )
}
