export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'
export type BreathingPattern = '4-7-8' | 'box' | 'simple'

export interface BreathingState {
  isActive: boolean
  isPaused: boolean
  currentPhase: BreathingPhase
  phaseProgress: number // 0-1
  cycleCount: number
}

export interface BreathingPatternDurations {
  inhale: number
  hold: number
  exhale: number
  rest: number
}
