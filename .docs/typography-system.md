# Typography System

## Font Family
**All text uses Poppins**
- Font: Poppins (Google Fonts)
- Weights available: 300 (Light), 400 (Regular), 500 (Medium)

---

## Line Heights (Standard Tailwind)

| Class | Value | Usage |
|-------|-------|-------|
| `leading-none` | 1.0 (100%) | Captions, uppercase labels |
| `leading-tight` | 1.25 (125%) | All headings (H1, H2, Display) |
| `leading-normal` | 1.5 (150%) | All body text, descriptions |

---

## Typography Sizes & Styles

### Display Text (Large Headlines)

#### Display 1 (Header Card with Image)
- **Mobile**: 48px / leading-tight
- **Desktop**: 72px / leading-tight
- **Weight**: 300 (Light)

#### Display 2 (Header Card without Image)
- **Mobile**: 36px / leading-tight
- **Desktop**: 60px / leading-tight
- **Weight**: 300 (Light)

---

### Headings

#### H1 (Question Cards - Small variant)
- **Mobile**: 30px / leading-tight
- **Desktop**: 36px / leading-tight
- **Weight**: 300 (Light)

#### H1 (Question Cards - Large variant)
- **All screens**: 36px / leading-tight
- **Weight**: 300 (Light)

---

### Body Text

#### Large Body
- **Size**: 18px / leading-normal
- **Weight**: 400 (Regular)
- **Usage**: Desktop body text, large radio cards, large buttons

#### Base Body
- **Size**: 16px / leading-normal
- **Weight**: 400 (Regular)
- **Usage**: Mobile body text, small radio cards, default text

#### Small Text
- **Size**: 14px / leading-normal
- **Weight**: 400 (Regular)
- **Usage**: Secondary information

#### Caption
- **Size**: 12px / leading-none
- **Weight**: 400 (Regular)
- **Usage**: Uppercase labels, captions

---

## Component-Specific Typography

### Buttons

#### Large Buttons (size="lg")
- **Height**: 48px (h-12)
- **Font Size**: 18px (text-lg)
- **Weight**: 500 (Medium)
- **Line Height**: leading-normal

#### Default Buttons
- **Height**: 40px (h-10)
- **Font Size**: 14px (text-sm)
- **Weight**: 500 (Medium)
- **Line Height**: leading-normal

---

### Radio Cards

#### Large Radio Cards (Desktop)
- **Title**: 18px / leading-normal / 400 (Regular)
- **Description**: 18px / leading-normal / 400 (Regular)
- **Padding**: 24px (p-6)
- **Gap**: 24px (gap-6)

#### Small Radio Cards (Mobile)
- **Title**: 16px / leading-normal / 400 (Regular)
- **Description**: 16px / leading-normal / 400 (Regular)
- **Padding**: 20px (p-5)
- **Gap**: 20px (gap-5)

---

### Header Cards

#### Title
- See Display 1 or Display 2 above (depending on variant)

#### Body
- **Mobile**: 16px / leading-normal
- **Desktop**: 18px / leading-normal
- **Weight**: 400 (Regular)

#### Caption
- **Size**: 12px (text-xs)
- **Line Height**: leading-none (1.0)
- **Weight**: 400 (Regular)
- **Transform**: Uppercase

---

### Question Cards

#### Caption
- **Size**: 14px (text-sm)
- **Line Height**: leading-none (1.0)
- **Weight**: 400 (Regular)
- **Transform**: Uppercase

#### Title
- See H1 sections above

---

### Modals (Tell Me More)

#### Modal Title
- **Size**: 18px (text-lg)
- **Line Height**: leading-normal
- **Weight**: 500 (Medium)

#### Modal Content
- **Mobile**: 16px / leading-normal
- **Desktop**: 18px / leading-normal
- **Weight**: 400 (Regular)

---

## Implementation Notes

1. **Font Family CSS Variables**:
   - `--font-poppins`: Applied to both body and display text
   - `--font-family-body`: Points to `--font-poppins`
   - `--font-family-display`: Points to `--font-poppins`

2. **Responsive Sizing**:
   - Use Tailwind's `md:` prefix for desktop breakpoint (768px+)
   - Mobile-first approach: base classes for mobile, `md:` for desktop

3. **Line Height Philosophy**:
   - Headings: `leading-tight` (1.25) for compact, impactful display
   - Body text: `leading-normal` (1.5) for comfortable reading
   - Captions/Labels: `leading-none` (1.0) for tight spacing

4. **Font Weights**:
   - Light (300): All display text and headings
   - Regular (400): All body text and descriptions
   - Medium (500): Buttons and emphasized text
