# Features Directory

This directory contains feature-based modules organized by domain/functionality.

## Structure

Each feature is self-contained with its own:
- **components/** - React components specific to this feature
- **hooks/** - Custom React hooks for this feature
- **types/** - TypeScript types and interfaces
- **utils/** - Utility functions
- **schemas/** - Validation schemas (Zod)
- **api/** - API client code (not routes - those go in /app/api)

## Current Features

### `/auth`
User authentication and authorization
- Login, signup, password reset
- Session management
- Auth state hooks

### `/directive`
The main ACD form creation feature
- Multi-step form components
- Form state management
- Auto-save functionality
- Validation schemas

### `/pdf`
PDF generation for legally compliant ACDs
- PDF templates using react-pdf
- Document formatting
- NSW legal compliance

### `/ai-enhancement`
Optional AI text enhancement using Claude
- Text improvement suggestions
- User voice preservation
- Enhancement UI components

### `/support`
Trauma-informed support features
- Breathing exercises
- Resource links
- Crisis support content

## Usage Pattern

### Import from features in your pages:

```tsx
// app/paced/page.tsx
import { DirectiveForm } from '@/features/directive/components/DirectiveForm'
import { useFormState } from '@/features/directive/hooks/useFormState'

export default function PacedFlowPage() {
  const { formData, updateFormData } = useFormState()
  return <DirectiveForm data={formData} onUpdate={updateFormData} />
}
```

## Best Practices

1. **Keep features independent** - Don't import from other features directly
2. **Use shared components** - Put truly shared UI in `/components`
3. **One feature, one directory** - All related code stays together
4. **Export via index.ts** - Use barrel exports for clean imports
