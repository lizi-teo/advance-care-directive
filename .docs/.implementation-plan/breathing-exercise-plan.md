# Breathing Exercise Implementation Plan

## Overview
Add a full-screen breathing exercise overlay to the QA page that helps users pause and calm down during emotionally heavy questions. Features haptic feedback synchronized with breathing rhythm.

## User Decisions
- **UI**: Full-screen overlay (immersive experience)
- **Default Pattern**: 4-7-8 technique (inhale 4s, hold 7s, exhale 8s)
- **Progress Save**: localStorage only (simple, no database changes)
- **Animation**: CSS/SVG circle with gradients (lightweight, no dependencies)

## Tech Stack
- Next.js 16 + React 19 + TypeScript
- Radix UI Dialog (already installed)
- Tailwind CSS v4 + tw-animate-css
- Vibration API for haptic feedback
- localStorage for progress persistence

---

## Implementation Steps

### Phase 1: Foundation Components

#### 1.1 Create Dialog UI Component
**File**: `/components/ui/dialog.tsx` (NEW)
- Wrap `@radix-ui/react-dialog`
- Follow existing drawer.tsx pattern (vaul wrapper)
- Export: Dialog, DialogTrigger, DialogContent, DialogOverlay, DialogClose
- Use tw-animate-css for fade-in/fade-out animations
- Support dark mode via CSS variables

#### 1.2 Create Type Definitions
**File**: `/features/qa/types/breathing.ts` (NEW)
```typescript
export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'
export type BreathingPattern = '4-7-8' | 'box' | 'simple'

export interface BreathingState {
  isActive: boolean
  isPaused: boolean
  currentPhase: BreathingPhase
  phaseProgress: number // 0-1
  cycleCount: number
}
```

#### 1.3 Create Breathing Constants
**File**: `/features/qa/constants/breathingPatterns.ts` (NEW)
```typescript
export const BREATHING_PATTERNS = {
  '4-7-8': { inhale: 4000, hold: 7000, exhale: 8000, rest: 0 },
  'box': { inhale: 4000, hold: 4000, exhale: 4000, rest: 4000 },
  'simple': { inhale: 4000, hold: 0, exhale: 6000, rest: 0 },
}

export const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Rest',
}
```

---

### Phase 2: Core Breathing Logic

#### 2.1 Create Breathing Exercise Hook
**File**: `/features/qa/hooks/useBreathingExercise.ts` (NEW)
- Manage breathing state (phase, progress, active/paused)
- Use `requestAnimationFrame` for smooth progress tracking
- Calculate phase transitions based on pattern timing
- Return: `{ phase, progress, isActive, isPaused, start, pause, resume, reset, cycleCount }`
- Clean up animation frames on unmount

**Key Logic**:
- Track elapsed time within current phase
- Calculate progress as `elapsed / phaseDuration` (0-1)
- Transition to next phase when progress >= 1
- Support pause/resume without losing phase state
- Count completed cycles (for UI/stats)

#### 2.2 Create Haptic Feedback Hook
**File**: `/features/qa/hooks/useHapticFeedback.ts` (NEW)
- Feature detection: `'vibrate' in navigator`
- Vibration patterns:
  - Inhale: `[50]` (short pulse at start)
  - Hold: `[]` (no vibration)
  - Exhale: `[75]` (slightly longer pulse)
  - Rest: `[]` (no vibration)
  - Cycle complete: `[50, 100, 50]` (triple pulse)
- Subscribe to phase changes from useBreathingExercise
- Graceful degradation if Vibration API unavailable
- Return: `{ isSupported }` for UI feedback

#### 2.3 Create Progress Auto-Save Hook
**File**: `/features/qa/hooks/useProgressAutoSave.ts` (NEW)
- Save QA progress to localStorage when pause is tapped
- Key: `'qa-progress'`
- Data: `{ currentQuestionIndex, responses, timestamp }`
- Return: `{ saveProgress, clearProgress, getSavedProgress }`
- Optional: Auto-restore on page load (discuss with user)

---

### Phase 3: Animation Component

#### 3.1 Create CSS/SVG Breathing Animation
**File**: `/features/qa/components/BreathingAnimation.tsx` (NEW)
- Render centered circle that scales with breathing
- Scale calculation:
  - Inhale: `0.5 + (progress * 0.5)` (grows 0.5 → 1.0)
  - Hold: `1.0` (stays full size)
  - Exhale: `1.0 - (progress * 0.5)` (shrinks 1.0 → 0.5)
  - Rest: `0.5` (stays small)
- Size: 200px mobile, 300px desktop
- Gradient: Use `from-primary to-secondary` (theme colors)
- Smooth transitions: `transition-transform duration-300 ease-in-out`
- Overlay text: Current phase label ("Breathe In", "Hold", "Breathe Out")
- Opacity pulse: Fade between 0.7 and 1.0 for subtle glow effect

**Responsive Design**:
```tsx
<div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px]">
  <div
    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary"
    style={{
      transform: `scale(${scale})`,
      opacity: 0.7 + (progress * 0.3)
    }}
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <p className="text-2xl md:text-3xl font-display">
      {PHASE_LABELS[phase]}
    </p>
  </div>
</div>
```

---

### Phase 4: Overlay Component

