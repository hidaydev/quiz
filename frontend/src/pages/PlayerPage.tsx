import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useQuiz, useStartAttempt, useSaveAnswer, useSubmitAttempt } from '../queries'
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

  const { data: quiz, isError: quizNotFound, isLoading: quizLoading, isFetching: quizFetching } = useQuiz(quizId)
  const startAttempt = useStartAttempt()
  const saveAnswer = useSaveAnswer()
  const submitAttempt = useSubmitAttempt()
  const { tabSwitches, pastes } = useAntiCheat(attempt?.id ?? null)

  const questions = (attempt?.quiz.questions ?? []).filter((q) => q.type !== 'code')
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
      state: { result, total: questions.length, antiCheat: { tabSwitches, pastes } },
    })
  }

  if (!attempt) {
    return (
      <div className="page">
        <button className="back" onClick={() => navigate('/play')}>← Home</button>
        <div className="card start-card">
          <div className="start-emoji">🧠</div>
          <h2>{quizLoading ? `Quiz #${quizId}` : (quiz?.title ?? `Quiz #${quizId}`)}</h2>
          {quiz?.description && <p className="muted" style={{ marginBottom: 8 }}>{quiz.description}</p>}
          {quizFetching && <p className="muted" style={{ marginBottom: 12 }}>Loading quiz…</p>}
          {quizNotFound && (
            <div className="notice-error" style={{ marginBottom: 16, textAlign: 'left' }}>
              <span>⚠</span>
              <span>Quiz not found. Please check the ID and try again.</span>
            </div>
          )}
          {startError && (
            <div className="notice-error" style={{ marginBottom: 16, textAlign: 'left' }}>
              <span>⚠</span>
              <span>{startError}</span>
            </div>
          )}
          <div className="meta-row">
            <div className="meta-item">
              <div className="mv">{quiz?.questions?.length ?? '—'}</div>
              <div className="ml">Questions</div>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleStart} disabled={startAttempt.isPending || quizLoading || quizNotFound}>
            {startAttempt.isPending ? 'Starting…' : 'Start Quiz'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <button className="back" onClick={() => navigate('/')}>← Home</button>
      <div className="player-head">
        <div className="player-title">{attempt.quiz.title}</div>
        <span className="progress-txt">{currentIndex + 1} / {questions.length}</span>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></span>
      </div>
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id] ?? ''}
          onChange={(value) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))}
        />
      )}
      <div className="nav-row">
        <button className="btn btn-ghost" onClick={() => setCurrentIndex((i) => i - 1)} disabled={currentIndex === 0}>← Previous</button>
        {!isLastQuestion
          ? <button className="btn btn-primary" onClick={handleNext} disabled={saveAnswer.isPending}>{saveAnswer.isPending ? 'Saving…' : 'Next →'}</button>
          : <button className="btn btn-primary" onClick={handleSubmit} disabled={submitAttempt.isPending || saveAnswer.isPending}>{submitAttempt.isPending ? 'Submitting…' : 'Submit Quiz'}</button>}
      </div>
    </div>
  )
}
