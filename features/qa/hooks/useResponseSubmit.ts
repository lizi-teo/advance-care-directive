'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useResponseSubmit() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitResponse = async (
    questionId: string,
    answerOptionId: string,
    freeTextNote?: string,
    sessionId?: string | null
  ) => {
    try {
      setSubmitting(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()

      const { error: submitError } = await supabase
        .from('user_responses')
        .insert({
          user_id: user?.id || null,
          question_id: questionId,
          answer_option_id: answerOptionId,
          free_text_note: freeTextNote || null,
          session_id: sessionId || null,
          created_at: new Date().toISOString()
        })

      if (submitError) {
        throw submitError
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save response')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submitResponse, submitting, error }
}
