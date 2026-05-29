import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  BuilderPage,
  PlayerPage,
  ResultsPage,
  NotFoundPage,
} from './pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/quiz/:id" element={<PlayerPage />} />
        <Route path="/quiz/:id/results" element={<ResultsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
