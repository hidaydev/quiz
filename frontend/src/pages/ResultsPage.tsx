import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import type { SubmitResult } from '../types'

interface LocationState {
  result: SubmitResult
  total: number
  antiCheat?: { tabSwitches: number; pastes: number }
}

const ResultsPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return (
      <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
        <p className="text-slate-500">No results found.</p>
        <button
          className="font-semibold text-sm border border-slate-200 cursor-pointer px-4.5 py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 mt-3"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    )
  }

  const { result, total, antiCheat } = state as LocationState
  const resolvedTotal = result.details.length || total
  const percentage = Math.round((result.score / resolvedTotal) * 100)

  return (
    <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
      <button
        className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-5 cursor-pointer bg-transparent border-none p-0 hover:text-slate-900"
        onClick={() => navigate('/')}
      >
        ← Home
      </button>
      <div className="bg-white border border-slate-200 rounded-xl shadow-card p-9.5 text-center mb-8">
        <div className="font-extrabold text-6xl leading-none tracking-[-0.03em] tabular-nums">
          {result.score}
          <span className="text-slate-400 font-bold"> / {resolvedTotal}</span>
        </div>
        <div className="text-slate-500 font-medium text-base mt-2">
          {percentage}% correct —{' '}
          {percentage >= 80
            ? 'Excellent work!'
            : percentage >= 50
              ? 'Nice effort.'
              : 'Keep practicing!'}
        </div>
      </div>

      {antiCheat && (antiCheat.tabSwitches > 0 || antiCheat.pastes > 0) && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3.5 text-sm font-medium flex gap-2.5 items-start mb-6">
          <span>⚠</span>
          <span>
            {[
              antiCheat.tabSwitches > 0 &&
                `${antiCheat.tabSwitches} tab switch${antiCheat.tabSwitches > 1 ? 'es' : ''}`,
              antiCheat.pastes > 0 &&
                `${antiCheat.pastes} paste${antiCheat.pastes > 1 ? 's' : ''}`,
            ]
              .filter(Boolean)
              .join(', ')}{' '}
            detected
          </span>
        </div>
      )}

      <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[.07em] my-7.5">
        Question breakdown
      </div>
      <div className="flex flex-col gap-2.5 mt-2">
        {result.details.map((d, i) => (
          <div
            key={d.questionId}
            className={clsx(
              'flex items-center justify-between px-4.5 py-3.75 rounded-lg text-[14.5px] font-medium border gap-3.5',
              d.correct
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200',
            )}
          >
            <div className="flex flex-col gap-0.75 min-w-0">
              <span className="font-semibold">Question {i + 1}</span>
              {!d.correct && d.expected !== undefined && (
                <span className="text-[13px] opacity-85 font-normal">
                  Expected:{' '}
                  <code className="font-mono font-semibold">{d.expected}</code>
                </span>
              )}
            </div>
            <span className="font-bold text-[13.5px] whitespace-nowrap">
              {d.correct ? '✓ Correct' : '✗ Incorrect'}
            </span>
          </div>
        ))}
      </div>

      <button
        className="font-semibold text-[15px] border border-transparent cursor-pointer w-full py-3.25 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white hover:bg-blue-700 mt-6.5"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  )
}

export default ResultsPage
