'use client'

import { QuestionCard } from '@/features/qa/components/QuestionCard'
import { QuestionCard as QuestionHeaderCard } from '@/components/ui/question-card'
import { useQuestions } from '@/features/qa/hooks/useQuestions'
import { useResponseSubmit } from '@/features/qa/hooks/useResponseSubmit'
import { useProgressAutoSave } from '@/features/qa/hooks/useProgressAutoSave'
import { BreathingOverlay } from '@/features/qa/components/BreathingOverlay'
import { TellMeMoreModal } from '@/features/qa/components/TellMeMoreModal'
import { Button } from '@/components/ui/button'
import { Info, Feather, Wind, X } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState, useRef, useEffect } from 'react'
import { useScrollDirection } from '@/lib/hooks/useScrollDirection'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function QAPage() {
  const { questions, loading, error } = useQuestions()
  const { submitResponse, submitting, error: submitError } = useResponseSubmit()
  const { saveProgress } = useProgressAutoSave()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showBreathing, setShowBreathing] = useState(false)
  const [showTellMeMore, setShowTellMeMore] = useState(false)
  const scrollDirection = useScrollDirection(10)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)

  // Focus management when question changes
  useEffect(() => {
    if (questionHeadingRef.current) {
      questionHeadingRef.current.focus()
    }
  }, [currentQuestionIndex])

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

  const handlePause = () => {
    // Save progress to localStorage
    saveProgress({
      currentQuestionIndex,
      responses,
      timestamp: new Date().toISOString()
    })
    // Open breathing overlay
    setShowBreathing(true)
  }

  const handleClose = () => {
    // Save progress before closing
    saveProgress({
      currentQuestionIndex,
      responses,
      timestamp: new Date().toISOString()
    })
    // Navigate back or to home page
    window.history.back()
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
      {/* App Bar - Mobile: 48px, Desktop: 56px - Hides on scroll down (mobile only) */}
      <div className={`w-full flex items-center justify-between h-12 md:h-14 px-5 md:px-8 border-b border-border shrink-0 sticky top-0 z-50 bg-muted transition-transform duration-300 ease-in-out ${
        scrollDirection === 'down' ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
      }`}>
        <div className="text-sm md:text-base text-foreground" aria-live="polite" aria-atomic="true">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-5 md:gap-8 shrink-0">
          <SettingsPanel>
            <Button
              variant="ghost-subtle"
              size="icon"
              className="w-8 h-8 p-0 font-[family-name:var(--font-family-display)] text-xl font-medium"
              aria-label="Settings"
            >
              Aa
            </Button>
          </SettingsPanel>
          <Button
            variant="ghost-subtle"
            size="icon"
            onClick={handleClose}
            className="w-8 h-8 p-0"
            aria-label="Close"
          >
            <X size={24} className="text-foreground md:hidden" strokeWidth={ICON_STROKE_WIDTH} />
            <X size={32} className="text-foreground hidden md:block" strokeWidth={ICON_STROKE_WIDTH} />
          </Button>
        </div>
      </div>

      {/* Success Message - Announced to screen readers */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed top-20 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto">
        {/* Mobile: Use QuestionHeaderCard component - extends to edges */}
        <div className="md:hidden w-full">
          <QuestionHeaderCard
            caption={currentQuestion.caption || "VALUES AND WHAT MATTERS"}
            title={currentQuestion.question_text}
            size="small"
            showImage={!!currentQuestion.image_url}
            imageUrl={currentQuestion.image_url || undefined}
            roundedHeader={false}
            onLearnMoreClick={currentQuestion.tell_me_more ? () => setShowTellMeMore(true) : undefined}
          />
        </div>

        {/* Desktop: Header Question Card with gradient background - extends to edges */}
        <div className="hidden md:block w-full question-card-gradient py-6" data-size="small">
          <div className="w-full flex flex-col gap-6 px-8 lg:px-32 xl:px-60">
            {/* Caption */}
            <p className="[font-size:var(--text-sm)] uppercase leading-none text-foreground font-[family-name:var(--font-family-body)]">
              {currentQuestion.caption || "VALUES AND WHAT MATTERS"}
            </p>

            <h1
              ref={questionHeadingRef}
              tabIndex={-1}
              className="w-full [font-size:var(--text-h1-lg)] [line-height:var(--leading-h1-lg)] text-foreground font-[family-name:var(--font-family-display)] focus:outline-none"
            >
              {currentQuestion.question_text}
            </h1>

            {currentQuestion.tell_me_more && (
              <Button
                variant="ghost-subtle"
                onClick={() => setShowTellMeMore(true)}
                className="self-start h-auto px-0 py-0 [font-size:var(--text-base)]"
              >
                <Info size={24} />
                <span className="font-[family-name:var(--font-family-body)]">Tell me more</span>
              </Button>
            )}
          </div>
        </div>

        {/* Question Options and Actions - Responsive margins: 20px → 32px → 128px → 240px */}
        <div className="w-full px-5 md:px-8 lg:px-32 xl:px-60 py-5 md:py-8">
          {/* Desktop: two-column layout (image + content), Mobile: single column */}
          <div className="w-full flex flex-col md:flex-row gap-0 md:gap-6 lg:gap-8 xl:gap-10">
            {/* Desktop Image - Left sidebar, scales responsively */}
            {currentQuestion.image_url && (
              <div className="hidden md:block md:w-[280px] md:h-[280px] lg:w-[360px] lg:h-[360px] xl:w-[428px] xl:h-[428px] rounded-b-full overflow-hidden relative shrink-0">
                <img
                  src={currentQuestion.image_url}
                  alt="Question illustration"
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

              {/* Journal and Breathe Buttons - Responsive gap */}
              <div className="w-full flex gap-4 md:gap-5 lg:gap-6">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 min-w-0"
                  aria-label="Journal"
                >
                  <Feather strokeWidth={ICON_STROKE_WIDTH} />
                  <span className="hidden sm:inline">Journal</span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 min-w-0"
                  onClick={handlePause}
                  aria-label="Breathe"
                >
                  <Wind strokeWidth={ICON_STROKE_WIDTH} />
                  <span className="hidden sm:inline">Breathe</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Mobile: padding 20px, Desktop: padding 32px */}
      <div className="w-full border-t border-border px-5 md:px-8 py-5 shrink-0">
        {/* Mobile: Full width equal buttons, Desktop: standard */}
        <div className="w-full flex items-center gap-3 md:justify-end md:gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="flex-1 md:flex-none"
          >
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!hasSelectedAnswer}
            className="flex-1 md:flex-none"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Breathing Exercise Overlay */}
      <BreathingOverlay
        open={showBreathing}
        onClose={() => setShowBreathing(false)}
      />

      {/* Tell Me More Modal */}
      <TellMeMoreModal
        open={showTellMeMore}
        onOpenChange={setShowTellMeMore}
        questionText={currentQuestion.question_text}
        tellMeMoreContent={currentQuestion.tell_me_more}
      />
    </div>
  )
}
