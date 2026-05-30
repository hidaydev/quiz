// frontend/src/api/attempts.ts
import client from './axiosClient'
import { endpoints } from './constants'
import type { Attempt, SubmitResult } from '../types'

export const startAttempt = async (quizId: number): Promise<Attempt> => {
  const { data } = await client.post(endpoints.attempts, { quizId })
  return data
}

export const saveAnswer = async (
  attemptId: number,
  questionId: number,
  value: string,
): Promise<void> => {
  await client.post(endpoints.attemptAnswer(attemptId), { questionId, value })
}

export const submitAttempt = async (
  attemptId: number,
): Promise<SubmitResult> => {
  const { data } = await client.post(endpoints.attemptSubmit(attemptId))
  return data
}

export const logEvent = (attemptId: number, event: string): void => {
  client.post(endpoints.attemptEvent(attemptId), { event }).catch(() => {})
}
