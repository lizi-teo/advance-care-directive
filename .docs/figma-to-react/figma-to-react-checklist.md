# Figma to React Quick Reference Checklist

**READ THIS BEFORE CREATING ANY COMPONENT**

This is a condensed quick reference for creating components from Figma. For detailed explanations, see `figma-to-react-base.md`.

---

## MANDATORY Requirements

### 1. **ONLY shadcn/ui**
- ✅ Use shadcn/ui components as base (`@/components/ui/`)
- ✅ Extend with `cn()` utility
- ❌ NO Material UI, Flowbite, Ant Design, or other UI libraries

### 2. **ONLY Theme Provider Tokens**
- ✅ Use: `bg-primary`, `text-foreground`, `bg-background`, `border-border`, `bg-card`, etc.
- ❌ NO hardcoded colors: `#fff`, `rgb()`, `bg-blue-500`, `text-red-600`
- ❌ NO arbitrary values
- **Why**: Ensures automatic light/dark mode support via `next-themes`

### 3. **ONLY React Hook Form** (for forms)
- ✅ Use `useForm` hook with `zodResolver`
- ✅ Define zod validation schemas
- ✅ Integrate with shadcn/ui Form components
- ❌ NO Formik, Final Form, or other form libraries

### 4. **Mobile-First Responsive Design**
- ✅ Add responsive breakpoints: `md:`, `lg:`
- ✅ Touch targets minimum 44x44px on mobile (`h-12` or `h-11`)
- ✅ Typography scales: `text-2xl md:text-3xl lg:text-4xl`
- ✅ Spacing increases: `px-4 md:px-8 lg:px-12`
- ✅ Constrain long-form content: `max-w-prose` or `max-w-3xl`

### 5. **ALWAYS Check for Existing Components FIRST**
- ✅ **CRITICAL: Search repository for existing components before creating new ones**
- ✅ **Molecules & Organisms: ALWAYS compose from existing atoms/molecules**
- ✅ Check `components/ui/` for shadcn/ui base components
- ✅ Search codebase for custom components that match Figma design
- ❌ NO duplicate components - reuse and extend existing ones

**Component Hierarchy:**
- **Atoms**: Basic shadcn/ui components (Button, Input, Card, etc.)
- **Molecules**: Compositions of 2-3 atoms (e.g., SearchBar = Input + Button)
- **Organisms**: Complex compositions using molecules and atoms (e.g., HeaderCard, QuestionCard)
- **Pages**: Full page layouts using organisms, molecules, and atoms

**When working with Figma links:**
1. Extract design from Figma
2. **BEFORE creating anything:** Search repository for similar existing components
3. Identify if design is atom, molecule, or organism
4. For molecules/organisms: Find and use existing components to compose
5. Only create NEW atoms if shadcn/ui doesn't have it AND it doesn't exist in repo

---

## Figma MCP Workflow (CRITICAL)

### When You Provide a Figma Link

**MANDATORY: Use Figma MCP Server Commands**

1. **Extract Design Data from Figma**
   ```typescript
   // CRITICAL: ALWAYS GET VARIABLES FIRST - This is MORE IMPORTANT than getting design
   // Variables must be retrieved before anything else to ensure proper token mapping

   // 1. GET VARIABLES FIRST (MANDATORY)
   mcp_figma_dev_mod_get_variable_defs({ nodeId, ... })

   // 2. Then get other data (in any order)
   mcp_figma_get_figma_data({ fileKey, nodeId })
   mcp_figma_dev_mod_get_code({ nodeId, ... })
   mcp_figma_dev_mod_get_image({ nodeId, ... })
   ```

2. **Extract Node ID from Figma URL**
   ```
   URL: https://figma.com/design/:fileKey/:fileName?node-id=1-2
   Node ID: 1:2 (replace hyphens with colons)
   ```

### Design Token Handling Workflow

**CRITICAL: Design tokens from Figma are REFERENCE ONLY**

#### Step 1: Identify New Design Tokens
When analyzing Figma design, if you find NEW tokens (colors, spacing, typography, etc.) that don't exist in our theme:

**❌ DO NOT create them automatically**
**✅ NOTIFY the user first**

