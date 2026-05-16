# Styling Guidelines

Practical reference for this project. Based on patterns in `app/(marketing)/page.tsx` and `app/qa/page.tsx`.

---

## Core rules

### 1. Always use `globals.css` as the source of truth

All reusable styles, CSS variables, component classes, and gradient definitions live in `app/globals.css`. Before writing any inline style or ad-hoc Tailwind class, check whether a CSS variable or utility class already exists there.

- Design tokens → `app/globals.css` `:root` block
- Reusable component classes → `app/globals.css` `@layer components`
- Never duplicate values that are already defined as CSS variables

```tsx
// ✅ Use what's in globals.css
<div className="page-container question-card-gradient" data-size="large">
<p style={{ background: 'var(--gradient-brand)' }}>

// ❌ Re-inventing what already exists in globals.css
<div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32">
<div style={{ background: 'linear-gradient(-13.9deg, rgb(119,88,176)...)' }}>
```

### 2. Deviations must be deliberate — ask first

If implementing a design requires a value, pattern, or style that doesn't exist in `globals.css` or contradicts an existing rule in this guide, **stop and ask the user** before writing the code:

> "This uses `[value]` which isn't in `globals.css`. Do you want me to add it as a CSS variable / utility class, or handle it as a one-off?"

Only proceed once confirmed. If approved as a global pattern, add it to `globals.css` and update this guide. If it's a one-off exception, document it inline with a comment.

---

## Layout

### Page container

Always wrap page content in `.page-container`. This gives the standard max-width and responsive horizontal padding — used on every page and screen including QA flow screens, summary, signed, and marketing pages.

```tsx
<div className="page-container py-10 md:py-16">
  {/* content */}
</div>
```

The class expands to:
- Mobile: `px-6` (24px)
- Tablet md+: `px-16` (64px)
- Desktop lg+: `px-32` (128px)
- Max width: `1440px`, centred

**Never** write `w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32` by hand — use `.page-container`.

### Full-bleed sections

For sections that need an edge-to-edge background (colour or gradient), put the background on an outer `w-full` wrapper and nest `.page-container` inside.

```tsx
<section className="w-full" style={{ background: '#1B1724' }}>
  <div className="page-container py-10 md:py-20">
    {/* content */}
  </div>
</section>
```

### Full-height pages (flows)

QA-style pages that must fill the viewport use `h-dvh` with a flex column so the footer can be pinned.

```tsx
<div className="h-dvh w-full flex flex-col bg-background overflow-x-hidden">
  <AppBar />
  <div className="flex-1 relative min-h-0">
    {/* scrollable content */}
  </div>
  {/* sticky footer */}
</div>
```

### AppBar

Height is always `h-14`. It is `sticky top-0 z-50 bg-muted`.

```tsx
<div className="w-full h-14 border-b border-border shrink-0 sticky top-0 z-50 bg-muted">
  <div className="page-container h-full flex items-center justify-between">
    {/* logo | actions */}
  </div>
</div>
```

### Sticky page footer

Used in QA flow. Fixed to the bottom, sits above content.

```tsx
<div className="w-full border-t border-border py-4 shrink-0 fixed bottom-0 left-0 right-0 z-40 bg-background">
  <div className="page-container flex items-center gap-3 md:justify-end">
    {/* buttons */}
  </div>
</div>
```

Add `pb-24` to the scrollable content above it so nothing is hidden behind the footer.

---

## Spacing rhythms

Use **flex + gap** for layout composition — not margins between siblings. Margins are only for spacing within a container when you can't use gap (e.g. mixing animation-wrapped and static elements).

### Vertical section padding

| Section type | Class | Source |
|---|---|---|
| Hero banner | `py-8 md:py-14 lg:py-16` | Home hero |
| Dark feature section | `py-10 md:py-20` | Home dark sections |
| Standard content page | `py-10 md:py-16` | Summary, signed, witness |
| QA question options area | `py-5 md:py-8` | QA options |
| QA desktop question header | `py-6` | QA desktop header |
| Sticky footer | `py-4` | QA sticky footer |
| Footer / header bar | `h-14` (flex) | AppBar, page footers |

