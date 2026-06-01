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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(15,23,42,.04),0_1px_3px_rgba(15,23,42,.07)] p-[22px]">
      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">Title <span className="text-[#2563eb]">*</span></label>
        <input
          type="text"
          placeholder="e.g. JavaScript Fundamentals"
          className={`w-full font-[inherit] px-[13px] py-2.5 border border-[#e2e8f0] rounded-lg bg-white text-[#0f172a] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#eff6ff] transition-[border-color,box-shadow] duration-[120ms]${errors.title ? ' !border-[#ef4444]' : ''}`}
          {...register('title', { required: 'A title is required.' })}
        />
        {errors.title && <div className="text-[#dc2626] text-[13px] font-medium">{errors.title.message}</div>}
      </div>

      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">Description</label>
        <textarea
          placeholder="What's this quiz about?"
          className="w-full font-[inherit] px-[13px] py-2.5 border border-[#e2e8f0] rounded-lg bg-white text-[#0f172a] outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#eff6ff] transition-[border-color,box-shadow] duration-[120ms] resize-y min-h-[88px]"
          {...register('description')}
        />
      </div>

      <button
        type="submit"
        className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-[#2563eb] text-white disabled:opacity-55 disabled:cursor-not-allowed hover:not-disabled:bg-[#1d4ed8]"
        disabled={isLoading}
      >
        {isLoading ? 'Saving…' : defaultValues?.title ? 'Save Quiz' : 'Create Quiz'}
      </button>
    </form>
  )
}
