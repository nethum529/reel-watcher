import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Hash, LayoutGrid, Menu, Search, Users, X, type LucideIcon } from 'lucide-react'
import { Icon } from '@/components/icon'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

interface NavItemDef {
  label: string
  icon: LucideIcon
  to: string
  // Predicate over the current pathname — detail routes light their index item.
  isActive: (pathname: string) => boolean
  kbd?: string
}

// Order = obstacle frequency (DESIGN §5): Browse · Topics · Creators · Search.
const NAV_ITEMS: NavItemDef[] = [
  {
    label: 'Browse',
    icon: LayoutGrid,
    to: '/browse',
    isActive: (p) => p === '/browse',
  },
  {
    label: 'Topics',
    icon: Hash,
    to: '/topics',
    isActive: (p) => p === '/topics' || p.startsWith('/topic/'),
  },
  {
    label: 'Creators',
    icon: Users,
    to: '/creators',
    isActive: (p) => p === '/creators' || p.startsWith('/creator/'),
  },
  {
    label: 'Search',
    icon: Search,
    to: '/search',
    isActive: (p) => p === '/search',
    kbd: '⌘K',
  },
]

// One nav item. Active carries THREE channels (DESIGN §6): Oswald weight bump +
// a 2px Orchid (--primary) underline + the color shift — never color alone.
// `sheet` renders the full-width mobile variant; bar is the inline desktop tab.
function NavItem({
  item,
  active,
  sheet,
  onNavigate,
}: {
  item: NavItemDef
  active: boolean
  sheet?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      data-active-rule={active ? 'true' : undefined}
      className={cn(
        'inline-flex items-center gap-2 border-b-2 font-condensed text-label uppercase tracking-[0.04em] transition-colors',
        // ≥44px hit area (BRAND §10). items-center in the 64/72px bar keeps every
        // item's bottom aligned so the active 2px underline still reads as a baseline rule.
        sheet ? 'min-h-11 w-full px-1 py-2' : 'min-h-11 px-1',
        active
          ? 'border-primary font-semibold text-foreground'
          : 'border-transparent font-medium text-muted-foreground hover:border-border hover:text-foreground',
      )}
    >
      <Icon icon={item.icon} size={16} />
      <span>{item.label}</span>
      {item.kbd && (
        <kbd className="ml-1 hidden font-sans text-caption font-normal text-muted-foreground lg:inline">
          {item.kbd}
        </kbd>
      )}
    </Link>
  )
}

// The bold structural top bar (BRAND §2, DESIGN §6) — the horizontal Swiss
// masthead rule that anchors the grid: full-bleed --background, a 2px --border
// bottom rule, sticky. Wordmark (Anton) → primary nav → theme toggle. At <md the
// nav collapses behind a menu button into a focus-trapped Sheet.
export function TopBar() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background">
      <div className="rw-container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            aria-label="reel-watcher — home"
            className="inline-flex min-h-11 items-center font-display text-title uppercase tracking-[-0.01em] text-foreground lg:text-[26px]"
          >
            reel-watcher
          </Link>
          <nav aria-label="Primary" className="hidden h-full items-center gap-4 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} item={item} active={item.isActive(pathname)} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

// Mobile nav button + Sheet (<md). Follows the WAI-ARIA APG Dialog (modal)
// pattern (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus trapped
// inside, Esc closes, focus returns to the trigger, body scroll locked.
function MobileMenu() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const trigger = triggerRef.current // captured for focus-return at cleanup

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusables()[0]?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      trigger?.focus() // return focus to the trigger (modal contract)
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon icon={open ? X : Menu} size={20} />
      </button>

      {open && (
        <>
          {/* Scrim — a purposeful layer signal over content, not decorative glass. */}
          <div
            className="fixed inset-0 z-40 bg-foreground/40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Primary navigation"
            className="fixed inset-y-0 right-0 z-50 w-[264px] border-l-2 border-border bg-background p-6"
          >
            <nav aria-label="Primary" className="mt-12 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  sheet
                  active={item.isActive(pathname)}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
