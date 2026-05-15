'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Printer } from 'lucide-react'

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
        <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 h-14 flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            Advance Care Directive
          </p>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] print:hidden"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-2xl">
          <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground mb-2">
            Advance Care Directive
          </h1>
          <p className="text-muted-foreground [font-size:var(--text-base)] font-[family-name:var(--font-family-body)] mb-10">
            A summary of values and treatment preferences.
          </p>

          <div className="flex flex-col divide-y divide-border">
            {questions.map((question) => {
              const response = responses.find(r => r.question_id === question.id)
              const selectedOption = answerOptions.find(o => o.id === response?.answer_option_id)

              return (
                <div key={question.id} className="py-6 flex flex-col gap-1.5">
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
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
