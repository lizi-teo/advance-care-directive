Write Vitest unit tests for this Next.js advance care directive app. 
Add a new test project to vitest.config.ts alongside the existing storybook project 
so unit tests run with `vitest run --project=unit`.

Create the following test files:

---

**1. `evals/pdf-mapping.test.ts`**
Test that ACDDocument (`features/pdf/components/ACDDocument.tsx`) renders 
answers, free text notes, signed name, and signature image correctly.
- All answers appear in the PDF output
- free_text_note values are included
- signedName appears in title, signature section, and footer
- signatureDataUrl is passed to the Image component
- signedAt date is formatted as Australian locale (e.g. "1 June 2026")
- A missing/null caption renders without error

**2. `evals/pdf-api.test.ts`**
Test the `/api/generate-pdf` route handler (`app/api/generate-pdf/route.ts`).
- Returns 400 if signedName is missing
- Returns 400 if signatureDataUrl is missing
- Returns 400 if signedAt is missing
- Returns 400 if answers is not an array
- Returns a PDF response with correct Content-Type and Content-Disposition headers 
  when all required fields are provided (mock `renderToBuffer` to return a Buffer)
- Filename in Content-Disposition is sanitized from signedName 
  (e.g. "Jane Smith" → "advance-care-directive-jane-smith.pdf")

**3. `evals/supabase-data.test.ts`**
Test the data completeness logic — mock Supabase and verify:

Responses (`useResponseSubmit` hook, `features/qa/hooks/useResponseSubmit.ts`):
- Inserts question_id, answer_option_id, session_id correctly
- Inserts free_text_note when provided
- Sets free_text_note to null when omitted
- Sets user_id to null when no auth user

Signature (`useSignature` hook, `features/qa/hooks/useSignature.ts`):
- Uploads PNG to the `signatures` storage bucket under `{sessionId}/{timestamp}.png`
- Inserts session_id, signed_name, signature_url, signed_at into `signatures` table
- Returns null (not throws) if storage upload fails

**4. `evals/signed-page-data.test.ts`**
Test the data assembly logic on the signed page 
(`app/signed/[sessionId]/page.tsx`) — mock Supabase queries and verify:

- Loads signature, responses, questions, and answer options for the session
- Deduplicates responses so only the latest per question_id is used
- Renders witness block when witness_signatures returns a record
- Renders "No witness yet" + share buttons when witness_signatures returns null
- free_text_note appears as a note under the answer when present
- Unanswered questions (no matching response) show "Not answered"

---

Key types and interfaces already in the codebase:
- `UserResponse`, `Question`, `AnswerOption` → `features/qa/types/index.ts`
- `ACDDocumentProps` → `features/pdf/components/ACDDocument.tsx`
- Supabase client → `lib/supabase.ts` (mock this with vi.mock)

Use `vi.mock` for Supabase and `renderToBuffer`. 
Use React Testing Library for component tests.
Do not use `any` types.