import { useParams, useNavigate } from 'react-router-dom'
import {
  QuizForm,
  QuestionForm,
  QuestionList,
  type QuizFormValues,
  type QuestionFormValues,
} from '../components'
import {
  useQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../queries'

export default function BuilderPage() {
  const { id } = useParams()
  const quizId = id ? Number(id) : 0
  const navigate = useNavigate()

  const { data: quiz, isLoading } = useQuiz(quizId)
  const createQuiz = useCreateQuiz()
  const updateQuiz = useUpdateQuiz(quizId)
  const addQuestion = useAddQuestion(quizId)
  const updateQuestion = useUpdateQuestion(quizId)
  const deleteQuestion = useDeleteQuestion(quizId)

  const handleQuizSubmit = async (values: QuizFormValues) => {
    if (quizId) {
      await updateQuiz.mutateAsync({ ...values, isPublished: true })
    } else {
      const created = await createQuiz.mutateAsync({
        ...values,
        isPublished: true,
      })
      navigate(`/builder/${created.id}`)
    }
  }

  const handleEditQuestion = async (
    questionId: number,
    values: QuestionFormValues,
  ) => {
    const codeSnippet = values.codeSnippet?.trim() || undefined
    if (values.type === 'mcq') {
      await updateQuestion.mutateAsync({
        id: questionId,
        payload: {
          type: 'mcq',
          prompt: values.prompt,
          codeSnippet,
          options: values.options.map((o) => o.value),
          correctAnswer: values.correctAnswerIndex!,
        },
      })
    } else {
      await updateQuestion.mutateAsync({
        id: questionId,
        payload: {
          type: 'short',
          prompt: values.prompt,
          codeSnippet,
          correctAnswer: values.correctAnswerText!,
        },
      })
    }
  }

  const handleAddQuestion = async (values: QuestionFormValues) => {
    const codeSnippet = values.codeSnippet?.trim() || undefined
    if (values.type === 'mcq') {
      await addQuestion.mutateAsync({
        type: 'mcq',
        prompt: values.prompt,
        codeSnippet,
        options: values.options.map((o) => o.value),
        correctAnswer: values.correctAnswerIndex!,
      })
    } else {
      await addQuestion.mutateAsync({
        type: 'short',
        prompt: values.prompt,
        codeSnippet,
        correctAnswer: values.correctAnswerText!,
      })
    }
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 pt-10 pb-24">
      <button
        className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-5 cursor-pointer bg-transparent border-none p-0 hover:text-slate-900"
        onClick={() => navigate('/')}
      >
        ← Home
      </button>
      <h1 className="text-[26px] font-bold tracking-[-0.02em] m-0 mb-1">
        {quizId ? 'Edit quiz' : 'Create quiz'}
      </h1>
      <p className="text-slate-500 m-0 mb-[26px] text-[15px]">
        {quizId
          ? 'Update the details, then manage questions below.'
          : "Start with the basics. You'll add questions after saving."}
      </p>
      {quizId > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm flex-wrap mb-5">
          <span>Quiz ID</span>
          <span className="font-mono font-bold bg-white border border-blue-200 rounded-md px-2 py-px">
            {quizId}
          </span>
          <button
            className="font-semibold text-[13px] border border-slate-200 cursor-pointer px-3 py-1.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 ml-auto"
            onClick={() => navigator.clipboard?.writeText(String(quizId))}
          >
            Copy
          </button>
        </div>
      )}

      {quizId > 0 && isLoading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <QuizForm
          key={quiz?.id ?? 'new'}
          defaultValues={
            quiz
              ? { title: quiz.title, description: quiz.description }
              : undefined
          }
          onSubmit={handleQuizSubmit}
          isLoading={createQuiz.isPending || updateQuiz.isPending}
        />
      )}

      {quizId > 0 && (
        <>
          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[.07em] my-[30px]">
            Questions ({quiz?.questions?.length ?? 0})
          </div>
          <QuestionList
            questions={quiz?.questions ?? []}
            onDelete={(id) => deleteQuestion.mutate(id)}
            onEdit={handleEditQuestion}
            isEditing={updateQuestion.isPending}
          />

          <hr className="border-0 border-t border-slate-200 mt-7" />
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-[22px] mt-5">
            <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-[.07em] mt-0 mb-[14px]">
              Add a question
            </div>
            <QuestionForm
              onSubmit={handleAddQuestion}
              isLoading={addQuestion.isPending}
            />
          </div>
        </>
      )}
    </div>
  )
}
