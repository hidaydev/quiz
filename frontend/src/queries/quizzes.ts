// frontend/src/queries/quizzes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/constants'
import { fetchQuizzes, fetchQuiz, createQuiz, updateQuiz } from '../api/quizzes'
import { addQuestion, updateQuestion, deleteQuestion } from '../api/questions'

export const useQuizzes = () =>
  useQuery({ queryKey: queryKeys.quizzes, queryFn: fetchQuizzes })

export const useQuiz = (id: number) =>
  useQuery({
    queryKey: queryKeys.quiz(id),
    queryFn: () => fetchQuiz(id),
    enabled: id > 0,
  })

export const useCreateQuiz = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createQuiz,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quizzes }),
  })
}

export const useUpdateQuiz = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateQuiz>[1]) =>
      updateQuiz(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.quiz(id) })
      qc.invalidateQueries({ queryKey: queryKeys.quizzes })
    },
  })
}

export const useAddQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof addQuestion>[1]) =>
      addQuestion(quizId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}

export const useUpdateQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof updateQuestion>[1]
    }) => updateQuestion(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}

export const useDeleteQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}
