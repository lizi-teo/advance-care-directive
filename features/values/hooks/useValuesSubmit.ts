'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useValuesSubmit() {
  const [submitting, setSubmitting] = useState(false)

  const submitValues = async (
    sessionId: string,
    selectedWords: string[],
    valuesNote?: string
  ): Promise<boolean> => {
    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('session_values')
        .insert({
          session_id: sessionId,
          selected_words: selectedWords,
          values_note: valuesNote || null,
        })
      if (error) throw error
      return true
    } catch {
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submitValues, submitting }
}
