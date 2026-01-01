'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QuestionWithOptions } from '../types'

export function useQuestions() {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true)

        // Fetch questions (try lowercase 'questions' first)
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .order('id')

        if (questionsError) {
          throw questionsError
        }

        if (!questionsData || questionsData.length === 0) {
          setQuestions([])
          setLoading(false)
          return
        }

        // Fetch all answer options
        const { data: optionsData, error: optionsError } = await supabase
          .from('answer_options')
          .select('*')
          .order('option_order')

        if (optionsError) {
          throw optionsError
        }

        // Combine questions with their options
        const questionsWithOptions: QuestionWithOptions[] = questionsData.map((q) => ({
          ...q,
          answer_options: optionsData?.filter((opt) => opt.question_id === q.id) || []
        }))

        setQuestions(questionsWithOptions)
        setError(null)
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  return { questions, loading, error }
}
