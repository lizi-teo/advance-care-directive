# Multi-State Positioning

Make the app work for all Australian states — not just NSW. The current copy explicitly
ties the app to NSW Health's framework, which signals to users in SA, QLD, VIC, and WA
that the tool may not apply to them.

The approach: reposition as an **Advance Care Plan** (nationally recognised term) rather
than an **Advance Care Directive** (a statutory term with state-specific legal meaning).
The document becomes a clearly documented statement of care wishes that complements —
but does not replace — a state's statutory form.

---

## Files to change

| File | What changes |
|------|-------------|
| `app/(marketing)/page.tsx` | Framework reference, NSW Health link, witness copy, disclaimer, hero terminology |
| `app/summary/[sessionId]/page.tsx` | "NSW Advance Care Directive" heading, NSW Health framework copy, NSW Health link |
| `app/signed/[sessionId]/page.tsx` | "NSW Advance Care Directive" H1, directive description copy |
| `app/signed/[sessionId]/witness/page.tsx` | "NSW Advance Care Directive — Witness signature" heading, witness confirmed copy |
| `features/pdf/components/ACDDocument.tsx` | PDF title, document title, witness line, footer |
| `app/api/generate-pdf/route.ts` | PDF filename (`advance-care-directive-` → `advance-care-plan-`) |
| `app/qa/page.tsx` | PDF download filename (`advance-care-directive-`) |

---

## Changes by file

### 1. `app/(marketing)/page.tsx`

**Hero description** — soften the term in the opening paragraph:
- Before: `"An Advance Care Directive lets you share what matters to you..."`
- After: `"An advance care plan lets you share what matters to you..."`
- Add bridge line below: *"You may know this as a DNR, advance care directive, or living will — this covers the same ground."*

**Witness card** (`What you'll get` section):
- Before: `"Witnessing is strongly recommended by NSW Health."`
- After: `"Witnessing is strongly recommended across Australia and gives your plan more weight with healthcare teams."`

**About section** — framework reference:
- Before: `"follows NSW Health's advance care planning framework"`
- After: `"follows the Advance Care Planning Australia framework"`

**About section** — NSW Health link:
- Before: `Visit NSW Health` → `health.nsw.gov.au`
- After: `Visit Advance Care Planning Australia` → `advancecareplanning.org.au`

**Add disclaimer** — small text below the CTA button or in the About section:
> "This document is a personal statement of your care wishes. In some states, a separate statutory advance care directive form may also be available. This plan complements — but does not replace — those forms."

---

### 2. `app/summary/[sessionId]/page.tsx`

- Line 98/113: `"Advance Care Directive"` heading → `"Advance Care Plan"`
- Line 123: `"This follows the NSW Health advance care planning framework. Advance care directives are legally recognised in NSW and should be honoured by your medical team."` 
  → `"This follows the Advance Care Planning Australia framework. Your advance care plan should be honoured by your medical team across Australia. In some states a separate statutory form may also be available."`
- Line 132: `"NSW Health →"` link → `"Advance Care Planning Australia →"` linking to `advancecareplanning.org.au`

---

### 3. `app/signed/[sessionId]/page.tsx`

- Line 200: `"NSW Advance Care Directive"` → `"Advance Care Plan"`
- Line 218: `"...prepared this advance care directive..."` → `"...prepared this advance care plan..."`

---

### 4. `app/signed/[sessionId]/witness/page.tsx`

- Line 114: `"NSW Advance Care Directive — Witness signature"` → `"Advance Care Plan — Witness signature"`
- Line 136: `"...advance care directive."` → `"...advance care plan."`

---

### 5. `features/pdf/components/ACDDocument.tsx`

- Line 162: `<Document title="Advance Care Directive">` → `<Document title="Advance Care Plan">`
- Line 165: `"Advance Care Directive"` text → `"Advance Care Plan"`
- Line 212: `"Witnessed in accordance with NSW Health guidelines."` → `"Witnessed in accordance with Advance Care Planning Australia guidelines."`
- Line 219: Footer `"Advance Care Directive — {signedName}"` → `"Advance Care Plan — {signedName}"`

---

### 6. `app/api/generate-pdf/route.ts`

- Line 21: filename `advance-care-directive-${safeName}.pdf` → `advance-care-plan-${safeName}.pdf`

---

### 7. `app/qa/page.tsx`

- Line 166: download filename `advance-care-directive-${name}` → `advance-care-plan-${name}`

---

## What does NOT change

- The GitHub repo name (`advance-care-directive`) — not user-facing
- The Vercel project name — not user-facing; revisit when a custom domain is set
- The database table/column names — no migration needed, purely a copy change
- The questions content — the questions themselves are state-agnostic already

---

## Notes

- "Advance Care Plan" (ACP) is the term used by Advance Care Planning Australia and is
  understood by healthcare providers in all states.
- The statutory term "Advance Care Directive" has specific legal meaning in SA, QLD, VIC,
  and WA. Using "plan" avoids implying the document is equivalent to those statutory forms.
- NSW has no statutory ACD form — a well-documented personal statement is fully valid
  under common law. This app's output remains legally meaningful in NSW.
- SA passed new ACD reforms in January 2026 (see `.docs/research/regulatory-changes.md`).
  The SA statutory form details should be verified before adding state-specific guidance.
