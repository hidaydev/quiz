import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  HomePage,
  BuilderPage,
  PlayerPage,
  ResultsPage,
  NotFoundPage,
} from './pages'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/play" replace />} />
        <Route path="/play" element={<HomePage />} />
        <Route path="/build" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/quiz/:id" element={<PlayerPage />} />
        <Route path="/quiz/:id/results" element={<ResultsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