#### 4.1 Create Breathing Overlay
**File**: `/features/qa/components/BreathingOverlay.tsx` (NEW)
- Use Dialog component from step 1.1
- Props: `{ open: boolean, onClose: () => void }`
- Full-screen centered layout
- Pattern selector (3 buttons: 4-7-8, Box, Simple)
- Default pattern: 4-7-8
- Auto-start on open
- Show cycle counter: "Cycle X" after each complete cycle
- Close button (X icon, top-right)
- ESC key support (built into Radix Dialog)
- Dark mode support (automatic via theme)

**Layout**:
```
┌─────────────────────────────┐
│  [X]                        │  ← Close button
│                             │
│        ┌─────────┐          │
│        │         │          │
│        │    ○    │          │  ← Breathing circle + label
│        │         │          │
│        └─────────┘          │
│                             │
│     Cycle 3                 │  ← Cycle counter
│                             │
│  [4-7-8] [Box] [Simple]     │  ← Pattern selector
│  [Pause] [Resume]           │  ← Controls
│                             │
└─────────────────────────────┘
```

**State Management**:
- Local state for pattern selection
- useBreathingExercise for timing/animation
- useHapticFeedback for vibrations
- Auto-start breathing when dialog opens
- Reset on close

---

### Phase 5: Integration with QA Page

#### 5.1 Modify QA Page
**File**: `/app/qa/page.tsx` (MODIFY)

**Changes**:
1. **Add state** (after line 20):
   ```typescript
   const [showBreathing, setShowBreathing] = useState(false)
   ```

2. **Add progress save hook** (after line 16):
   ```typescript
   const { saveProgress } = useProgressAutoSave()
   ```

3. **Add pause handler** (after handleBack function, ~line 45):
   ```typescript
   const handlePause = () => {
     // Save progress to localStorage
     saveProgress({
       currentQuestionIndex,
       responses,
       timestamp: new Date().toISOString()
     })
     // Open breathing overlay
     setShowBreathing(true)
   }
   ```

4. **Update Pause button** (lines 161-177):
   ```typescript
   <Button
     variant="secondary"
     className="flex-1 h-12 rounded-full text-base min-w-0"
     onClick={handlePause}  // ← ADD THIS
   >
     <Feather strokeWidth={ICON_STROKE_WIDTH} />
     <span className="hidden sm:inline">Pause</span>
   </Button>
   ```

5. **Add overlay component** (end of return, after footer):
   ```typescript
   <BreathingOverlay
     open={showBreathing}
     onClose={() => setShowBreathing(false)}
   />
   ```

6. **Add imports** (top of file):
   ```typescript
   import { BreathingOverlay } from '@/features/qa/components/BreathingOverlay'
   import { useProgressAutoSave } from '@/features/qa/hooks/useProgressAutoSave'
   ```

---

### Phase 6: Polish & Accessibility

#### 6.1 Accessibility Features
- ARIA labels on all buttons
- Keyboard navigation (Tab, ESC, Space/Enter)
- Screen reader announcements for phase changes
- Focus management (return focus to Pause button on close)
- Reduced motion support: `@media (prefers-reduced-motion: reduce)`
  - Disable scale animations
  - Use opacity changes only
  - Disable haptic feedback

#### 6.2 Error Handling
- Check Vibration API support, show message if unavailable
- Handle localStorage quota exceeded gracefully
- Validate pattern selection

#### 6.3 Testing Checklist
- [ ] Breathing animation smooth on mobile
- [ ] Haptic feedback works on supported devices
- [ ] Progress saves correctly to localStorage
- [ ] Pattern switching works mid-cycle
- [ ] Pause/resume maintains phase state
- [ ] Dark mode colors correct
- [ ] ESC key closes overlay
- [ ] Responsive on all screen sizes
- [ ] Cycle counter increments correctly
- [ ] Focus returns to Pause button on close

---

## File Summary

### New Files (8)
1. `/components/ui/dialog.tsx` - Radix Dialog wrapper
2. `/features/qa/types/breathing.ts` - Type definitions
3. `/features/qa/constants/breathingPatterns.ts` - Pattern configurations
4. `/features/qa/hooks/useBreathingExercise.ts` - Core breathing logic
5. `/features/qa/hooks/useHapticFeedback.ts` - Vibration API wrapper
6. `/features/qa/hooks/useProgressAutoSave.ts` - localStorage persistence
7. `/features/qa/components/BreathingAnimation.tsx` - CSS/SVG circle animation
8. `/features/qa/components/BreathingOverlay.tsx` - Main overlay component

### Modified Files (1)
1. `/app/qa/page.tsx` - Add pause handler, integrate overlay

### No Changes Needed
- package.json (all dependencies already installed)
- Database schema (using localStorage)
- SettingsContext (no settings to add initially)

---

## Implementation Order

1. ✅ **Dialog component** - Foundation for overlay
2. ✅ **Types & constants** - Type safety
3. ✅ **useBreathingExercise hook** - Core timing logic
4. ✅ **BreathingAnimation component** - Visual feedback
5. ✅ **useHapticFeedback hook** - Haptic sync
6. ✅ **useProgressAutoSave hook** - Progress persistence
7. ✅ **BreathingOverlay component** - Orchestrate everything
8. ✅ **QA page integration** - Wire it up

---

## Future Enhancements (Out of Scope)
- Add Lottie animation as optional preference
- Add guided audio (optional narration)
- Add breathing stats/history tracking
- Sync progress to Supabase for multi-device
- Add more breathing patterns (5-5, 6-6, etc.)
- Add breathing exercise onboarding tutorial
