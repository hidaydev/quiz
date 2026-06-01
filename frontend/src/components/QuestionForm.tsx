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
  onCancel?: () => void
  defaultValues?: Partial<QuestionFormValues>
  isLoading?: boolean
  submitLabel?: string
}

export default function QuestionForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
  submitLabel,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    shouldUnregister: true,
    defaultValues: defaultValues ?? {
      type: 'mcq',
      options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    },
  })

  const type = watch('type')
  const { fields, append, remove } = useFieldArray({ control, name: 'options' })

  const handleFormSubmit = (values: QuestionFormValues) => {
    onSubmit(values)
    if (!defaultValues)
      reset({
        type: values.type,
        prompt: '',
        codeSnippet: '',
        options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
        correctAnswerIndex: undefined,
        correctAnswerText: '',
      })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">Question type</label>
        <div className="flex gap-2.5">
          <label
            className={[
              'flex flex-1 items-center gap-[9px] px-3.5 py-3 border-[1.5px] rounded-lg cursor-pointer font-medium text-sm transition-all duration-[120ms]',
              type === 'mcq'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 hover:border-slate-300',
            ].join(' ')}
          >
            <input
              type="radio"
              value="mcq"
              className="accent-blue-600 shrink-0"
              {...register('type')}
            />
            Multiple choice
          </label>
          <label
            className={[
              'flex flex-1 items-center gap-[9px] px-3.5 py-3 border-[1.5px] rounded-lg cursor-pointer font-medium text-sm transition-all duration-[120ms]',
              type === 'short'
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-slate-200 hover:border-slate-300',
            ].join(' ')}
          >
            <input
              type="radio"
              value="short"
              className="accent-blue-600 shrink-0"
              {...register('type')}
            />
            Short answer
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">
          Prompt <span className="text-blue-600">*</span>
        </label>
        <textarea
          className="font-[inherit] px-[13px] py-2.5 border border-slate-200 rounded-[8px] bg-white text-slate-900 w-full outline-none resize-y min-h-[88px] focus:border-blue-600 focus:shadow-focus"
          placeholder="e.g. What does typeof null evaluate to?"
          {...register('prompt', {
            required: 'A question prompt is required.',
          })}
        />
        {errors.prompt && (
          <div className="text-red-600 text-[13px] font-medium">
            {errors.prompt.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">
          Code snippet{' '}
          <span className="text-slate-400 text-[12.5px]">
            (optional — shown in a code block)
          </span>
        </label>
        <textarea
          className="font-mono font-[inherit] px-[13px] py-2.5 border border-slate-200 rounded-[8px] bg-white text-slate-900 w-full outline-none resize-y min-h-[70px] focus:border-blue-600 focus:shadow-focus"
          placeholder="console.log(0.1 + 0.2);"
          {...register('codeSnippet')}
        />
      </div>

      {type === 'mcq' && (
        <div className="flex flex-col gap-1.5 mb-4.5">
          <label className="font-semibold text-sm">
            Options{' '}
            <span className="text-slate-400 text-[12.5px]">
              (select the correct one)
            </span>
          </label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="flex items-center gap-2.5 mb-2.5">
                <input
                  type="radio"
                  value={index}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: 'var(--color-blue-600)',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                  {...register('correctAnswerIndex', {
                    required: 'Select the correct answer',
                    valueAsNumber: true,
                  })}
                />
                <input
                  type="text"
                  className="font-[inherit] px-[13px] py-2.5 border border-slate-200 rounded-[8px] bg-white text-slate-900 w-full outline-none focus:border-blue-600 focus:shadow-focus"
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.value`, {
                    required: 'Option text is required',
                  })}
                />
                {fields.length > 2 && (
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[7px] border border-slate-200 bg-white text-slate-500 cursor-pointer grid place-items-center text-sm transition-all duration-[120ms] hover:bg-red-50 hover:text-red-800 hover:border-red-200"
                    onClick={() => {
                      const current = getValues('correctAnswerIndex')
                      remove(index)
                      if (current === index) {
                        setValue(
                          'correctAnswerIndex',
                          undefined as unknown as number,
                          { shouldValidate: true },
                        )
                      } else if (current !== undefined && current > index) {
                        setValue('correctAnswerIndex', current - 1)
                      }
                    }}
                    title="Remove option"
                    aria-label="Remove option"
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.options?.[index]?.value && (
                <div className="text-red-600 text-[13px] font-medium ml-7 mb-1.5">
                  {errors.options[index].value.message}
                </div>
              )}
            </div>
          ))}
          {errors.correctAnswerIndex && (
            <div className="text-red-600 text-[13px] font-medium">
              {errors.correctAnswerIndex.message}
            </div>
          )}
          {fields.length < 6 && (
            <button
              type="button"
              className="mt-1 font-semibold text-sm border border-slate-200 cursor-pointer px-[18px] py-2.5 rounded-[8px] whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300"
              onClick={() => append({ value: '' })}
            >
              + Add option
            </button>
          )}
        </div>
      )}

      {type === 'short' && (
        <div className="flex flex-col gap-1.5 mb-4.5">
          <label className="font-semibold text-sm">
            Accepted answer{' '}
            <span className="text-slate-400 text-[12.5px]">
              (case-insensitive)
            </span>
          </label>
          <input
            type="text"
            className="font-[inherit] px-[13px] py-2.5 border border-slate-200 rounded-[8px] bg-white text-slate-900 w-full outline-none focus:border-blue-600 focus:shadow-focus"
            placeholder="e.g. JSON.parse"
            {...register('correctAnswerText', {
              required: 'Provide the accepted answer.',
            })}
          />
          {errors.correctAnswerText && (
            <div className="text-red-600 text-[13px] font-medium">
              {errors.correctAnswerText.message}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2.5">
        <button
          type="submit"
          className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-[8px] whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-blue-600 text-white disabled:opacity-55 disabled:cursor-not-allowed hover:not-disabled:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Saving…' : (submitLabel ?? '+ Add Question')}
        </button>
        {onCancel && (
          <button
            type="button"
            className="font-semibold text-sm border border-slate-200 cursor-pointer px-[18px] py-2.5 rounded-[8px] whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
