'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSessionId } from '@/features/qa/hooks/useSessionId'
import { useValuesSubmit } from '@/features/values/hooks/useValuesSubmit'
import { toast } from 'sonner'

const WORD_CATEGORIES = [
  {
    category: 'Connection',
    words: ['Belonging', 'Closeness', 'Family', 'Friendship', 'Loyalty', 'Togetherness', 'Together'],
  },
  {
    category: 'Who I am',
    words: ['Being myself', 'Courage', 'Dignity', 'Gentleness', 'Humour', 'Independence', 'Integrity', 'Resilience', 'Strength'],
  },
  {
    category: 'How I live',
    words: ['Adventure', 'Creativity', 'Freedom', 'Joy', 'Playfulness', 'Simplicity', 'Stillness', 'Warmth'],
  },
  {
    category: 'What I stand for',
    words: ['Compassion', 'Faith', 'Goodness', 'Honesty', 'Justice', 'Kindness', 'Legacy', 'Truth', 'Wisdom'],
  },
  {
    category: 'What sustains me',
    words: ['Acceptance', 'Beauty', 'Community', 'Ease', 'Enough', 'Growth', 'Home', 'Nature', 'Peace', 'Security', 'Helping others', 'Spirituality'],
  },
]

export default function ValuesPage() {
  const router = useRouter()
  const sessionId = useSessionId()
  const { submitValues, submitting } = useValuesSubmit()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')

  const toggleWord = (word: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  const handleSave = async () => {
    if (!sessionId) return
    const words = Array.from(selected)
    if (words.length === 0) {
      router.push('/qa')
      return
    }
    const ok = await submitValues(sessionId, words, note || undefined)
    if (ok) {
      localStorage.setItem('qa-values', JSON.stringify({ words, note: note || undefined }))
      router.push('/qa')
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleSkip = () => router.push('/qa')

  const selectedCount = selected.size

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppBar />

      <div className="flex-1 overflow-y-auto">
        <div className="page-container py-8 md:py-12 max-w-2xl flex flex-col gap-8">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-2"
          >
            <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
              What matters to you?
            </h1>
            <p className="[font-size:var(--text-base)] text-foreground/70 font-[family-name:var(--font-family-body)]">
              Choose the words that feel true to you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut', delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            {WORD_CATEGORIES.map(({ category, words }) => (
              <div key={category} className="flex flex-col gap-3">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-foreground/40 font-[family-name:var(--font-family-body)]">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {words.map(word => (
                    <WordChip
                      key={word}
                      word={word}
                      selected={selected.has(word)}
                      onToggle={() => toggleWord(word)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-2 pt-2"
              >
                <label
                  htmlFor="values-note"
                  className="[font-size:var(--text-sm)] text-foreground/60 font-[family-name:var(--font-family-body)]"
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
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 [font-size:var(--text-base)] font-[family-name:var(--font-family-body)] text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>

      <div className="w-full border-t border-border-emphasis py-4 bg-background shrink-0">
        <div className="page-container flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end md:gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleSkip}
            className="w-full md:w-auto h-12 md:h-11"
          >
            Skip
          </Button>
          <Button
            size="lg"
            onClick={handleSave}
            disabled={selectedCount === 0 || submitting}
            className="w-full md:w-auto h-12 md:h-11"
          >
            {submitting ? 'Saving…' : 'Continue to questions'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function WordChip({
  word,
  selected,
  onToggle,
}: {
  word: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'px-4 py-2 rounded-full border [font-size:var(--text-sm)] font-[family-name:var(--font-family-body)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground border-border hover:border-foreground/40'
      )}
    >
      {word}
    </button>
  )
}
