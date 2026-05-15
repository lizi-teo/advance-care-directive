'use client'

import { QuestionCard } from '@/features/qa/components/QuestionCard'
import { QuestionCard as QuestionHeaderCard } from '@/components/ui/question-card'
import { useQuestions } from '@/features/qa/hooks/useQuestions'
import { useResponseSubmit } from '@/features/qa/hooks/useResponseSubmit'
import { useProgressAutoSave } from '@/features/qa/hooks/useProgressAutoSave'
import { BreathingOverlay } from '@/features/qa/components/BreathingOverlay'
import { TellMeMoreModal } from '@/features/qa/components/TellMeMoreModal'
import { SummaryScreen, SummaryFooter } from '@/features/qa/components/SummaryScreen'
import { useSessionId } from '@/features/qa/hooks/useSessionId'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Info, Wind, X, Sun, Moon } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useScrollDirection } from '@/lib/hooks/useScrollDirection'
import { toast } from 'sonner'

export default function QAPage() {
  const { questions, loading, error } = useQuestions()
  const { submitResponse, submitting, error: submitError } = useResponseSubmit()
  const { resolvedTheme, setTheme } = useTheme()
  const sessionId = useSessionId()
  const { saveProgress } = useProgressAutoSave()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showBreathing, setShowBreathing] = useState(false)
  const [showTellMeMore, setShowTellMeMore] = useState(false)
  const [desktopImageLoaded, setDesktopImageLoaded] = useState(false)
  const [breathePulse, setBreathePulse] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [editingFromSummary, setEditingFromSummary] = useState(false)
  const scrollDirection = useScrollDirection(10)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)

  // Define currentQuestion early so it can be used in useEffect hooks
  const currentQuestion = questions[currentQuestionIndex]

  // Focus management when question changes
  useEffect(() => {
    if (questionHeadingRef.current) {
      questionHeadingRef.current.focus()
    }
  }, [currentQuestionIndex])

  // Reset image loading state when question changes
  useEffect(() => {
    if (currentQuestion?.image_url) {
      setDesktopImageLoaded(false)
    }
  }, [currentQuestion?.image_url])

  // Pulse the breathe button after 10s idle on a question
  useEffect(() => {
    setBreathePulse(false)
    const timer = setTimeout(() => setBreathePulse(true), 10000)
    return () => clearTimeout(timer)
  }, [currentQuestionIndex])

  const handleAnswerSelect = async (questionId: string, answerOptionId: string, note?: string) => {
    // Update local state
    setResponses(prev => ({ ...prev, [questionId]: answerOptionId }))

    // Submit to database
    const success = await submitResponse(questionId, answerOptionId, note, sessionId)

    if (success) {
      toast.success('Response saved!')
    }
  }

  const handleContinue = () => {
    if (editingFromSummary) {
      setEditingFromSummary(false)
      setShowSummary(true)
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handleEditFromSummary = (questionIndex: number) => {
    setShowSummary(false)
    setEditingFromSummary(true)
    setCurrentQuestionIndex(questionIndex)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/summary/${sessionId}`
    if (navigator.share) {
      await navigator.share({ title: 'My Advance Care Directive', url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handlePause = () => {
    setBreathePulse(false)
    saveProgress({
      currentQuestionIndex,
      responses,
      timestamp: new Date().toISOString()
    })
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

  // Safety check for currentQuestion
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-foreground">Loading question...</p>
      </div>
    )
  }

  const hasSelectedAnswer = !!responses[currentQuestion.id]

  return (
    <div className="min-h-screen w-full flex flex-col bg-background overflow-x-hidden">
      {/* App Bar - Mobile: 48px, Desktop: 56px - Hides on scroll down (mobile only) */}
      <div className={`w-full flex items-center justify-between h-12 md:h-14 px-5 md:px-8 border-b border-border shrink-0 sticky top-0 z-50 bg-muted transition-transform duration-300 ease-in-out ${
        scrollDirection === 'down' ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
      }`}>
        <div className="text-sm md:text-base text-foreground" aria-live="polite" aria-atomic="true">
          {showSummary ? 'Complete' : `${currentQuestionIndex + 1} of ${questions.length}`}
        </div>
        <div className="flex items-center gap-5 md:gap-6 shrink-0">
          <Button
            variant="ghost-subtle"
            size="icon"
            onClick={handlePause}
            className={`w-8 h-8 p-0 md:w-auto md:h-auto md:px-2 md:gap-1.5 ${breathePulse ? 'animate-breathe-pulse' : ''}`}
            aria-label="Breathe"
          >
            <Wind size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
            <Wind size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
            <span className="hidden md:inline text-sm font-[family-name:var(--font-family-body)]">Breathe</span>
          </Button>
<Button
            variant="ghost-subtle"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 p-0 md:w-auto md:h-auto md:px-2 md:gap-1.5"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <>
                <Sun size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
                <Sun size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
              </>
            ) : (
              <>
                <Moon size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
                <Moon size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
              </>
            )}
            <span className="hidden md:inline text-sm font-[family-name:var(--font-family-body)]">
              {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </Button>
          <Button
            variant="ghost-subtle"
            size="icon"
            onClick={handleClose}
            className="w-8 h-8 p-0"
            aria-label="Close"
          >
            <X size={24} className="text-foreground md:hidden" strokeWidth={ICON_STROKE_WIDTH} />
            <X size={20} className="text-foreground hidden md:block" strokeWidth={ICON_STROKE_WIDTH} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {showSummary ? (
        <SummaryScreen
          questions={questions}
          responses={responses}
          onEdit={handleEditFromSummary}
        />
      ) : (
        <div className="flex-1 w-full overflow-y-auto md:pb-24">
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
            <div className="w-full max-w-[1440px] mx-auto flex flex-col px-8 lg:px-12">
              <p className="[font-size:var(--text-sm)] uppercase leading-none text-foreground font-[family-name:var(--font-family-body)] mb-6">
                {currentQuestion.caption || "VALUES AND WHAT MATTERS"}
              </p>
              <h1
                ref={questionHeadingRef}
                tabIndex={-1}
                className="w-full [font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] text-foreground font-[family-name:var(--font-family-display)] focus:outline-none"
              >
                {currentQuestion.question_text}
              </h1>
              {currentQuestion.tell_me_more && (
                <Button
                  variant="ghost-subtle"
                  onClick={() => setShowTellMeMore(true)}
                  className="self-start h-auto px-0 py-0 [font-size:var(--text-base)] mt-6"
                >
                  <Info size={24} strokeWidth={ICON_STROKE_WIDTH} />
                  <span className="font-[family-name:var(--font-family-body)]">Learn more</span>
                </Button>
              )}
            </div>
          </div>

          {/* Question Options and Actions */}
          <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 py-5 md:py-8">
            <div className="w-full flex flex-col md:flex-row gap-0 md:gap-6 lg:gap-8 xl:gap-10">
              {currentQuestion.image_url && (
                <div className="hidden md:block md:w-[280px] md:h-[280px] lg:w-[360px] lg:h-[360px] xl:w-[428px] xl:h-[428px] rounded-b-full overflow-hidden relative shrink-0">
                  {!desktopImageLoaded && (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-b-full" />
                  )}
                  <img
                    src={currentQuestion.image_url}
                    alt="Question illustration"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      desktopImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setDesktopImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
                </div>
              )}
              <div className="w-full flex-1 space-y-6 lg:space-y-8 min-w-0">
                <QuestionCard
                  question={currentQuestion}
                  onAnswerSelect={handleAnswerSelect}
                  selectedAnswerId={responses[currentQuestion.id]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {showSummary ? (
        <SummaryFooter
          onShare={handleShare}
          onPrint={() => window.print()}
        />
      ) : (
        <div className="w-full border-t border-border-emphasis py-5 shrink-0 md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40 bg-background">
          <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 flex items-center gap-3 md:justify-end md:gap-4">
            {currentQuestionIndex > 0 && !editingFromSummary && (
              <Button
                variant="ghost"
                size="lg"
                onClick={handleBack}
                className="flex-1 md:flex-none"
              >
                Back
              </Button>
            )}
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!hasSelectedAnswer}
              className="flex-1 md:flex-none"
            >
              {editingFromSummary ? 'Back to summary' : currentQuestionIndex === questions.length - 1 ? 'Review answers' : 'Continue'}
            </Button>
          </div>
        </div>
      )}

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
