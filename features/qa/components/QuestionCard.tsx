'use client'

import { QuestionWithOptions } from '../types'
import { Button } from '@/components/ui/button'
import { RadioCardGroup, RadioCard } from '@/components/ui/radio-card'
import { Textarea } from '@/components/ui/textarea'
import { CirclePlus } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState, useEffect } from 'react'

interface QuestionCardProps {
  question: QuestionWithOptions
  onAnswerSelect: (questionId: string, answerOptionId: string, note?: string) => void
  selectedAnswerId?: string
}

export function QuestionCard({ question, onAnswerSelect, selectedAnswerId }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedAnswerId)
  const [note, setNote] = useState<string>('')
  const [showNote, setShowNote] = useState<boolean>(false)
  const [announcement, setAnnouncement] = useState<string>('')

  // Sync local state with prop when question changes
  useEffect(() => {
    setSelected(selectedAnswerId)
  }, [selectedAnswerId, question.id])

  const handleSelect = (answerOptionId: string) => {
    setSelected(answerOptionId)
    onAnswerSelect(question.id, answerOptionId, note)

    // Find the selected option text for screen reader announcement
    const selectedOption = question.answer_options.find(opt => opt.id === answerOptionId)
    if (selectedOption) {
      setAnnouncement(`Selected: ${selectedOption.option_text}`)
      // Clear announcement after it's been read
      setTimeout(() => setAnnouncement(''), 1000)
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Screen reader announcement for answer selection */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <RadioCardGroup
        value={selected}
        onValueChange={(value) => handleSelect(value)}
      >
        {question.answer_options
          .sort((a, b) => a.option_order - b.option_order)
          .map((option) => (
            <RadioCard
              key={option.id}
              value={option.id}
              title={option.option_text}
            />
          ))}
      </RadioCardGroup>

      {!showNote ? (
        <Button
          variant="ghost"
          onClick={() => setShowNote(true)}
        >
          <CirclePlus size={24} />
          Add a note
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor={`note-${question.id}`} className="text-sm font-medium block">
            Additional notes (optional)
          </label>
          <Textarea
            id={`note-${question.id}`}
            placeholder="Add any additional thoughts or notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      )}
    </div>
  )
}
