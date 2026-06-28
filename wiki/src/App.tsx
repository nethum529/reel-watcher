import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { LandingPage } from '@/pages/landing'
import { BrowsePage } from '@/pages/browse'
import { TopicsPage } from '@/pages/topics'
import { CreatorsPage } from '@/pages/creators'
import { TopicPage } from '@/pages/topic'
import { CreatorPage } from '@/pages/creator'
import { PostPage } from '@/pages/post'
import { SearchPage } from '@/pages/search'
import { NotFoundPage } from '@/pages/not-found'

// HashRouter so the built app is file://-hostable (no server rewrites needed).
// #/ is the dramatic landing (no top bar); everything else sits in the shell.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="browse" element={<BrowsePage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="creators" element={<CreatorsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="topic/:tag" element={<TopicPage />} />
          <Route path="creator/:creator" element={<CreatorPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
