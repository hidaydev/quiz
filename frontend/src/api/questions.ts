// frontend/src/api/questions.ts
import client from './client'
import { endpoints } from './constants'
import type { Question } from '../types'

export const addQuestion = async (
  quizId: number,
  payload: {
    type: 'mcq' | 'short'
    prompt: string
    options?: string[]
    correctAnswer: string | number
    position?: number
  }
): Promise<Question> => {
  const { data } = await client.post(endpoints.questions(quizId), payload)
  return data
}

export const updateQuestion = async (
  id: number,
  payload: Partial<{ position: number; prompt: string; options: string[]; correctAnswer: string | number }>
): Promise<Question> => {
  const { data } = await client.patch(endpoints.question(id), payload)
  return data
}

export const deleteQuestion = async (id: number): Promise<void> => {
  await client.delete(endpoints.question(id))
}
