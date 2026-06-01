import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  queryKeys,
  fetchQuizzes,
  fetchQuiz,
  createQuiz,
  updateQuiz,
} from '../api'

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
