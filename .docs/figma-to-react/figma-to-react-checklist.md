# Figma to React Checklist

**When you type `#f`, Claude follows these instructions for creating components from Figma designs.**

---

## Index

1. [MANDATORY Rules](#mandatory-rules) - Core requirements (shadcn/ui, theme tokens, forms, responsive, search existing)
2. [Figma Workflow](#figma-workflow) - MCP commands, token handling, workflow steps
3. [Quick Reference](#quick-reference) - Theme tokens, breakpoints, spacing, typography
4. [Component Patterns](#component-patterns) - Copy-paste examples (buttons, forms, cards)
5. [Accessibility](#accessibility-a11y) - a11y requirements and examples
6. [Component Creation Checklist](#component-creation-checklist) - Step-by-step process
7. [Common Mistakes](#common-mistakes) - Do's and don'ts
8. [Quick Commands](#quick-commands) - Install commands
9. [Context](#context-trauma-informed-acd-app) - App-specific design principles

---

## MANDATORY Rules

### 1. ONLY shadcn/ui
- ✅ Use `@/components/ui/` components + `cn()` utility
- ❌ NO other UI libraries

### 2. ONLY Theme Tokens
- ✅ Use: `bg-primary`, `text-foreground`, `bg-background`, `border-border`
- ❌ NO: `#fff`, `rgb()`, `bg-blue-500`, arbitrary values
- **Why**: Auto light/dark mode via `next-themes`

### 3. ONLY React Hook Form (forms only)
- ✅ `useForm` + `zodResolver` + zod schemas + shadcn/ui Form
- ❌ NO other form libraries

### 4. Mobile-First Responsive
- ✅ Breakpoints: `md:`, `lg:`, `xl:`
- ✅ Touch targets: min 44px (`h-12`)
- ✅ Scale typography: `text-2xl md:text-3xl lg:text-4xl`
- ✅ Scale spacing: `px-4 md:px-8 lg:px-12 xl:px-60`
- ✅ Constrain text: `max-w-prose`

### 5. ALWAYS Check Existing Components FIRST
- ✅ **Search repo BEFORE creating anything**
- ✅ **Molecules/Organisms: Compose from existing atoms**
- ❌ NO duplicate components

**Hierarchy**: Atoms (shadcn/ui) → Molecules (2-3 atoms) → Organisms (complex) → Pages

---

## Figma Workflow

### When Given Figma Link:

1. **Get Variables FIRST (MANDATORY)**
   ```typescript
   mcp_figma_get_variable_defs({ nodeId, fileKey })  // ALWAYS FIRST
   mcp_figma_get_design_context({ nodeId, fileKey }) // Then design
   mcp_figma_get_screenshot({ nodeId, fileKey })     // Then screenshot
   ```

2. **Extract Node ID from URL**
   ```
   https://figma.com/design/:fileKey/:fileName?node-id=1-2
   Node ID: 1:2 (replace - with :)
   ```

3. **Handle New Design Tokens**
   - Find new tokens? → **NOTIFY USER** (don't create)
   - Wait for approval
   - Add to `app/globals.css` first
   - Map Figma → CSS var → Tailwind class
   - ❌ NEVER use Figma values directly

**Workflow**:
```
Figma link → Get variables → Get design → Search existing components
→ New tokens? Notify user → Approved? Add to globals.css
→ Map tokens → Identify component type → Compose from existing → Build
```

## Quick Reference

### Theme Tokens
```typescript
// Colors
bg-background, text-foreground, bg-card, text-card-foreground
bg-primary, text-primary-foreground, bg-secondary, text-secondary-foreground
bg-muted, text-muted-foreground, bg-accent, text-accent-foreground
bg-destructive, text-destructive-foreground, border-border, ring-ring

// Icons (≤48px: standard weight, >48px: ICON_STROKE_WIDTH)
import { ICON_STROKE_WIDTH } from "@/lib/theme-config"
<Info size={24} />  // ≤48px: standard
<Heart size={64} strokeWidth={ICON_STROKE_WIDTH} />  // >48px: thin
```

### Breakpoints
- Mobile: `< 768px` (default)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+), `xl:` (1280px+)

### Spacing Patterns (Progressive Scaling)
| Context | Mobile → md → lg → xl |
|---------|----------------------|
| Page horizontal | `px-4` → `px-8` → `px-32` → `px-60` |
| Page vertical | `py-6` → `py-8` → `py-12` |
| Card padding | `py-4 p-4` → `py-6 p-6` → `py-6 p-6` |
| Section gaps | `gap-6` → `gap-8` → `gap-12` |
| Button groups | `gap-2` → `gap-3` → `gap-4` |

**Rule**: Scale progressively, avoid big jumps (e.g., `px-5 md:px-8 lg:px-32 xl:px-60` ✅)

**Card headers**: Use consistent 24px (`py-6 gap-6`) for all desktop sizes, no progressive scaling. Buttons inside use `py-0` to avoid extra padding.

### Touch Targets & Typography
- Buttons: `h-12` mobile, `h-12 md:h-10` desktop
- Inputs: `h-12 md:h-10`
- H1: `text-2xl md:text-3xl lg:text-4xl`
- Body: `text-base md:text-lg`
- Content width: `max-w-prose` (emotional), `max-w-4xl` (forms), `max-w-7xl` (dashboard)

## Component Patterns

### Button
```tsx
<Button className="h-12 md:h-10" variant="default">Click Me</Button>
```

### Form Input
```tsx
<div className="space-y-2">
  <Label>Label</Label>
  <Input className="h-12 md:h-10" />
</div>
```

### Page Container
```tsx
<div className="min-h-screen px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12 bg-background">
  <div className="max-w-7xl mx-auto">{children}</div>
</div>
```

### Card
```tsx
<div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">{children}</div>
```

### React Hook Form
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({ field: z.string().min(1) })
const form = useForm({ resolver: zodResolver(schema) })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField control={form.control} name="field" render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl><Input className="h-12 md:h-10" {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  </form>
</Form>
```

## Accessibility (a11y)

**All components MUST follow WCAG 2.1 AA**

### Required Attributes
- Icon-only buttons: `aria-label="Description"`
- Images: `alt="Description"` or `alt=""` (decorative)
- Hidden text on mobile: Add `aria-label` to parent
- Dynamic content: `role="status" aria-live="polite"` (success) or `role="alert" aria-live="assertive"` (errors)
- Progress: `aria-live="polite"` on counters
- Navigation: `aria-current="page"` or `aria-current="step"`

### Examples
```tsx
// Icon button
<Button aria-label="Close dialog"><X size={24} /></Button>

// Image
<img src={url} alt={question.image_alt || "Question illustration"} />

// Hidden text
<Button aria-label="Journal">
  <Feather />
  <span className="hidden sm:inline">Journal</span>
</Button>

// Status message
<div role="status" aria-live="polite">{successMessage}</div>
```

### Focus Management
- Move focus on navigation (e.g., to new question heading)
- Trap focus in modals
- Return focus to trigger on modal close

## Component Creation Checklist

- [ ] Get variables: `mcp_figma_get_variable_defs()` **FIRST**
- [ ] Get design: `mcp_figma_get_design_context()`
- [ ] Search existing components (Glob/Grep)
- [ ] New tokens? **NOTIFY USER** (don't create)
- [ ] Map tokens to globals.css after approval
- [ ] Identify component type (atom/molecule/organism)
- [ ] Compose from existing components

### During Creation
- [ ] Use shadcn/ui + theme tokens only
- [ ] NO Figma values directly, NO hardcoded colors
- [ ] Icons: ≤48px standard weight, >48px `ICON_STROKE_WIDTH`
- [ ] Responsive: `h-12 md:h-10`, progressive spacing
- [ ] a11y: `aria-label`, `alt`, `aria-live` regions
- [ ] Forms: React Hook Form + zod

### Post-Creation
- [ ] Test light/dark mode
- [ ] Test all breakpoints (mobile/tablet/desktop)
- [ ] No hardcoded values (`#`, `rgb`, `bg-blue-`)

## Common Mistakes

**❌ DON'T:**
- Create components without searching existing
- Use Figma values directly (`#2563EB`, `bg-[#2563EB]`)
- Hardcode colors, spacing, or stroke widths
- Use `ICON_STROKE_WIDTH` on icons ≤48px
- Skip responsive classes or progressive scaling

**✅ DO:**
- Search repo first (Glob/Grep)
- Compose from existing components
- Map Figma → globals.css → theme tokens
- Use progressive scaling: `px-4 md:px-8 lg:px-32 xl:px-60`
- Icons ≤48px: `<Info size={24} />` (standard)
- Icons >48px: `<Heart size={64} strokeWidth={ICON_STROKE_WIDTH} />`

## Quick Commands

```bash
npx shadcn@latest add button
npm install react-hook-form zod @hookform/resolvers
```

## Context: Trauma-Informed ACD App
- Older adults are key users
- Generous spacing, calm aesthetics
- Large touch targets (`h-12`), constrained text width (`max-w-prose`)
- Readability is critical

---

**Version 2.0** | Condensed for reduced context usage
