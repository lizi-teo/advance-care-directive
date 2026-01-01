'use client'

import { QuestionWithOptions } from '../types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface QuestionCardProps {
  question: QuestionWithOptions
  onAnswerSelect: (questionId: string, answerOptionId: string, note?: string) => void
  selectedAnswerId?: string
}

export function QuestionCard({ question, onAnswerSelect, selectedAnswerId }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedAnswerId)
  const [note, setNote] = useState<string>('')

  const handleSelect = (answerOptionId: string) => {
    setSelected(answerOptionId)
    onAnswerSelect(question.id, answerOptionId, note)
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      {question.caption && (
        <p className="text-sm text-muted-foreground">{question.caption}</p>
      )}

      <h3 className="text-xl font-semibold">{question.question_text}</h3>

      {question.image_url && (
        <img
          src={question.image_url}
          alt={question.caption || 'Question image'}
          className="w-full max-w-md rounded-md"
        />
      )}

      <div className="space-y-2 pt-4">
        {question.answer_options
          .sort((a, b) => a.option_order - b.option_order)
          .map((option) => (
            <Button
              key={option.id}
              variant={selected === option.id ? 'default' : 'outline'}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleSelect(option.id)}
            >
              {option.option_text}
            </Button>
          ))}
      </div>

      <div className="pt-4 space-y-2">
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
    </div>
  )
}
