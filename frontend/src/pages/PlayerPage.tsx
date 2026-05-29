// frontend/src/pages/PlayerPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useStartAttempt, useSaveAnswer, useSubmitAttempt } from '../queries'
import { QuestionCard } from '../components'
import type { Attempt } from '../types'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const quizId = Number(id)

  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startError, setStartError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)

  const startAttempt = useStartAttempt()
  const saveAnswer = useSaveAnswer()
  const submitAttempt = useSubmitAttempt()

  const handleSubmit = useCallback(async (currentAttempt: Attempt, currentAnswers: Record<number, string>, questions: Attempt['quiz']['questions']) => {
    const lastQuestion = questions[questions.length - 1]
    if (!lastQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: currentAttempt.id,
      questionId: lastQuestion.id,
      value: currentAnswers[lastQuestion.id] ?? '',
    })
    const result = await submitAttempt.mutateAsync(currentAttempt.id)
    navigate(`/quiz/${quizId}/results`, {
      state: { result, total: questions.length },
    })
  }, [saveAnswer, submitAttempt, navigate, quizId])

  const questions = (attempt?.quiz.questions ?? []).filter(
    (q) => q.type !== 'code',
  )

  useEffect(() => {
    if (!attempt?.quiz.timeLimitSeconds) return

    const startedAt = new Date(attempt.startedAt.replace(' ', 'T') + 'Z')
    const calc = () => {
      const elapsed = (Date.now() - startedAt.getTime()) / 1000
      return Math.max(0, Math.floor(attempt.quiz.timeLimitSeconds! - elapsed))
    }

    setRemaining(calc())

    const interval = setInterval(() => {
      const r = calc()
      setRemaining(r)
      if (r <= 0) {
        clearInterval(interval)
        handleSubmit(attempt, answers, questions)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [attempt])

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

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleNext = async () => {
    if (!attempt || !currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    setCurrentIndex((i) => i + 1)
  }

  const handleSubmitClick = async () => {
    if (!attempt || !currentQuestion) return
    await saveAnswer.mutateAsync({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value: answers[currentQuestion.id] ?? '',
    })
    const result = await submitAttempt.mutateAsync(attempt.id)
    navigate(`/quiz/${quizId}/results`, {
      state: { result, total: questions.length },
    })
  }

  if (!attempt) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Home
        </Link>
        <h1 className="text-2xl font-bold">Quiz #{quizId}</h1>
        {startError && <p className="text-red-600 text-sm">{startError}</p>}
        <button
          onClick={handleStart}
          disabled={startAttempt.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {startAttempt.isPending ? 'Starting...' : 'Start Quiz'}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{attempt.quiz.title}</h1>
        <div className="flex items-center gap-4">
          {remaining !== null && (
            <span className={`text-sm font-mono font-medium ${remaining <= 30 ? 'text-red-600' : 'text-gray-500'}`}>
              {formatTime(remaining)}
            </span>
          )}
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
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

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded disabled:opacity-30 hover:bg-gray-50"
        >
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            disabled={saveAnswer.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saveAnswer.isPending ? 'Saving...' : 'Next'}
          </button>
        ) : (
          <button
            onClick={handleSubmitClick}
            disabled={submitAttempt.isPending || saveAnswer.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {submitAttempt.isPending ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  )
}
