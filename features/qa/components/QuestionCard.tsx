'use client'

import { QuestionWithOptions } from '../types'
import { Button } from '@/components/ui/button'
import { RadioCardGroup, RadioCard } from '@/components/ui/radio-card'
import { Textarea } from '@/components/ui/textarea'
import { CirclePlus, Pencil } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useState, useEffect } from 'react'

interface QuestionCardProps {
  question: QuestionWithOptions
  onAnswerSelect: (questionId: string, answerOptionId: string, note?: string) => void
  selectedAnswerId?: string
  initialNote?: string
  onNoteChange?: (questionId: string, note: string) => void
}

export function QuestionCard({ question, onAnswerSelect, selectedAnswerId, initialNote, onNoteChange }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedAnswerId)
  const [note, setNote] = useState<string>('')
  const [savedNote, setSavedNote] = useState<string>('')
  const [showNote, setShowNote] = useState<boolean>(false)
  const [noteSaved, setNoteSaved] = useState<boolean>(false)
  const [announcement, setAnnouncement] = useState<string>('')

  useEffect(() => {
    setSelected(selectedAnswerId)
    const restored = initialNote ?? ''
    setNote(restored)
    setSavedNote(restored)
    setShowNote(false)
    setNoteSaved(!!restored)
  }, [question.id])

  const handleSelect = (answerOptionId: string) => {
    setSelected(answerOptionId)
    onAnswerSelect(question.id, answerOptionId, savedNote)

    const selectedOption = question.answer_options.find(opt => opt.id === answerOptionId)
    if (selectedOption) {
      setAnnouncement(`Selected: ${selectedOption.option_text}`)
      setTimeout(() => setAnnouncement(''), 1000)
    }
  }

  const handleNoteDone = () => {
    setSavedNote(note)
    setShowNote(false)
    setNoteSaved(true)
    if (selected) onAnswerSelect(question.id, selected, note)
  }

  const handleNoteEdit = () => {
    setNote(savedNote)
    setShowNote(true)
  }

  const handleNoteCancel = () => {
    setNote(savedNote)
    setShowNote(false)
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
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
              className="md:gap-6 md:p-6 [&_p]:md:[font-size:var(--text-lg)]"
            />
          ))}
      </RadioCardGroup>

      {showNote ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`note-${question.id}`} className="text-sm font-medium block">
            Additional notes (optional)
          </label>
          <Textarea
            id={`note-${question.id}`}
            placeholder="Add any additional thoughts or notes..."
            value={note}
            onChange={(e) => {
                setNote(e.target.value)
                onNoteChange?.(question.id, e.target.value)
              }}
            className="min-h-[100px]"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={handleNoteCancel}>Cancel</Button>
            <Button onClick={handleNoteDone}>Done</Button>
          </div>
        </div>
      ) : noteSaved ? (
        <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
          <p className="text-sm text-foreground/80 flex-1 line-clamp-2">{savedNote}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNoteEdit}
            aria-label="Edit note"
            className="shrink-0 -mt-1 -mr-1 h-8 w-8"
          >
            <Pencil size={16} strokeWidth={ICON_STROKE_WIDTH} />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setShowNote(true)}>
          <CirclePlus size={24} />
          Add a note
        </Button>
      )}
    </div>
  )
}
