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
      const created = await createQuiz.mutateAsync({ ...values, isPublished: true })
      navigate(`/builder/${created.id}`)
    }
  }

  const handleEditQuestion = async (questionId: number, values: QuestionFormValues) => {
    const codeSnippet = values.codeSnippet?.trim() || undefined
    if (values.type === 'mcq') {
      await updateQuestion.mutateAsync({
        id: questionId,
        payload: { type: 'mcq', prompt: values.prompt, codeSnippet, options: values.options.map((o) => o.value), correctAnswer: values.correctAnswerIndex! },
      })
    } else {
      await updateQuestion.mutateAsync({
        id: questionId,
        payload: { type: 'short', prompt: values.prompt, codeSnippet, correctAnswer: values.correctAnswerText! },
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
    <div className="page">
      <button className="back" onClick={() => navigate('/')}>← Home</button>
      {quizId > 0 && (
        <div className="id-banner" style={{ marginBottom: 16 }}>
          <span>Quiz ID</span>
          <span className="idnum">{quizId}</span>
          <button className="btn btn-ghost copy-btn" style={{ fontSize: 13, padding: '6px 12px' }} onClick={() => navigator.clipboard?.writeText(String(quizId))}>Copy</button>
        </div>
      )}
      <h1 className="page-title">{quizId ? 'Edit quiz' : 'Create quiz'}</h1>
      <p className="page-sub">
        {quizId
          ? 'Update the details, then manage questions below.'
          : "Start with the basics. You'll add questions after saving."}
      </p>

      {quizId > 0 && isLoading ? (
        <p className="muted">Loading…</p>
      ) : (
        <QuizForm
          key={quiz?.id ?? 'new'}
          defaultValues={quiz ? { title: quiz.title, description: quiz.description } : undefined}
          onSubmit={handleQuizSubmit}
          isLoading={createQuiz.isPending || updateQuiz.isPending}
        />
      )}

      {quizId > 0 && (
        <>
          <div className="section-label">Questions ({quiz?.questions?.length ?? 0})</div>
          <QuestionList
            questions={quiz?.questions ?? []}
            onDelete={(id) => deleteQuestion.mutate(id)}
            onEdit={handleEditQuestion}
            isEditing={updateQuestion.isPending}
          />

          <div className="card pad" style={{ marginTop: 24 }}>
            <div className="section-label" style={{ marginTop: 0 }}>Add a question</div>
            <QuestionForm onSubmit={handleAddQuestion} isLoading={addQuestion.isPending} />
          </div>
        </>
      )}
    </div>
  )
}
