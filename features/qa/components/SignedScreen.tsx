'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Download, Printer, Share2, Info } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { QuestionWithOptions } from '../types'

interface SignedScreenProps {
  signedName: string
  signatureDataUrl: string
  signedAt: string
  questions: QuestionWithOptions[]
  responses: Record<string, string>
  onRevise?: () => void
  sessionId?: string
}

export function SignedScreen({ signedName, signatureDataUrl, signedAt, questions, responses, onRevise, sessionId }: SignedScreenProps) {
  const firstName = signedName.split(' ')[0]
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const sigBg = mounted && resolvedTheme === 'dark' ? '#3F384F' : '#D8CDE9'
  const formattedDate = new Date(signedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="w-full">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-12">

        {/* Title + Name */}
        <div className="mb-8 md:mb-10">
          <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground mb-6 md:mb-8">
            NSW Advance Care Directive
          </h1>
          <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
            Full name
          </p>
          <p className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
            {signedName}
          </p>
        </div>

        {/* Microcopy */}
        <div className="flex flex-col gap-4 max-w-xl mb-8">
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            {firstName} has prepared this advance care directive to make their values and medical wishes known. It sets out the care they want to receive — and the care they don't — if they are ever unable to speak for themselves.
          </p>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            These decisions were made thoughtfully and freely. They reflect what matters most to {firstName} and should be honoured by anyone involved in their care.
          </p>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            This document was completed on {formattedDate}.
          </p>
        </div>

        {/* Witnessing callout */}
        <div className="flex flex-col md:flex-row gap-3 rounded-lg border border-border bg-muted/40 p-4 max-w-xl mb-4">
          <Info size={20} strokeWidth={ICON_STROKE_WIDTH} className="shrink-0 md:mt-0.5 text-muted-foreground" />
          <div className="flex flex-col gap-2">
            <h6 className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]">
              Witnessing is recommended
            </h6>
            <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
              Your directive is legally valid in NSW without a witness.
            </p>
            <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
              NSW Health strongly recommends having someone witness your signature — it helps confirm you had decision-making capacity and signed freely.
            </p>
            {sessionId && (
              <a
                href={`/signed/${sessionId}/witness`}
                className="[font-size:var(--text-sm)] font-medium text-primary underline underline-offset-2 hover:no-underline w-fit font-[family-name:var(--font-family-body)]"
              >
                Add witness signature →
              </a>
            )}
          </div>
        </div>

        {/* Revise link */}
        {onRevise && (
          <div className="max-w-xl mb-10 md:mb-14">
            <button
              onClick={onRevise}
              className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] underline underline-offset-2"
            >
              Changed your mind? Revise your answers
            </button>
          </div>
        )}

        {/* Q&A answers */}
        <div className="flex flex-col divide-y divide-border-emphasis mb-12 md:mb-16">
          {questions.map(question => {
            const selectedOption = question.answer_options.find(o => o.id === responses[question.id])
            return (
              <div key={question.id} className="py-8 flex flex-col gap-1.5">
                {question.caption && (
                  <p className="[font-size:var(--text-xs)] uppercase text-muted-foreground font-[family-name:var(--font-family-body)] tracking-wide mb-1">
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
            )
          })}
        </div>

        {/* Signature block */}
        <div className="border-t border-border-emphasis pt-10 flex flex-col gap-2 max-w-xs">
          <div
            className="h-28 rounded-lg border border-border overflow-hidden"
            style={{ background: sigBg }}
          >
            <img
              src={signatureDataUrl}
              alt="Your signature"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="[font-size:var(--text-base)] text-foreground font-[family-name:var(--font-family-body)] font-medium mt-1">
            {signedName}
          </p>
          <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)]">
            {formattedDate}
          </p>
        </div>

      </div>
    </div>
  )
}

export function SignedFooter({
  onDownload,
  onPrint,
  onShare,
  downloading = false,
}: {
  onDownload: () => void
  onPrint: () => void
  onShare: () => void
  downloading?: boolean
}) {
  return (
    <div className="w-full border-t border-border-emphasis py-4 shrink-0 bg-background">
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={onDownload}
          disabled={downloading}
          className="w-full md:w-auto md:order-2 h-12 md:h-11 gap-2"
        >
          <Download size={18} strokeWidth={ICON_STROKE_WIDTH} />
          {downloading ? 'Downloading…' : 'Download PDF'}
        </Button>

        {/* Print + Share */}
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:gap-2 md:order-1">
          <Button
            variant="outline"
            onClick={onPrint}
            className="h-11 gap-2 text-muted-foreground font-[family-name:var(--font-family-body)]"
          >
            <Printer size={16} strokeWidth={ICON_STROKE_WIDTH} />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={onShare}
            className="h-11 gap-2 text-muted-foreground font-[family-name:var(--font-family-body)]"
          >
            <Share2 size={16} strokeWidth={ICON_STROKE_WIDTH} />
            Share
          </Button>
        </div>

      </div>
    </div>
  )
}
