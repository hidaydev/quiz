import { useState } from 'react'
import type { Question } from '../types'
import QuestionForm, { type QuestionFormValues } from './QuestionForm'

interface Props {
  questions: Question[]
  onDelete: (id: number) => void
  onEdit: (id: number, values: QuestionFormValues) => Promise<void>
  isEditing?: boolean
}

export default function QuestionList({ questions, onDelete, onEdit, isEditing }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)

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
        <div className={`card q-card${editingId === q.id ? ' edit-card' : ''}`} key={q.id}>
          {editingId === q.id ? (
            <>
              <div className="section-label" style={{ marginTop: 0, marginBottom: 14 }}>Editing question {i + 1}</div>
              <QuestionForm
                key={q.id}
                defaultValues={{
                  type: q.type as 'mcq' | 'short',
                  prompt: q.prompt,
                  codeSnippet: q.codeSnippet,
                  options: q.options?.map((o) => ({ value: o })) ?? [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
                  correctAnswerIndex: q.type === 'mcq' ? q.correctAnswer as number : undefined,
                  correctAnswerText: q.type === 'short' ? String(q.correctAnswer ?? '') : undefined,
                }}
                onSubmit={async (values) => {
                  await onEdit(q.id, values)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
                isLoading={isEditing}
                submitLabel="Save changes"
              />
            </>
          ) : (
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
                    Accepted answer: <b>{String(q.correctAnswer)}</b>
                  </div>
                )}
              </div>
              <div className="q-controls">
                <button className="icon-btn" onClick={() => setEditingId(q.id)} title="Edit">✎</button>
                <button className="icon-btn danger" onClick={() => onDelete(q.id)} title="Delete" style={{ color: '#b91c1c' }}>✕</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
