import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  useQuiz,
  useStartAttempt,
  useSaveAnswer,
  useSubmitAttempt,
} from '../queries'
import { useAntiCheat } from '../hooks'
import { QuestionCard } from '../components'
import type { Attempt } from '../types'

export default function PlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const quizId = Number(id)

  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startError, setStartError] = useState<string | null>(null)

  const {
    data: quiz,
    isError: quizNotFound,
    isLoading: quizLoading,
    isFetching: quizFetching,
  } = useQuiz(quizId)
  const startAttempt = useStartAttempt()
  const saveAnswer = useSaveAnswer()
  const submitAttempt = useSubmitAttempt()
  const { tabSwitches, pastes } = useAntiCheat(attempt?.id ?? null)

  const questions = (attempt?.quiz.questions ?? []).filter(
    (q) => q.type !== 'code',
  )
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleStart = async () => {
    setStartError(null)
    try {
      const result = await startAttempt.mutateAsync(quizId)
      setAttempt(result)
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.error
        : 'Failed to start quiz. Make sure the quiz is published.'
      setStartError(msg)
    }
  }

  const handleNext = async () => {
    if (!attempt || !currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    setCurrentIndex((i) => i + 1)
  }

  const handleSubmit = async () => {
    if (!attempt || !currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    const result = await submitAttempt.mutateAsync(attempt.id)
    navigate(`/quiz/${quizId}/results`, {
      state: {
        result,
        total: questions.length,
        antiCheat: { tabSwitches, pastes },
      },
    })
  }

  if (!attempt) {
    return (
      <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
        <button
          className="inline-flex items-center gap-1.5 text-[#64748b] text-sm font-medium mb-5 cursor-pointer bg-transparent border-none p-0 hover:text-[#0f172a]"
          onClick={() => navigate('/play')}
        >
          ← Home
        </button>
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(15,23,42,.04),0_1px_3px_rgba(15,23,42,.07)] p-10 text-center">
          <div className="text-[40px] mb-3.5">🧠</div>
          <h2>
            {quizLoading
              ? `Quiz #${quizId}`
              : (quiz?.title ?? `Quiz #${quizId}`)}
          </h2>
          {quiz?.description && (
            <p className="text-[#64748b] mb-2">{quiz.description}</p>
          )}
          {quizFetching && <p className="text-[#64748b] mb-3">Loading quiz…</p>}
          {quizNotFound && (
            <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] rounded-lg px-4 py-3.5 text-sm font-medium flex gap-2.5 items-start mb-4 text-left">
              <span>⚠</span>
              <span>Quiz not found. Please check the ID and try again.</span>
            </div>
          )}
          {startError && (
            <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] rounded-lg px-4 py-3.5 text-sm font-medium flex gap-2.5 items-start mb-4 text-left">
              <span>⚠</span>
              <span>{startError}</span>
            </div>
          )}
          <div className="flex gap-5.5 justify-center my-5.5 mb-7">
            <div className="text-center">
              <div className="font-bold text-xl">
                {quiz?.questions?.length ?? '—'}
              </div>
              <div className="text-[#64748b] text-[12.5px] uppercase tracking-[.06em]">
                Questions
              </div>
            </div>
          </div>
          <button
            className="font-semibold text-[16px] border border-transparent cursor-pointer px-6.5 py-3.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-[#2563eb] text-white disabled:opacity-55 disabled:cursor-not-allowed hover:bg-[#1d4ed8]"
            onClick={handleStart}
            disabled={startAttempt.isPending || quizLoading || quizNotFound}
          >
            {startAttempt.isPending ? 'Starting…' : 'Start Quiz'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
      <button
        className="inline-flex items-center gap-1.5 text-[#64748b] text-sm font-medium mb-5 cursor-pointer bg-transparent border-none p-0 hover:text-[#0f172a]"
        onClick={() => navigate('/')}
      >
        ← Home
      </button>
      <div className="flex items-baseline justify-between gap-4 mb-3.5">
        <div className="font-bold text-lg tracking-[-0.01em]">
          {attempt.quiz.title}
        </div>
        <span className="text-[#64748b] font-semibold text-sm tabular-nums">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden mb-6.5">
        <span
          className="block h-full bg-[#2563eb] rounded-full transition-[width] duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></span>
      </div>
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id] ?? ''}
          onChange={(value) =>
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
          }
        />
      )}
      <div className="flex items-center justify-between gap-3 mt-6.5">
        <button
          className="font-semibold text-sm border border-[#e2e8f0] cursor-pointer px-4.5 py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 min-w-[124px] transition-all duration-[120ms] bg-white text-[#0f172a] disabled:opacity-55 disabled:cursor-not-allowed hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        {!isLastQuestion ? (
          <button
            className="font-semibold text-sm border border-transparent cursor-pointer px-4.5 py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 min-w-[124px] transition-all duration-[120ms] bg-[#2563eb] text-white disabled:opacity-55 disabled:cursor-not-allowed hover:bg-[#1d4ed8]"
            onClick={handleNext}
            disabled={saveAnswer.isPending}
          >
            {saveAnswer.isPending ? 'Saving…' : 'Next →'}
          </button>
        ) : (
          <button
            className="font-semibold text-sm border border-transparent cursor-pointer px-4.5 py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 min-w-[124px] transition-all duration-[120ms] bg-[#2563eb] text-white disabled:opacity-55 disabled:cursor-not-allowed hover:bg-[#1d4ed8]"
            onClick={handleSubmit}
            disabled={submitAttempt.isPending || saveAnswer.isPending}
          >
            {submitAttempt.isPending ? 'Submitting…' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}
