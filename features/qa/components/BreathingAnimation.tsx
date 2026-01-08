'use client'

import { useRef, useEffect, useState } from 'react'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { BreathingPhase, BreathingPattern } from '../types/breathing'
import { PHASE_LABELS, BREATHING_PATTERNS } from '../constants/breathingPatterns'
import breathAnimationData from '@/components/ui/breath-animation.json'

interface BreathingAnimationProps {
  phase: BreathingPhase
  progress: number
  pattern: BreathingPattern
}

function calculateAnimationProgress(
  phase: BreathingPhase,
  progress: number,
  pattern: BreathingPattern
): number {
  const patternConfig = BREATHING_PATTERNS[pattern]
  const hasHold = patternConfig.hold > 0

  // Map breathing phases to animation timeline (0-1)
  switch (phase) {
    case 'inhale':
      return progress * 0.5 // First half: 0 → 0.5
    case 'hold':
      // Continue animating slowly during hold to maintain movement
      return 0.5 + (progress * 0.15) // Slowly progress from 0.5 → 0.65
    case 'exhale':
      // If no hold phase, start exhale from 0.5, otherwise from 0.65
      if (hasHold) {
        return 0.65 + progress * 0.35 // Continue from 0.65 → 1.0
      } else {
        return 0.5 + progress * 0.5 // Continue from 0.5 → 1.0
      }
    case 'rest':
      return 0 // Reset to start
    default:
      return 0
  }
}

export function BreathingAnimation({ phase, progress, pattern }: BreathingAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [displayPhase, setDisplayPhase] = useState<BreathingPhase>(phase)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (lottieRef.current) {
      const animationProgress = calculateAnimationProgress(phase, progress, pattern)
      const totalFrames = lottieRef.current.getDuration(true) // Get total frames

      if (totalFrames) {
        const targetFrame = animationProgress * totalFrames
        lottieRef.current.goToAndStop(targetFrame, true)
      }
    }
  }, [phase, progress, pattern])

  // Smooth cross-fade between phases
  useEffect(() => {
    if (phase !== displayPhase) {
      setIsTransitioning(true)

      // Wait for fade out, then update phase
      const timer = setTimeout(() => {
        setDisplayPhase(phase)
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [phase, displayPhase])

  return (
    <div className="w-[250px] md:w-[350px] lg:w-[400px] flex flex-col items-center justify-center gap-4">
      {/* Lottie animation */}
      <div className="w-full h-[250px] md:h-[350px] lg:h-[400px]">
        <Lottie
          lottieRef={lottieRef}
          animationData={breathAnimationData}
          loop={false}
          autoplay={false}
        />
      </div>

      {/* Phase label with cross-fade transition */}
      <div className="min-w-[200px] md:min-w-[250px] lg:min-w-[300px] flex justify-center">
        <p
          style={{
            fontFamily: 'var(--font-family-display)',
            transition: 'opacity 300ms ease-in-out',
            opacity: isTransitioning ? 0 : 1,
          }}
          className="text-2xl md:text-3xl lg:text-4xl text-foreground font-light text-center whitespace-nowrap"
          aria-live="polite"
          aria-atomic="true"
        >
          {PHASE_LABELS[displayPhase]}
        </p>
      </div>
    </div>
  )
}
