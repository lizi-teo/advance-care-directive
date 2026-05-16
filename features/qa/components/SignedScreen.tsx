'use client'

import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button, OutlineButton } from '@/components/ui/button'
import { Download, Printer, Share2, Link2, Mail, Copy, Check } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { QuestionWithOptions } from '../types'
import { toast } from 'sonner'

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
  const [copied, setCopied] = useState(false)
  useEffect(() => setMounted(true), [])
  const sigBg = mounted && resolvedTheme === 'dark' ? '#3F384F' : '#D8CDE9'
  const directiveUrl = mounted && sessionId ? `${window.location.origin}/signed/${sessionId}` : ''
  const formattedDate = new Date(signedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleCopyDirective = async () => {
    await navigator.clipboard.writeText(directiveUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWitness = async () => {
    const url = `${window.location.origin}/signed/${sessionId}/witness`
    if (navigator.share) {
      try {
        await navigator.share({ title: `Witness ${signedName}'s advance care directive`, url })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Witness link copied to clipboard')
    }
  }

  return (
    <div className="w-full">
      <motion.div
        className="page-container py-8 md:py-12"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      >

        {/* Title + Name */}
        <motion.div
          className="mb-8 md:mb-10"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } }}
        >
          <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground mb-6 md:mb-8">
            NSW Advance Care Directive
          </h1>
          <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
            Full name
          </p>
          <p className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
            {signedName}
          </p>
        </motion.div>

        {/* Microcopy */}
        <motion.div
          className="flex flex-col gap-4 max-w-xl mb-8"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } }}
        >
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            {firstName} has prepared this advance care directive to make their values and medical wishes known. It sets out the care they want to receive — and the care they don't — if they are ever unable to speak for themselves.
          </p>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            These decisions were made thoughtfully and freely. They reflect what matters most to {firstName} and should be honoured by anyone involved in their care.
          </p>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            This document was completed on {formattedDate}.
          </p>
        </motion.div>

        {/* Revise link */}
        {onRevise && (
          <motion.div
            className="max-w-xl mb-10 md:mb-14"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } }}
          >
            <button
              onClick={onRevise}
              className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] underline underline-offset-2"
            >
              Changed your mind? Revise your answers
            </button>
          </motion.div>
        )}

        {/* Q&A answers */}
        <motion.div
          className="flex flex-col divide-y divide-border-emphasis mb-12 md:mb-16"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } }}
        >
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
        </motion.div>

        {/* Signatures section */}
        <motion.div
          className="border-t border-border-emphasis pt-10 flex flex-col gap-10"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } }}
        >
          {/* Signer */}
          <div className="flex flex-col gap-2 max-w-xs">
            <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
              Signed by
            </p>
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

          {/* Witness */}
          {sessionId && (
            <div className="flex flex-col gap-2 max-w-xs">
              <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
                Witnessed by
              </p>
              <div className="h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <p className="[font-size:var(--text-xs)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                  No witness yet
                </p>
              </div>
              <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed mt-1">
                Share a link for your witness to sign on their own device, or open it together now.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <OutlineButton
                  onClick={handleShareWitness}
                  icon={<Link2 size={16} strokeWidth={ICON_STROKE_WIDTH} />}
                  className="w-full h-11 font-[family-name:var(--font-family-body)]"
                >
                  Share witness link
                </OutlineButton>
                <a
                  href={`/signed/${sessionId}/witness`}
                  className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] text-center py-1"
                >
                  Open now →
                </a>
              </div>
            </div>
          )}
        </motion.div>

        {/* Share directive */}
        {sessionId && directiveUrl && (
          <motion.div
            className="flex flex-col gap-3 pt-10 border-t border-border max-w-xl"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } }}
          >
            <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
              Share your directive
            </p>
            <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
              Send this link to your doctor, family, or healthcare team. Keep it somewhere safe — it's the only way to return to this directive.
            </p>
            <div className="btn-group mt-1">
              <div className="flex-1 flex items-center h-11 px-3 rounded-lg border border-border bg-muted/40 min-w-0">
                <span className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] truncate">
                  {directiveUrl}
                </span>
              </div>
              <OutlineButton
                onClick={handleCopyDirective}
                icon={copied ? <Check size={15} strokeWidth={ICON_STROKE_WIDTH} /> : <Copy size={15} strokeWidth={ICON_STROKE_WIDTH} />}
                className="h-11 shrink-0 font-[family-name:var(--font-family-body)]"
              >
                {copied ? 'Copied' : 'Copy'}
              </OutlineButton>
              <a
                href={`mailto:?subject=My NSW Advance Care Directive&body=Here is a link to my advance care directive:%0A%0A${encodeURIComponent(directiveUrl)}`}
                className="h-11 shrink-0 flex items-center gap-1.5 px-4 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors [font-size:var(--text-sm)] font-[family-name:var(--font-family-body)]"
              >
                <Mail size={15} strokeWidth={ICON_STROKE_WIDTH} />
                Email
              </a>
            </div>
          </motion.div>
        )}

      </motion.div>
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
      <div className="page-container flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">

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
