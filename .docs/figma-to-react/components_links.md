# Components Documentation

## Context

Context: Each component is given in the following format -
"
ComponentParent
ComponentName: Link
Description: Description
"

---
## Layout Rules

### Container Max-Width
For extra large desktop screens, use a max-width container to prevent content from stretching too wide:

```tsx
// Standard content container
<div className="w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
  {/* content */}
</div>
```

- `max-w-[1440px]` - Content never exceeds 1440px wide
- `mx-auto` - Centers the container, creating natural side margins on wider screens
- `px-5 md:px-8 lg:px-12` - Internal padding (20px → 32px → 48px)

For full-width backgrounds with contained content:
```tsx
<div className="w-full bg-gradient"> {/* Full-width background */}
  <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
    {/* Contained content */}
  </div>
</div>
```

---
## Components

## Atoms
1. Buttons
primary: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=18-270&m=dev
secondary: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=109-2594&m=dev
ghost: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=109-3172&m=dev
outline: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=109-2883&m=dev
destructive dark: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=110-1537&m=dev


--- 
## Molecules
1. Main question
Card: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=24-420&m=dev

2. Answer options
https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=24-376&m=dev

4. header-card
https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=22-878&m=dev

5. Audio progress bar
https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=85-1729&m=dev



---
## Organisms - Pages dark theme
1. Question page
Small screen: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=85-2077&m=dev
Large screen: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=85-2076&m=dev

2. Breathing exercise
## 4-7-8 breathing exercise
Small screen dark: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2262&m=dev
Small screen light: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2014&m=dev
Large screen dark: 
https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2135&m=dev
## Box breathing
small screen dark: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2016&m=dev
small screen light: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2013&m=dev
## Simple breathing
Small screen dark: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2017&m=dev
small screen light: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=167-2012&m=dev

3. Tell me more
Small and large screen: https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=202-1257&m=dev




