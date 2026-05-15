# Legal Aid NSW — Figma Variables Reference
### Sourced from NSW Government Design System (v3.24.4) + AEM SCSS components

The site is built on the **NSW Government Design System**. These are the canonical token names and actual hex values to use when setting up your Figma variables.

---

## Colour

### Brand Colours
These are the core NSW Gov brand colours used across hero banners, buttons, nav, and themed sections.

| Figma Variable Name | CSS Variable | Hex | Role |
|---|---|---|---|
| `brand/dark` | `--nsw-brand-dark` | `#002664` | Primary nav, headings, links, dark backgrounds |
| `brand/light` | `--nsw-brand-light` | `#CBEDFD` | Light tinted backgrounds, cards |
| `brand/supplementary` | `--nsw-brand-supplementary` | `#146CFD` | Accent blue — buttons, interactive elements |
| `brand/accent` | `--nsw-brand-accent` | `#D7153A` | Highlight / CTA red, badges |
| `brand/accent-light` | `--nsw-brand-accent-light` | `#FFE6EA` | Light red background tint |

> In the SCSS files, `$blue-600` likely maps to `--nsw-brand-supplementary` (#146CFD) and `$blue-800` to `--nsw-brand-dark` (#002664).

---

### Grey Scale
Used for backgrounds, borders, dividers, and surface hierarchy.

| Figma Variable Name | CSS Variable | Hex | Role |
|---|---|---|---|
| `grey/black` | `--nsw-black` | `#000000` | Maximum contrast text |
| `grey/grey-01` | `--nsw-grey-01` | `#22272B` | Default body text, dark surfaces |
| `grey/grey-02` | `--nsw-grey-02` | `#495054` | Secondary text, labels |
| `grey/grey-03` | `--nsw-grey-03` | `#CDD3D6` | Borders, dividers |
| `grey/grey-04` | `--nsw-grey-04` | `#EBEBEB` | Subtle backgrounds, rules |
| `grey/off-white` | `--nsw-off-white` | `#F2F2F2` | Page/panel backgrounds |
| `grey/white` | `--nsw-white` | `#FFFFFF` | White surfaces, cards |

> In the SCSS: `$grey-200` → likely `#CDD3D6` (grey-03), `$grey-100` → likely `#F2F2F2` (off-white).

---

### Text Colours

| Figma Variable Name | CSS Variable | Hex | Role |
|---|---|---|---|
| `text/dark` | `--nsw-text-dark` | `#22272B` | Body text on light backgrounds |
| `text/light` | `--nsw-text-light` | `#FFFFFF` | Text on dark/coloured backgrounds |

---

### Link & Interactive States

| Figma Variable Name | CSS Variable | Hex | Role |
|---|---|---|---|
| `link/default` | `--nsw-link` | `#002664` | Default link colour |
| `link/visited` | `--nsw-visited` | `#551A8B` | Visited link |
| `link/hover` | `--nsw-hover` | `rgba(0,38,100,0.1)` | Hover background overlay |
| `link/active` | `--nsw-active` | `rgba(0,38,100,0.2)` | Active/pressed background |
| `link/focus` | `--nsw-focus` | `#0085B3` | Focus ring |
| `link/disabled` | `--nsw-disabled` | `#8093B2` | Disabled state |
| `link/on-dark` | `--nsw-link-light` | `#E6E9F0` | Link on dark backgrounds |
| `link/visited-on-dark` | `--nsw-visited-light` | `#DDD1E8` | Visited link on dark |
| `link/focus-on-dark` | `--nsw-focus-light` | `#CCE7F0` | Focus ring on dark |

---

### Status / Feedback Colours

| Figma Variable Name | Hex (approx) | Role |
|---|---|---|
| `status/info` | `#2E5299` | Informational messages |
| `status/success` | `#008A00` | Success states |
| `status/warning` | `#C95000` | Warning messages |
| `status/error` | `#B81237` | Error states |

---

## Typography

### Font
**Public Sans** (Google Fonts) — fallback: Arial, sans-serif

```
font-family: 'Public Sans', Arial, sans-serif;
```

### Type Scale

| Figma Variable Name | Size (mobile) | Size (desktop) | Line Height | Weight |
|---|---|---|---|---|
| `type/heading-1` | 36px / 2.25rem | 48px / 3rem | 1.25 | 700 Bold |
| `type/heading-2` | 28px / 1.75rem | 32px / 2rem | 1.25 | 700 Bold |
| `type/heading-3` | 22px / 1.375rem | 24px / 1.5rem | 1.25–1.33 | 700 Bold |
| `type/heading-4` | 18px / 1.125rem | 20px / 1.25rem | 1.33–1.4 | 700 Bold |
| `type/heading-5` | 16px / 1rem | 16px / 1rem | 1.5 | 700 Bold |
| `type/intro` | 18px / 1.125rem | 20px / 1.25rem | 1.33–1.4 | 400 Regular |
| `type/body` | 16px / 1rem | 16px / 1rem | 1.5 | 400 Regular |
| `type/small` | 14px / 0.875rem | 14px / 0.875rem | 1.35 | 400 Regular |

> In the SCSS, `$font14` = `type/small` (14px / 0.875rem). The accordion panel uses this size.

---

## Spacing

The NSW Design System uses an **8px base grid**. Spacing steps in the AEM SCSS map to multiples of this.

| Figma Variable Name | Value | Notes |
|---|---|---|
| `spacing/0` | 0 | Reset / no spacing |
| `spacing/1` | 8px | XS |
| `spacing/2` | 16px | SM — button padding, small gaps |
| `spacing/3` | 24px | MD — mobile section spacing |
| `spacing/4` | 32px | LG — desktop section spacing |
| `spacing/5` | 40px | XL |
| `spacing/8` | 64px | 2XL — large layout gaps |
| `spacing/10` | 80px | Hero image offset, CTA offset |
| `spacing/12` | 96px | Max content padding |

---

## Border

| Figma Variable Name | Value | Role |
|---|---|---|
| `border/none` | 0 | No border |
| `border/subtle` | 1px solid `#CDD3D6` | Accordion item dividers, table borders |
| `border/focus` | 3px solid `#0085B3` | Focus ring width |
| `border/radius/sm` | 4px | Subtle rounding (buttons, inputs) |

---

## Shadows

| Figma Variable Name | Value | Role |
|---|---|---|
| `shadow/card` | `0 4px 12px rgba(0,0,0,0.15)` | Card elevation |
| `shadow/dropdown` | `0 4px 8px rgba(0,0,0,0.1)` | Nav dropdowns, popovers |

---

## Breakpoints (for reference, not Figma variables)

| Name | Value | Usage |
|---|---|---|
| `sm-max` | 576px | Mobile — single column |
| `md-max` | 992px | Tablet — stacked layout |
| Desktop | 993px+ | Full side-by-side layout |

---

## AEM SCSS → NSW Design System Token Mapping

Quick cross-reference for when you encounter SCSS variable names in the codebase:

| SCSS Token (AEM) | NSW Design System Token | Hex |
|---|---|---|
| `$white` | `--nsw-white` | `#FFFFFF` |
| `$black` | `--nsw-text-dark` | `#22272B` |
| `$black-900` | `--nsw-grey-01` (darkest) | `#22272B` |
| `$blue-600` | `--nsw-brand-supplementary` | `#146CFD` |
| `$blue-800` | `--nsw-brand-dark` | `#002664` |
| `$grey-100` | `--nsw-off-white` | `#F2F2F2` |
| `$grey-200` | `--nsw-grey-03` | `#CDD3D6` |
| `$grey-350` | `--nsw-grey-02` (approx) | `#495054` |

---

## Notes for Figma Setup

1. **Create a primitive layer first** — set up all raw hex values (e.g. `blue/002664`, `grey/CDD3D6`) before creating semantic tokens.
2. **Semantic variables reference primitives** — e.g. `brand/dark` → `blue/002664`. This means you can retheme by updating one primitive.
3. **NSW Design System has an official Figma UI Kit** — worth checking at `designsystem.nsw.gov.au/docs/content/design/figma-ui-kit.html` before building from scratch, as it may already include variables you can fork.
4. **AEM SCSS uses `$grey-*` naming from their own scale** — not the same numbering as NSW Gov, so always cross-check against what you see on the live site visually.
