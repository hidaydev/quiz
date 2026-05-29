// frontend/src/components/QuestionCard.tsx
import type { Question } from '../types'

interface Props {
  question: Omit<Question, 'correctAnswer'>
  value: string
  onChange: (value: string) => void
}

export default function QuestionCard({ question, value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="font-medium text-lg">{question.prompt}</p>

      {question.type === 'mcq' && question.options && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={String(i)}
                checked={value === String(i)}
                onChange={() => onChange(String(i))}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'short' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Your answer"
        />
      )}
    </div>
  )
}
