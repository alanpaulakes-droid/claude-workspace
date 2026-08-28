import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CoursePage from './pages/CoursePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import FlashcardsPage from './pages/FlashcardsPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/curso/:courseId" element={<CoursePage />} />
        <Route path="/curso/:courseId/tema/:topicId" element={<LessonPage />} />
        <Route path="/curso/:courseId/tema/:topicId/quiz" element={<QuizPage />} />
        <Route path="/curso/:courseId/flashcards" element={<FlashcardsPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  )
}
