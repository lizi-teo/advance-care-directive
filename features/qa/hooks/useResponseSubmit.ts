'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useResponseSubmit() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitResponse = async (
    questionId: string,
    answerOptionId: string,
    freeTextNote?: string
  ) => {
    try {
      setSubmitting(true)
      setError(null)

      // Get current user session (will be null for anonymous users)
      const { data: { user } } = await supabase.auth.getUser()

      const { error: submitError } = await supabase
        .from('user_responses')
        .insert({
          user_id: user?.id || null,
          question_id: questionId,
          answer_option_id: answerOptionId,
          free_text_note: freeTextNote || null,
          created_at: new Date().toISOString()
        })

      if (submitError) {
        throw submitError
      }

      return true
    } catch (err) {
      console.error('Error submitting response:', err)
      setError(err instanceof Error ? err.message : 'Failed to save response')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submitResponse, submitting, error }
}
