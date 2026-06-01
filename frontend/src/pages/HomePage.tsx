import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useQuizzes } from '../queries'

function Brand() {
  return (
    <Link
      to="/play"
      className="flex items-center gap-2.5 font-bold text-[19px] tracking-[-0.01em] no-underline text-slate-900"
    >
      <span className="w-[30px] h-[30px] rounded-lg bg-blue-600 grid place-items-center text-white font-bold text-[15px]">
        Q
      </span>
      Quiz Maker
    </Link>
  )
}

export default function HomePage() {
  const { data: quizzes, isLoading, error } = useQuizzes()
  const location = useLocation()
  const tab = location.pathname === '/build' ? 'build' : 'play'
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
    <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
      <div className="flex items-center justify-between mb-7">
        <Brand />
        <div
          className="inline-flex bg-slate-100 border border-slate-200 rounded-[10px] p-1 gap-1"
          role="tablist"
        >
          <Link
            className={`px-5 py-2 rounded-[7px] font-semibold text-sm text-slate-500 cursor-pointer border-none bg-transparent transition-all duration-[120ms] hover:text-slate-900${tab === 'play' ? ' bg-white text-slate-900 shadow-tab' : ''}`}
            to="/play"
          >
            Play
          </Link>
          <Link
            className={`px-5 py-2 rounded-[7px] font-semibold text-sm text-slate-500 cursor-pointer border-none bg-transparent transition-all duration-[120ms] hover:text-slate-900${tab === 'build' ? ' bg-white text-slate-900 shadow-tab' : ''}`}
            to="/build"
          >
            Build
          </Link>
        </div>
      </div>

      {tab === 'play' ? (
        <>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] m-0 mb-1">
            Play a quiz
          </h1>
          <p className="text-slate-500 m-0 mb-[26px] text-[15px]">
            Got a quiz ID? Drop it in. Or browse public quizzes below.
          </p>

          <form
            onSubmit={handleTakeQuiz}
            className="bg-white border border-slate-200 rounded-xl shadow-card p-[22px] mb-8"
          >
            <div className="flex flex-col gap-1.5 mb-0">
              <label className="font-semibold text-sm">Quiz ID</label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 1042"
                  value={quizId}
                  className={`w-full font-[inherit] px-[13px] py-2.5 border rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus transition-[border-color,box-shadow] duration-[120ms]${idError ? ' !border-red-500 border-slate-200' : ' border-slate-200'}`}
                  onChange={(e) => {
                    setQuizId(e.target.value)
                    setIdError('')
                  }}
                />
                <button
                  type="submit"
                  className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white hover:bg-blue-700"
                >
                  Take Quiz
                </button>
              </div>
              {idError && (
                <div className="text-red-600 text-[13px] font-medium mt-2">
                  {idError}
                </div>
              )}
            </div>
          </form>

          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[.07em] my-[30px]">
            Public quizzes
          </div>
          {isLoading && <p className="text-slate-500">Loading…</p>}
          {error && <p className="text-red-800">Failed to load quizzes.</p>}
          {!isLoading && published.length === 0 && (
            <div className="text-center px-6 py-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold text-slate-900 mb-1">
                No public quizzes yet
              </div>
              <div>Ask a creator for a quiz ID to get started.</div>
            </div>
          )}
          {published.length > 0 && (
            <div className="flex flex-col gap-3">
              {published.map((q) => (
                <div
                  className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-[18px] flex items-center justify-between gap-4 transition-[box-shadow,border-color] duration-[120ms] hover:shadow-card-hover hover:border-slate-300"
                  key={q.id}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-base">{q.title}</div>
                    <div className="text-slate-500 text-sm mt-0.5">
                      {q.description}
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      <span className="text-blue-600 text-[12px] font-mono font-semibold">
                        Quiz ID: {q.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => navigate(`/quiz/${q.id}`)}
                    >
                      Play →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 mb-0">
            <div>
              <h1 className="text-[26px] font-bold tracking-[-0.02em] m-0 mb-1">
                Your quizzes
              </h1>
              <p className="text-slate-500 m-0 mb-[26px] text-[15px]">
                Create and manage your coding quizzes.
              </p>
            </div>
            <Link
              to="/builder"
              className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white hover:bg-blue-700"
            >
              + Create Quiz
            </Link>
          </div>
          {isLoading && <p className="text-slate-500">Loading…</p>}
          {error && <p className="text-red-800">Failed to load quizzes.</p>}
          {!isLoading && quizzes?.length === 0 && (
            <div className="text-center px-6 py-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
              <div className="text-3xl mb-2">✏️</div>
              <div className="font-semibold text-slate-900 mb-1">
                No quizzes yet
              </div>
              <div>Create your first quiz to see it here.</div>
              <Link
                to="/builder"
                className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white hover:bg-blue-700 mt-4"
              >
                + Create Quiz
              </Link>
            </div>
          )}
          {quizzes && quizzes.length > 0 && (
            <div className="flex flex-col gap-3">
              {quizzes.map((q) => (
                <div
                  className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-[18px] flex items-center justify-between gap-4 transition-[box-shadow,border-color] duration-[120ms] hover:shadow-card-hover hover:border-slate-300"
                  key={q.id}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-base">{q.title}</div>
                    <div className="text-slate-500 text-sm mt-0.5">
                      {q.description}
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                      <span className="text-blue-600 text-[12px] font-mono font-semibold">
                        Quiz ID: {q.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/builder/${q.id}`}
                      className="font-semibold text-sm border border-slate-200 cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300"
                    >
                      Edit
                    </Link>
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
