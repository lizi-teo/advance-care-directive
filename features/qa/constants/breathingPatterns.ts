import { BreathingPattern, BreathingPhase, BreathingPatternDurations } from '../types/breathing'
import { Cloud, Square, Wind, LucideIcon } from 'lucide-react'

export const BREATHING_PATTERNS: Record<BreathingPattern, BreathingPatternDurations> = {
  '4-7-8': { inhale: 4000, hold: 7000, exhale: 8000, rest: 0 },
  'box': { inhale: 4000, hold: 4000, exhale: 4000, rest: 4000 },
  'simple': { inhale: 4000, hold: 0, exhale: 6000, rest: 0 },
}

export const PHASE_LABELS: Record<BreathingPhase, string> = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Hold Empty',
}

export const PATTERN_LABELS: Record<BreathingPattern, string> = {
  '4-7-8': '4-7-8 Calming Breath',
  'box': 'Box Breathing',
  'simple': 'Gentle Breathing',
}

export const PATTERN_DESCRIPTIONS: Record<BreathingPattern, string> = {
  '4-7-8': 'Ideal for anxiety relief. Helps slow your heart rate and quiet racing thoughts when you need calm.',
  'box': 'Ideal for stress management. Helps you regain clarity and feel centered during challenging moments.',
  'simple': 'Ideal for beginners or feeling overwhelmed. A gentle technique that provides immediate comfort.',
}

export const PATTERN_DURATIONS: Record<BreathingPattern, string> = {
  '4-7-8': 'Inhale 4s • Hold 7s • Exhale 8s',
  'box': 'Inhale 4s • Hold 4s • Exhale 4s • Rest 4s',
  'simple': 'Inhale 4s • Exhale 6s',
}

export const PATTERN_ICONS: Record<BreathingPattern, LucideIcon> = {
  '4-7-8': Cloud,
  'box': Square,
  'simple': Wind,
}
