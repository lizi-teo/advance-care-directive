'use client'

import { useEffect, useRef } from 'react'
import { BreathingPhase } from '../types/breathing'

const HAPTIC_PATTERNS: Record<BreathingPhase, number[]> = {
  inhale: [50], // Short pulse at start
  hold: [], // No vibration
  exhale: [75], // Slightly longer pulse
  rest: [], // No vibration
}

interface UseHapticFeedbackOptions {
  phase: BreathingPhase
  isActive: boolean
  cycleCount: number
}

interface UseHapticFeedbackReturn {
  isSupported: boolean
}

export function useHapticFeedback({
  phase,
  isActive,
  cycleCount,
}: UseHapticFeedbackOptions): UseHapticFeedbackReturn {
  const previousPhaseRef = useRef<BreathingPhase>(phase)
  const previousCycleRef = useRef<number>(cycleCount)
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator

  useEffect(() => {
    if (!isSupported || !isActive) {
      return
    }

    // Trigger vibration on phase change
    if (previousPhaseRef.current !== phase) {
      const pattern = HAPTIC_PATTERNS[phase]
      if (pattern.length > 0) {
        navigator.vibrate(pattern)
      }
      previousPhaseRef.current = phase
    }

    // Trigger special pattern on cycle complete
    if (previousCycleRef.current !== cycleCount && cycleCount > 0) {
      navigator.vibrate([50, 100, 50]) // Triple pulse for completion
      previousCycleRef.current = cycleCount
    }
  }, [phase, isActive, cycleCount, isSupported])

  return {
    isSupported,
  }
}