Example notification:
```
⚠️ NEW DESIGN TOKENS IDENTIFIED:

Colors:
- Brand Blue: #2563EB (used for CTA buttons)
- Success Green: #10B981 (used for completion states)

Spacing:
- XXL: 96px (used for hero sections)

NEXT STEP: Should I map these to theme provider and globals.css?
Suggested mapping:
- Brand Blue → --color-brand-primary
- Success Green → --color-success
- XXL spacing → Add to Tailwind config
```

#### Step 2: Create Tokens in Theme Provider FIRST
After user approval, create tokens in this order:

1. **Add to `app/globals.css`** (CSS Variables)
   ```css
   :root {
     --color-brand-primary: oklch(...);
     --color-success: oklch(...);
   }

   .dark {
     --color-brand-primary: oklch(...);
     --color-success: oklch(...);
   }
   ```

2. **Map to Tailwind** (if needed)
   Update `tailwind.config.js` or use `@theme inline` in globals.css

3. **Document the mapping**
   Create mapping from Figma token → CSS variable → Tailwind class

#### Step 3: Map All Figma Tokens to Theme
**MANDATORY: Every design token from Figma MUST be mapped**

| Figma Token | CSS Variable | Tailwind Class | Usage |
|-------------|--------------|----------------|-------|
| Primary Blue #2563EB | `--color-primary` | `bg-primary` | Primary actions |
| Text Dark #1F2937 | `--foreground` | `text-foreground` | Body text |
| Spacing 16px | (use Tailwind) | `p-4` / `m-4` | Standard spacing |

**Never use Figma values directly in components!**

```tsx
// ❌ WRONG - Using Figma values directly
<div style={{ backgroundColor: '#2563EB' }}>

// ❌ WRONG - Creating arbitrary values
<div className="bg-[#2563EB]">

// ✅ CORRECT - Using mapped theme tokens
<div className="bg-primary">
```

### Design Token Reference vs Implementation

**Figma Design Tokens = REFERENCE**
- Use to understand designer's intent
- Identify color palette, spacing system, typography scale
- Note patterns and consistency

**Theme Provider & globals.css = IMPLEMENTATION**
- Single source of truth for the application
- Ensures light/dark mode compatibility
- Maintains consistency across all components

### Workflow Summary

```
1. User provides Figma link
   ↓
2. **CRITICAL: Get variables FIRST using mcp_figma_dev_mod_get_variable_defs()**
   ↓
3. Use other Figma MCP commands to extract design (code, image, etc.)
   ↓
4. **CRITICAL: Search repository for existing components (Glob, Grep)**
   ↓
5. Identify design tokens from variables
   ↓
6. Check if tokens exist in globals.css
   ↓
7. NEW tokens? → NOTIFY USER (don't create yet)
   ↓
8. User approves → Create in globals.css + theme provider FIRST
   ↓
9. Map Figma tokens to CSS variables
   ↓
10. Identify component type (atom/molecule/organism)
   ↓
11. For molecules/organisms → Find existing components to compose
   ↓
12. Use mapped tokens in components (bg-primary, text-foreground, etc.)
   ↓
13. NEVER use Figma values directly in code
   ↓
14. NEVER create duplicate components - reuse existing ones
```

---

## Quick Reference Tables

### Available Theme Tokens

```typescript
// Colors (ALWAYS use these)
bg-background, text-foreground
bg-card, text-card-foreground
bg-popover, text-popover-foreground
bg-primary, text-primary-foreground
bg-secondary, text-secondary-foreground
bg-muted, text-muted-foreground
bg-accent, text-accent-foreground
bg-destructive, text-destructive-foreground
border-border, border-input
ring-ring

// Radius (maps to --radius-* variables)
rounded-sm, rounded-md, rounded-lg, rounded-xl

// Icon Configuration (from lib/theme-config.ts)
import { ICON_STROKE_WIDTH } from "@/lib/theme-config"
// Use: <IconName size={24} strokeWidth={ICON_STROKE_WIDTH} />
```

### Responsive Breakpoints

| Breakpoint | Size | Tailwind Prefix | Usage |
|------------|------|-----------------|-------|
| Mobile | < 768px | (none) | Default/base styles |
| Tablet | 768px+ | `md:` | Medium screens |
| Desktop | 1024px+ | `lg:` | Large screens |
| Desktop | 1280px+ | `xl:` | Extra large |

