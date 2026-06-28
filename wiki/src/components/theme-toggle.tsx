import { Moon, Sun } from 'lucide-react'
import { Icon } from '@/components/icon'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

// Icon-only theme toggle (DESIGN §6): sun when dark (→ light), moon when light
// (→ dark). The aria-label names the TARGET theme. ≥44px hit area; the global
// :focus-visible ring applies. Two channels: the glyph swaps and color shifts.
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      <Icon icon={isDark ? Sun : Moon} size={20} />
    </button>
  )
}
