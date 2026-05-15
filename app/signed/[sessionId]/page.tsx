'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabase'
import { Printer, Share2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface SignatureRecord {
  signed_name: string
  signature_url: string
  signed_at: string
}

interface WitnessRecord {
  witness_name: string
  witness_signature_url: string
  witnessed_at: string
}

interface Response {
  question_id: string
  answer_option_id: string
  free_text_note: string | null
}

interface Question {
  id: string
  question_text: string
  caption: string | null
  display_order: number
}

interface AnswerOption {
  id: string
  question_id: string
  option_text: string
}

export default function SignedPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const sigBg = mounted && resolvedTheme === 'dark' ? '#3F384F' : '#D8CDE9'
  const [signature, setSignature] = useState<SignatureRecord | null>(null)
  const [witness, setWitness] = useState<WitnessRecord | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    async function load() {
      const [
        { data: sigData },
        { data: witnessData },
        { data: rawResponses, error: responsesError },
        { data: qs },
        { data: opts },
      ] = await Promise.all([
        supabase
          .from('signatures')
          .select('signed_name, signature_url, signed_at')
          .eq('session_id', sessionId)
          .order('signed_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('witness_signatures')
          .select('witness_name, witness_signature_url, witnessed_at')
          .eq('session_id', sessionId)
          .maybeSingle(),
        supabase
          .from('user_responses')
          .select('question_id, answer_option_id, free_text_note, created_at')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false }),
        supabase
          .from('questions')
          .select('id, question_text, caption, display_order')
          .order('display_order', { ascending: true }),
        supabase.from('answer_options').select('id, question_id, option_text'),
      ])

      if (responsesError || !rawResponses || rawResponses.length === 0) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const seen = new Set<string>()
      const deduped = rawResponses.filter(r => {
        if (seen.has(r.question_id)) return false
        seen.add(r.question_id)
        return true
      })

      setSignature(sigData ?? null)
      setWitness(witnessData ?? null)
      setResponses(deduped)
      setQuestions(qs ?? [])
      setAnswerOptions(opts ?? [])
      setLoading(false)
    }

    if (sessionId) load()
  }, [sessionId])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: 'My Advance Care Directive', url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-[family-name:var(--font-family-body)]">Loading…</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-foreground font-[family-name:var(--font-family-body)]">No directive found for this link.</p>
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">The link may be incorrect or the session has expired.</p>
        </div>
      </div>
    )
  }

  const firstName = signature?.signed_name.split(' ')[0] ?? ''
  const signedDate = signature
    ? new Date(signature.signed_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const witnessedDate = witness
    ? new Date(witness.witnessed_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="w-full border-b border-border bg-muted print:hidden">
        <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 h-14 flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)]"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)]"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >

          {/* Title + name */}
          <div className="mb-10">
            <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground mb-6">
              NSW Advance Care Directive
            </h1>
            {signature && (
              <>
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
                  Full name
                </p>
                <p className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
                  {signature.signed_name}
                </p>
              </>
            )}
          </div>

          {/* Microcopy */}
          {signature && (
            <div className="flex flex-col gap-4 mb-10">
              <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                {firstName} has prepared this advance care directive to make their values and medical wishes known. It sets out the care they want to receive — and the care they don't — if they are ever unable to speak for themselves.
              </p>
              <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                These decisions were made thoughtfully and freely. They reflect what matters most to {firstName} and should be honoured by anyone involved in their care.
              </p>
              <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                This document was completed on {signedDate}.
              </p>
            </div>
          )}

          {/* Q&A */}
          <motion.div
            className="flex flex-col divide-y divide-border mb-12"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }}
          >
            {questions.map(question => {
              const response = responses.find(r => r.question_id === question.id)
              const selectedOption = answerOptions.find(o => o.id === response?.answer_option_id)

              return (
                <motion.div
                  key={question.id}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } } }}
                  className="py-6 flex flex-col gap-1.5"
                >
                  {question.caption && (
                    <p className="[font-size:var(--text-xs)] uppercase text-muted-foreground font-[family-name:var(--font-family-body)] tracking-wide">
                      {question.caption}
                    </p>
                  )}
                  <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                    {question.question_text}
                  </p>
                  {selectedOption ? (
                    <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)]">
                      {selectedOption.option_text}
                    </p>
                  ) : (
                    <p className="[font-size:var(--text-base)] text-muted-foreground italic font-[family-name:var(--font-family-body)]">
                      Not answered
                    </p>
                  )}
                  {response?.free_text_note && (
                    <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] mt-1">
                      Note: {response.free_text_note}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Signatures */}
          <div className="border-t border-border pt-10 flex flex-col gap-10">

            {/* Signer */}
            {signature && (
              <div className="flex flex-col gap-2 max-w-xs">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
                  Signed by
                </p>
                <div className="h-28 rounded-lg border border-border overflow-hidden" style={{ background: sigBg }}>
                  <img
                    src={signature.signature_url}
                    alt={`Signature of ${signature.signed_name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)] mt-1">
                  {signature.signed_name}
                </p>
                <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                  {signedDate}
                </p>
              </div>
            )}

            {/* Witness block or CTA */}
            {witness ? (
              <div className="flex flex-col gap-2 max-w-xs">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] mb-1">
                  Witnessed by
                </p>
                <div className="h-28 rounded-lg border border-border overflow-hidden" style={{ background: sigBg }}>
                  <img
                    src={witness.witness_signature_url}
                    alt={`Signature of ${witness.witness_name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)] mt-1">
                  {witness.witness_name}
                </p>
                <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                  {witnessedDate}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                  Witness
                </p>
                <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed max-w-sm">
                  This directive has not yet been witnessed. Witnessing is not legally required in NSW, but is strongly recommended.
                </p>
                <Link
                  href={`/signed/${sessionId}/witness`}
                  className="[font-size:var(--text-sm)] font-medium text-primary underline underline-offset-2 hover:no-underline font-[family-name:var(--font-family-body)] w-fit"
                >
                  Witness this directive →
                </Link>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </div>
  )
}