### Spacing Patterns

**IMPORTANT: Margins and padding must scale progressively across breakpoints**

| Context | Mobile | Tablet (md) | Desktop (lg) | Large Desktop (xl) |
|---------|--------|-------------|--------------|-------------------|
| Page horizontal margins | `px-4` or `px-5` | `px-8` | `px-24` or `px-32` | `px-60` |
| Page vertical padding | `py-6` | `py-8` | `py-12` | `py-12` |
| Card padding | `p-4` | `p-6` | `p-8` | `p-8` |
| Section gaps | `space-y-6` | `space-y-8` | `space-y-12` | `space-y-12` |
| Form fields | `space-y-4` | `space-y-6` | `space-y-6` | `space-y-6` |
| Button groups | `gap-2` | `gap-3` | `gap-4` | `gap-4` |

**Example - Progressive Horizontal Margins:**
```tsx
// ❌ WRONG - Jumps from 20px to 240px
<div className="px-5 md:px-60">

// ✅ CORRECT - Scales progressively
<div className="px-5 md:px-8 lg:px-32 xl:px-60">
//             20px → 32px → 128px → 240px
```

**Why this matters:**
- Prevents cramped layouts on tablet/small desktop (768-1024px)
- Ensures content has breathing room at each breakpoint
- Avoids jarring jumps in spacing
- Prioritizes content width on constrained screens

**Example - Progressive Gaps Between Elements:**
```tsx
// ❌ WRONG - Fixed or jumping gaps
<div className="flex gap-8">
<div className="flex gap-2 md:gap-8">  // Too big a jump

// ✅ CORRECT - Progressive gaps
<div className="flex gap-4 md:gap-5 lg:gap-6 xl:gap-8">
//             16px → 20px → 24px → 32px

// ✅ CORRECT - Progressive vertical spacing
<div className="space-y-6 lg:space-y-8 xl:space-y-10">
//             24px → 32px → 40px
```

**Rule of Thumb:**
- Small gaps (buttons, inline elements): `gap-2` → `gap-3` → `gap-4` → `gap-6`
- Medium gaps (cards, sections): `gap-4` → `gap-5` → `gap-6` → `gap-8`
- Large gaps (major sections): `gap-6` → `gap-8` → `gap-10` → `gap-12`

### Touch Target Sizes

**Button Sizes (Standard - 48px for mobile accessibility):**

| Size | Height | Figma Name | Usage |
|------|--------|------------|-------|
| `sm` | `h-10` (40px) | "Default" | Compact UIs, desktop secondary actions |
| `default` | `h-12` (48px) | "Large" | Standard mobile/desktop buttons (recommended) |
| `lg` | `h-12` (48px) | "Large" | Emphasized CTAs |

**Note:** 48px (h-12) is the recommended standard for mobile touch accessibility. Tablet/desktop can use same size or optionally scale down with responsive classes (e.g., `h-12 md:h-10`).

**Other Components:**

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Icon buttons | `h-12 w-12` | `h-10 w-10` |
| Form inputs | `h-12` (48px) | `h-10` (40px) |

### Typography Scaling

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| H1 | `text-2xl` | `text-3xl` | `text-4xl` |
| H2 | `text-xl` | `text-2xl` | `text-3xl` |
| H3 | `text-lg` | `text-xl` | `text-2xl` |
| Body | `text-base` | `text-lg` | `text-lg` |

### Content Width Constraints

| Content Type | Max Width |
|--------------|-----------|
| Emotional/reflective | `max-w-prose` or `max-w-3xl` |
| Forms | `max-w-4xl` or `max-w-5xl` |
| Dashboard | `max-w-7xl` |

---

## Component Patterns (Copy-Paste Ready)

### Icons with Theme Stroke Width

**IMPORTANT RULE: Icon sizes 32px and smaller use standard weight**

