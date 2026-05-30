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
  defaultValues?: Partial<QuestionFormValues>
  isLoading?: boolean
  submitLabel?: string
}

export default function QuestionForm({ onSubmit, defaultValues, isLoading, submitLabel }: Props) {
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<QuestionFormValues>({
    shouldUnregister: true,
    defaultValues: defaultValues ?? {
      type: 'mcq',
      options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    },
  })

  const type = watch('type')
  const { fields } = useFieldArray({ control, name: 'options' })

  const handleFormSubmit = (values: QuestionFormValues) => {
    onSubmit(values)
    if (!defaultValues) reset({ type: values.type, options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }] })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="field">
        <label>Question type</label>
        <div className="radio-group">
          <label className={`radio-pill${type === 'mcq' ? ' sel' : ''}`}>
            <input type="radio" value="mcq" {...register('type')} />
            Multiple choice
          </label>
          <label className={`radio-pill${type === 'short' ? ' sel' : ''}`}>
            <input type="radio" value="short" {...register('type')} />
            Short answer
          </label>
        </div>
      </div>

      <div className="field">
        <label>Prompt <span className="req">*</span></label>
        <textarea
          placeholder="e.g. What does typeof null evaluate to?"
          {...register('prompt', { required: 'A question prompt is required.' })}
        />
        {errors.prompt && <div className="field-error">{errors.prompt.message}</div>}
      </div>

      <div className="field">
        <label>Code snippet <span className="hint">(optional — shown in a code block)</span></label>
        <textarea
          className="mono"
          style={{ minHeight: 70 }}
          placeholder="console.log(0.1 + 0.2);"
          {...register('codeSnippet')}
        />
      </div>

      {type === 'mcq' && (
        <div className="field">
          <label>Options <span className="hint">(select the correct one)</span></label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="opt-input-row">
                <input
                  type="radio"
                  value={index}
                  {...register('correctAnswerIndex', { required: 'Select the correct answer', valueAsNumber: true })}
                />
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.value`, { required: 'Option text is required' })}
                />
              </div>
              {errors.options?.[index]?.value && (
                <div className="field-error" style={{ marginLeft: 28, marginBottom: 6 }}>{errors.options[index].value.message}</div>
              )}
            </div>
          ))}
          {errors.correctAnswerIndex && <div className="field-error">{errors.correctAnswerIndex.message}</div>}
        </div>
      )}

      {type === 'short' && (
        <div className="field">
          <label>Accepted answer <span className="hint">(case-insensitive)</span></label>
          <input
            type="text"
            placeholder="e.g. JSON.parse"
            {...register('correctAnswerText', { required: 'Provide the accepted answer.' })}
          />
          {errors.correctAnswerText && <div className="field-error">{errors.correctAnswerText.message}</div>}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Saving…' : (submitLabel ?? '+ Add Question')}
      </button>
    </form>
  )
}
