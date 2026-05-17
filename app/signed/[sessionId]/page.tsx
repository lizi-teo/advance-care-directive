'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
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

  // Live witness notification — subscribe until a witness is recorded
  useEffect(() => {
    if (!sessionId || witness) return

    const channel = supabase
      .channel(`witness-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'witness_signatures', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const incoming = payload.new as WitnessRecord
          setWitness(incoming)
          toast.success(`${incoming.witness_name} has witnessed your directive`)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessionId, witness])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: 'My Advance Care Directive', url }) } catch (err) { if (err instanceof Error && err.name === 'AbortError') return }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const handleShareWitnessLink = async () => {
    const url = `${window.location.origin}/signed/${sessionId}/witness`
    if (navigator.share) {
      try { await navigator.share({ title: 'Witness my Advance Care Directive', url }) } catch (err) { if (err instanceof Error && err.name === 'AbortError') return }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Witness link copied to clipboard')
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
        <div className="page-container h-14 flex items-center justify-end gap-3">
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
      <div className="page-container py-10 md:py-16">
        <motion.div
          className="max-w-2xl flex flex-col gap-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >

          {/* Title + name */}
          <div className="flex flex-col gap-6">
            <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
              NSW Advance Care Directive
            </h1>
            {signature && (
              <div className="flex flex-col gap-1">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                  Full name
                </p>
                <p className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
                  {signature.signed_name}
                </p>
              </div>
            )}
          </div>

          {/* Microcopy */}
          {signature && (
            <div className="flex flex-col gap-4">
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
            className="flex flex-col divide-y divide-border"
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
          <div className="border-t border-border pt-10 grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Signer */}
            {signature && (
              <div className="flex flex-col gap-3 max-w-xs">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                  Signed by
                </p>
                <div className="h-28 rounded-lg border border-border overflow-hidden" style={{ background: sigBg }}>
                  <img
                    src={signature.signature_url}
                    alt={`Signature of ${signature.signed_name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)]">
                    {signature.signed_name}
                  </p>
                  <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                    {signedDate}
                  </p>
                </div>
              </div>
            )}

            {/* Witness block or CTA */}
            {witness ? (
              <AnimatePresence>
                <motion.div
                  key="witnessed"
                  className="flex flex-col gap-3 max-w-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                    Witnessed by
                  </p>
                  <div className="h-28 rounded-lg border border-border overflow-hidden" style={{ background: sigBg }}>
                    <img
                      src={witness.witness_signature_url}
                      alt={`Signature of ${witness.witness_name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)]">
                      {witness.witness_name}
                    </p>
                    <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)]">
                      {witnessedDate}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                  Witnessed by
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)]">
                      No witness yet
                    </p>
                    <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                      Share a link for your witness to sign on their own device, or open it together now.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 pt-2 pb-2">
                    <button
                      onClick={handleShareWitnessLink}
                      className="[font-size:var(--text-sm)] font-medium text-link underline underline-offset-2 hover:no-underline font-[family-name:var(--font-family-body)] text-left"
                    >
                      Share witness link
                    </button>
                    <Link
                      href={`/signed/${sessionId}/witness`}
                      className="[font-size:var(--text-sm)] font-medium text-link underline underline-offset-2 hover:no-underline font-[family-name:var(--font-family-body)]"
                    >
                      Open now
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </div>
  )
}
