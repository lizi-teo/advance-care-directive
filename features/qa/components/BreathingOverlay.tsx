'use client'

import { useState, useEffect } from 'react'
import { X, Play, Pause, ChevronLeft } from 'lucide-react'
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BreathingAnimation } from './BreathingAnimation'
import { BreathingSelectionCard } from './BreathingSelectionCard'
import { useBreathingExercise } from '../hooks/useBreathingExercise'
import { useHapticFeedback } from '../hooks/useHapticFeedback'
import { BreathingPattern } from '../types/breathing'
import { PATTERN_LABELS } from '../constants/breathingPatterns'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

interface BreathingOverlayProps {
  open: boolean
  onClose: () => void
}

type ViewMode = 'selection' | 'exercise'

export function BreathingOverlay({ open, onClose }: BreathingOverlayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('selection')
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>('4-7-8')
  const {
    phase,
    progress,
    isActive,
    isPaused,
    cycleCount,
    start,
    pause,
    resume,
    reset,
  } = useBreathingExercise(selectedPattern)

  const { isSupported } = useHapticFeedback({
    phase,
    isActive,
    cycleCount,
  })

  // Reset to selection view when overlay opens
  useEffect(() => {
    if (open) {
      setViewMode('selection')
      reset()
    } else {
      reset()
    }
  }, [open, reset])

  const handleBeginExercise = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern)
    setViewMode('exercise')
    start()
  }

  const handleClose = () => {
    setViewMode('selection')
    reset()
    onClose()
  }

  const handleBack = () => {
    setViewMode('selection')
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-full h-full md:max-w-2xl md:h-[85vh] md:max-h-[800px] flex flex-col items-stretch p-0 border-none ${
          viewMode === 'selection' ? 'breathing-card-gradient' : 'bg-background'
        }`}
        aria-label="Breathing exercise"
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Breathing Exercise</DialogTitle>

        {/* App bar */}
        <div className="flex h-14 items-center justify-between px-5 py-0 shrink-0">
          <div className="flex gap-0 items-center">
            {viewMode === 'exercise' && (
              <Button
                variant="ghost-subtle"
                onClick={handleBack}
                className="h-auto px-0 py-2 text-sm"
                aria-label="Back to exercise selection"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </Button>
            )}
          </div>
          <DialogClose
            className="rounded-sm transition-all hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="Close breathing exercise"
          >
            <X size={32} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col gap-8 items-start pb-5 pt-5 overflow-y-auto">
          {viewMode === 'selection' ? (
            /* Selection view: Show selection card with carousel */
            <BreathingSelectionCard onBeginExercise={handleBeginExercise} />
          ) : (
            /* Exercise view: Show breathing animation and controls */
            <>
              {/* Breathing animation */}
              <div className="flex flex-col items-center gap-6 w-full flex-1 justify-center">
                <BreathingAnimation phase={phase} progress={progress} pattern={selectedPattern} />

                {/* Cycle counter - always reserves space to prevent layout shift */}
                <p
                  className={`text-sm text-muted-foreground font-medium h-5 ${cycleCount > 0 ? 'opacity-100' : 'opacity-0'}`}
                  aria-live="polite"
                  aria-hidden={cycleCount === 0}
                >
                  Cycle {cycleCount || 1}
                </p>
              </div>

              {/* Play/Pause controls */}
              <div className="flex gap-3 w-full justify-center">
                {!isActive || isPaused ? (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={isPaused ? resume : start}
                    className="min-w-[120px]"
                    aria-label={isPaused ? 'Resume breathing exercise' : 'Start breathing exercise'}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {isPaused ? 'Resume' : 'Start'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={pause}
                    className="min-w-[120px]"
                    aria-label="Pause breathing exercise"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
              </div>

              {/* Haptic support message */}
              {!isSupported && (
                <p className="text-xs text-muted-foreground text-center w-full max-w-sm mx-auto" role="status">
                  Haptic feedback is not supported on this device
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
