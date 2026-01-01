'use client'

import { QuestionCard } from '@/features/qa/components/QuestionCard'
import { useQuestions } from '@/features/qa/hooks/useQuestions'
import { useResponseSubmit } from '@/features/qa/hooks/useResponseSubmit'
import { useState } from 'react'

export default function QAPage() {
  const { questions, loading, error } = useQuestions()
  const { submitResponse, submitting, error: submitError } = useResponseSubmit()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <p className="text-lg">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error loading questions</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">No questions found</h2>
          <p className="text-yellow-600">Please add some questions in your Supabase database.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Questions</h1>
          <p className="text-muted-foreground">Please answer the following questions</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {submitError}</p>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswerId={responses[question.id]}
            />
          ))}
        </div>

        {submitting && (
          <div className="text-center text-muted-foreground">
            Saving response...
          </div>
        )}
      </div>
    </div>
  )
}
