'use client'

import { QuestionWithOptions } from '../types'
import { Button } from '@/components/ui/button'
import { Pencil, Share2, Printer, CheckCircle2 } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { toast } from 'sonner'

interface SummaryScreenProps {
  questions: QuestionWithOptions[]
  responses: Record<string, string>
  onEdit: (questionIndex: number) => void
}

export function SummaryScreen({ questions, responses, onEdit }: SummaryScreenProps) {
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: 'My Advance Care Directive', url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-12">

        {/* Completion header */}
        <div className="flex flex-col gap-3 mb-10 md:mb-12">
          <CheckCircle2 size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-primary" />
          <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
            You're done
          </h1>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] max-w-xl">
            Review your answers below. You can edit any response before sharing or printing your directive.
          </p>
        </div>

        {/* Q&A list */}
        <div className="flex flex-col divide-y divide-border-emphasis">
          {questions.map((question, index) => {
            const selectedOptionId = responses[question.id]
            const selectedOption = question.answer_options.find(o => o.id === selectedOptionId)

            return (
              <div key={question.id} className="py-8 flex flex-row items-start gap-4 md:gap-8 group">
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  {question.caption && (
                    <p className="[font-size:var(--text-xs)] uppercase text-muted-foreground font-[family-name:var(--font-family-body)] tracking-wide mb-2">
                      {question.caption}
                    </p>
                  )}
                  <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                    {question.question_text}
                  </p>
                  {selectedOption ? (
                    <p className="[font-size:var(--text-base)] text-foreground font-[family-name:var(--font-family-body)] font-medium">
                      {selectedOption.option_text}
                    </p>
                  ) : (
                    <p className="[font-size:var(--text-base)] text-muted-foreground italic font-[family-name:var(--font-family-body)]">
                      Not answered
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(index)}
                  className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground px-2 md:px-3"
                  aria-label={`Edit answer to: ${question.question_text}`}
                >
                  <Pencil size={14} strokeWidth={ICON_STROKE_WIDTH} />
                  <span className="hidden md:inline">Edit</span>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function SummaryFooter({ onShare, onPrint }: { onShare: () => void; onPrint: () => void }) {
  return (
    <div className="w-full border-t border-border-emphasis py-5 shrink-0 bg-background">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 flex items-center gap-3 md:justify-end md:gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrint}
          className="flex-1 md:flex-none gap-2"
        >
          <Printer size={20} strokeWidth={ICON_STROKE_WIDTH} />
          Print
        </Button>
        <Button
          size="lg"
          onClick={onShare}
          className="flex-1 md:flex-none gap-2"
        >
          <Share2 size={20} strokeWidth={ICON_STROKE_WIDTH} />
          Share
        </Button>
      </div>
    </div>
  )
}