```tsx
import { ICON_STROKE_WIDTH } from "@/lib/theme-config"
import { Heart, ChevronLeft, Menu, Info, Plus } from "lucide-react"

// ✅ Icons 32px and SMALLER - Use standard weight (omit strokeWidth or use default)
<Info size={24} />  // Standard weight for better visibility
<Plus size={20} />  // Standard weight for better visibility
<Heart size={32} /> // Standard weight at 32px

// ✅ Icons LARGER than 32px - Use ICON_STROKE_WIDTH
<Heart size={64} strokeWidth={ICON_STROKE_WIDTH} />
<Menu size={48} strokeWidth={ICON_STROKE_WIDTH} />
<ChevronLeft size={40} strokeWidth={ICON_STROKE_WIDTH} />
```

**Why this rule?**
- Small icons (≤32px) with thin strokes are hard to see and appear too light
- Standard Lucide stroke width (2) provides better visibility for small icons
- Large icons (>32px) can use thin strokes (0.5) for elegant appearance
- Maintains consistency with design system while ensuring usability

### Basic Button

```tsx
<Button
  className="h-12 md:h-10 px-6 md:px-4"
  variant="default"
>
  Click Me
</Button>
```

### Form Input

```tsx
<div className="space-y-2">
  <Label className="text-sm md:text-base">Label</Label>
  <Input
    className="h-12 md:h-10 px-4 md:px-3 text-base"
  />
</div>
```

### Page Container

```tsx
<div className="min-h-screen px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12 bg-background">
  <div className="max-w-7xl mx-auto">
    {children}
  </div>
</div>
```

### Content Section (Long-form)

```tsx
<section className="max-w-prose mx-auto px-4 md:px-8 py-6 md:py-8 lg:py-12">
  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-foreground">
    {title}
  </h2>
  <div className="text-base md:text-lg leading-relaxed text-muted-foreground space-y-4 md:space-y-6">
    {children}
  </div>
</section>
```

### Card

```tsx
<div className="bg-card border border-border rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 shadow-sm">
  {children}
</div>
```

### Button Group

```tsx
<div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center justify-end">
  <Button variant="outline" className="h-12 md:h-10">Cancel</Button>
  <Button className="h-12 md:h-10">Continue</Button>
</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {children}
</div>
```

