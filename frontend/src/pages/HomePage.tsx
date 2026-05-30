import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuizzes } from '../queries'

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="mark">Q</span>
      Quiz Maker
    </Link>
  )
}

export default function HomePage() {
  const { data: quizzes, isLoading, error } = useQuizzes()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') === 'build' ? 'build' : 'play') as 'play' | 'build'
  const [quizId, setQuizId] = useState('')
  const [idError, setIdError] = useState('')
  const navigate = useNavigate()

  const handleTakeQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    const v = quizId.trim()
    if (!/^\d+$/.test(v) || parseInt(v, 10) <= 0) {
      setIdError('Enter a valid quiz ID (a positive number).')
      return
    }
    setIdError('')
    navigate(`/quiz/${v}`)
  }

  const published = quizzes?.filter((q) => q.isPublished) ?? []

  return (
    <div className="page">
      <div className="app-head">
        <Brand />
        <div className="tabs" role="tablist">
          <button className={`tab${tab === 'play' ? ' active' : ''}`} onClick={() => setSearchParams({ tab: 'play' })}>Play</button>
          <button className={`tab${tab === 'build' ? ' active' : ''}`} onClick={() => setSearchParams({ tab: 'build' })}>Build</button>
        </div>
      </div>

      {tab === 'play' ? (
        <>
          <h1 className="page-title">Play a quiz</h1>
          <p className="page-sub">Got a quiz ID? Drop it in. Or browse public quizzes below.</p>

          <form onSubmit={handleTakeQuiz} className="card pad" style={{ marginBottom: 32 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Quiz ID</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 1042"
                  value={quizId}
                  className={idError ? 'input-error' : ''}
                  onChange={(e) => { setQuizId(e.target.value); setIdError('') }}
                />
                <button type="submit" className="btn btn-primary">Take Quiz</button>
              </div>
              {idError && <div className="field-error" style={{ marginTop: 8 }}>{idError}</div>}
            </div>
          </form>

          <div className="section-label">Public quizzes</div>
          {isLoading && <p className="muted">Loading…</p>}
          {error && <p style={{ color: 'var(--bad-fg)' }}>Failed to load quizzes.</p>}
          {!isLoading && published.length === 0 && (
            <div className="empty-state">
              <div className="em-emoji">🔍</div>
              <div className="em-title">No public quizzes yet</div>
              <div>Ask a creator for a quiz ID to get started.</div>
            </div>
          )}
          {published.length > 0 && (
            <div className="list">
              {published.map((q) => (
                <div className="card quiz-item" key={q.id}>
                  <div style={{ minWidth: 0 }}>
                    <div className="qi-title">{q.title}</div>
                    <div className="qi-desc">{q.description}</div>
                    <div className="qi-meta" style={{ marginTop: 6 }}>
                      <span className="qi-id">Quiz ID: {q.id}</span>
                    </div>
                  </div>
                  <div className="qi-actions">
                    <button className="btn btn-primary" onClick={() => navigate(`/quiz/${q.id}`)}>Play →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="spread" style={{ alignItems: 'flex-start', marginBottom: 0 }}>
            <div>
              <h1 className="page-title">Your quizzes</h1>
              <p className="page-sub">Create and manage your coding quizzes.</p>
            </div>
            <Link to="/builder" className="btn btn-primary">+ Create Quiz</Link>
          </div>
          {isLoading && <p className="muted">Loading…</p>}
          {error && <p style={{ color: 'var(--bad-fg)' }}>Failed to load quizzes.</p>}
          {!isLoading && quizzes?.length === 0 && (
            <div className="empty-state">
              <div className="em-emoji">✏️</div>
              <div className="em-title">No quizzes yet</div>
              <div>Create your first quiz to see it here.</div>
              <Link to="/builder" className="btn btn-primary" style={{ marginTop: 16 }}>+ Create Quiz</Link>
            </div>
          )}
          {quizzes && quizzes.length > 0 && (
            <div className="list">
              {quizzes.map((q) => (
                <div className="card quiz-item" key={q.id}>
                  <div style={{ minWidth: 0 }}>
                    <div className="qi-title">{q.title}</div>
                    <div className="qi-desc">{q.description}</div>
                    <div className="qi-meta" style={{ marginTop: 6 }}>
                      <span className="qi-id">Quiz ID: {q.id}</span>
                    </div>
                  </div>
                  <div className="qi-actions">
                    <Link to={`/builder/${q.id}`} className="btn btn-ghost">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
