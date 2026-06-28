import type { LucideIcon } from 'lucide-react'
import { Icon } from '@/components/icon'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  hint?: string
}

// Typographic empty state (DESIGN §8.4 / §9): left-locked (never centered), a
// 32px muted glyph, an Oswald uppercase line, and a plain fix hint. No stock,
// no gradient, no blob.
export function EmptyState({ icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 py-16">
      <Icon icon={icon} size={32} className="text-muted-foreground" />
      <p className="font-condensed text-h3 font-semibold uppercase text-foreground">{title}</p>
      {hint && <p className="font-sans text-caption text-muted-foreground">{hint}</p>}
    </div>
  )
}