### Form with React Hook Form

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  field: z.string().min(1, "Required"),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { field: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Label</FormLabel>
              <FormControl>
                <Input className="h-12 md:h-10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-12 md:h-10">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## Component-Specific Responsive Patterns

### Header Question Card (QA Screens)

**Image Presentation Differs Between Mobile and Desktop:**

#### Mobile (Small Screen):
- Image is **part of the header-card component**
- Rendered as horizontal banner at the bottom of the card
- Height: 120px, spans full card width
- Shows cropped horizontal view of image
- Included in the card's component structure

#### Desktop (Large Screen):
- Image is **separate from the header-card component**
- Rendered as vertical sidebar/panel (428px × 438px)
- Positioned as a sibling element in the page layout
- Placed to the LEFT of question options
- Has rounded bottom corners (`rounded-bl-full rounded-br-full`)
- Shows more vertical portion of the image

**Implementation Notes:**
```tsx
// Mobile: Image inside header-card component
<HeaderQuestionCard>
  {/* card content */}
  <div className="h-[120px] w-full md:hidden"> {/* Image banner */}
    <img src={image} />
  </div>
</HeaderQuestionCard>

// Desktop: Image as separate layout element
<div className="hidden md:flex md:gap-8">
  <div className="w-[428px] h-[438px] rounded-b-full"> {/* Separate image */}
    <img src={image} />
  </div>
  <div className="flex-1">
    <HeaderQuestionCard /> {/* Card without image */}
    {/* Question options */}
  </div>
</div>
```

---

## Component Creation Checklist

### Pre-Creation (Figma Link Provided)
- [ ] **Extract design from Figma using MCP commands**
  - [ ] Parse Figma URL to get fileKey and nodeId
  - [ ] **CRITICAL: Use `mcp_figma_dev_mod_get_variable_defs()` FIRST (MANDATORY) - Variables are MORE IMPORTANT than design**
  - [ ] Use `mcp_figma_get_figma_data()` to get component structure
  - [ ] Use `mcp_figma_dev_mod_get_code()` for design specs
- [ ] **CRITICAL: Search for existing components BEFORE creating anything**
  - [ ] Use Glob to search `components/ui/**/*.tsx` for similar components
  - [ ] Use Grep to search for component names/patterns in the codebase
  - [ ] Identify if similar atoms, molecules, or organisms already exist
  - [ ] **For molecules/organisms:** List all existing components that could be reused
  - [ ] **NOTIFY USER** if existing components are found that match the design
  - [ ] Only proceed with new component if nothing similar exists
- [ ] **Identify design tokens from Figma**
  - [ ] Extract colors, spacing, typography, shadows, etc.
  - [ ] Check if tokens already exist in `app/globals.css`
  - [ ] If NEW tokens found → NOTIFY USER (do not create automatically)
  - [ ] Wait for approval before creating new tokens
- [ ] **Map Figma tokens to existing theme**
  - [ ] Create mapping table: Figma token → CSS variable → Tailwind class
  - [ ] Document any missing tokens that need to be created
  - [ ] Ensure all Figma colors map to semantic theme tokens
- [ ] **Determine component type and composition strategy**
  - [ ] Is this an atom, molecule, or organism?
  - [ ] What existing components will be used to build this?
  - [ ] Create composition plan using existing components

### Pre-Creation (General)
- [ ] Verify shadcn/ui is installed
- [ ] Verify React Hook Form and zod are installed
- [ ] Verify next-themes is installed
- [ ] Check if shadcn/ui already has this component (`npx shadcn@latest add [component]`)

### During Creation
- [ ] Use shadcn/ui base component from `@/components/ui/`
- [ ] Apply ONLY theme tokens (no hardcoded colors, NO Figma values directly)
- [ ] Map ALL Figma design tokens to theme provider tokens
- [ ] Icons use `ICON_STROKE_WIDTH` from `@/lib/theme-config`
- [ ] Add responsive classes (md:, lg:) to ALL elements
- [ ] Typography scales across breakpoints
- [ ] Touch targets minimum 44px on mobile (h-12 or h-11)
- [ ] Spacing increases with screen size (px-4 md:px-8 lg:px-12)
- [ ] Long-form content constrained (max-w-prose)
- [ ] Forms use React Hook Form + zod
- [ ] TypeScript interfaces extend shadcn/ui types

### Post-Creation Validation
- [ ] NO hardcoded colors (search for `#`, `rgb`, `bg-blue-`)
- [ ] NO Figma values used directly in code
- [ ] ALL colors use theme tokens (bg-primary, text-foreground, etc.)
- [ ] ALL design tokens properly mapped from Figma → theme provider
- [ ] Component is responsive at all breakpoints
- [ ] Touch targets meet 44px minimum on mobile
- [ ] Text is readable (min 16px base, constrained width)
- [ ] Test in light AND dark mode
- [ ] Test on mobile (< 768px), tablet (768-1024px), desktop (1024px+)

---

## Common Mistakes to Avoid

### ❌ DON'T
```tsx
// Creating new components without checking for existing ones
// ❌ You saw a card design in Figma and immediately created a new component
export function NewCard() { ... } // But Card already exists!

// Duplicating existing components with different names
// ❌ Creating HeaderBanner when HeaderCard already exists with same functionality
export function HeaderBanner() { ... }

// Building molecules from scratch instead of composing atoms
// ❌ Creating a custom SearchInput when you could use Input + Button
export function SearchInput() {
  return <div><input /><button /></div> // Should use shadcn/ui components!
}

// Using Figma values directly
<div style={{ backgroundColor: '#2563EB' }}> // Figma primary blue
<div className="bg-[#2563EB]"> // Arbitrary Figma color

// Creating tokens without user approval
// (You identified a new color in Figma)
const newBrandColor = '#10B981'; // ❌ Don't do this!

// Hardcoded colors
<div className="bg-blue-500 text-white">

// Hardcoded icon stroke widths
<Heart size={24} strokeWidth={0.5} /> // ❌ Hardcoded! Also too thin for small icons
<Menu size={20} strokeWidth={1} /> // ❌ Inconsistent!

// Using ICON_STROKE_WIDTH on small icons (makes them too thin)
<Info size={24} strokeWidth={ICON_STROKE_WIDTH} /> // ❌ Too thin! Use standard weight for ≤32px

// Hardcoded spacing values
<div style={{ padding: '16px' }}>

// Non-responsive
<h1 className="text-4xl">Title</h1>

// Small touch targets on mobile
<button className="h-8 w-8">

// Full-width text (hard to read)
<div className="w-full">
  <p>Very long paragraph...</p>
</div>

// Using other UI libraries
import { Button } from '@mui/material'

// Hardcoded form validation
const [errors, setErrors] = useState({})
```

### ✅ DO
```tsx
// 1. FIRST: Search for existing components
// Use Glob to find similar components
// Use Grep to search for patterns
// ✅ Found existing HeaderCard component - reuse it!

// 2. Compose molecules/organisms from existing atoms
// ✅ Build SearchBar using existing Input + Button components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  return (
    <div className="flex gap-2">
      <Input className="h-12 md:h-10" placeholder="Search..." />
      <Button className="h-12 md:h-10">Search</Button>
    </div>
  )
}

// 3. Extract from Figma using MCP
const figmaData = await mcp_figma_get_figma_data({ fileKey, nodeId })

// 4. Identify new tokens and NOTIFY user
// Found Figma primary: #2563EB
// ⚠️ USER: Should I map this to --color-brand-primary?

// 5. After approval, map to theme tokens
<div className="bg-primary text-primary-foreground"> // Maps to Figma primary

// 6. Use correct stroke width for icons based on size
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
<Info size={24} /> // ✅ Icons ≤32px use standard weight (better visibility)
<Heart size={64} strokeWidth={ICON_STROKE_WIDTH} /> // ✅ Large icons use thin weight

// 7. Use Tailwind spacing (not Figma pixel values)
<div className="p-4 md:p-6 lg:p-8">

// Responsive typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>

// Proper touch targets
<button className="h-12 md:h-10 w-12 md:w-10">

// Constrained reading width
<div className="max-w-prose mx-auto px-4 md:px-8">
  <p className="text-base md:text-lg leading-relaxed">Long paragraph...</p>
</div>

// shadcn/ui components
import { Button } from '@/components/ui/button'

// React Hook Form + zod
const form = useForm({ resolver: zodResolver(schema) })
```

---

## Application Context Reminders

**This is a trauma-informed ACD application:**
- Older adults are a key user group
- Users read and write emotional content
- Spacing should feel generous and calming
- Readability is critical
- Touch targets must be comfortable

**Design Principles:**
- **Generous spacing**: More whitespace reduces overwhelm
- **Constrained width**: 60-80 characters per line for emotional content
- **Large touch targets**: Easier for older adults and mobile users
- **Clear hierarchy**: Typography scaling helps navigation
- **Calm aesthetics**: Theme tokens ensure consistency

---

## File Structure

```
ComponentName/
├── index.ts                 # Barrel export
├── ComponentName.tsx        # Main component (shadcn/ui based)
└── ComponentName.test.tsx   # Tests (optional)
```

---

## Quick Commands

```bash
# Install shadcn/ui component
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form

# Install dependencies
npm install react-hook-form zod @hookform/resolvers
npm install next-themes
npm install class-variance-authority clsx tailwind-merge
```

---

## When in Doubt

### Before Creating ANY Component
1. **FIRST: Search for existing components** → Use Glob/Grep to find similar components
2. **Identify component type** → Is it an atom, molecule, or organism?
3. **For molecules/organisms** → What existing components can you compose?
4. **Check existing custom components** → Search `components/ui/` and project

### Figma Workflow
5. **User provides Figma link?** → Use Figma MCP commands to extract design
6. **Found new design tokens?** → NOTIFY user, don't create automatically
7. **Mapping tokens?** → Figma value → CSS variable → Tailwind class
8. **Never use Figma values directly** → Always map to theme provider first

### Component Creation
9. **Check shadcn/ui docs**: https://ui.shadcn.com
10. **Use theme tokens**: Never hardcode colors (no Figma hex values!)
11. **Make it responsive**: Add md: and lg: variants
12. **Test both modes**: Light and dark
13. **Constrain content**: Use max-w-prose for readability
14. **Large touch targets**: h-12 on mobile minimum
15. **Refer to base guide**: `figma-to-react-base.md` for detailed examples

---

**Last Updated**: 2026-01-04
**Version**: 1.2 (Added mandatory requirement to check for existing components before creating new ones, with emphasis on composing molecules/organisms from existing atoms)