### Content flex gaps

| Context | Gap | Source |
|---|---|---|
| Dark section: heading + grid/list | `flex flex-col gap-8 md:gap-10` | Home feature sections |
| Column: icon + text block | `flex flex-col gap-6` | Home about/privacy |
| Text block: multiple paragraphs | `flex flex-col gap-4` | Signed microcopy |
| Hero body: 2–3 tight paragraphs | `flex flex-col gap-5` | Home hero text |
| Feature card internal | `flex flex-col gap-4` | Home cards |
| Hero two-col layout | `gap-8 lg:gap-12` | Home hero left/right |
| Document page: intro → content | `gap-10` | Summary, signed |
| Document page: h1 → subtitle | `gap-2` | Summary intro |
| Document list row (inner) | `gap-1.5` | Summary, signed Q&A rows |
| Signature block sections | `flex flex-col gap-10` | Signed page |
| Signature card (label+sig+name+date) | `flex flex-col gap-2` | Signed page |

```tsx
// ✅ Dark section with heading + grid
<div className="flex flex-col gap-8 md:gap-10">
  <h2 className="section-heading text-white">What you'll get</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">{/* cards */}</div>
</div>

// ✅ Document intro section
<div className="flex flex-col gap-10">
  <div className="flex flex-col gap-2">
    <h1>Page title</h1>
    <p>Subtitle text.</p>
  </div>
  <div className="flex flex-col divide-y divide-border">{/* Q&A list */}</div>
</div>

// ❌ margin-based sibling spacing
<h1 className="mb-2">Page title</h1>
<p className="mb-10">Subtitle text.</p>
```

### Document list rows (summary, signed, witness pages)

Each Q&A row uses `py-6` vertical padding and `gap-1.5` between its inner elements:

```tsx
<div className="py-6 flex flex-col gap-1.5">
  <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
    Caption
  </p>
  <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)]">
    Question text
  </p>
  <p className="[font-size:var(--text-base)] text-foreground font-medium font-[family-name:var(--font-family-body)]">
    Answer
  </p>
  {/* optional */}
  <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] mt-1">
    Note: …
  </p>
</div>
```

### QA-specific spacing

```tsx
// Desktop question header (full-bleed gradient)
<div className="py-6 question-card-gradient" data-size="large">
  <div className="page-container">
    <div className="flex items-center justify-between mb-6">
      <p>{caption}</p>
      <span>{n} of {total}</span>
    </div>
    <h1>{question}</h1>
    <Button className="mt-6">Learn more</Button>
  </div>
</div>

// Question options area
<div className="page-container py-5 md:py-8">
  <div className="space-y-6 lg:space-y-8">{/* answer options */}</div>
</div>
```

---

## Typography

### Use CSS variable utilities — not standard Tailwind size classes

This project has a custom type scale defined in `globals.css`. Use it via inline CSS variable syntax:

```tsx
// ✅ correct
<h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)]">

// ❌ wrong — bypasses the custom scale and font-scaling system
<h1 className="text-3xl leading-tight">
```

### Type scale reference

| Token | Value | Usage |
|---|---|---|
| `--text-xs` | 12px | Captions, labels, uppercase tags |
| `--text-sm` | 14px | Secondary text, meta |
| `--text-base` | 16px | Body copy |
| `--text-lg` | 18px | Large body |
| `--text-xl` | 20px | Card sub-headings |
| `--text-2xl` | 24px | Card titles desktop |
| `--text-h1-sm` | 30px | Page headings (mobile/compact) |
| `--text-h1-lg` | 36px | Page headings (desktop) |
| `--text-display-1-sm` | 48px | Hero mobile |
| `--text-display-1-lg` | 72px | Hero desktop |

Pair each size with its matching line-height token (`--leading-h1-sm`, `--leading-body-sm`, etc.).

### Font families

