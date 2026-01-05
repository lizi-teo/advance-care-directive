'use client'

import { QuestionCard } from '@/features/qa/components/QuestionCard'
import { QuestionCard as QuestionHeaderCard } from '@/components/ui/question-card'
import { useQuestions } from '@/features/qa/hooks/useQuestions'
import { useResponseSubmit } from '@/features/qa/hooks/useResponseSubmit'
import { Button } from '@/components/ui/button'
import { Info, Feather, Sparkles, X } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState } from 'react'
import { useScrollDirection } from '@/lib/hooks/useScrollDirection'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function QAPage() {
  const { questions, loading, error } = useQuestions()
  const { submitResponse, submitting, error: submitError } = useResponseSubmit()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const scrollDirection = useScrollDirection(10)

  const handleAnswerSelect = async (questionId: string, answerOptionId: string, note?: string) => {
    // Update local state
    setResponses(prev => ({ ...prev, [questionId]: answerOptionId }))

    // Submit to database
    const success = await submitResponse(questionId, answerOptionId, note)

    if (success) {
      setSuccessMessage('Response saved!')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-foreground">Loading questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-5">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
          <h2 className="text-destructive font-semibold">Error loading questions</h2>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-5">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md">
          <h2 className="text-yellow-700 dark:text-yellow-500 font-semibold">No questions found</h2>
          <p className="text-yellow-600 dark:text-yellow-400">Please add some questions in your Supabase database.</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const hasSelectedAnswer = !!responses[currentQuestion.id]

  return (
    <div className="min-h-screen w-full flex flex-col bg-background overflow-x-hidden">
      {/* App Bar - Mobile: 56px, Desktop: 80px - Hides on scroll down (mobile only) */}
      <div className={`w-full flex items-center justify-between h-14 md:h-20 px-5 md:px-8 border-b border-border shrink-0 sticky top-0 z-50 bg-background transition-transform duration-300 ease-in-out ${
        scrollDirection === 'down' ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
      }`}>
        <div className="flex items-center gap-3 md:gap-5 text-sm text-foreground overflow-hidden">
          <div className="whitespace-nowrap">{currentQuestionIndex + 1} of {questions.length}</div>
          <div className="text-right truncate">
            Next: {currentQuestionIndex < questions.length - 1 ? questions[currentQuestionIndex + 1].caption || 'Question' : 'Complete'}
          </div>
        </div>
        <div className="flex items-center gap-5 md:gap-8 shrink-0">
          <SettingsPanel>
            <button className="w-8 h-8 flex items-center justify-center font-[family-name:var(--font-family-display)] text-xl font-medium text-foreground" aria-label="Settings">
              Aa
            </button>
          </SettingsPanel>
          <button className="w-8 h-8 flex items-center justify-center" aria-label="Close">
            <X size={32} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto">
        {/* Mobile: Use QuestionHeaderCard component - extends to edges */}
        <div className="md:hidden w-full">
          <QuestionHeaderCard
            caption={currentQuestion.caption || "VALUES AND WHAT MATTERS"}
            title={currentQuestion.question_text}
            size="small"
            showImage={!!currentQuestion.image_url}
            imageUrl={currentQuestion.image_url}
            roundedHeader={false}
          />
        </div>

        {/* Desktop: Header Question Card with gradient background - extends to edges */}
        <div className="hidden md:block w-full question-card-gradient py-8" data-size="small">
          <div className="w-full flex flex-col gap-5 lg:gap-6 xl:gap-8 px-8 lg:px-32 xl:px-60">
            {/* Caption */}
            <p className="text-sm uppercase leading-none text-foreground font-[family-name:var(--font-family-body)]">
              {currentQuestion.caption || "VALUES AND WHAT MATTERS"}
            </p>

            <h1 className="w-full text-4xl leading-[2.625rem] text-foreground font-[family-name:var(--font-family-display)]">
              {currentQuestion.question_text}
            </h1>

            <button className="flex items-center gap-2 text-foreground hover:opacity-80 self-start transition-opacity">
              <Info size={24} />
              <span className="text-base underline underline-offset-2 font-[family-name:var(--font-family-body)]">Tell me more</span>
            </button>
          </div>
        </div>

        {/* Question Options and Actions - Responsive margins: 20px → 32px → 128px → 240px */}
        <div className="w-full px-5 md:px-8 lg:px-32 xl:px-60 py-5 md:py-8">
          {/* Desktop: two-column layout (image + content), Mobile: single column */}
          <div className="w-full flex flex-col md:flex-row gap-0 md:gap-6 lg:gap-8 xl:gap-10">
            {/* Desktop Image - Left sidebar, scales responsively */}
            {currentQuestion.image_url && (
              <div className="hidden md:block md:w-[280px] md:h-[290px] lg:w-[360px] lg:h-[370px] xl:w-[428px] xl:h-[438px] rounded-b-full overflow-hidden relative shrink-0">
                <img
                  src={currentQuestion.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
              </div>
            )}

            {/* Question Card and Actions */}
            <div className="w-full flex-1 space-y-6 lg:space-y-8 min-w-0">
              <QuestionCard
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswerId={responses[currentQuestion.id]}
              />

              {/* Journal and Pause Buttons - Responsive gap */}
              <div className="w-full flex gap-4 md:gap-5 lg:gap-6">
                <Button
                  variant="secondary"
                  className="flex-1 h-12 rounded-full text-base min-w-0"
                >
                  <Feather strokeWidth={ICON_STROKE_WIDTH} />
                  <span className="hidden sm:inline">Journal</span>
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 h-12 rounded-full text-base min-w-0"
                >
                  <Sparkles strokeWidth={ICON_STROKE_WIDTH} />
                  <span className="hidden sm:inline">Pause</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Mobile: padding 20px, Desktop: padding 32px */}
      <div className="w-full border-t border-border px-5 md:px-8 py-5 shrink-0">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="h-12 px-5 md:px-8 text-base"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!hasSelectedAnswer}
            className="h-12 px-5 md:px-8 text-base"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
