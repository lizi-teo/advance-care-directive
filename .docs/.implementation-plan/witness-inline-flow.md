# Simplified Signing + Witness Flow

## Context

User and witness are expected to be in the same room. There is no need for a device handoff ceremony — the witness reads the care wishes on the same page, then signs inline in the witness section below. The goal is:
- Remove print/share from everywhere except the final signed page
- Witness signing happens inline on `/signed/[sessionId]` — no separate flow, no full-screen takeover
- Keep clear messaging that witnessing is optional but encouraged by NSW Health

---

## Flow

```
Q&A → Summary → Sign directive (FinaliseScreen)
                       ↓ redirect after signing
              /signed/[sessionId]          ← only page with Print/Share
                       |
         Witness reads care wishes on same page
                       |
         Optional: "Add a witness signature"
                       ↓ inline expansion
              Witness signs (name + signature pad)
                       ↓
                Both signatures visible
```

---

## Witness UX: Inline, Same Page

Two internal states in `WitnessMode`. No full-screen overlay, no handoff screen.

```
State 1 — idle (in the witness column, below the signer's signature)
  Label (xs, uppercase): "WITNESSED BY"
  Dashed placeholder box: "No witness yet"
  Optional text: "Optional — NSW Health recommends having a witness present..."
  Button (outline): "Add a witness signature"

State 2 — form (expands inline where the CTA was)
  Label (xs, uppercase): "WITNESSED BY"
  Body: "If you've read [FirstName]'s care wishes above and saw them sign,
         please add your name and signature below."
  InfoBox: what witnessing means (3 bullets + optional disclaimer)
  Name input (h-12, autocomplete="name", label: "Witness full name")
  Signature pad (label: "Witness signature")
  Button (primary, disabled until both filled): "Confirm as witness"
  Link: "Cancel" → returns to State 1
```

On submit, `onComplete(record)` is called — parent replaces WitnessMode with the static witnessed-by display.

---

## Files to Change

### 1. `features/witness/WitnessMode.tsx` ✅ Done
- Removed `handoff` and `success` states
- Removed fixed full-screen overlay
- Form renders inline within the signatures grid column
- Simplified to `'idle' | 'form'` states
- On submit calls `onComplete` directly (no intermediate success screen)

### 2. `app/signed/[sessionId]/page.tsx`
- No changes needed to witness integration — already uses `WitnessMode` + `onComplete`
- The realtime `witness_signatures` subscription stays as-is

### 3. `app/qa/page.tsx`
- After signature upload + DB insert succeed in `handleSubmit`, replace `setShowDone(true)` with `router.push(\`/signed/${sessionId}\`)`. Import `useRouter` from `next/navigation`. Remove `showDone` state, `SignedScreen`, and `SignedFooter` imports.

### 4. `features/qa/components/SignedScreen.tsx`
- No longer used after the redirect change. Confirm no other imports, then delete.

### 5. `app/summary/[sessionId]/page.tsx`
- Remove the Print button. Remove `Printer` import and `requestAnimationFrame(() => window.print())` handler.

### 6. `app/signed/[sessionId]/witness/page.tsx`
- No changes. Keep for backward compatibility (old witness share links still work).

---

## Supabase

No schema changes.

---

## Verification

1. Complete Q&A → FinaliseScreen → sign → confirm redirect to `/signed/[sessionId]`
2. Signed page shows care wishes (Q&A) + signer signature
3. Witness section shows optional text + "Add a witness signature" button
4. Click button → form expands inline (no full-screen takeover)
5. Witness reads care wishes above (same page), fills name + signature
6. Submit → both signatures visible on the page
7. `/signed/[sessionId]/witness` direct URL — still works independently
