// frontend/src/components/QuestionForm.tsx
import { useForm, useFieldArray } from 'react-hook-form'

export interface QuestionFormValues {
  type: 'mcq' | 'short'
  prompt: string
  codeSnippet?: string
  options: { value: string }[]
  correctAnswerIndex?: number
  correctAnswerText?: string
}

interface Props {
  onSubmit: (values: QuestionFormValues) => void
  isLoading?: boolean
}

export default function QuestionForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    shouldUnregister: true,
    defaultValues: {
      type: 'mcq',
      options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    },
  })

  const type = watch('type')
  const { fields } = useFieldArray({ control, name: 'options' })

  const handleFormSubmit = (values: QuestionFormValues) => {
    onSubmit(values)
    reset({
      type: values.type,
      options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 border rounded p-4"
    >
      <div className="flex gap-4">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" value="mcq" {...register('type')} />
          Multiple Choice
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" value="short" {...register('type')} />
          Short Answer
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prompt *</label>
        <textarea
          {...register('prompt', { required: 'Prompt is required' })}
          className="w-full border rounded px-3 py-2"
          rows={2}
        />
        {errors.prompt && (
          <p className="text-red-600 text-sm mt-1">{errors.prompt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Code Snippet{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register('codeSnippet')}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={4}
          placeholder="Paste code here..."
        />
      </div>

      {type === 'mcq' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Options — select the correct answer
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  value={index}
                  {...register('correctAnswerIndex', {
                    required: 'Select the correct answer',
                    valueAsNumber: true,
                  })}
                />
                <input
                  {...register(`options.${index}.value`, {
                    required: 'Option text is required',
                  })}
                  className="flex-1 border rounded px-3 py-1"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
              {errors.options?.[index]?.value && (
                <p className="text-red-600 text-xs ml-6">
                  {errors.options[index].value.message}
                </p>
              )}
            </div>
          ))}
          {errors.correctAnswerIndex && (
            <p className="text-red-600 text-sm">
              {errors.correctAnswerIndex.message}
            </p>
          )}
        </div>
      )}

      {type === 'short' && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Correct Answer *
          </label>
          <input
            {...register('correctAnswerText', {
              required: 'Correct answer is required',
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Case-insensitive match"
          />
          {errors.correctAnswerText && (
            <p className="text-red-600 text-sm mt-1">
              {errors.correctAnswerText.message}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Adding...' : 'Add Question'}
      </button>
    </form>
  )
}