```tsx
// Body text
<p className="font-[family-name:var(--font-family-body)]">

// Headings / display
<h1 className="font-[family-name:var(--font-family-display)]">
```

### Section headings (h2)

Use the `.section-heading` class for marketing-style h2s. It scales automatically across breakpoints.

```tsx
<h2 className="section-heading text-white">What you'll get</h2>
```

### Captions / labels

```tsx
<p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
  Values and what matters
</p>
```

### Content width

Constrain reading text so lines don't get too long:

```tsx
<p className="max-w-[45ch]">  {/* question text */}
<p className="max-w-lg">      {/* marketing body */}
<div className="max-w-2xl">   {/* signed/summary content */}
```

---

## Colour

### Always use theme tokens

All colours must come from CSS variables so light/dark mode works automatically.

```tsx
// ✅ correct
<div className="bg-background text-foreground">
<p className="text-muted-foreground">
<div className="border border-border">

// ❌ wrong
<div className="bg-white text-gray-900">
<div style={{ color: '#161616' }}>
```

### Core tokens

| Token | Light | Dark | Use for |
|---|---|---|---|
| `bg-background` | white | `#1B1724` | Page background |
| `text-foreground` | `#161616` | `#FAFAFA` | Primary text |
| `text-muted-foreground` | `#737373` | `#A3A3A3` | Secondary text |
| `bg-muted` | `#EEE8F7` | `#292337` | App bar, subtle backgrounds |
| `border-border` | `#EDEDED` | `#4A445B` | Dividers, card borders |
| `border-border-emphasis` | `#A3A3A3` | `#625B73` | Input borders |
| `bg-primary` | `#6A41BB` | same | CTA buttons |
| `text-primary-foreground` | `#FAFAFA` | same | Text on primary |
| `text-link` | `#6A41BB` | `#C5A3FF` | Inline links |

### Dark overlay sections (marketing page)

These sections use literal hex colours from the lavender palette — they are intentionally not theme-switching:

```tsx
// Deep dark background
style={{ background: '#1B1724' }}  // --lavender-950

// Card/panel background inside dark sections
style={{ background: '#292337' }}  // --lavender-800
```

---

## Gradients

Use the CSS classes defined in `globals.css`. Never write gradient values inline.

### Available gradient classes

| Class | Usage |
|---|---|
| `.gradient-brand` | Hero section, brand CTAs |
| `.question-card-gradient` + `data-size="large"` | Desktop question header |
| `.question-card-gradient` + `data-size="small"` | Mobile question card |
| `.header-card-gradient` | Generic card header backgrounds |
| `.header-card-gradient` + `data-image="true"` | Card headers with images |

All gradient classes auto-switch between light and dark mode variants.

```tsx
// ✅ hero section
<section className="w-full gradient-brand">

// ✅ desktop question header
<div className="question-card-gradient" data-size="large">

// ❌ inline gradient value
<div style={{ background: 'linear-gradient(...)' }}>
```

### Text colour on gradients

- On `.gradient-brand` (always dark): use `text-white`, `text-white/80`, `text-white/70`
- On `.question-card-gradient` (theme-aware): use `text-foreground`, `text-foreground/70`, `text-foreground/50`

---

## Buttons

### Sizes

```tsx
// Primary CTA — full width on mobile, auto on desktop
<Button size="lg" className="h-12 md:h-11 flex-1 md:flex-none">
  Continue
</Button>

// Secondary/ghost — same height rhythm
<Button variant="ghost" size="lg" className="h-12 md:h-11">
  Back
</Button>

// App bar icon buttons
<Button variant="ghost-subtle" size="icon" className="w-8 h-8 p-0 md:w-auto md:h-auto md:px-2 md:gap-1.5">
  <Icon size={24} className="md:hidden" />
  <Icon size={20} className="hidden md:block" />
  <span className="hidden md:inline text-sm">Label</span>
</Button>
```

### Rounded CTA (hero)

```tsx
<Button size="lg" className="rounded-full h-12 px-8 gap-2 w-full md:w-auto">
  Start my directive
  <ArrowRight size={18} strokeWidth={ICON_STROKE_WIDTH} />
</Button>
```

