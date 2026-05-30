import type { Question } from '../types'

interface Props {
  questions: Question[]
  onDelete: (id: number) => void
}

export default function QuestionList({ questions, onDelete }: Props) {
  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <div className="em-emoji">📝</div>
        <div className="em-title">No questions yet</div>
        <div>Add your first question using the form below.</div>
      </div>
    )
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div className="card q-card" key={q.id}>
          <div className="q-head">
            <span className="q-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="q-body">
              <span className={`badge badge-type${q.type === 'short' ? ' short' : ''}`}>
                {q.type === 'mcq' ? 'Multiple choice' : 'Short answer'}
              </span>
              <div className="q-prompt-txt" style={{ marginTop: 8 }}>{q.prompt}</div>
              {q.codeSnippet && <pre className="code-block">{q.codeSnippet}</pre>}
              {q.type === 'mcq' && q.options && (
                <ul className="opt-preview">
                  {q.options.map((o, oi) => (
                    <li key={oi} className={oi === q.correctAnswer ? 'correct' : ''}>
                      <span className="opt-dot"></span>
                      {o}{oi === q.correctAnswer ? ' ✓' : ''}
                    </li>
                  ))}
                </ul>
              )}
              {q.type === 'short' && (
                <div className="short-ans">
                  Accepted: <code>{String(q.correctAnswer)}</code>
                </div>
              )}
            </div>
            <div className="q-controls">
              <button className="icon-btn danger" onClick={() => onDelete(q.id)} title="Delete" style={{ color: '#b91c1c' }}>✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
