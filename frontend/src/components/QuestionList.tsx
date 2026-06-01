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
      <div className="text-center py-12 px-6 text-[#64748b] border border-dashed border-[#cbd5e1] rounded-xl bg-white">
        <div className="text-3xl mb-2">📝</div>
        <div className="font-semibold text-[#0f172a] mb-1">No questions yet</div>
        <div>Add your first question using the form below.</div>
      </div>
    )
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div
          className={[
            'bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(15,23,42,.04),0_1px_3px_rgba(15,23,42,.07)] px-5 py-4.5 mt-3',
            editingId === q.id ? '!border-[#2563eb] !shadow-[0_0_0_3px_#eff6ff]' : '',
          ].join(' ')}
          key={q.id}
        >
          {editingId === q.id ? (
            <>
              <div className="text-[13px] font-semibold text-[#64748b] uppercase tracking-[.07em] mt-0 mb-3.5">Editing question {i + 1}</div>
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
            <div className="flex items-start gap-3">
              <span className="font-mono text-[#94a3b8] text-[13px] font-semibold pt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <span
                  className={[
                    'text-[10.5px] font-semibold px-2 py-0.75 rounded-full inline-flex items-center gap-1.25 uppercase tracking-[.06em]',
                    q.type === 'short'
                      ? 'bg-[#f5f3ff] text-[#6d28d9]'
                      : 'bg-[#eff6ff] text-[#1d4ed8]',
                  ].join(' ')}
                >
                  {q.type === 'mcq' ? 'Multiple choice' : 'Short answer'}
                </span>
                <div className="font-semibold text-[15.5px] leading-[1.4] mt-2">{q.prompt}</div>
                {q.codeSnippet && (
                  <pre className="font-mono text-[13.5px] leading-[1.6] bg-[#0f172a] text-[#e2e8f0] rounded-lg px-4 py-3.5 overflow-x-auto mt-3 whitespace-pre">
                    {q.codeSnippet}
                  </pre>
                )}
                {q.type === 'mcq' && q.options && (
                  <ul className="list-none mt-3 p-0 flex flex-col gap-1.5">
                    {q.options.map((o, oi) => (
                      <li
                        key={oi}
                        className={[
                          'flex items-center gap-2.25 text-sm px-2.75 py-1.75 rounded-lg',
                          oi === q.correctAnswer
                            ? 'bg-[#f0fdf4] text-[#166534] font-semibold'
                            : 'bg-[#f8fafc] text-[#64748b]',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'w-4 h-4 rounded-full border-2 border-current shrink-0',
                            oi === q.correctAnswer ? 'opacity-100' : 'opacity-35',
                          ].join(' ')}
                        ></span>
                        {o}{oi === q.correctAnswer ? ' ✓' : ''}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === 'short' && (
                  <div className="mt-2.5 text-sm text-[#64748b]">
                    Accepted answer: <b className="font-mono font-semibold bg-[#f0fdf4] text-[#166534] px-2 py-px rounded">{String(q.correctAnswer)}</b>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] cursor-pointer grid place-items-center text-sm transition-all duration-[120ms] hover:bg-[#f8fafc] hover:text-[#0f172a] hover:border-[#cbd5e1]"
                  onClick={() => setEditingId(q.id)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white text-[#b91c1c] cursor-pointer grid place-items-center text-sm transition-all duration-[120ms] hover:bg-[#fef2f2] hover:text-[#991b1b] hover:border-[#fecaca]"
                  onClick={() => onDelete(q.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
