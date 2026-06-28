import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { HomePage } from '@/pages/home'
import { TopicsPage } from '@/pages/topics'
import { CreatorsPage } from '@/pages/creators'
import { TopicPage } from '@/pages/topic'
import { CreatorPage } from '@/pages/creator'
import { PostPage } from '@/pages/post'
import { SearchPage } from '@/pages/search'
import { NotFoundPage } from '@/pages/not-found'

// HashRouter so the built app is file://-hostable (no server rewrites needed).
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="creators" element={<CreatorsPage />} />
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
