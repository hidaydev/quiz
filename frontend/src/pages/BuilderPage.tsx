import { useParams, useNavigate, Link } from 'react-router-dom'
import QuizForm, { type QuizFormValues } from '../components/QuizForm'
import QuestionForm, { type QuestionFormValues } from '../components/QuestionForm'
import QuestionList from '../components/QuestionList'
import {
  useQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../queries/quizzes'
import type { Question } from '../types'

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
      await updateQuiz.mutateAsync(values)
    } else {
      const created = await createQuiz.mutateAsync(values)
      navigate(`/builder/${created.id}`)
    }
  }

  const handleAddQuestion = async (values: QuestionFormValues) => {
    if (values.type === 'mcq') {
      await addQuestion.mutateAsync({
        type: 'mcq',
        prompt: values.prompt,
        options: values.options.map(o => o.value),
        correctAnswer: values.correctAnswerIndex!,
      })
    } else {
      await addQuestion.mutateAsync({
        type: 'short',
        prompt: values.prompt,
        correctAnswer: values.correctAnswerText!,
      })
    }
  }

  const handleMoveUp = async (question: Question) => {
    const questions = quiz?.questions ?? []
    const index = questions.findIndex(q => q.id === question.id)
    if (index <= 0) return
    const above = questions[index - 1]
    await updateQuestion.mutateAsync({ id: question.id, payload: { position: above.position } })
    await updateQuestion.mutateAsync({ id: above.id, payload: { position: question.position } })
  }

  const handleMoveDown = async (question: Question) => {
    const questions = quiz?.questions ?? []
    const index = questions.findIndex(q => q.id === question.id)
    if (index >= questions.length - 1) return
    const below = questions[index + 1]
    await updateQuestion.mutateAsync({ id: question.id, payload: { position: below.position } })
    await updateQuestion.mutateAsync({ id: below.id, payload: { position: question.position } })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">← Home</Link>
        <h1 className="text-2xl font-bold">{quizId ? 'Edit Quiz' : 'Create Quiz'}</h1>
      </div>

      {quizId && isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <QuizForm
          defaultValues={
            quiz
              ? {
                  title: quiz.title,
                  description: quiz.description,
                  timeLimitSeconds: quiz.timeLimitSeconds,
                  isPublished: quiz.isPublished,
                }
              : undefined
          }
          onSubmit={handleQuizSubmit}
          isLoading={createQuiz.isPending || updateQuiz.isPending}
        />
      )}

      {quizId && (
        <>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Quiz ID: <strong className="text-gray-800">{quizId}</strong>
              <span className="ml-2 text-gray-400">(share this ID with players)</span>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Questions</h2>
            <QuestionList
              questions={quiz?.questions ?? []}
              onDelete={id => deleteQuestion.mutate(id)}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Add Question</h2>
            <QuestionForm onSubmit={handleAddQuestion} isLoading={addQuestion.isPending} />
          </div>
        </>
      )}
    </div>
  )
}
