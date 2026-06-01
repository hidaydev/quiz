import { useLocation, useNavigate } from 'react-router-dom'
import type { SubmitResult } from '../types'


interface LocationState {
  result: SubmitResult
  total: number
  antiCheat?: { tabSwitches: number; pastes: number }
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return (
      <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
        <p className="text-[#64748b]">No results found.</p>
        <button className="font-semibold text-sm border border-[#e2e8f0] cursor-pointer px-4.5 py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#cbd5e1] mt-3" onClick={() => navigate('/')}>
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
      <button className="inline-flex items-center gap-1.5 text-[#64748b] text-sm font-medium mb-5 cursor-pointer bg-transparent border-none p-0 hover:text-[#0f172a]" onClick={() => navigate('/')}>← Home</button>
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(15,23,42,.04),0_1px_3px_rgba(15,23,42,.07)] p-9.5 text-center mb-8">
        <div className="font-extrabold text-6xl leading-none tracking-[-0.03em] tabular-nums">
          {result.score}<span className="text-[#94a3b8] font-bold"> / {resolvedTotal}</span>
        </div>
        <div className="text-[#64748b] font-medium text-base mt-2">
          {percentage}% correct — {percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Nice effort.' : 'Keep practicing!'}
        </div>
      </div>

      {antiCheat && (antiCheat.tabSwitches > 0 || antiCheat.pastes > 0) && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] rounded-lg px-4 py-3.5 text-sm font-medium flex gap-2.5 items-start mb-6">
          <span>⚠</span>
          <span>
            {[
              antiCheat.tabSwitches > 0 && `${antiCheat.tabSwitches} tab switch${antiCheat.tabSwitches > 1 ? 'es' : ''}`,
              antiCheat.pastes > 0 && `${antiCheat.pastes} paste${antiCheat.pastes > 1 ? 's' : ''}`,
            ].filter(Boolean).join(', ')} detected
          </span>
        </div>
      )}

      <div className="text-[13px] font-semibold text-[#64748b] uppercase tracking-[.07em] my-7.5">Question breakdown</div>
      <div className="flex flex-col gap-2.5 mt-2">
        {result.details.map((d, i) => (
          <div key={d.questionId} className={['flex items-center justify-between px-4.5 py-3.75 rounded-lg text-[14.5px] font-medium border gap-3.5', d.correct ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' : 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'].join(' ')}>
            <div className="flex flex-col gap-0.75 min-w-0">
              <span className="font-semibold">Question {i + 1}</span>
              {!d.correct && d.expected !== undefined && (
                <span className="text-[13px] opacity-85 font-normal">Expected: <code className="font-mono font-semibold">{d.expected}</code></span>
              )}
            </div>
            <span className="font-bold text-[13.5px] whitespace-nowrap">{d.correct ? '✓ Correct' : '✗ Incorrect'}</span>
          </div>
        ))}
      </div>

      <button className="font-semibold text-[15px] border border-transparent cursor-pointer w-full py-3.25 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-[#2563eb] text-white hover:bg-[#1d4ed8] mt-6.5" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  )
}
