I want you to create a Chips component in Figma at [https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=285-1688&m=dev].

## Step 1 — Read the colour system
Scan the codebase for our CSS variable colour system. Look in these files (check all that exist):
- `src/app/globals.css`
- `src/styles/globals.css`
- `styles/globals.css`
- Any file named `globals.css`, `variables.css`, or `tokens.css`

Extract every CSS variable used for colour, specifically:
--background, --foreground, --primary, --primary-foreground,
--secondary, --secondary-foreground, --destructive, --muted,
--muted-foreground, --accent, --accent-foreground, --border, --ring

Note both light and dark mode values if present (inside :root and .dark).

## Step 2 — Create Figma variables
In the Figma file, create a Variable Collection called "Chip Colours" with modes
"Light" and "Dark". Create one variable per CSS variable found above,
using the exact light/dark hex or hsl values. Name each variable to match
the CSS variable name exactly (e.g. `primary`, `primary-foreground`, `destructive`, etc.).

## Step 3 — Build the Chip component

Create a Figma component called "Chip" as a component set with the following
properties and styles. Follow these values exactly — they come directly from
the shadcn Badge source.

### Base styles (apply to ALL variants)
- Layout: auto layout, horizontal, align centre
- Height: 20px fixed
- Horizontal padding: 8px (left and right)
- Vertical padding: 2px (top and bottom)
- Gap between elements: 4px
- Corner radius: 24px
- Border: 1px, transparent by default (visible on Outline only)
- Font size: 12px
- Font weight: 500 (Medium)
- Line height: 1
- White space: no wrap
- Overflow: hidden

### Component properties

**Property 1 — variant**
Values: Default | Secondary | Destructive | Outline

**Property 2 — icon**
Values: None | Left | Right

**Property 3 — state**
Values: Default | Hover | Focus

### Anatomy
Each chip contains up to 3 layers in this order:
1. Icon-left (12×12px, visible when icon=Left)
2. Label (text layer, "Chip")
3. Icon-right (12×12px, visible when icon=Right)

Use a placeholder icon (square or circle) for icon slots — the user
will swap these out. Bind visibility of icon layers to the icon property.

### Colour mapping per variant — bind all fills to Figma variables

**Default**
- Background fill: var(primary)
- Label colour: var(primary-foreground)
- Border: transparent
- Shadow: drop shadow 0 1px 2px rgba(0,0,0,0.05)
- Hover bg: var(primary) at 80% opacity
- Focus ring: 1.5px var(ring) with 2px offset, outside the chip

**Secondary**
- Background fill: var(secondary)
- Label colour: var(secondary-foreground)
- Border: transparent
- No shadow
- Hove