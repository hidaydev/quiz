// frontend/src/components/QuestionList.tsx
import type { Question } from '../types'

interface Props {
  questions: Question[]
  onDelete: (id: number) => void
  onMoveUp: (question: Question) => void
  onMoveDown: (question: Question) => void
}

export default function QuestionList({ questions, onDelete, onMoveUp, onMoveDown }: Props) {
  if (questions.length === 0) {
    return <p className="text-gray-400 text-sm">No questions yet.</p>
  }

  return (
    <ul className="space-y-2">
      {questions.map((q, index) => (
        <li key={q.id} className="border rounded p-3 flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase text-gray-400 mr-2">
              {q.type}
            </span>
            <span className="text-sm">{q.prompt}</span>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onMoveUp(q)}
              disabled={index === 0}
              className="px-2 py-1 text-xs border rounded disabled:opacity-30 hover:bg-gray-100"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(q)}
              disabled={index === questions.length - 1}
              className="px-2 py-1 text-xs border rounded disabled:opacity-30 hover:bg-gray-100"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onDelete(q.id)}
              className="px-2 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
