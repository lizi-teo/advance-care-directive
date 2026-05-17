# Implementation Plan: Name + E-Signature

## Context
The Q&A flow ends at `SummaryScreen`. Signature appears as a **final step after the summary**, before PDF generation. PDF generation is currently stubbed out, so this plan covers both.

---

## Step 1 — `SignaturePad` component ✅
**Files:** `features/qa/components/SignaturePad.tsx`

- Install `signature_pad` (canvas library, ~30kb)
- Canvas element with draw-to-sign via mouse/touch
- Clear button, undo button
- Exports `getDataURL()` as base64 PNG
- Full name text input above the canvas
- Consent checkbox ("I agree this is my signature")
- Works with React Hook Form via `Controller`

---

## Step 2 — `FinaliseScreen` step in the flow ✅
**Files:** `features/qa/components/FinaliseScreen.tsx`, update `app/qa/page.tsx`

- New screen after `SummaryScreen` (Summary → **Finalise** → Done)
- Contains `SignaturePad` + name input
- "Generate my directive" CTA button
- Back navigation to summary

---

## Step 3 — Signature storage
**Files:** `features/qa/hooks/useSignature.ts`

- Save base64 PNG to Supabase Storage bucket (`signatures/`)
- Save signed name + timestamp + `session_id` to a new `signatures` table
- Returns a `signatureUrl` for use in PDF

---

## Step 4 — PDF generation with signature embedded
**Files:** `app/api/generate-pdf/route.ts`, `features/pdf/` components

- Implement the stubbed PDF route using `@react-pdf/renderer` (already installed)
- Embed: all Q&A answers, full name, signature image, date signed
- Return PDF as a blob download or open in new tab

---

## What's not in scope
- Witness/notary signature (a second signature field — separate feature)
- Legally verified identity (requires a third-party service like DocuSign)
- Paced flow integration (placeholder page, tackle after fast flow works)

---

## Rough effort
| Step | Effort | Status |
|---|---|---|
| SignaturePad component | ~2–3 hrs | Done |
| FinaliseScreen + flow wiring | ~1–2 hrs | Done |
| Signature storage (Supabase) | ~1 hr | Pending |
| PDF generation | ~3–4 hrs | Pending |
