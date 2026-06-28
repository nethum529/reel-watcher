import type { LucideIcon } from 'lucide-react'
import { Icon } from '@/components/icon'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  hint?: string
}

// Typographic empty state (DESIGN §6.4/§7): 32px muted glyph + plain message.
export function EmptyState({ icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <Icon icon={icon} size={32} className="text-muted-foreground" />
      <p className="font-sans text-body text-foreground">{title}</p>
      {hint && <p className="font-sans text-caption text-muted-foreground">{hint}</p>}
    </div>
  )
}
