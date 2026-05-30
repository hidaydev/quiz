import { useForm } from 'react-hook-form'

export interface QuizFormValues {
  title: string
  description: string
}

interface Props {
  defaultValues?: Partial<QuizFormValues>
  onSubmit: (values: QuizFormValues) => void
  isLoading?: boolean
}

export default function QuizForm({ defaultValues, onSubmit, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<QuizFormValues>({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card pad">
      <div className="field">
        <label>Title <span className="req">*</span></label>
        <input
          type="text"
          placeholder="e.g. JavaScript Fundamentals"
          className={errors.title ? 'input-error' : ''}
          {...register('title', { required: 'A title is required.' })}
        />
        {errors.title && <div className="field-error">{errors.title.message}</div>}
      </div>

      <div className="field">
        <label>Description</label>
        <textarea placeholder="What's this quiz about?" {...register('description')} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Saving…' : defaultValues?.title ? 'Save Quiz' : 'Create Quiz'}
      </button>
    </form>
  )
}
