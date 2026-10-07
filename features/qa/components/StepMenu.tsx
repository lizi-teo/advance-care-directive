'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { cn } from '@/lib/utils'
import type { QuestionWithOptions } from '@/features/qa/types'

interface StepMenuProps {
  questions: QuestionWithOptions[]
  responses: Record<string, string>
  currentIndex: number
  onGoToValues: () => void
  onGoToQuestion: (index: number) => void
  onGoToReview: () => void
  className?: string
}

export function StepMenu({
  questions,
  responses,
  currentIndex,
  onGoToValues,
  onGoToQuestion,
  onGoToReview,
  className,
}: StepMenuProps) {
  const [open, setOpen] = useState(false)

  // People can revisit any answered question, plus the first unanswered one —
  // but not skip ahead past questions they haven't answered yet.
  const firstUnanswered = questions.findIndex(q => !responses[q.id])
  const furthestReachable = firstUnanswered === -1 ? questions.length - 1 : firstUnanswered
  const allAnswered = firstUnanswered === -1

  const pick = (action: () => void) => {
    setOpen(false)
    action()
  }

  const itemClass =
    'w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-left [font-size:var(--text-sm)] font-[family-name:var(--font-family-body)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1 [font-size:var(--text-sm)] text-foreground/70 hover:text-foreground hover:bg-foreground/5 font-[family-name:var(--font-family-body)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        aria-label={`Question ${currentIndex + 1} of ${questions.length}. Open list of steps`}
      >
        {currentIndex + 1} of {questions.length}
        <ChevronDown size={16} strokeWidth={ICON_STROKE_WIDTH} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-2 max-h-[70vh] overflow-y-auto">
        <nav aria-label="Steps">
          <ul className="flex flex-col gap-0.5">
            <li>
              <button type="button" className={cn(itemClass, 'hover:bg-muted')} onClick={() => pick(onGoToValues)}>
                <span className="w-6 shrink-0" />
                <span className="flex-1">Your values</span>
              </button>
            </li>
            <li className="my-1 border-t border-border" role="separator" />
            {questions.map((q, index) => {
              const answered = !!responses[q.id]
              const current = index === currentIndex
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    disabled={index > furthestReachable}
                    aria-current={current ? 'step' : undefined}
                    className={cn(itemClass, current ? 'bg-muted' : 'hover:bg-muted')}
                    onClick={() => pick(() => onGoToQuestion(index))}
                  >
                    <span className="w-6 shrink-0 text-foreground/50 tabular-nums">{index + 1}</span>
                    <span className={cn('flex-1 line-clamp-2', current && 'font-medium')}>{q.question_text}</span>
                    {/* Lighter purple in dark mode: --primary is only 2.6:1 on the dark popover, below the 3:1 icon minimum */}
                    {answered && (
                      <Check size={18} strokeWidth={2} className="shrink-0 text-primary dark:text-(--purple-300)" aria-label="Answered" />
                    )}
                  </button>
                </li>
              )
            })}
            <li className="my-1 border-t border-border" role="separator" />
            <li>
              <button
                type="button"
                disabled={!allAnswered}
                className={cn(itemClass, 'hover:bg-muted')}
                onClick={() => pick(onGoToReview)}
              >
                <span className="w-6 shrink-0" />
                <span className="flex-1">Review answers</span>
              </button>
            </li>
          </ul>
        </nav>
      </PopoverContent>
    </Popover>
  )
}
