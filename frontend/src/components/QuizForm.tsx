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

export default function QuizForm({
  defaultValues,
  onSubmit,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({ defaultValues })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-slate-200 rounded-xl shadow-card p-[22px]"
    >
      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">
          Title <span className="text-blue-600">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. JavaScript Fundamentals"
          className={`w-full font-[inherit] px-[13px] py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus transition-[border-color,box-shadow] duration-[120ms]${errors.title ? ' !border-red-500' : ''}`}
          {...register('title', { required: 'A title is required.' })}
        />
        {errors.title && (
          <div className="text-red-600 text-[13px] font-medium">
            {errors.title.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">Description</label>
        <textarea
          placeholder="What's this quiz about?"
          className="w-full font-[inherit] px-[13px] py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:border-blue-600 focus:shadow-focus transition-[border-color,box-shadow] duration-[120ms] resize-y min-h-[88px]"
          {...register('description')}
        />
      </div>

      <button
        type="submit"
        className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white disabled:opacity-55 disabled:cursor-not-allowed hover:not-disabled:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading
          ? 'Saving…'
          : defaultValues?.title
            ? 'Save Quiz'
            : 'Create Quiz'}
      </button>
    </form>
  )
}
