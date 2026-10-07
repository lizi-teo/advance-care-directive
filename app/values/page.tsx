'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { QuestionCard as QuestionHeaderCard } from '@/components/ui/question-card'
import { cn } from '@/lib/utils'
import { useSessionId } from '@/features/qa/hooks/useSessionId'
import { useValuesSubmit } from '@/features/values/hooks/useValuesSubmit'
import { useValuesCategories } from '@/features/values/hooks/useValuesCategories'
import { toast } from 'sonner'

export default function ValuesPage() {
  const router = useRouter()
  const sessionId = useSessionId()
  const { submitValues, submitting } = useValuesSubmit()
  const { categories, loading } = useValuesCategories()
  const reduceMotion = useReducedMotion()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  // Bring back earlier picks when someone returns here from the questions
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qa-values')
      if (!stored) return
      const parsed = JSON.parse(stored)
      // Read after mount (not in useState) so the server and first client render match
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(parsed?.words)) setSelected(new Set(parsed.words))
      if (typeof parsed?.note === 'string') setNote(parsed.note)
    } catch {}
  }, [])

  const toggleWord = (word: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  const handleSave = async () => {
    const words = Array.from(selected)

    if (words.length === 0) {
      localStorage.removeItem('qa-values')
      router.push('/qa')
      return
    }

    const byCategory = categories
      .map(c => ({ category: c.name, words: c.words.map(w => w.word).filter(w => selected.has(w)) }))
      .filter(c => c.words.length > 0)

    localStorage.setItem('qa-values', JSON.stringify({ words, byCategory, note: note || undefined }))

    if (sessionId) {
      const ok = await submitValues(sessionId, words, byCategory, note || undefined)
      if (!ok) {
        toast.error('Your values are saved on this device, but could not be backed up. Please try again later.')
      }
    }

    router.push('/qa')
  }

  const handleSkip = () => {
    localStorage.removeItem('qa-values')
    router.push('/qa')
  }

  const selectedCount = selected.size
  const activeCategory = categories[activeCategoryIndex]
  const canGoBack = activeCategoryIndex > 0
  const canGoNext = activeCategoryIndex < categories.length - 1
  const motionDuration = reduceMotion ? 0 : 0.22

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppBar />

      <main className="flex-1 overflow-y-auto">
        {/* Mobile: full-width header card with image at top (matches QA page) */}
        <div className="md:hidden">
          <QuestionHeaderCard
            caption="Values warm-up"
            title="What matters to you?"
            size="small"
            showImage
            imageUrl="/images/values.png"
            imageClassName="object-top"
            roundedHeader={false}
            className="pb-10"
          />
        </div>

        {/* Desktop: gradient header */}
        <div className="hidden md:block w-full py-6 question-card-gradient" data-size="large">
          <div className="page-container">
            <p className="[font-size:var(--text-sm)] uppercase leading-none text-foreground/70 font-[family-name:var(--font-family-body)]">
              Values warm-up
            </p>
            <h1 className="mt-3 w-full max-w-[45ch] [font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] text-foreground font-[family-name:var(--font-family-display)]">
              What matters to you?
            </h1>
          </div>
        </div>

        <div className="page-container pt-5 pb-10 md:py-8 lg:py-10 flex flex-col gap-5 md:gap-6">
          <div className="w-full flex flex-col md:flex-row gap-6 lg:gap-8 xl:gap-10 md:items-start">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionDuration, ease: 'easeOut' }}
              className="hidden md:block md:w-[280px] lg:w-[360px] xl:w-[428px] shrink-0"
            >
              <div className="relative md:h-[280px] lg:h-[360px] xl:h-[428px] rounded-b-full overflow-hidden bg-muted">
                <Image
                  src="/images/values.png"
                  alt="Illustration for values warm-up"
                  fill
                  sizes="(min-width: 1280px) 428px, (min-width: 1024px) 360px, (min-width: 768px) 280px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/35" />
              </div>
            </motion.div>

            <div className="w-full flex-1 max-w-2xl min-w-0 flex flex-col gap-5 md:gap-6">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: motionDuration, ease: 'easeOut', delay: reduceMotion ? 0 : 0.08 }}
                className="flex flex-col gap-5"
              >
                <section
                  className="rounded-lg border border-border bg-background shadow-sm overflow-hidden"
                  aria-labelledby="values-category-title"
                >
                  {loading || !activeCategory ? (
                    <div className="p-6 flex flex-col gap-4">
                      <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                      <div className="h-7 w-36 rounded bg-muted animate-pulse" />
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-11 w-24 rounded-full bg-muted animate-pulse" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-border bg-muted/70 px-4 py-4 md:px-6 md:py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-2">
                            <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-foreground/50 font-[family-name:var(--font-family-body)]">
                              {activeCategoryIndex + 1} of {categories.length}
                            </p>
                            <h2
                              id="values-category-title"
                              className="[font-size:var(--text-2xl)] [line-height:var(--leading-2xl)] font-[family-name:var(--font-family-display)] text-foreground"
                            >
                              {activeCategory.name}
                            </h2>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="h-10 px-3 -mr-2 -mt-1 text-foreground/70"
                          >
                            Skip
                          </Button>
                        </div>
                        <p className="[font-size:var(--text-base)] text-foreground/70 font-[family-name:var(--font-family-body)] leading-relaxed mt-3 max-w-2xl">
                          {activeCategory.prompt_text}
                        </p>
                      </div>

                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeCategory.name}
                          initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                          transition={{ duration: motionDuration, ease: 'easeOut' }}
                          className="p-4 md:p-6"
                        >
                          <div className="flex flex-wrap gap-2.5" role="group" aria-label={`${activeCategory.name} values`}>
                            {activeCategory.words.map(({ word }) => (
                              <WordChip
                                key={word}
                                word={word}
                                selected={selected.has(word)}
                                reduceMotion={!!reduceMotion}
                                onToggle={() => toggleWord(word)}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveCategoryIndex(index => Math.max(0, index - 1))}
                          disabled={!canGoBack}
                          className="h-10 px-3"
                        >
                          Back
                        </Button>
                        <div className="flex gap-1" aria-hidden="true">
                          {categories.map(({ name }, index) => (
                            <span
                              key={name}
                              className={cn(
                                'h-1.5 rounded-full transition-all',
                                index === activeCategoryIndex ? 'w-6 bg-primary' : 'w-1.5 bg-border-emphasis'
                              )}
                            />
                          ))}
                        </div>
                        {canGoNext ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveCategoryIndex(index => index + 1)}
                            className="h-10 px-3"
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={submitting}
                            className="h-10 px-3"
                          >
                            {submitting ? 'Saving…' : 'Continue →'}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </section>

                <AnimatePresence initial={false}>
                  {selectedCount > 0 && (
                    <motion.div
                      key="values-note"
                      initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: motionDuration, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4 md:p-5">
                        <label
                          htmlFor="values-note"
                          className="[font-size:var(--text-sm)] text-foreground/70 font-[family-name:var(--font-family-body)]"
                        >
                          Anything you want to add?{' '}
                          <span className="text-foreground/40">(optional)</span>
                        </label>
                        <textarea
                          id="values-note"
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          rows={3}
                          placeholder="e.g. I want to stay myself, even if I can't speak."
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 [font-size:var(--text-base)] font-[family-name:var(--font-family-body)] text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function WordChip({
  word,
  selected,
  reduceMotion,
  onToggle,
}: {
  word: string
  selected: boolean
  reduceMotion: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 px-4 py-2 rounded-full border [font-size:var(--text-sm)] font-[family-name:var(--font-family-body)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-foreground border-border hover:border-foreground/40'
      )}
    >
      {word}
    </motion.button>
  )
}
