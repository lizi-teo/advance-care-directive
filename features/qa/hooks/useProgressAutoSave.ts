'use client'

import { useCallback } from 'react'

const QA_PROGRESS_KEY = 'qa-progress'

interface QAProgress {
  currentQuestionIndex: number
  responses: Record<string, string>
  timestamp: string
}

interface UseProgressAutoSaveReturn {
  saveProgress: (data: QAProgress) => void
  clearProgress: () => void
  getSavedProgress: () => QAProgress | null
}

export function useProgressAutoSave(): UseProgressAutoSaveReturn {
  const saveProgress = useCallback((data: QAProgress) => {
    try {
      localStorage.setItem(QA_PROGRESS_KEY, JSON.stringify(data))
    } catch (error) {
      // Handle localStorage quota exceeded or other errors
      console.error('Failed to save progress:', error)
    }
  }, [])

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(QA_PROGRESS_KEY)
    } catch (error) {
      console.error('Failed to clear progress:', error)
    }
  }, [])

  const getSavedProgress = useCallback((): QAProgress | null => {
    try {
      const saved = localStorage.getItem(QA_PROGRESS_KEY)
      if (saved) {
        return JSON.parse(saved) as QAProgress
      }
    } catch (error) {
      console.error('Failed to get saved progress:', error)
    }
    return null
  }, [])

  return {
    saveProgress,
    clearProgress,
    getSavedProgress,
  }
}
