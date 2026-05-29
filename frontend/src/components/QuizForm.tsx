// frontend/src/components/QuizForm.tsx
import { useForm } from 'react-hook-form'

export interface QuizFormValues {
  title: string
  description: string
  timeLimitSeconds?: number
  isPublished: boolean
}

interface Props {
  defaultValues?: Partial<QuizFormValues>
  onSubmit: (values: QuizFormValues) => void
  isLoading?: boolean
}

export default function QuizForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: { isPublished: false, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Time Limit (seconds, optional)
        </label>
        <input
          type="number"
          min={1}
          {...register('timeLimitSeconds', { valueAsNumber: true })}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. 300"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublished" {...register('isPublished')} />
        <label htmlFor="isPublished" className="text-sm">
          Published{' '}
          <span className="text-gray-500">
            (must be published for players to take it)
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Quiz'}
      </button>
    </form>
  )
}
