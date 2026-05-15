'use client'

import { QuestionCard } from '@/features/qa/components/QuestionCard'
import { QuestionCard as QuestionHeaderCard } from '@/components/ui/question-card'
import { useQuestions } from '@/features/qa/hooks/useQuestions'
import { useResponseSubmit } from '@/features/qa/hooks/useResponseSubmit'
import { useProgressAutoSave } from '@/features/qa/hooks/useProgressAutoSave'
import { BreathingOverlay } from '@/features/qa/components/BreathingOverlay'
import { TellMeMoreModal } from '@/features/qa/components/TellMeMoreModal'
import { SummaryScreen, SummaryFooter } from '@/features/qa/components/SummaryScreen'
import { FinaliseScreen, FinaliseFooter } from '@/features/qa/components/FinaliseScreen'
import { SignedScreen, SignedFooter } from '@/features/qa/components/SignedScreen'
import { useSessionId } from '@/features/qa/hooks/useSessionId'
import { useSignature } from '@/features/qa/hooks/useSignature'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Info, Wind, Sun, Moon } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export default function QAPage() {
  const { questions, loading, error } = useQuestions()
  const { submitResponse, submitting, error: submitError } = useResponseSubmit()
  const { resolvedTheme, setTheme } = useTheme()
  const sessionId = useSessionId()
  const { saveProgress } = useProgressAutoSave()
  const { save: saveSignature } = useSignature()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showBreathing, setShowBreathing] = useState(false)
  const [showTellMeMore, setShowTellMeMore] = useState(false)
  const [desktopImageLoaded, setDesktopImageLoaded] = useState(false)
  const [breathePulse, setBreathePulse] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showFinalise, setShowFinalise] = useState(false)
  const [editingFromSummary, setEditingFromSummary] = useState(false)
  const [finaliseName, setFinaliseName] = useState('')
  const [finaliseSignature, setFinaliseSignature] = useState<string | null>(null)
  const [finaliseConsented, setFinaliseConsented] = useState(false)
  const [finalising, setFinalising] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [signedAt, setSignedAt] = useState('')
  const [downloading, setDownloading] = useState(false)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)
  const questionScrollRef = useRef<HTMLDivElement>(null)
  const summaryScrollRef = useRef<HTMLDivElement>(null)

  // Define currentQuestion early so it can be used in useEffect hooks
  const currentQuestion = questions[currentQuestionIndex]

  // Scroll to top and focus heading when question changes
  useEffect(() => {
    if (questionScrollRef.current) questionScrollRef.current.scrollTop = 0
    if (questionHeadingRef.current) {
      questionHeadingRef.current.focus()
    }
  }, [currentQuestionIndex])

  useEffect(() => {
    if (showSummary && summaryScrollRef.current) summaryScrollRef.current.scrollTop = 0
  }, [showSummary])

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

    if (!success) {
      toast.error('Failed to save response. Please try again.')
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

  const handleFinalise = () => {
    setShowSummary(false)
    setShowFinalise(true)
  }

  const handleFinaliseBack = () => {
    setShowFinalise(false)
    setShowSummary(true)
  }

  const buildAnswers = () =>
    questions.map(q => ({
      caption: q.caption,
      question: q.question_text,
      answer: q.answer_options.find(o => o.id === responses[q.id])?.option_text ?? 'Not answered',
    }))

  const downloadPDF = async (name: string, signature: string, timestamp: string) => {
    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: buildAnswers(),
        signedName: name,
        signatureDataUrl: signature,
        signedAt: timestamp,
      }),
    })
    if (!res.ok) throw new Error('PDF generation failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `advance-care-directive-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFinaliseComplete = async () => {
    if (!finaliseSignature) return
    setFinalising(true)
    const timestamp = new Date().toISOString()

    if (sessionId) {
      saveSignature({ sessionId, signedName: finaliseName, signatureDataUrl: finaliseSignature })
    }

    try {
      await downloadPDF(finaliseName, finaliseSignature, timestamp)
      setSignedAt(timestamp)
      setShowFinalise(false)
      setShowDone(true)
    } catch {
      toast.error('Could not generate your PDF. Please try again.')
    } finally {
      setFinalising(false)
    }
  }

  const handleDoneDownload = async () => {
    if (!finaliseSignature) return
    setDownloading(true)
    try {
      await downloadPDF(finaliseName, finaliseSignature, signedAt)
    } catch {
      toast.error('Could not download your PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleRevise = () => {
    setShowDone(false)
    setShowSummary(true)
    setFinaliseName('')
    setFinaliseSignature(null)
    setFinaliseConsented(false)
    setSignedAt('')
  }

  const handleDoneShare = async () => {
    const url = `${window.location.origin}/signed/${sessionId}`
    if (navigator.share) {
      await navigator.share({ title: 'My Advance Care Directive', url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
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
    <div className="h-screen w-full flex flex-col bg-background overflow-x-hidden">
      {/* App Bar - Mobile: 48px, Desktop: 56px - Hides on scroll down (mobile only) */}
      <div className="w-full flex items-center justify-between h-12 md:h-14 px-5 md:px-8 border-b border-border shrink-0 sticky top-0 z-50 bg-muted">
        <div className="text-sm md:text-base text-foreground" aria-live="polite" aria-atomic="true">
          {showDone ? 'Signed' : showFinalise ? 'Sign' : showSummary ? 'Complete' : `${currentQuestionIndex + 1} of ${questions.length}`}
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
        </div>
      </div>

      {/* Main Content */}
      {showDone && finaliseSignature ? (
        <div className="flex-1 w-full overflow-y-auto overscroll-y-none">
          <SignedScreen
            signedName={finaliseName}
            signatureDataUrl={finaliseSignature}
            signedAt={signedAt}
            questions={questions}
            responses={responses}
            onRevise={handleRevise}
            sessionId={sessionId ?? undefined}
          />
        </div>
      ) : showFinalise ? (
        <div className="flex-1 w-full overflow-y-auto overscroll-y-none">
          <FinaliseScreen
            name={finaliseName}
            onNameChange={setFinaliseName}
            onSignatureChange={setFinaliseSignature}
            consented={finaliseConsented}
            onConsentChange={setFinaliseConsented}
          />
        </div>
      ) : showSummary ? (
        <div ref={summaryScrollRef} className="flex-1 w-full overflow-y-auto overscroll-y-none">
          <SummaryScreen
            questions={questions}
            responses={responses}
            onEdit={handleEditFromSummary}
          />
        </div>
      ) : (
        <div ref={questionScrollRef} className="flex-1 w-full overflow-y-auto overscroll-y-none md:pb-24">
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
      {showDone ? (
        <SignedFooter
          onDownload={handleDoneDownload}
          onPrint={() => window.print()}
          onShare={handleDoneShare}
          downloading={downloading}
        />
      ) : showFinalise ? (
        <FinaliseFooter
          onBack={handleFinaliseBack}
          onSubmit={handleFinaliseComplete}
          canSubmit={finaliseName.trim().length > 0 && finaliseSignature !== null && finaliseConsented}
          loading={finalising}
        />
      ) : showSummary ? (
        <SummaryFooter
          onShare={handleShare}
          onPrint={() => window.print()}
          onFinalise={handleFinalise}
        />
      ) : (
        <div className="w-full border-t border-border-emphasis py-5 shrink-0 md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40 bg-background">
          <div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-end">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!hasSelectedAnswer}
              className="w-full md:w-auto md:order-2 h-12 md:h-11"
            >
              {editingFromSummary ? 'Back to summary' : currentQuestionIndex === questions.length - 1 ? 'Review answers' : 'Continue'}
            </Button>
            {currentQuestionIndex > 0 && !editingFromSummary && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="w-full md:w-auto md:order-1 h-12 md:h-11 text-muted-foreground"
              >
                Back
              </Button>
            )}
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
