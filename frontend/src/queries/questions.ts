import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, addQuestion, updateQuestion, deleteQuestion } from '../api'

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
