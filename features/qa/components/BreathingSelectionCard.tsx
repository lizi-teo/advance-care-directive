'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { BreathingPattern } from '../types/breathing'
import { PATTERN_LABELS, PATTERN_DESCRIPTIONS, PATTERN_ICONS } from '../constants/breathingPatterns'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

interface BreathingSelectionCardProps {
  onBeginExercise: (pattern: BreathingPattern) => void
}

const AVAILABLE_PATTERNS: BreathingPattern[] = ['4-7-8', 'box', 'simple']

export function BreathingSelectionCard({ onBeginExercise }: BreathingSelectionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    duration: 20,
  })

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const handleBegin = () => {
    const selectedPattern = AVAILABLE_PATTERNS[selectedIndex]
    onBeginExercise(selectedPattern)
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prevIndex = selectedIndex === 0 ? AVAILABLE_PATTERNS.length - 1 : selectedIndex - 1
        scrollTo(prevIndex)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        const nextIndex = selectedIndex === AVAILABLE_PATTERNS.length - 1 ? 0 : selectedIndex + 1
        scrollTo(nextIndex)
      }
    },
    [selectedIndex, scrollTo]
  )

  return (
    <div className="flex flex-col items-center justify-between min-h-full w-full px-5 pb-5 pt-0">
      {/* Header */}
      <p className="font-body text-base leading-6 text-foreground text-center w-full">
        Select a breathing exercise
      </p>

      {/* Swipeable content container */}
      <div className="flex flex-col items-center gap-5 flex-1 justify-center w-full max-w-[340px]">
        {/* Embla carousel viewport */}
        <div
          className="overflow-hidden w-full"
          ref={emblaRef}
          role="region"
          aria-label="Breathing exercise options"
          aria-roledescription="carousel"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="flex" role="group" aria-live="polite" aria-atomic="true">
            {AVAILABLE_PATTERNS.map((pattern) => {
              const Icon = PATTERN_ICONS[pattern]
              return (
                <div
                  key={pattern}
                  className="flex-[0_0_100%] min-w-0 flex flex-col items-center gap-5"
                >
                  {/* Icon */}
                  <div className="w-[120px] h-[120px] flex items-center justify-center">
                    <Icon className="w-full h-full text-icon-accent" strokeWidth={0.7} />
                  </div>

                  {/* Title */}
                  <h1 className="font-display text-[30px] leading-tight text-foreground font-normal text-center w-full max-w-[300px] px-5">
                    {PATTERN_LABELS[pattern]}
                  </h1>

                  {/* Description */}
                  <p className="font-body text-base leading-normal text-foreground text-center w-full max-w-[300px] px-5">
                    {PATTERN_DESCRIPTIONS[pattern]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="flex gap-5 items-center mb-8">
        {AVAILABLE_PATTERNS.map((_, index) => (
          <Button
            key={index}
            variant="ghost-subtle"
            size="icon"
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 p-0 rounded-full transition-colors ${
              index === selectedIndex ? 'bg-primary hover:opacity-90' : 'bg-secondary'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === selectedIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Begin button */}
      <Button
        onClick={handleBegin}
        className="w-full max-w-[340px] h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        size="lg"
      >
        Begin
      </Button>
    </div>
  )
}
