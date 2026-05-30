// frontend/src/pages/ResultsPage.tsx
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
      <div className="page">
        <p className="muted">No results found.</p>
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    )
  }

  const { result, total, antiCheat } = state as LocationState
  const resolvedTotal = result.details.length || total
  const percentage = Math.round((result.score / resolvedTotal) * 100)

  return (
    <div className="page">
      <button className="back" onClick={() => navigate('/')}>← Home</button>
      <div className="card score-card" style={{ marginBottom: 32 }}>
        <div className="score-big">
          {result.score}<span className="denom"> / {resolvedTotal}</span>
        </div>
        <div className="score-pct">
          {percentage}% correct — {percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Nice effort.' : 'Keep practicing!'}
        </div>
      </div>

      {antiCheat && (antiCheat.tabSwitches > 0 || antiCheat.pastes > 0) && (
        <div className="notice-error" style={{ marginBottom: 24 }}>
          <span>⚠</span>
          <span>
            {[
              antiCheat.tabSwitches > 0 && `${antiCheat.tabSwitches} tab switch${antiCheat.tabSwitches > 1 ? 'es' : ''}`,
              antiCheat.pastes > 0 && `${antiCheat.pastes} paste${antiCheat.pastes > 1 ? 's' : ''}`,
            ].filter(Boolean).join(', ')} detected
          </span>
        </div>
      )}

      <div className="section-label">Question breakdown</div>
      <div className="breakdown">
        {result.details.map((d, i) => (
          <div key={d.questionId} className={`bd-row ${d.correct ? 'correct' : 'incorrect'}`}>
            <div className="bd-q">
              <span className="bd-prompt">Question {i + 1}</span>
              {!d.correct && d.expected !== undefined && (
                <span className="expected">Expected: <code>{d.expected}</code></span>
              )}
            </div>
            <span className="bd-status">{d.correct ? '✓ Correct' : '✗ Incorrect'}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-block" style={{ marginTop: 26 }} onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  )
}
