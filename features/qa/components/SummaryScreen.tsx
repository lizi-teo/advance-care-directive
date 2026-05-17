'use client'

import { motion } from 'motion/react'
import { QuestionWithOptions } from '../types'
import { Button, OutlineButton } from '@/components/ui/button'
import { InfoBox } from '@/components/ui/info-box'
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
      <div className="page-container py-8 md:py-12">

        {/* Completion header */}
        <motion.div
          className="flex flex-col gap-3 mb-10 md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <CheckCircle2 size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-primary" />
          <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
            You've done something meaningful
          </h1>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] max-w-xl">
            It takes courage to think about these things.
          </p>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] max-w-xl">
            Review your answers below, and share or print your directive when you're ready.
          </p>
        </motion.div>

        {/* Q&A list */}
        <motion.div
          className="flex flex-col divide-y divide-border-emphasis"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }}
        >
          {questions.map((question, index) => {
            const selectedOptionId = responses[question.id]
            const selectedOption = question.answer_options.find(o => o.id === selectedOptionId)

            return (
              <motion.div
                key={question.id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } } }}
                className="py-8 flex flex-row items-start gap-4 md:gap-8 group"
              >
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
              </motion.div>
            )
          })}
        </motion.div>

        {/* Footer note */}
        <motion.div
          className="mt-10 md:mt-12 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut', delay: 0.3 }}
        >
          <InfoBox className="flex flex-col gap-3">
            <p className="font-medium text-foreground">What to do with your directive</p>
            <p>Share a copy with your GP and anyone close to you. Store it somewhere easy to find, or carry a note saying where it lives.</p>
            <p>This follows the NSW Health advance care planning framework. Advance care directives are legally recognised in NSW and should be honoured by your medical team.</p>
            <p>
              To learn more, visit{' '}
              <a
                href="https://www.health.nsw.gov.au/patients/acp/Pages/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link underline underline-offset-2 hover:no-underline"
              >
                NSW Health →
              </a>
            </p>
          </InfoBox>
        </motion.div>

      </div>
    </div>
  )
}

export function SummaryFooter({
  onShare,
  onPrint,
  onFinalise,
}: {
  onShare: () => void
  onPrint: () => void
  onFinalise: () => void
}) {
  return (
    <div className="w-full border-t border-border-emphasis py-4 shrink-0 bg-background">
      <div className="page-container flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={onFinalise}
          className="w-full md:w-auto md:order-2 h-12 md:h-11"
        >
          Sign my directive
        </Button>

        {/* Print + Share */}
        <div className="grid grid-cols-2 gap-3 md:btn-group md:order-1">
          <OutlineButton
            onClick={onPrint}
            icon={<Printer size={16} strokeWidth={ICON_STROKE_WIDTH} />}
            className="h-11 font-[family-name:var(--font-family-body)]"
          >
            Print
          </OutlineButton>
          <OutlineButton
            onClick={onShare}
            icon={<Share2 size={16} strokeWidth={ICON_STROKE_WIDTH} />}
            className="h-11 font-[family-name:var(--font-family-body)]"
          >
            Share
          </OutlineButton>
        </div>

      </div>
    </div>
  )
}
