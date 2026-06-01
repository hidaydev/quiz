import type { Quiz } from '../types'

interface Props {
  quiz: Quiz
  action: React.ReactNode
}

const QuizCard = ({ quiz, action }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card px-5 py-[18px] flex items-center justify-between gap-4 transition-[box-shadow,border-color] duration-[120ms] hover:shadow-card-hover hover:border-slate-300">
      <div className="min-w-0">
        <div className="font-semibold text-base">{quiz.title}</div>
        <div className="text-slate-500 text-sm mt-0.5">{quiz.description}</div>
        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
          <span className="text-blue-600 text-[12px] font-mono font-semibold">
            Quiz ID: {quiz.id}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">{action}</div>
    </div>
  )
}

export default QuizCard
