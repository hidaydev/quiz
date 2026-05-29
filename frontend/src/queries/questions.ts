import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, addQuestion, updateQuestion, deleteQuestion } from '../api'
import type { Quiz, Question } from '../types'

type QuizCache = Quiz & { questions: Question[] }

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
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: queryKeys.quiz(quizId) })
      const previous = qc.getQueryData<QuizCache>(queryKeys.quiz(quizId))
      qc.setQueryData<QuizCache>(queryKeys.quiz(quizId), (old) => {
        if (!old) return old
        return {
          ...old,
          questions: old.questions.map((q) =>
            q.id === id ? { ...q, ...payload } : q,
          ),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        qc.setQueryData(queryKeys.quiz(quizId), context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}

export const useDeleteQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}
