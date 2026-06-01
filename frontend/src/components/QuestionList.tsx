import { useState } from 'react'
import type { Question } from '../types'
import QuestionForm, { type QuestionFormValues } from './QuestionForm'

interface Props {
  questions: Question[]
  onDelete: (id: number) => void
  onEdit: (id: number, values: QuestionFormValues) => Promise<void>
  isEditing?: boolean
}

export default function QuestionList({
  questions,
  onDelete,
  onEdit,
  isEditing,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 px-6 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
        <div className="text-3xl mb-2">📝</div>
        <div className="font-semibold text-slate-900 mb-1">
          No questions yet
        </div>
        <div>Add your first question using the form below.</div>
      </div>
    )
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div
          className={[
            'bg-white border border-slate-200 rounded-xl shadow-card px-5 py-4.5 mt-3',
            editingId === q.id
              ? '!border-blue-600 !shadow-focus'
              : '',
          ].join(' ')}
          key={q.id}
        >
          {editingId === q.id ? (
            <>
              <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[.07em] mt-0 mb-3.5">
                Editing question {i + 1}
              </div>
              <QuestionForm
                key={q.id}
                defaultValues={{
                  type: q.type as 'mcq' | 'short',
                  prompt: q.prompt,
                  codeSnippet: q.codeSnippet,
                  options: q.options?.map((o) => ({ value: o })) ?? [
                    { value: '' },
                    { value: '' },
                    { value: '' },
                    { value: '' },
                  ],
                  correctAnswerIndex:
                    q.type === 'mcq' ? (q.correctAnswer as number) : undefined,
                  correctAnswerText:
                    q.type === 'short'
                      ? String(q.correctAnswer ?? '')
                      : undefined,
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
              <span className="font-mono text-slate-400 text-[13px] font-semibold pt-0.5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={[
                    'text-[10.5px] font-semibold px-2 py-0.75 rounded-full inline-flex items-center gap-1.25 uppercase tracking-[.06em]',
                    q.type === 'short'
                      ? 'bg-violet-50 text-violet-700'
                      : 'bg-blue-50 text-blue-700',
                  ].join(' ')}
                >
                  {q.type === 'mcq' ? 'Multiple choice' : 'Short answer'}
                </span>
                <div className="font-semibold text-[15.5px] leading-[1.4] mt-2">
                  {q.prompt}
                </div>
                {q.codeSnippet && (
                  <pre className="font-mono text-[13.5px] leading-[1.6] bg-slate-900 text-slate-200 rounded-lg px-4 py-3.5 overflow-x-auto mt-3 whitespace-pre">
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
                            ? 'bg-green-50 text-green-800 font-semibold'
                            : 'bg-slate-50 text-slate-500',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'w-4 h-4 rounded-full border-2 border-current shrink-0',
                            oi === q.correctAnswer
                              ? 'opacity-100'
                              : 'opacity-35',
                          ].join(' ')}
                        ></span>
                        {o}
                        {oi === q.correctAnswer ? ' ✓' : ''}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === 'short' && (
                  <div className="mt-2.5 text-sm text-slate-500">
                    Accepted answer:{' '}
                    <b className="font-mono font-semibold bg-green-50 text-green-800 px-2 py-px rounded">
                      {String(q.correctAnswer)}
                    </b>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 cursor-pointer grid place-items-center text-sm transition-all duration-[120ms] hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  onClick={() => setEditingId(q.id)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-red-700 cursor-pointer grid place-items-center text-sm transition-all duration-[120ms] hover:bg-red-50 hover:text-red-800 hover:border-red-200"
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
