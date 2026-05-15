import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Printer } from 'lucide-react'

interface PageProps {
  params: Promise<{ sessionId: string }>
}

async function getSessionResponses(sessionId: string) {
  const { data: responses, error } = await supabase
    .from('user_responses')
    .select('question_id, answer_option_id, free_text_note')
    .eq('session_id', sessionId)

  if (error || !responses || responses.length === 0) return null

  const { data: questions } = await supabase
    .from('questions')
    .select('id, question_text, caption, display_order')
    .order('display_order', { ascending: true })

  const { data: answerOptions } = await supabase
    .from('answer_options')
    .select('id, question_id, option_text')

  return { responses, questions: questions ?? [], answerOptions: answerOptions ?? [] }
}

export default async function SummaryPage({ params }: PageProps) {
  const { sessionId } = await params
  const data = await getSessionResponses(sessionId)

  if (!data) return notFound()

  const { responses, questions, answerOptions } = data

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
