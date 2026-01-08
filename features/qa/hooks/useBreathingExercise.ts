'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BreathingPhase, BreathingPattern } from '../types/breathing'
import { BREATHING_PATTERNS } from '../constants/breathingPatterns'

interface UseBreathingExerciseReturn {
  phase: BreathingPhase
  progress: number
  isActive: boolean
  isPaused: boolean
  cycleCount: number
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

const PHASE_ORDER: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest']

function getNextPhase(currentPhase: BreathingPhase, pattern: BreathingPattern): BreathingPhase {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase)
  let nextIndex = (currentIndex + 1) % PHASE_ORDER.length

  // Skip phases with 0 duration
  let nextPhase = PHASE_ORDER[nextIndex]
  while (BREATHING_PATTERNS[pattern][nextPhase] === 0 && nextIndex !== currentIndex) {
    nextIndex = (nextIndex + 1) % PHASE_ORDER.length
    nextPhase = PHASE_ORDER[nextIndex]
  }

  return nextPhase
}

export function useBreathingExercise(pattern: BreathingPattern = '4-7-8'): UseBreathingExerciseReturn {
  const [phase, setPhase] = useState<BreathingPhase>('inhale')
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [cycleCount, setCycleCount] = useState(0)

  const startTimeRef = useRef<number>(0)
  const pauseTimeRef = useRef<number>(0)
  const pausedElapsedRef = useRef<number>(0)
  const frameRef = useRef<number>(0)

  const getCurrentPhaseDuration = useCallback(() => {
    return BREATHING_PATTERNS[pattern][phase]
  }, [pattern, phase])

  const reset = useCallback(() => {
    setPhase('inhale')
    setProgress(0)
    setIsActive(false)
    setIsPaused(false)
    setCycleCount(0)
    pausedElapsedRef.current = 0
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const start = useCallback(() => {
    setIsActive(true)
    setIsPaused(false)
    setPhase('inhale')
    setProgress(0)
    setCycleCount(0)
    pausedElapsedRef.current = 0
    startTimeRef.current = performance.now()
  }, [])

  const pause = useCallback(() => {
    if (isActive && !isPaused) {
      setIsPaused(true)
      pauseTimeRef.current = performance.now()
    }
  }, [isActive, isPaused])

  const resume = useCallback(() => {
    if (isActive && isPaused) {
      setIsPaused(false)
      // Add the paused duration to our elapsed offset
      pausedElapsedRef.current += performance.now() - pauseTimeRef.current
    }
  }, [isActive, isPaused])

  useEffect(() => {
    if (!isActive || isPaused) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      return
    }

    const duration = getCurrentPhaseDuration()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current - pausedElapsedRef.current
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        // Transition to next phase
        const next = getNextPhase(phase, pattern)

        // Increment cycle count when completing a full cycle (returning to inhale)
        if (phase === 'exhale' && next === 'inhale') {
          setCycleCount(prev => prev + 1)
        } else if (phase === 'rest' && next === 'inhale') {
          setCycleCount(prev => prev + 1)
        }

        setPhase(next)
        setProgress(0)
        startTimeRef.current = currentTime
        pausedElapsedRef.current = 0
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isActive, isPaused, phase, pattern, getCurrentPhaseDuration])

  return {
    phase,
    progress,
    isActive,
    isPaused,
    cycleCount,
    start,
    pause,
    resume,
    reset,
  }
}
