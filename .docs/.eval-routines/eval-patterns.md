# Eval Patterns

Each eval follows the same 3-step shape: **mock dependencies → run code → assert output**.
The four files in `evals/` each use a variation of this pattern depending on what is being tested.

---

## Pattern 1 — Hook calls a mocked service

**File:** `evals/supabase-data.test.ts`
**Tests:** `useResponseSubmit`, `useSignature`
**What it checks:** Does the hook pass the right data shape to Supabase?

```
┌─────────────────────────────────────────┐
│  MOCK                                   │
│  Replace real supabase client with      │
│  fake functions (mockInsert,            │
│  mockStorageUpload, mockGetUser, …)     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  INPUT                                  │
│  Call the hook with controlled args     │
│  e.g. submitResponse('q-1','a-1',       │
│       'my note', 'sess-abc')            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CODE UNDER TEST                        │
│  useResponseSubmit / useSignature       │
│  hook logic runs                        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  ASSERT                                 │
│  mockInsert was called with             │
│  { question_id, answer_option_id,       │
│    session_id, free_text_note, … }      │
└─────────────────────────────────────────┘
```

**Tests in this file:**
- `inserts question_id, answer_option_id, and session_id correctly`
- `inserts free_text_note when provided`
- `sets free_text_note to null when omitted`
- `sets user_id to null when no auth user`
- `uploads PNG to the signatures bucket under {sessionId}/{timestamp}.png`
- `inserts session_id, signed_name, signature_url, and signed_at into signatures table`
- `returns null (not throws) if storage upload fails`

---

## Pattern 2 — React component renders mocked PDF primitives

**File:** `evals/pdf-mapping.test.tsx`
**Tests:** `ACDDocument`
**What it checks:** Does the PDF document component output the right content in the right format?

```
┌─────────────────────────────────────────┐
│  MOCK                                   │
│  Replace @react-pdf/renderer with       │
│  plain HTML equivalents                 │
│  (Document → <div>, Text → <span>, …)  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  INPUT                                  │
│  Render <ACDDocument> with fake props   │
│  answers, signedName, signedAt,         │
│  signatureDataUrl                       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CODE UNDER TEST                        │
│  ACDDocument component renders          │
│  its layout using PDF primitives        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  ASSERT                                 │
│  screen.getByText('1 June 2026')        │
│  screen.getAllByText('Jane Smith')       │
│  img src === signatureDataUrl           │
└─────────────────────────────────────────┘
```

**Tests in this file:**
- `renders all answers in the PDF output`
- `includes free_text_note values`
- `shows signedName in the signature section and footer`
- `passes signatureDataUrl to the Image component`
- `formats signedAt as Australian locale`
- `renders without error when caption is null`

---

## Pattern 3 — API route validates input and returns the right response

**File:** `evals/pdf-api.test.ts`
**Tests:** `POST /api/generate-pdf`
**What it checks:** Does the route reject bad input and return the correct headers on success?

```
┌─────────────────────────────────────────┐
│  MOCK                                   │
│  Replace renderToBuffer with a fake     │
│  that returns Buffer.from('fake-pdf')   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  INPUT                                  │
│  Construct a fake NextRequest with      │
│  a body (valid or deliberately broken)  │
│  e.g. missing signedName field          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CODE UNDER TEST                        │
│  POST handler in                        │
│  app/api/generate-pdf/route.ts runs     │
└──────────────────┬──────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
┌──────────────┐   ┌─────────────────────┐
│  ASSERT 400  │   │  ASSERT 200         │
│  if required │   │  Content-Type:      │
│  field is    │   │  application/pdf    │
│  missing     │   │  Content-Disposition│
└──────────────┘   │  safe filename      │
                   └─────────────────────┘
```

**Tests in this file:**
- `returns 400 if signedName is missing`
- `returns 400 if signatureDataUrl is missing`
- `returns 400 if signedAt is missing`
- `returns 400 if answers is not an array`
- `returns PDF response with correct Content-Type and Content-Disposition headers`
- `sanitizes signedName spaces and special chars into a safe filename`

---

## Pattern 4 — Page component assembles data from multiple mocked tables

**File:** `evals/signed-page-data.test.tsx`
**Tests:** `SignedPage`
**What it checks:** Does the signed page correctly load, deduplicate, and display all data from Supabase?

```
┌─────────────────────────────────────────┐
│  MOCK (many layers)                     │
│  supabase.from() → per-table responses  │
│  next/navigation → sessionId param      │
│  next-themes → resolvedTheme            │
│  motion/react → plain divs              │
│  WitnessMode → simplified stub          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  INPUT                                  │
│  setupFrom({ witnessData, responses })  │
│  configures which tables return what    │
│  then render(<SignedPage />)            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CODE UNDER TEST                        │
│  SignedPage queries 5 tables:           │
│  signatures, witness_signatures,        │
│  user_responses, questions,             │
│  answer_options — then assembles view   │
└──────────────────┬──────────────────────┘
                   │
          ┌────────┴──────────────┐
          ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│  ASSERT data     │   │  ASSERT edge cases   │
│  renders from    │   │  - deduplication     │
│  all 5 tables    │   │  - witness present   │
│  correctly       │   │  - witness absent    │
└──────────────────┘   │  - free text note    │
                       │  - unanswered q      │
                       └──────────────────────┘
```

**Tests in this file:**
- `loads and displays signature, questions, and answers for the session`
- `deduplicates responses so only the latest per question_id is used`
- `renders witness block when witness_signatures returns a record`
- `renders WitnessMode when witness_signatures returns null`
- `shows free_text_note as a note under the answer`
- `shows "Not answered" for questions with no matching response`

---

## Summary: the 3-step shape every eval shares

```
MOCK → INPUT → ASSERT
```

| Step   | What you control            | Why                                      |
|--------|-----------------------------|------------------------------------------|
| Mock   | All external dependencies   | Tests run fast, offline, deterministically |
| Input  | The data passed to your code | Makes the test repeatable and specific   |
| Assert | What the output must look like | Defines what "correct" means             |

The only difference between the four patterns is **what level** is under test:
- Pattern 1 → a React hook
- Pattern 2 → a React component (visual output)
- Pattern 3 → an API route (HTTP response)
- Pattern 4 → a full page (data assembly across many sources)
