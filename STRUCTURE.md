# Project Structure

This document explains the organization of the Advance Care Directive web application.

## Directory Overview

```
advance-care-directive/
├── app/                          # Next.js App Router (ROUTES ONLY)
├── features/                     # Feature-based modules (BUSINESS LOGIC)
├── components/                   # Shared UI components
├── lib/                         # Shared utilities
└── .docs/                       # Project documentation
```

---

## `/app` - Routes & Pages

**Purpose:** File-based routing. Each folder/file here creates a URL route.

```
app/
├── (marketing)/                 # Route group (doesn't affect URL)
│   ├── page.tsx                # Landing page "/"
│   └── layout.tsx
│
├── (flows)/                    # Route group for form flows
│   ├── paced/
│   │   ├── page.tsx           # "/paced"
│   │   └── [step]/page.tsx    # "/paced/about-you", etc.
│   └── fast/
│       ├── page.tsx           # "/fast"
│       └── [step]/page.tsx    # "/fast/about-you", etc.
│
├── dashboard/
│   └── page.tsx               # "/dashboard"
│
├── api/                       # API routes (backend)
│   ├── enhance/route.ts       # POST /api/enhance
│   └── generate-pdf/route.ts  # POST /api/generate-pdf
│
├── layout.tsx                 # Root layout
└── globals.css                # Global styles
```

### Route Groups: `(marketing)` and `(flows)`
Folders in parentheses DON'T appear in the URL. They're for organization only.
- `app/(marketing)/page.tsx` → URL is `/` (not `/marketing`)
- `app/(flows)/paced/page.tsx` → URL is `/paced` (not `/flows/paced`)

---

## `/features` - Business Logic

**Purpose:** Domain-specific code organized by feature/module.

```
features/
├── auth/                      # Authentication feature
│   ├── components/           # Login/Signup forms
│   ├── hooks/                # useAuth, useSession
│   └── types/                # User, Session types
│
├── directive/                 # Main ACD form feature
│   ├── components/
│   │   ├── sections/         # AboutYouSection, ValuesSection, etc.
│   │   ├── DirectiveForm.tsx
│   │   └── ProgressIndicator.tsx
│   ├── hooks/
│   │   ├── useFormState.ts   # Form data management
│   │   └── useAutoSave.ts    # Auto-save to Supabase
│   ├── schemas/              # Zod validation schemas
│   └── types/                # DirectiveData, FormStep types
│
├── pdf/                       # PDF generation
│   ├── templates/            # react-pdf templates
│   ├── components/           # PDF-specific components
│   └── utils/                # PDF formatting helpers
│
├── ai-enhancement/            # Claude AI text enhancement
│   ├── components/           # Enhancement UI
│   └── api/                  # Claude API client
│
└── support/                   # Trauma-informed features
    ├── components/           # BreathingExercise, ResourceLinks
    └── content/              # Support text content
```

### How Pages Use Features

Pages are thin orchestration layers:

```tsx
// app/(flows)/paced/page.tsx
import { DirectiveForm } from '@/features/directive/components/DirectiveForm'
import { useFormState } from '@/features/directive/hooks/useFormState'

export default function PacedFlowPage() {
  const { formData, updateFormData } = useFormState()
  return <DirectiveForm data={formData} onUpdate={updateFormData} />
}
```

---

## `/components` - Shared UI Components

**Purpose:** Reusable components used across multiple features.

```
components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
│
├── forms/                     # Shared form components
│   ├── FormField.tsx
│   └── FormError.tsx
│
└── layout/                    # Layout components
    └── theme-provider.tsx
```

**When to use `/components` vs `/features`:**
- `/components` → Used by 2+ features (e.g., Button, Input)
- `/features/[name]/components` → Only used by that feature

---

## `/lib` - Shared Utilities

**Purpose:** Utilities and configurations used across the app.

```
lib/
├── supabase/                  # Supabase client & helpers
├── validations/               # Shared validation utilities
└── utils.ts                   # cn() for Tailwind, etc.
```

---

## Import Patterns

### Absolute Imports with `@/`

```tsx
// ✅ Good - Clean, absolute imports
import { DirectiveForm } from '@/features/directive/components/DirectiveForm'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ❌ Bad - Relative imports get messy
import { DirectiveForm } from '../../../features/directive/components/DirectiveForm'
```

### Barrel Exports

Each feature has `index.ts` files for cleaner imports:

```tsx
// Instead of:
import { DirectiveForm } from '@/features/directive/components/DirectiveForm'
import { ProgressIndicator } from '@/features/directive/components/ProgressIndicator'

// You can do:
import { DirectiveForm, ProgressIndicator } from '@/features/directive/components'
```

---

## Key Principles

1. **Routes in `/app`, logic in `/features`**
   - Pages are thin wrappers
   - Business logic lives in features

2. **Organize by feature, not by file type**
   - ✅ `/features/directive/{components,hooks,types}`
   - ❌ `/components/directive`, `/hooks/directive`

3. **Keep features independent**
   - Features shouldn't import from other features
   - Share via `/components` or `/lib` if needed

4. **Use TypeScript paths**
   - Always use `@/` imports
   - Never use relative paths like `../../../`

---

## Next Steps

As you build, follow this pattern:

1. **Create a new feature:** Add to `/features`
2. **Create a new page:** Add to `/app`
3. **Create shared UI:** Add to `/components`
4. **Create utilities:** Add to `/lib`

See `/features/README.md` for more details on the features directory.
