import type { Question } from '../types'

interface Props {
  question: Omit<Question, 'correctAnswer'>
  value: string
  onChange: (value: string) => void
}

export default function QuestionCard({ question, value, onChange }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-7.5">
      <div className="text-[21px] font-semibold leading-[1.35] tracking-[-0.01em]">
        {question.prompt} asdf
      </div>

      {question.codeSnippet && (
        <pre className="font-mono text-[13.5px] leading-[1.6] bg-slate-900 text-slate-200 rounded-lg px-4 py-3.5 overflow-x-auto mt-3 whitespace-pre">
          {question.codeSnippet}
        </pre>
      )}

      {question.type === 'mcq' && question.options && (
        <div className="flex flex-col gap-2.75 mt-6">
          {question.options.map((opt, i) => {
            const selected = value === String(i)
            return (
              <label
                key={i}
                onClick={() => onChange(String(i))}
                className={[
                  'flex items-center gap-3.25 px-4.25 py-3.75 rounded-lg border-[1.5px] cursor-pointer text-[15px] font-medium transition-all duration-[120ms]',
                  selected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                ].join(' ')}
              >
                <span
                  className={[
                    'w-4.75 h-4.75 rounded-full border-2 shrink-0 grid place-items-center transition-all duration-[120ms]',
                    selected ? 'border-blue-600' : 'border-slate-300',
                  ].join(' ')}
                >
                  {selected && (
                    <span className="w-2.25 h-2.25 rounded-full bg-blue-600" />
                  )}
                </span>
                {opt}
              </label>
            )
          })}
        </div>
      )}

      {question.type === 'short' && (
        <input
          type="text"
          className="mt-6 w-full px-3.25 py-[10px] border border-slate-200 rounded-lg text-[inherit] font-[inherit] focus:outline-none focus:border-blue-600 focus:shadow-focus"
          placeholder="Type your answer…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      )}
    </div>
  )
}
