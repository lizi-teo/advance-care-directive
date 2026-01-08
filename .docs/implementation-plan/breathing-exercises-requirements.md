# Breathing Exercises - Carousel Microcopy

## Overview
Carousel of three breathing exercise options displayed before the user begins. Each card explains what the exercise is ideal for, giving users time to prepare and choose the right technique for their current state.

---

## 4-7-8 Breathing

**Title:** "4-7-8 Calming Breath"

**Duration Pattern:** Inhale 4s • Hold 7s • Exhale 8s

**Microcopy:**
"Ideal for anxiety relief. Helps slow your heart rate and quiet racing thoughts when you need calm."

---

## Box Breathing

**Title:** "Box Breathing"

**Duration Pattern:** Inhale 4s • Hold 4s • Exhale 4s • Rest 4s

**Microcopy:**
"Ideal for stress management. Helps you regain clarity and feel centered during challenging moments."

---

## Simple Breathing

**Title:** "Gentle Breathing"

**Duration Pattern:** Inhale 4s • Exhale 6s

**Microcopy:**
"Ideal for beginners or feeling overwhelmed. A gentle technique that provides immediate comfort."

---

## Implementation Notes

### Carousel Card Structure
Each card should include:
1. Visual indicator (icon or animation preview)
2. Title
3. Duration pattern
4. Ideal for microcopy (2 lines max)
5. "Begin" button (shown on selected card)

### User Flow
1. User navigates to breathing exercise
2. Carousel displays all three options
3. User swipes/navigates through options
4. User selects preferred technique
5. User taps "Begin" when ready
6. Breathing exercise starts

---

## User Story: Breathing Exercise Selection and Guided Practice

### User Story
**As a** user completing my advance care directive
**I want to** select and complete a guided breathing exercise
**So that** I can calm myself and be in the right mindset before answering difficult questions

### Acceptance Criteria

#### Scenario 1: Selecting a Breathing Exercise
**Given** I am on the breathing exercise page
**When** I view the available exercises
**Then** I should see multiple breathing exercise options (4-7-8 breathing, box breathing, gentle breathing)
**And** each exercise should display:
- Exercise name
- Brief description
- Duration pattern
- Visual preview or icon

#### Scenario 2: Starting the Exercise
**Given** I have selected a breathing exercise
**When** I tap the "Begin" button
**Then** the exercise should start immediately
**And** a Lottie animation should display to guide me through the breathing pattern
**And** the interface should enter a focused/immersive mode

#### Scenario 3: Following the Guided Animation
**Given** the breathing exercise has started
**When** the Lottie animation plays
**Then** the animation should visually guide me through:
- **Inhale** phase (visual expansion/growth)
- **Hold** phase (visual pause)
- **Exhale** phase (visual contraction)
- **Hold** phase (if applicable)
**And** the animation should loop for the full exercise duration
**And** haptic feedback should accompany phase transitions (if device supports it)

#### Scenario 4: Completing the Exercise
**Given** I am following the breathing exercise
**When** the full duration completes
**Then** the animation should gracefully end
**And** I should see a completion message
**And** I should be able to:
- Return to the QA page
- Repeat the same exercise
- Choose a different exercise

#### Scenario 5: Exiting Early
**Given** I am in the middle of a breathing exercise
**When** I want to exit early
**Then** I should be able to dismiss the overlay/modal
**And** return to where I was previously

### Technical Notes
- Lottie animation file: `components/ui/breath-animation.json`
- Components: `BreathingAnimation.tsx`, `BreathingOverlay.tsx`
- Custom hooks: `useBreathingExercise.ts`, `useHapticFeedback.ts`
- Animation should be smooth and calming (60fps target)
- Support both light and dark modes
- Ensure accessibility for users who cannot see animations

---

**Last Updated:** 2026-01-06
