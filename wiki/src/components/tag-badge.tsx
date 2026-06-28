import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

interface TagBadgeProps {
  tag: string
  selected?: boolean
  size?: 'default' | 'sm'
}

// A topic tag rendered as a link to its topic page (DESIGN §6.3). Interactive
// hover/active states; selected adds a check (second channel beyond color).
export function TagBadge({ tag, selected = false, size = 'default' }: TagBadgeProps) {
  return (
    <Link
      to={`/topic/${encodeURIComponent(tag)}`}
      // 44px touch target around the smaller visual chip (BRAND §10 / WCAG 2.5.8).
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors',
        !selected && 'hover:[&>span]:border-border-strong hover:[&>span]:text-foreground',
      )}
    >
      <Badge variant={selected ? 'selected' : 'default'} size={size}>
        {selected && <Icon icon={Check} size={12} />}
        {tag}
      </Badge>
    </Link>
  )
}
