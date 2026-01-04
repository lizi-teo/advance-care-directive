'use client'

import { QuestionWithOptions } from '../types'
import { Button } from '@/components/ui/button'
import { RadioCardGroup, RadioCard } from '@/components/ui/radio-card'
import { Textarea } from '@/components/ui/textarea'
import { CirclePlus } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState } from 'react'

interface QuestionCardProps {
  question: QuestionWithOptions
  onAnswerSelect: (questionId: string, answerOptionId: string, note?: string) => void
  selectedAnswerId?: string
}

export function QuestionCard({ question, onAnswerSelect, selectedAnswerId }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedAnswerId)
  const [note, setNote] = useState<string>('')
  const [showNote, setShowNote] = useState<boolean>(false)

  const handleSelect = (answerOptionId: string) => {
    setSelected(answerOptionId)
    onAnswerSelect(question.id, answerOptionId, note)
  }

  return (
    <div className="space-y-5 md:space-y-6">
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
          size="sm"
          onClick={() => setShowNote(true)}
          className="h-auto px-0 py-0 text-foreground hover:text-foreground/80"
        >
          <CirclePlus size={24} strokeWidth={ICON_STROKE_WIDTH} className="mr-2" />
          Add a note
        </Button>
      ) : (
        <div className="space-y-2">
          <label htmlFor={`note-${question.id}`} className="text-sm font-medium">
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
