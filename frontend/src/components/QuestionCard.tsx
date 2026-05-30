import type { Question } from '../types'

interface Props {
  question: Omit<Question, 'correctAnswer'>
  value: string
  onChange: (value: string) => void
}

export default function QuestionCard({ question, value, onChange }: Props) {
  return (
    <div className="question-card card">
      <div className="q-prompt">{question.prompt}</div>
      {question.codeSnippet && <pre className="code-block">{question.codeSnippet}</pre>}

      {question.type === 'mcq' && question.options && (
        <div className="options">
          {question.options.map((opt, i) => (
            <label
              key={i}
              className={`option${value === String(i) ? ' selected' : ''}`}
              onClick={() => onChange(String(i))}
            >
              <span className="dot"></span>
              {opt}
            </label>
          ))}
        </div>
      )}

      {question.type === 'short' && (
        <input
          type="text"
          className="short-input"
          placeholder="Type your answer…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      )}
    </div>
  )
}
