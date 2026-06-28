import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { LandingPage } from '@/pages/landing'
import { HomePage } from '@/pages/home'
import { TopicPage } from '@/pages/topic'
import { CreatorPage } from '@/pages/creator'
import { PostPage } from '@/pages/post'
import { SearchPage } from '@/pages/search'
import { NotFoundPage } from '@/pages/not-found'

// HashRouter so the built app is file://-hostable (no server rewrites needed).
// #/ is the dramatic landing (no sidebar); #/wiki and below sit in the shell.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="wiki" element={<HomePage />} />
          <Route path="topic/:tag" element={<TopicPage />} />
          <Route path="creator/:creator" element={<CreatorPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
