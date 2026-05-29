import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuizzes } from '../queries/quizzes'

export default function HomePage() {
  const { data: quizzes, isLoading, error } = useQuizzes()
  const [quizId, setQuizId] = useState('')
  const navigate = useNavigate()

  const handleTakeQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = quizId.trim()
    if (trimmed && Number.isInteger(Number(trimmed)) && Number(trimmed) > 0) {
      navigate(`/quiz/${trimmed}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quiz Maker</h1>
        <Link
          to="/builder"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Quiz
        </Link>
      </div>

      <form onSubmit={handleTakeQuiz} className="flex gap-2 mb-8">
        <input
          type="text"
          value={quizId}
          onChange={e => setQuizId(e.target.value)}
          placeholder="Enter quiz ID to play"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Take Quiz
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-3">All Quizzes</h2>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Failed to load quizzes.</p>}
      {quizzes && quizzes.length === 0 && (
        <p className="text-gray-400 text-sm">No quizzes yet. Create one!</p>
      )}
      {quizzes && quizzes.length > 0 && (
        <ul className="space-y-2">
          {quizzes.map(q => (
            <li key={q.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{q.title}</p>
                <p className="text-sm text-gray-500">{q.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {q.id} · {q.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/builder/${q.id}`}
                  className="text-sm text-blue-600 underline"
                >
                  Edit
                </Link>
                <Link
                  to={`/quiz/${q.id}`}
                  className="text-sm text-green-600 underline"
                >
                  Play
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
