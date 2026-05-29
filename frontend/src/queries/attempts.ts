// frontend/src/queries/attempts.ts
import { useMutation } from '@tanstack/react-query'
import { startAttempt, saveAnswer, submitAttempt } from '../api'

export const useStartAttempt = () =>
  useMutation({ mutationFn: (quizId: number) => startAttempt(quizId) })

export const useSaveAnswer = () =>
  useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      value,
    }: {
      attemptId: number
      questionId: number
      value: string
    }) => saveAnswer(attemptId, questionId, value),
  })

export const useSubmitAttempt = () =>
  useMutation({ mutationFn: (attemptId: number) => submitAttempt(attemptId) })
