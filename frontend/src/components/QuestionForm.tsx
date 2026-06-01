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

export default function QuestionForm({ onSubmit, onCancel, defaultValues, isLoading, submitLabel }: Props) {
  const { register, handleSubmit, watch, control, reset, setValue, getValues, formState: { errors } } = useForm<QuestionFormValues>({
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
    if (!defaultValues) reset({
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
          <label className={['flex flex-1 items-center gap-[9px] px-3.5 py-3 border-[1.5px] rounded-lg cursor-pointer font-medium text-sm transition-all duration-[120ms]', type === 'mcq' ? 'border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8] font-semibold' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'].join(' ')}>
            <input type="radio" value="mcq" className="accent-[#2563eb] shrink-0" {...register('type')} />
            Multiple choice
          </label>
          <label className={['flex flex-1 items-center gap-[9px] px-3.5 py-3 border-[1.5px] rounded-lg cursor-pointer font-medium text-sm transition-all duration-[120ms]', type === 'short' ? 'border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8] font-semibold' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'].join(' ')}>
            <input type="radio" value="short" className="accent-[#2563eb] shrink-0" {...register('type')} />
            Short answer
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">Prompt <span className="text-[#2563eb]">*</span></label>
        <textarea
          className="font-[inherit] px-[13px] py-2.5 border border-[#e2e8f0] rounded-[8px] bg-white text-[#0f172a] w-full outline-none resize-y min-h-[88px] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#eff6ff]"
          placeholder="e.g. What does typeof null evaluate to?"
          {...register('prompt', { required: 'A question prompt is required.' })}
        />
        {errors.prompt && <div className="text-[#dc2626] text-[13px] font-medium">{errors.prompt.message}</div>}
      </div>

      <div className="flex flex-col gap-1.5 mb-4.5">
        <label className="font-semibold text-sm">Code snippet <span className="text-[#94a3b8] text-[12.5px]">(optional — shown in a code block)</span></label>
        <textarea
          className="font-mono font-[inherit] px-[13px] py-2.5 border border-[#e2e8f0] rounded-[8px] bg-white text-[#0f172a] w-full outline-none resize-y min-h-[70px] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#eff6ff]"
          placeholder="console.log(0.1 + 0.2);"
          {...register('codeSnippet')}
        />
      </div>

      {type === 'mcq' && (
        <div className="flex flex-col gap-1.5 mb-4.5">
          <label className="font-semibold text-sm">Options <span className="text-[#94a3b8] text-[12.5px]">(select the correct one)</span></label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="flex items-center gap-2.5 mb-2.5">
                <input
                  type="radio"
                  value={index}
                  style={{ width: 18, height: 18, accentColor: '#2563eb', flexShrink: 0, cursor: 'pointer' }}
                  {...register('correctAnswerIndex', { required: 'Select the correct answer', valueAsNumber: true })}
                />
                <input
                  type="text"
                  className="font-[inherit] px-[13px] py-2.5 border border-[#e2e8f0] rounded-[8px] bg-white text-[#0f172a] w-full outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#eff6ff]"
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.value`, { required: 'Option text is required' })}
                />
                {fields.length > 2 && (
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[7px] border border-[#e2e8f0] bg-white text-[#64748b] cursor-pointer grid place-items-center text-sm transition-all duration-[120ms] hover:bg-[#fef2f2] hover:text-[#991b1b] hover:border-[#fecaca]"
                    onClick={() => {
                      const current = getValues('correctAnswerIndex')
                      remove(index)
                      if (current === index) {
                        setValue('correctAnswerIndex', undefined as unknown as number, { shouldValidate: true })
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
                <div className="text-[#dc2626] text-[13px] font-medium ml-7 mb-1.5">{errors.options[index].value.message}</div>
              )}
            </div>
          ))}
          {errors.correctAnswerIndex && <div className="text-[#dc2626] text-[13px] font-medium">{errors.correctAnswerIndex.message}</div>}
          {fields.length < 6 && (
            <button
              type="button"
              className="mt-1 font-semibold text-sm border border-[#e2e8f0] cursor-pointer px-[18px] py-2.5 rounded-[8px] whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
              onClick={() => append({ value: '' })}
            >
              + Add option
            </button>
          )}
        </div>
      )}

      {type === 'short' && (
        <div className="flex flex-col gap-1.5 mb-4.5">
          <label className="font-semibold text-sm">Accepted answer <span className="text-[#94a3b8] text-[12.5px]">(case-insensitive)</span></label>
          <input
            type="text"
            className="font-[inherit] px-[13px] py-2.5 border border-[#e2e8f0] rounded-[8px] bg-white text-[#0f172a] w-full outline-none focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#eff6ff]"
            placeholder="e.g. JSON.parse"
            {...register('correctAnswerText', { required: 'Provide the accepted answer.' })}
          />
          {errors.correctAnswerText && <div className="text-[#dc2626] text-[13px] font-medium">{errors.correctAnswerText.message}</div>}
        </div>
      )}

      <div className="flex gap-2.5">
        <button type="submit" className="font-semibold text-sm border border-transparent cursor-pointer px-[18px] py-2.5 rounded-[8px] whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-[#2563eb] text-white disabled:opacity-55 disabled:cursor-not-allowed hover:not-disabled:bg-[#1d4ed8]" disabled={isLoading}>
          {isLoading ? 'Saving…' : (submitLabel ?? '+ Add Question')}
        </button>
        {onCancel && (
          <button type="button" className="font-semibold text-sm border border-[#e2e8f0] cursor-pointer px-[18px] py-2.5 rounded-[8px] whitespace-nowrap inline-flex items-center justify-center gap-2 transition-all duration-[120ms] bg-white text-[#0f172a] hover:bg-[#f8fafc] hover:border-[#cbd5e1]" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}
