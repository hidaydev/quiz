// frontend/src/components/QuestionCard.tsx
import type { Question } from '../types'

interface Props {
  question: Omit<Question, 'correctAnswer'>
  value: string
  onChange: (value: string) => void
}

function parsePrompt(prompt: string): { text: string; code: string | null } {
  const match = prompt.match(/^([\s\S]*?)```(?:\w+)?\n([\s\S]*?)```([\s\S]*)$/)
  if (!match) return { text: prompt, code: null }
  return { text: (match[1] + match[3]).trim(), code: match[2].trim() }
}

export default function QuestionCard({ question, value, onChange }: Props) {
  const { text, code } = parsePrompt(question.prompt)

  return (
    <div className="space-y-4">
      {text && <p className="font-medium text-lg">{text}</p>}
      {code && (
        <pre className="bg-gray-900 text-gray-100 rounded p-4 text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}

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
