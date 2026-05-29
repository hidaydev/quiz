// frontend/src/pages/ResultsPage.tsx
import { useLocation, useNavigate } from 'react-router-dom'
import type { SubmitResult } from '../types'

interface LocationState {
  result: SubmitResult
  total: number
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <p className="text-gray-600">No results found.</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 underline"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const { result, total } = state as LocationState
  const resolvedTotal = result.details.length || total
  const percentage = Math.round((result.score / resolvedTotal) * 100)

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Results</h1>

      <div className="border rounded p-4 text-center">
        <p className="text-4xl font-bold">
          {result.score} / {resolvedTotal}
        </p>
        <p className="text-gray-500 mt-1">{percentage}% correct</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Per-question breakdown</h2>
        <ul className="space-y-2">
          {result.details.map((d, i) => (
            <li
              key={d.questionId}
              className={`border rounded p-3 ${
                d.correct
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium text-sm">Question {i + 1}</span>
                <span
                  className={`text-sm font-medium ${
                    d.correct ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  {d.correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              {!d.correct && d.expected !== undefined && (
                <p className="text-sm text-gray-600 mt-1">
                  Expected:{' '}
                  <code className="bg-white px-1 rounded">{d.expected}</code>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate('/')} className="text-blue-600 underline">
        Back to Home
      </button>
    </div>
  )
}
