// frontend/src/api/quizzes.ts
import client from './axiosClient'
import { endpoints } from './constants'
import type { Quiz } from '../types'

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  const { data } = await client.get(endpoints.quizzes)
  return data
}

export const fetchQuiz = async (id: number): Promise<Quiz> => {
  const { data } = await client.get(endpoints.quiz(id))
  return data
}

export const createQuiz = async (payload: {
  title: string
  description: string
  timeLimitSeconds?: number
  isPublished: boolean
}): Promise<Quiz> => {
  const { data } = await client.post(endpoints.quizzes, payload)
  return data
}

export const updateQuiz = async (
  id: number,
  payload: Partial<{
    title: string
    description: string
    timeLimitSeconds: number
    isPublished: boolean
  }>,
): Promise<Quiz> => {
  const { data } = await client.patch(endpoints.quiz(id), payload)
  return data
}