---

## Icons

Import from `lucide-react`. Use `ICON_STROKE_WIDTH` from `@/lib/theme-config` for all icons.

```tsx
import { Wind, Info } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

// Mobile/desktop size pair
<Wind size={24} strokeWidth={ICON_STROKE_WIDTH} className="md:hidden" />
<Wind size={20} strokeWidth={ICON_STROKE_WIDTH} className="hidden md:block" />

// Single size
<Info size={24} strokeWidth={ICON_STROKE_WIDTH} />
```

---

## Animation

Uses `motion/react` (not `framer-motion`).

### Fade-up (marketing sections)

```tsx
import { motion } from 'motion/react'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.28, ease: 'easeOut', delay: i * 0.08 }
  }),
}

// Stagger parent
<motion.div initial="hidden" animate="show"
  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
>
  <motion.h1 custom={1} variants={fadeUp}>Heading</motion.h1>
  <motion.div custom={2} variants={fadeUp}>Body</motion.div>
</motion.div>

// Scroll-triggered (marketing sections)
<motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
>
```

### Screen transitions (QA flow)

```tsx
import { AnimatePresence, motion } from 'motion/react'

<AnimatePresence mode="sync">
  <motion.div
    key="screen-key"
    className="absolute inset-0 overflow-y-auto"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {/* screen content */}
  </motion.div>
</AnimatePresence>
```

---

## Responsive patterns

### Mobile-first, three breakpoints

| Breakpoint | Prefix | Width |
|---|---|---|
| Mobile | (none) | < 768px |
| Tablet | `md:` | 768px+ |
| Desktop | `lg:` | 1024px+ |

### Show/hide by breakpoint

```tsx
// Mobile only
<div className="md:hidden">

// Desktop only
<div className="hidden md:block">
```

### Vertical padding on content sections

```tsx
// Standard content sections
className="py-10 md:py-16"

// Marketing sections
className="py-10 md:py-20"

// Hero
className="py-8 md:py-14 lg:py-16"
```

### Two-column grid (marketing)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
```

### Three-column grid (feature cards)

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
```

---

## Component-specific patterns

### Shared header bar (summary, signed, witness pages)

```tsx
<div className="w-full border-b border-border bg-muted">
  <div className="page-container h-14 flex items-center justify-between">
    <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
      Page title
    </p>
    {/* actions */}
  </div>
</div>
```

### Content area (summary, signed, witness pages)

```tsx
<div className="page-container py-8 md:py-12">
  <div className="max-w-2xl">
    {/* page content */}
  </div>
</div>
```

### Feature card (dark sections)

```tsx
<div
  className="flex flex-col gap-4 p-5 rounded-3xl"
  style={{ background: '#292337' }}
>
  <Icon size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-white/80" />
  <h3 className="[font-size:var(--text-xl)] font-[family-name:var(--font-family-display)] font-light text-white">
    Title
  </h3>
  <p className="[font-size:var(--text-base)] text-white/70 font-[family-name:var(--font-family-body)] leading-relaxed">
    Body copy.
  </p>
</div>
```

### Inline link

```tsx
<a
  href="..."
  className="[font-size:var(--text-sm)] font-[family-name:var(--font-family-body)] underline underline-offset-2 hover:no-underline text-link"
>
  Visit NSW Health
</a>
```

---

## What not to do

| ❌ Avoid | ✅ Use instead |
|---|---|
| `text-3xl`, `text-xl` for headings | `[font-size:var(--text-h1-sm)]` |
| `bg-white`, `text-gray-900` | `bg-background`, `text-foreground` |
| `w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32` | `.page-container` |
| Inline gradient strings | `.gradient-brand`, `.question-card-gradient` |
| `framer-motion` import | `motion/react` import |
| `strokeWidth={1}` on icons | `strokeWidth={ICON_STROKE_WIDTH}` |
| `font-bold` on display text | `font-light` or `font-[var(--font-weight-display)]` |
