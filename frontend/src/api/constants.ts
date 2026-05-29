// frontend/src/api/constants.ts
export const endpoints = {
  quizzes: '/quizzes',
  quiz: (id: number) => `/quizzes/${id}`,
  questions: (quizId: number) => `/quizzes/${quizId}/questions`,
  question: (id: number) => `/questions/${id}`,
  attempts: '/attempts',
  attemptAnswer: (id: number) => `/attempts/${id}/answer`,
  attemptSubmit: (id: number) => `/attempts/${id}/submit`,
}

export const queryKeys = {
  quizzes: ['quizzes'] as const,
  quiz: (id: number) => ['quizzes', id] as const,
  attempt: (id: number) => ['attempts', id] as const,
}
