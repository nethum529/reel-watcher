import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar, MobileBar } from '@/components/sidebar'

// App shell for every wiki route: skip link → left sidebar (rail vs content) →
// centered content area. Cmd/Ctrl+K jumps to search from anywhere (DESIGN §5).
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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-popover focus:px-4 focus:py-2 focus:font-sans focus:text-label focus:text-foreground"
      >
        Skip to content
      </a>
      <div className="md:flex">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileBar />
          <main
            id="main"
            className="flex-1 px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
