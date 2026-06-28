import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/top-bar'

// App shell for every non-landing route (DESIGN §6): skip link → bold top bar →
// left-locked content inside the 1280px Swiss grid container. Cmd/Ctrl+K jumps to
// search from anywhere (DESIGN §5).
export function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        navigate('/search')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:font-sans focus:text-label focus:text-foreground"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main" className="rw-container py-12 md:py-16 lg:py-20">
        <Outlet />
      </main>
    </div>
  )
}
