// frontend/src/types.ts
export type QuestionType = 'mcq' | 'short' | 'code'

export interface Quiz {
  id: number
  title: string
  description: string
  timeLimitSeconds?: number
  isPublished: boolean
  createdAt: string
  questions?: Question[]
}

export interface Question {
  id: number
  quizId: number
  type: QuestionType
  prompt: string
  options?: string[]
  correctAnswer?: string | number
  position: number
}

export interface Attempt {
  id: number
  quizId: number
  startedAt: string
  submittedAt: string | null
  answers: { questionId: number; value: string }[]
  quiz: {
    id: number
    title: string
    description: string
    timeLimitSeconds?: number
    questions: Omit<Question, 'correctAnswer'>[]
  }
}

export interface SubmitResult {
  score: number
  details: { questionId: number; correct: boolean; expected?: string }[]
}
