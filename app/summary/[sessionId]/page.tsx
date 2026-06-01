'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import { supabase } from '@/lib/supabase'
import { InfoBox } from '@/components/ui/info-box'

interface Response {
  question_id: string
  answer_option_id: string
  free_text_note: string | null
  created_at: string
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

export default function SummaryPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [responses, setResponses] = useState<Response[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: rawResponses, error } = await supabase
        .from('user_responses')
        .select('question_id, answer_option_id, free_text_note, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })

      if (error || !rawResponses || rawResponses.length === 0) {
        setNotFound(true)
        setLoading(false)
        return
      }

      // Keep only the latest response per question
      const seen = new Set<string>()
      const deduped = rawResponses.filter(r => {
        if (seen.has(r.question_id)) return false
        seen.add(r.question_id)
        return true
      })

      const [{ data: qs }, { data: opts }] = await Promise.all([
        supabase.from('questions').select('id, question_text, caption, display_order').order('display_order', { ascending: true }),
        supabase.from('answer_options').select('id, question_id, option_text'),
      ])

      setResponses(deduped)
      setQuestions(qs ?? [])
      setAnswerOptions(opts ?? [])
      setLoading(false)
    }

    if (sessionId) load()
  }, [sessionId])

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
          <p className="text-foreground font-[family-name:var(--font-family-body)]">No responses found for this link.</p>
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">The link may be incorrect or the session has expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="w-full border-b border-border bg-muted">
        <div className="page-container h-14 flex items-center">
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            Advance Care Directive
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-8 md:py-12">
        <div className="max-w-2xl flex flex-col gap-10">
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
              Advance Care Directive
            </h1>
            <p className="text-muted-foreground [font-size:var(--text-base)] font-[family-name:var(--font-family-body)]">
              A summary of values and treatment preferences.
            </p>
          </motion.div>

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
                className="text-link underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                NSW Health →
              </a>
            </p>
          </InfoBox>

          <motion.div
            className="flex flex-col divide-y divide-border"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
          >
            {questions.map((question) => {
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
        </div>
      </div>
    </div>
  )
}
