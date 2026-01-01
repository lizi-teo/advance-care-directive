# Figma to React Implementation Guide

This guide provides a comprehensive methodology for implementing UI components and design tokens from Figma designs in React applications using Figma MCP tools.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Process Overview](#process-overview)
- [Step-by-Step Guide](#step-by-step-guide)
  - [Phase 1: Analysis and Planning](#phase-1-analysis-and-planning)
  - [Phase 2: Frontend Structure Analysis](#phase-2-frontend-structure-analysis)
  - [Phase 3: Design Token Implementation](#phase-3-design-token-implementation)
  - [Phase 4: Component Reuse Analysis](#phase-4-component-reuse-analysis)
  - [Phase 5: Component Implementation](#phase-5-component-implementation)
  - [Phase 6: Demo and Documentation](#phase-6-demo-and-documentation)
- [Implementation Standards](#implementation-standards)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Implementation Checklist](#implementation-checklist)

## Overview

This process enables systematic translation of Figma design systems into React components by:

- Extracting design tokens (colors, typography, spacing, effects, avatars)
- Converting Figma components into React components
- Following existing project structure or atomic design principles
- Ensuring consistency, accessibility, and maintainability
- Maximizing component reusability and avoiding duplication
- **Using theme provider tokens for automatic light/dark mode support**

**Critical Requirements:**
1. You MUST ONLY use Figma MCP calls, not scripts or extractors. Under no circumstances should you create any scripts or extractors.
2. **You MUST ONLY use theme provider tokens from `next-themes`** - ALL components must use CSS variables defined in `app/globals.css`. NEVER hardcode colors, spacing, or other style values. This ensures automatic light/dark mode support.
3. **You MUST implement mobile-first responsive design** - ALL components must be fully responsive using Tailwind breakpoints (md:, lg:). Prioritize readability for older adults, generous touch targets (44px minimum), and trauma-informed spacing.

## Prerequisites

- Access to Figma file with Figma MCP (Multi-Codegen Plugin) enabled
- React project with TypeScript (recommended)
- **shadcn/ui** installed and configured
- **next-themes** installed for theme provider (light/dark mode support)
- **React Hook Form** and **zod** for form validation
- Understanding of the project structure
- Familiarity with React, TypeScript, Tailwind CSS, and shadcn/ui

## Process Overview

1. **Analysis and Planning** - Analyze Figma designs using MCP tools
2. **Frontend Structure Analysis** - Understand existing component organization
3. **Design Token Implementation** - Extract and implement design tokens
4. **Component Reuse Analysis** - Identify existing components to avoid duplication
5. **Component Implementation** - Create new components following established patterns
   - Use shadcn/ui as base
   - Apply theme provider tokens
   - Implement mobile-first responsive design
   - Ensure accessibility and trauma-informed spacing
6. **Demo and Documentation** - Create demos and documentation pages

## Step-by-Step Guide

### Phase 1: Analysis and Planning

#### 1.1 Figma Analysis

**ALWAYS use MCP Figma tools for accurate analysis:**

```typescript
// 1. REQUIRED: Get figma data
await mcp_figma_get_figma_data({
  fileKey: "figma-file-key",
  nodeId: "node-id-from-figma-url"
});

// 2. REQUIRED: Get the visual design
await mcp_figma_dev_mod_get_image({
  nodeId: "node-id-from-figma-url",
  clientFrameworks: "react,nextjs",
  clientLanguages: "typescript,css",
  clientName: "cursor"
});

// 3. REQUIRED: Get the generated code structure
await mcp_figma_dev_mod_get_code({
  nodeId: "node-id-from-figma-url", 
  clientFrameworks: "react,nextjs",
  clientLanguages: "typescript,css",
  clientName: "cursor"
});

// 4. REQUIRED: Get exact design tokens and variables
await mcp_figma_dev_mod_get_variable_defs({
  nodeId: "node-id-from-figma-url",
  clientFrameworks: "react,nextjs", 
  clientLanguages: "typescript,css",
  clientName: "cursor"
});

// 5. OPTIONAL: Check for code connections to existing components
await mcp_figma_dev_mod_get_code_connect_map({
  nodeId: "node-id-from-figma-url",
  clientFrameworks: "react,nextjs",
  clientLanguages: "typescript,css", 
  clientName: "cursor"
});
```

**Extract Node ID from Figma URL:**

- URL format: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
- Node ID: `1:2` (replace hyphens with colons)

**Key Analysis Steps:**

1. **Visual Analysis**: Understand exact appearance, states, and variations
2. **Structure Analysis**: Understand component hierarchy and implementation approach
3. **Token Analysis**: Extract exact colors, typography, spacing, and other design tokens
4. **Reusability Analysis**: Identify existing component connections

#### 1.2 Configuration Analysis

**ALWAYS check project configuration before implementation:**

Before starting any component implementation, you MUST read and analyze the `figma-to-react-config.json` file to understand the project's UI library and CSS framework preferences.

```typescript
// REQUIRED: Read configuration file
const configPath = "docs/figma/figma-to-react-config.json";
const config = await read_file(configPath);
```

**Configuration Structure:**

```json example
{
    "ui-library": [
        "shadcn/ui"
    ],
    "form-library": [
        "React Hook Form"
    ]
}
```

**MANDATORY Implementation Rules:**

**YOU MUST ONLY USE:**
1. **shadcn/ui** - For all UI components
2. **React Hook Form** - For all form-related components and validation

**Implementation Rules:**

1. **shadcn/ui Components (REQUIRED)**:
   - **FIRST: Verify shadcn/ui is installed** - Check package.json and components directory
   - **ALWAYS use shadcn/ui components** for component creation
   - Do NOT use Material UI, Flowbite, or any other UI library
   - Do NOT create custom styled components from scratch
   - Extend or compose existing shadcn/ui components
   - Follow shadcn/ui component patterns and APIs
   - Use shadcn/ui's theming system (Tailwind CSS based)

2. **React Hook Form (REQUIRED for Forms)**:
   - **FIRST: Verify React Hook Form is installed** - Check package.json
   - **ALWAYS use React Hook Form** for form state management and validation
   - Do NOT use other form libraries (Formik, Final Form, etc.)
   - Integrate React Hook Form with shadcn/ui form components
   - Follow React Hook Form patterns for validation

3. **No Other Libraries Allowed**:
   - Do NOT install or use Material UI, Flowbite, Ant Design, or other UI libraries
   - All components MUST be built using shadcn/ui
   - All forms MUST use React Hook Form

**Installation Requirements:**

If shadcn/ui or React Hook Form are not installed:

```bash
# shadcn/ui installation (requires Tailwind CSS)
# First, ensure Tailwind CSS is installed
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize shadcn/ui
npx shadcn@latest init

# Install specific shadcn/ui components as needed
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add form
# ... etc

# React Hook Form installation
npm install react-hook-form
# or
yarn add react-hook-form

# Optional: For form validation schema
npm install @hookform/resolvers zod
# or
yarn add @hookform/resolvers zod
```

**MANDATORY**: Before proceeding with component implementation, you MUST verify that shadcn/ui and React Hook Form are installed and available in the project. No other UI or form libraries are permitted.

**Example Implementation Approaches:**

**With shadcn/ui (REQUIRED):**

```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

// Use shadcn/ui components directly
export function CustomButton({ children, ...props }) {
  return (
    <Button {...props}>
      {children}
    </Button>
  )
}

// Extend shadcn/ui components with custom variants
import { cn } from "@/lib/utils"

export function CustomButton({ children, className, ...props }) {
  return (
    <Button
      className={cn("custom-variant-styles", className)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

**With React Hook Form (REQUIRED for Forms):**

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Phase 2: Frontend Structure Analysis

Before implementing any components, analyze the existing frontend structure to follow established patterns.

#### 2.1 Analyze Current Component Organization

**Search for Existing Structure:**

```bash
# Check for component organization patterns
file_search --query="**/components/**"
file_search --query="**/ui/**"
file_search --query="**/atoms/**"
file_search --query="**/molecules/**"

# Check for design token patterns
file_search --query="**/tokens/**"
file_search --query="**/theme/**"
file_search --query="**/styles/**"
```

#### 2.2 Component Structure Decision

**If Existing Structure Found:**

- Follow the same folder structure and naming conventions
- Maintain consistency with existing component patterns
- Use existing design token structure

**If No Structure Found:**

- Use atomic design principles as default:

  ```bash
  /src/components/
  ├── atoms/
  ├── molecules/
  ├── organisms/
  ├── templates/
  └── pages/
  ```

**Atomic Design Guidelines:**

- **Atoms**: Button, Checkbox, Icon, Avatar, Input
- **Molecules**: Input with label, Card header, Navigation item
- **Organisms**: Header, Footer, Card with multiple elements
- **Templates**: Page layouts and structures
- **Pages**: Complete page implementations

### Phase 3: Design Token Implementation

#### 3.1 Analyze Existing Tokens

Audit local project token files:

```bash
/src/styles/tokens/
├── layout.ts
├── typography.ts
├── colours.ts
├── avatars.ts
├── effects.ts
└── index.ts

/src/components/icons/
├── types.ts
├── index.ts
└── [Icon].tsx  # Individual icon components
```

#### 3.2 Create/Update Design Tokens

For each token category:

- If file doesn't exist, create it following project patterns
- If file exists, compare token values and update only if changed
- Use standard JS/TS object exports

```typescript
// Example: colors.ts
export const Colors = {
  primary: {
    default: '#556AEB',
    hover: '#4A5FD7',
    pressed: '#3E51C4',
    disabled: '#B8C4F0'
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD'
  }
}
```

#### 3.3 Theme System Integration

**MANDATORY: This project uses `next-themes` for theme management.**

All components MUST use CSS variables defined in `app/globals.css` that work with the theme provider. The theme provider is located at `components/theme-provider.tsx`.

**Available Theme Tokens (CSS Variables):**

```css
/* Colors */
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--border
--input
--ring

/* Radius */
--radius
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-2xl
--radius-3xl
--radius-4xl

/* Sidebar (if needed) */
--sidebar
--sidebar-foreground
--sidebar-primary
--sidebar-accent
/* ... etc */
```

**CRITICAL: Always use these CSS variables in your components:**

```typescript
// ✅ CORRECT - Using Tailwind classes that map to CSS variables
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Click me
  </button>
</div>

// ✅ CORRECT - Using CSS variables directly in custom styles
<div style={{ backgroundColor: 'hsl(var(--background))' }}>
  Content
</div>

// ❌ WRONG - Hardcoding colors
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  Content
</div>
```

### Phase 4: Component Reuse Analysis

Before creating any new component, perform thorough analysis to avoid duplication.

#### 4.1 Existing Component Audit

**Search for Similar Components:**

```bash
# Search for components by functionality
grep_search --query="button|input|select|modal" --includePattern="src/components/**/*.tsx"

# Example search for similar patterns
file_search --query="**/Button*"
file_search --query="**/Input*"
file_search --query="**/Select*"

# Use semantic search for related functionality
semantic_search --query="form input validation error state"
semantic_search --query="dropdown select option list"
```

#### 4.2 Reuse Strategies

1. **Extend Existing Component**: Add new props/variants to existing component
2. **Compose Components**: Combine multiple existing components
3. **Create Variant**: Create a new variant of existing component family
4. **Extract Base Component**: Factor out common functionality into a base component

#### 4.3 What NOT to Hardcode

**MANDATORY: Never Hardcode Values - Always Use Theme Provider Tokens**

This project uses `next-themes` with CSS variables defined in `app/globals.css`. ALL components MUST use theme tokens to ensure proper light/dark mode support.

```typescript
// ❌ DON'T HARDCODE - Colors (will break dark mode)
backgroundColor: '#556AEB'
color: '#212529'
className="bg-blue-500 text-gray-900"

// ✅ DO USE - Tailwind classes that reference CSS variables
className="bg-primary text-primary-foreground"
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="border-border"

// ✅ DO USE - CSS variables directly (when needed)
style={{ backgroundColor: 'hsl(var(--primary))' }}
style={{ color: 'hsl(var(--foreground))' }}

// ❌ DON'T HARDCODE - Spacing values
margin: '16px'
padding: '8px 12px'
className="m-4 p-3"

// ✅ DO USE - Tailwind spacing scale
className="m-4 p-3"  // Only if these map to design tokens
className="space-y-4"
className="gap-2"

// ❌ DON'T HARDCODE - Border radius
borderRadius: '8px'
className="rounded-lg"

// ✅ DO USE - Theme radius variables
className="rounded-lg"  // Uses --radius-lg from theme
className="rounded-md"  // Uses --radius-md from theme

// ❌ DON'T HARDCODE - Typography
fontSize: '16px'
fontWeight: 500

// ✅ DO USE - Tailwind typography classes
className="text-base font-medium"
className="text-sm font-normal"
```

**Key Rules:**
1. **Colors**: ALWAYS use `bg-primary`, `text-foreground`, `border-border`, etc.
2. **Spacing**: Use Tailwind spacing utilities (`p-4`, `m-2`, `gap-4`)
3. **Radius**: Use Tailwind radius utilities that map to `--radius-*` variables
4. **Typography**: Use Tailwind text utilities (`text-sm`, `font-medium`)
5. **NEVER**: Use hex colors, RGB values, or hardcoded pixel values

**Why This Matters:**
- Ensures components work in both light and dark mode automatically
- Maintains consistency across the entire application
- Allows theme changes to propagate to all components
- Makes components reusable and maintainable

### Phase 5: Component Implementation

#### 5.1 Configuration-Based Implementation Strategy

##### Check Configuration Before Component Creation

Before implementing any components, you MUST read the `figma-to-react-config.json` file to determine the implementation approach:

```typescript
// REQUIRED: Read configuration first
const configPath = "docs/figma/figma-to-react-config.json";
const configContent = await read_file(configPath);
const config = JSON.parse(configContent);
```

**Implementation Strategy Based on Configuration:**

```typescript
// MANDATORY: Only shadcn/ui and React Hook Form are allowed
const packageJsonPath = "package.json";
const packageJson = JSON.parse(await read_file(packageJsonPath));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Check if shadcn/ui is installed (check for Tailwind CSS and components directory)
const hasShadcnUI = dependencies["tailwindcss"] !== undefined;
const hasReactHookForm = dependencies["react-hook-form"] !== undefined;

if (!hasShadcnUI) {
  console.error("shadcn/ui is not installed. REQUIRED: Install shadcn/ui before proceeding.");
  console.log("Run: npx shadcn@latest init");
  return;
}

if (!hasReactHookForm) {
  console.error("React Hook Form is not installed. REQUIRED: Install React Hook Form before proceeding.");
  console.log("Run: npm install react-hook-form");
  return;
}

console.log("Using shadcn/ui for component implementation");
console.log("Using React Hook Form for form management");

// MANDATORY Implementation approach:
// - ALWAYS import and use shadcn/ui components from @/components/ui
// - ALWAYS use React Hook Form for form state and validation
// - Use Tailwind CSS for custom styling (shadcn/ui is built on Tailwind)
// - Follow shadcn/ui's component patterns and APIs
// - Integrate React Hook Form with shadcn/ui Form components
// - Use zod for form validation schemas
// - DO NOT use any other UI libraries (Material UI, Flowbite, etc.)
// - DO NOT use any other form libraries (Formik, Final Form, etc.)
```

#### 5.2 Component Discovery

##### Step 1: Read Components Links File

First, read and parse the `docs/figma/components_links.md` file to discover all components that need to be created. This file contains:

- Complete list of available components with Figma URLs
- Component categorization by parent groups
- Direct links to component sections in the Figma file
- Implementation priority based on component complexity

##### Step 2: Parse Component Information

For each component entry in the format:

```markdown
ComponentParent
ComponentName: "<Figma URL with node-id parameter>"
```

Extract:

- **Component Name**: Use this as the React component name
- **Figma File Key**: Extract from the URL path
- **Node ID**: Extract from the `node-id` URL parameter and convert hyphens to colons (e.g., `1-2` becomes `1:2`)

##### Step 3: Dynamic Processing

Process every component found in the file - the documentation should work regardless of how many components are listed or what they are named.

**File Reading Implementation:**

```typescript
// Example: Read and parse components_links.md
const readComponentsFile = async () => {
  // Use read_file tool to get contents of components_links.md
  const fileContent = await read_file('docs/figma/components_links.md');
  
  // Parse component entries
  const components = [];
  const lines = fileContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for component lines with format: ComponentName: "<URL>"
    if (line.includes(': "') && line.includes('figma.com')) {
      const [name, urlPart] = line.split(': "');
      const url = urlPart.replace('"', '').replace('>', '');
      
      // Extract fileKey and nodeId from URL
      const fileKey = url.match(/figma\.com\/design\/([^\/]+)/)?.[1];
      const nodeIdParam = url.match(/node-id=([^&]+)/)?.[1];
      const nodeId = nodeIdParam?.replace(/-/g, ':');
      
      if (fileKey && nodeId) {
        components.push({ name, fileKey, nodeId, url });
      }
    }
  }
  
  return components;
};
```

#### 5.2 For Each Component

For **EVERY SINGLE component** listed in `components_links.md`:

1. **Check if component already exists** in the project's component structure
2. **If component exists**: Skip and move to next component
3. **If component does NOT exist**: Create the component using the following process:
   - Use `mcp_figma_get_figma_data()` to extract component data from Figma
   - Use `mcp_figma_dev_mod_get_code()` for generated code structure  
   - Use `mcp_figma_dev_mod_get_image()` for visual reference (optional)
   - Save under the correct atomic design level (atoms/molecules/organisms)

**IMPORTANT**: You must process **ALL components** in the `components_links.md` file. Do not skip any component unless it already exists in the codebase.

**Component Discovery Process:**

1. **Read `components_links.md`**: Parse the file to extract all component names and their Figma URLs
2. **Extract Node IDs**: Convert Figma URLs to node IDs (replace hyphens with colons in node-id parameter)
3. **Process Each Component**: For every component found in the file:
   - Check if component already exists in project
   - If not found, create using Figma MCP tools
   - Use the extracted node ID for Figma API calls

**Dynamic Component Reading:**

The system should dynamically read `components_links.md` and process all components listed there, regardless of how many or which components are included. The file format follows:

```markdown
ComponentParent
ComponentName: "<Figma URL with node-id>"
```

> 🔍 **NOTE**: Components may not include functionality by default, but **basic interactivity should be inferred from the component name**.

> - A `Button` should render a button element.
> - A `Toggle` should manage internal state for on/off.
> - A `Checkbox` should handle checked/unchecked states.

Follow existing project structure or use this template:

**styled-components Structure (Recommended):**

```bash
ComponentName/
├── index.ts                 # Barrel file
├── ComponentName.tsx        # Main component with styled-components
├── ComponentName.types.ts   # TypeScript interfaces
├── ComponentName.styles.ts  # Styled components (optional for complex components)
└── ComponentName.test.tsx   # Unit tests
```

**CSS Modules Structure (Alternative):**

```bash
ComponentName/
├── index.ts                 # Barrel file
├── ComponentName.tsx        # Main component
├── ComponentName.module.css # Styles (if using CSS modules)
├── ComponentName.types.ts   # TypeScript interfaces
└── ComponentName.test.tsx   # Unit tests
```

#### 5.3 Component Template

**MANDATORY: Use shadcn/ui Template Only**

##### shadcn/ui Button Component Template (REQUIRED)

```typescript
'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

##### shadcn/ui Form Component Template with React Hook Form (REQUIRED)

```typescript
'use client';

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define form validation schema with zod
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function ComponentName() {
  // Initialize React Hook Form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

##### shadcn/ui Custom Component Template (Extending Base Components)

```typescript
'use client';

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function CustomButton({
  variant = 'default',
  size = 'default',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative",
        loading && "pointer-events-none opacity-70",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
      <span className={cn(loading && "invisible", "flex items-center gap-2")}>
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </Button>
  )
}
```

#### 5.4 Implementation Guidelines

##### MANDATORY: Create ALL Components from components_links.md

Based on the components listed in `docs/figma/components_links.md`, you **MUST create ALL components** that don't already exist in the project.

**Implementation Process for Each Component:**

1. **MANDATORY: Verify shadcn/ui and React Hook Form are installed**
   - Check that `tailwindcss` is in package.json (required for shadcn/ui)
   - Check that `react-hook-form` is in package.json
   - Check that shadcn/ui components exist in `@/components/ui/` directory
   - Install if missing: `npx shadcn@latest init` and `npm install react-hook-form`

2. **Extract exact styling** from Figma using `mcp_figma_get_figma_data()` and `mcp_figma_dev_mod_get_code()`

3. **ALWAYS use shadcn/ui components as the base**:
   - Import from `@/components/ui/` directory
   - Use shadcn/ui's Button, Input, Form, Select, etc.
   - Extend shadcn/ui components using the `cn()` utility for custom styles
   - Follow shadcn/ui's Tailwind-based styling approach

4. **For form components, ALWAYS use React Hook Form**:
   - Use `useForm` hook from react-hook-form
   - Use `zodResolver` with zod for validation schemas
   - Integrate with shadcn/ui Form components
   - Follow React Hook Form patterns for form state management

5. **Implement proper accessibility** attributes (ARIA labels, keyboard navigation)
   - shadcn/ui components have built-in accessibility features

6. **Include all interactive states** (focus, hover, disabled, active states)
   - Use Tailwind CSS classes for state variants
   - Leverage shadcn/ui's built-in state management

7. **MANDATORY: Use Theme Provider Tokens** for ALL styling
   - **CRITICAL**: This project uses `next-themes` - ALL components MUST use CSS variables from `app/globals.css`
   - **Colors**: ALWAYS use `bg-primary`, `text-foreground`, `bg-background`, `border-border`, etc.
   - **NEVER hardcode**: No hex colors (#fff), RGB values, or arbitrary Tailwind colors (bg-blue-500)
   - **Spacing**: Use Tailwind spacing utilities (`p-4`, `m-2`, `gap-4`)
   - **Radius**: Use `rounded-lg`, `rounded-md` which map to `--radius-*` theme variables
   - **Typography**: Use `text-sm`, `font-medium`, etc.
   - This ensures automatic light/dark mode support for all components

8. **Add comprehensive TypeScript interfaces** with proper prop definitions
   - Extend shadcn/ui component prop types
   - Use `VariantProps` from class-variance-authority for variant typing

9. **Include functionality** - infer basic interactivity from component names:
   - A `Toggle` should use shadcn/ui Switch component
   - A `Checkbox` should use shadcn/ui Checkbox component
   - A `RadioButton` should use shadcn/ui RadioGroup component
   - A `Slider` should use shadcn/ui Slider component
   - A `Tag` should be built from shadcn/ui Badge component

10. **Include unit tests** for all interactive behaviors (recommended)

**MANDATORY Implementation Rules:**

- **ONLY shadcn/ui**: All UI components MUST use shadcn/ui as the base
- **ONLY React Hook Form**: All forms MUST use React Hook Form for state management
- **ONLY Theme Provider Tokens**: ALL styling MUST use CSS variables from the theme provider (`--primary`, `--foreground`, etc.)
  - ❌ NEVER hardcode colors, spacing, or other style values
  - ✅ ALWAYS use Tailwind classes that reference theme tokens (`bg-primary`, `text-foreground`)
  - This ensures automatic light/dark mode support
- **NO Other Libraries**: Do NOT use Material UI, Flowbite, Ant Design, Formik, or any other UI/form library
- **Tailwind CSS Only**: Use Tailwind CSS classes for all custom styling
- **Consistent Approach**: All components MUST follow shadcn/ui and React Hook Form patterns

**Component Creation Verification:**

After implementation, verify that ALL components from `components_links.md` have been created:

- [ ] Read and parse `components_links.md` file
- [ ] Extract all component names from the file
- [ ] Verify each component has been created in the project
- [ ] Confirm no components were skipped

### Phase 6: Demo and Documentation

#### 6.1 Demo Component Creation

Create a demo page for components.

#### 6.2 Design Token Demo Pages

Create a demo page for design tokens

## Implementation Standards

### TypeScript Interface Design

Follow these patterns for props interfaces:

```typescript
interface ComponentProps {
  // Required props first
  value: string;
  onChange: (value: string) => void;
  
  // Optional behavior props
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  
  // State props
  error?: boolean;
  disabled?: boolean;
  
  // Content props
  label?: string;
  
  // Styling props
  className?: string;
  
  // HTML attributes
  'aria-label'?: string;
}
```

### State Management Patterns

```typescript
const [isOpen, setIsOpen] = useState(false);
const [focusedIndex, setFocusedIndex] = useState(-1);
const [value, setValue] = useState(defaultValue);
```

### Event Handling Patterns

```typescript
const handleClick = useCallback((event: React.MouseEvent) => {
  if (disabled) return;
  // Handle click logic
}, [disabled]);

const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      // Handle activation
      break;
    case 'Escape':
      // Handle escape
      break;
  }
}, []);
```

## Best Practices

### Component Development

- **Clean separation of concerns**: Styles, types, and logic in separate files when needed
- **Use props for flexibility**: Make components configurable and reusable
- **MANDATORY: Use shadcn/ui components**: Always use shadcn/ui as the base for all components
- **MANDATORY: Use theme provider tokens**: ALL components MUST use CSS variables from `app/globals.css`
  - ❌ NEVER hardcode colors, spacing, or style values
  - ✅ ALWAYS use theme tokens: `bg-primary`, `text-foreground`, `border-border`, etc.
  - This ensures automatic light/dark mode support via `next-themes`
- **MANDATORY: Mobile-first responsive design**: ALL components MUST be fully responsive
  - Use Tailwind breakpoints (md:, lg:) for responsive scaling
  - Typography must scale across breakpoints (text-2xl md:text-3xl lg:text-4xl)
  - Touch targets minimum 44x44px on mobile (h-12 or h-11)
  - Generous spacing on mobile, increasing with screen size (px-4 md:px-8 lg:px-12)
  - Constrain long-form content (max-w-prose) for readability
  - Prioritize older adults and trauma-informed design principles
- **Styling with Tailwind CSS**: Use Tailwind CSS utility classes that reference theme variables
- **Include accessibility**: ARIA attributes, keyboard navigation, screen reader support (built into shadcn/ui)
- **Handle all states**: Default, hover, focus, disabled, error, loading states using Tailwind classes
- **Write comprehensive types**: Use TypeScript and extend shadcn/ui component prop types
- **Forms with React Hook Form**: All forms must use React Hook Form with zod validation

### Design Token Usage

**MANDATORY: All components MUST use theme provider tokens for light/dark mode support.**

This project uses `next-themes` with CSS variables defined in `app/globals.css`. The theme provider is at `components/theme-provider.tsx`.

**Required Token Usage:**

- **Colors - CRITICAL**:
  - ✅ ALWAYS use: `bg-primary`, `text-foreground`, `bg-background`, `border-border`, `bg-card`, `text-muted-foreground`
  - ❌ NEVER use: Hex colors (`#fff`), arbitrary Tailwind (`bg-blue-500`), hardcoded RGB
  - Why: Ensures automatic light/dark mode switching

- **Spacing**:
  - ✅ Use Tailwind spacing utilities: `p-4`, `m-2`, `gap-4`, `space-y-4`
  - Consistent spacing across components

- **Typography**:
  - ✅ Use Tailwind text utilities: `text-sm`, `text-base`, `font-medium`, `font-semibold`
  - Consistent font sizes and weights

- **Border Radius**:
  - ✅ Use Tailwind radius utilities: `rounded-lg`, `rounded-md`, `rounded-sm`
  - Maps to `--radius-*` theme variables

- **Animation/Transitions**:
  - ✅ Use Tailwind transition utilities: `transition-all`, `duration-200`, `ease-in-out`
  - Consistent transitions and animations

**Available Theme Tokens:**
See section 3.4 "Theme System Integration" for the complete list of CSS variables available from the theme provider.

### Responsive Design Standards

**MANDATORY: All components MUST be fully responsive and optimized for the ACD application context.**

This is a trauma-informed Advance Care Directive application where users engage with emotional content. Responsive design must prioritize:
- **Readability**: Especially for older adults
- **Accessibility**: Generous spacing and touch targets
- **Calm experience**: Not cramped or overwhelming
- **Emotional safety**: Comfortable reading and writing reflective content

#### Responsive Breakpoints

Use Tailwind's default breakpoint system consistently:

```typescript
// Tailwind Breakpoints
Mobile:  < 768px   (base/default - no prefix)
Tablet:  768px+    (md:)
Desktop: 1024px+   (lg:)
Desktop: 1280px+   (xl:)
Desktop: 1536px+   (2xl:)
```

**Implementation Pattern:**

```tsx
// Mobile-first approach (default styles apply to mobile)
<div className="px-4 md:px-8 lg:px-12">
  {/* Content */}
</div>
```

#### Typography Scaling

**Headings MUST scale up across breakpoints for better hierarchy:**

```tsx
// ✅ CORRECT - Responsive heading scaling
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Your Advance Care Directive
</h1>

<h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
  Section Title
</h2>

<h3 className="text-lg md:text-xl lg:text-2xl font-medium">
  Subsection
</h3>

// ✅ CORRECT - Body text (slight scaling acceptable)
<p className="text-base md:text-lg leading-relaxed md:leading-relaxed">
  Long-form content here...
</p>

// ❌ WRONG - No responsive scaling
<h1 className="text-4xl font-bold">Title</h1>
```

**Typography Rules:**

1. **Minimum 16px base font size** (Tailwind's `text-base`) for accessibility
2. **Headings**: Always scale up (minimum 2xl on mobile, up to 4xl+ on desktop)
3. **Body text**: `text-base` on mobile, `text-lg` optional on desktop
4. **Line height**: Use `leading-relaxed` or `leading-loose` for emotional/reflective content
5. **Reading width**: Constrain long-form text (see Content Width section below)

#### Spacing and Padding Patterns

**Mobile-first approach with generous vertical spacing for comfortable scrolling:**

```tsx
// ✅ CORRECT - Standard spacing pattern
<section className="px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12">
  {/* Section content */}
</section>

// ✅ CORRECT - Card/container padding
<div className="p-4 md:p-6 lg:p-8">
  {/* Card content */}
</div>

// ✅ CORRECT - Vertical spacing between sections
<div className="space-y-6 md:space-y-8 lg:space-y-12">
  <section>Section 1</section>
  <section>Section 2</section>
</div>

// ✅ CORRECT - Stack spacing (forms, lists)
<div className="space-y-4 md:space-y-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Spacing Guidelines:**

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| **Page padding** | `px-4 py-6` | `px-8 py-8` | `px-12 py-12` |
| **Card padding** | `p-4` | `p-6` | `p-8` |
| **Section gaps** | `space-y-6` | `space-y-8` | `space-y-12` |
| **Form field gaps** | `space-y-4` | `space-y-6` | `space-y-6` |
| **Button groups** | `gap-2` | `gap-3` | `gap-4` |

**Why generous spacing:**
- Older adults benefit from more whitespace
- Emotional content needs breathing room
- Reduces visual overwhelm in trauma-informed design

#### Content Width Constraints

**CRITICAL: Long-form content MUST be constrained for readability.**

```tsx
// ✅ CORRECT - Constrained reading width for emotional/reflective content
<div className="max-w-prose mx-auto px-4 md:px-8">
  <p className="text-base md:text-lg leading-relaxed">
    Your advance care directive helps ensure...
  </p>
</div>

// ✅ CORRECT - Alternative width constraints
<div className="max-w-3xl mx-auto">  {/* ~768px max */}
  {/* Long-form content */}
</div>

<div className="max-w-4xl mx-auto">  {/* ~896px max */}
  {/* Wide content like forms */}
</div>

// ❌ WRONG - Full-width text is hard to read
<div className="w-full">
  <p className="text-base">Very long paragraph that spans...</p>
</div>
```

**Width Constraint Rules:**

1. **Emotional/reflective content**: `max-w-prose` (65ch ~520px) or `max-w-3xl`
2. **Form sections**: `max-w-4xl` or `max-w-5xl`
3. **Dashboard/overview pages**: `max-w-7xl`
4. **Always center**: Use `mx-auto` with width constraints
5. **Maintain padding**: Add `px-4 md:px-8` even with max-width

**Why this matters:**
- Optimal reading width is 60-80 characters per line
- Reduces eye strain and improves comprehension
- Critical for users processing emotional content

#### Touch Target Sizing

**MANDATORY: Minimum 44x44px tap targets on mobile (WCAG 2.1 AAA).**

```tsx
// ✅ CORRECT - Mobile-optimized touch targets
<button className="
  h-12 px-6           // 48px height on mobile (exceeds 44px minimum)
  md:h-10 md:px-4     // More compact on desktop
  text-base
  rounded-lg
  bg-primary text-primary-foreground
">
  Save Progress
</button>

// ✅ CORRECT - Icon buttons with proper touch targets
<button className="
  h-11 w-11          // 44px x 44px minimum
  md:h-9 md:w-9      // Smaller on desktop
  rounded-lg
  flex items-center justify-center
">
  <Icon className="h-5 w-5" />
</button>

// ✅ CORRECT - Form inputs with generous tap areas
<input className="
  h-12 px-4          // 48px height
  md:h-10 md:px-3    // Slightly smaller on desktop
  rounded-md
  border-input
  bg-background
  text-base
" />

// ❌ WRONG - Touch target too small on mobile
<button className="h-8 w-8">  {/* Only 32px - too small! */}
  <Icon />
</button>
```

**Touch Target Guidelines:**

| Component | Mobile | Desktop | Notes |
|-----------|--------|---------|-------|
| **Primary buttons** | `h-12` (48px) | `h-10` (40px) | Comfortable for thumbs |
| **Secondary buttons** | `h-11` (44px) | `h-9` (36px) | Minimum safe size |
| **Icon buttons** | `h-11 w-11` | `h-9 w-9` | Square, centered icon |
| **Form inputs** | `h-12` (48px) | `h-10` (40px) | Easy to tap/focus |
| **Checkboxes/radios** | `h-6 w-6` (24px) | `h-5 w-5` (20px) | With label padding |
| **Toggle switches** | `h-6` (24px) | `h-5` (20px) | shadcn/ui default |

**Spacing between touch targets:**
- Minimum **8px gap** between interactive elements on mobile
- Use `gap-2` (8px) or `gap-3` (12px) for button groups
- Increase to `gap-4` (16px) on desktop if space allows

#### Responsive Component Patterns

**Common component patterns with responsive classes applied:**

##### 1. Page Container

```tsx
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      min-h-screen
      px-4 md:px-8 lg:px-12
      py-6 md:py-8 lg:py-12
      bg-background
    ">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}
```

##### 2. Content Section (Long-form)

```tsx
export function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <section className="
      max-w-prose mx-auto
      px-4 md:px-8
      py-6 md:py-8 lg:py-12
    ">
      <h2 className="
        text-2xl md:text-3xl lg:text-4xl
        font-bold
        mb-4 md:mb-6
        text-foreground
      ">
        {title}
      </h2>
      <div className="
        text-base md:text-lg
        leading-relaxed
        text-muted-foreground
        space-y-4 md:space-y-6
      ">
        {children}
      </div>
    </section>
  )
}
```

##### 3. Form Field

```tsx
export function FormField({ label, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="
        text-sm md:text-base
        font-medium
        text-foreground
      ">
        {label}
      </Label>
      <Input
        className="
          h-12 md:h-10
          px-4 md:px-3
          text-base
          bg-background
          border-input
        "
        {...props}
      />
    </div>
  )
}
```

##### 4. Button Group

```tsx
export function ButtonGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      flex flex-col sm:flex-row
      gap-3 md:gap-4
      items-stretch sm:items-center
      justify-end
    ">
      {children}
    </div>
  )
}

// Usage
<ButtonGroup>
  <Button
    variant="outline"
    className="h-12 md:h-10 px-6 md:px-4"
  >
    Cancel
  </Button>
  <Button
    className="h-12 md:h-10 px-6 md:px-4"
  >
    Continue
  </Button>
</ButtonGroup>
```

##### 5. Card Component

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-card
      border border-border
      rounded-lg md:rounded-xl
      p-4 md:p-6 lg:p-8
      shadow-sm
    ">
      {children}
    </div>
  )
}
```

##### 6. Grid Layout

```tsx
export function GridLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      grid
      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      gap-4 md:gap-6 lg:gap-8
    ">
      {children}
    </div>
  )
}
```

##### 7. Navigation Tabs (Mobile-friendly)

```tsx
export function NavigationTabs({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="
      flex
      overflow-x-auto
      gap-2 md:gap-4
      pb-2
      border-b border-border
      -mx-4 px-4 md:mx-0 md:px-0
    ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className="
            h-11 md:h-10
            px-4 md:px-6
            whitespace-nowrap
            text-sm md:text-base
            font-medium
            rounded-t-lg
            hover:bg-accent
            transition-colors
          "
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

#### Responsive Testing Checklist

When implementing responsive components, verify:

- [ ] **Mobile (< 768px)**:
  - [ ] Touch targets are minimum 44x44px
  - [ ] Text is at least 16px (text-base)
  - [ ] Padding is generous for thumb scrolling (px-4, py-6 minimum)
  - [ ] Content stacks vertically appropriately
  - [ ] Horizontal scrolling is intentional (tabs, carousels) not accidental
  - [ ] Long-form content is constrained (max-w-prose)

- [ ] **Tablet (768px - 1024px)**:
  - [ ] Spacing increases from mobile (px-8, py-8)
  - [ ] Typography scales up (headings +1 size)
  - [ ] Two-column layouts where appropriate
  - [ ] Touch targets can be slightly smaller but still comfortable

- [ ] **Desktop (1024px+)**:
  - [ ] Spacing is generous (px-12, py-12)
  - [ ] Typography reaches maximum scale
  - [ ] Content width is constrained (max-w-7xl or narrower)
  - [ ] Multi-column layouts utilized
  - [ ] Hover states are clearly visible

- [ ] **Cross-breakpoint**:
  - [ ] Smooth transitions between breakpoints
  - [ ] No horizontal overflow
  - [ ] Reading width never exceeds ~80 characters
  - [ ] Emotional/reflective content feels calm and spacious
  - [ ] Interactive elements are clearly distinguishable

#### Application-Specific Guidelines

**For Paced Completion Flow:**
- Use `max-w-prose` for all question/prompt text
- Generous `py-8 md:py-12` between questions
- Large, comfortable input fields (`h-12` minimum)
- Clear visual separation between sections

**For Fast Completion Flow:**
- `max-w-4xl` for form sections
- Tighter spacing (`py-6 md:py-8`) acceptable
- Still maintain 44px touch targets
- Form fields in logical groups with `space-y-4`

**For Reflective/Emotional Content:**
- **Always** use `max-w-prose` or `max-w-3xl`
- **Maximum** line-height: `leading-relaxed` or `leading-loose`
- **Generous** vertical spacing: `space-y-6 md:space-y-8`
- **Calm** typography: `text-base md:text-lg`
- **Breathing room**: Extra padding around content blocks

### Code Quality

- Follow SOLID coding principles.
- **Readability**: Clear, self-documenting code
- **Extendability**: Easy to add new features and variants
- **Maintainability**: Consistent patterns across codebase
- **Performance**: Use React.memo() for components that render frequently
- **Testing**: Write unit tests for complex logic and interactions

## Examples

### Basic Component Example (shadcn/ui - REQUIRED)

```tsx
// Button.tsx - Using shadcn/ui Button component
import * as React from "react"
import { Button } from "@/components/ui/button"

interface CustomButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CustomButton({
  text,
  disabled = false,
  onClick,
  variant = 'default',
  size = 'default'
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}
```

### Extended shadcn/ui Component with Custom Styles

```tsx
// CustomButton.tsx - Extending shadcn/ui Button with custom styling
import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function CustomButton({
  variant = 'default',
  size = 'default',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative transition-all",
        loading && "pointer-events-none opacity-70",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
      <span className={cn(loading && "invisible", "flex items-center gap-2")}>
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </Button>
  )
}
```

### Form Component with React Hook Form (REQUIRED for Forms)

```tsx
// ProfileForm.tsx - Using shadcn/ui Form with React Hook Form
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define form schema with zod
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

export function ProfileForm() {
  // Initialize React Hook Form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Interactive Component Using shadcn/ui Switch

```tsx
// ToggleSwitch.tsx - Using shadcn/ui Switch component
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ToggleSwitchProps {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({
  label,
  checked = false,
  onCheckedChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="toggle"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      {label && (
        <Label
          htmlFor="toggle"
          className={disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        >
          {label}
        </Label>
      )}
    </div>
  )
}
```

## Implementation Checklist

### Pre-Implementation

- [ ] Use MCP Figma tools for design analysis
- [ ] **MANDATORY: Verify shadcn/ui is installed**
  - [ ] Check `tailwindcss` in package.json
  - [ ] Check `@/components/ui/` directory exists
  - [ ] Run `npx shadcn@latest init` if not installed
- [ ] **MANDATORY: Verify React Hook Form is installed**
  - [ ] Check `react-hook-form` in package.json
  - [ ] Run `npm install react-hook-form` if not installed
- [ ] **MANDATORY: Install zod for form validation**
  - [ ] Check `zod` and `@hookform/resolvers` in package.json
  - [ ] Run `npm install zod @hookform/resolvers` if not installed
- [ ] **MANDATORY: Verify theme provider is installed**
  - [ ] Check `next-themes` in package.json
  - [ ] Check `components/theme-provider.tsx` exists
  - [ ] Verify `app/globals.css` contains CSS variable definitions
  - [ ] Run `npm install next-themes` if not installed
- [ ] Analyze existing frontend structure and patterns
- [ ] Extract design tokens from Figma
- [ ] Identify component variations and states
- [ ] Plan component API (props interface)
- [ ] Choose appropriate component category/location
- [ ] **MANDATORY: Only use shadcn/ui templates (NO Material UI, Flowbite, or custom styled-components)**

### Component Reuse Analysis

- [ ] Search for existing similar components
- [ ] Use semantic search to find related functionality
- [ ] Check if existing components can be extended
- [ ] Determine reuse strategy (extend, compose, variant, or new)
- [ ] Document why existing components don't meet requirements
- [ ] **MANDATORY: Check if shadcn/ui already provides the needed component**
  - [ ] Check shadcn/ui documentation: https://ui.shadcn.com
  - [ ] Install the shadcn/ui component if it exists: `npx shadcn@latest add [component-name]`
  - [ ] Only create custom components if shadcn/ui doesn't provide the needed functionality

### Component Implementation

- [ ] **VERIFY: shadcn/ui is installed (tailwindcss + components/ui directory)**
- [ ] **VERIFY: React Hook Form is installed**
- [ ] **VERIFY: zod and @hookform/resolvers are installed**
- [ ] **VERIFY: Theme provider (next-themes) is installed**
- [ ] **VERIFY: ALL components from `components_links.md` are processed**
- [ ] Create component directory structure following project patterns
- [ ] **MANDATORY: Use shadcn/ui components as base**
  - [ ] Import from `@/components/ui/`
  - [ ] Use `cn()` utility for className merging
  - [ ] Use Tailwind CSS classes for styling
- [ ] **MANDATORY: Use ONLY theme provider tokens for styling**
  - [ ] NEVER hardcode colors (no `#fff`, `rgb()`, or arbitrary Tailwind like `bg-blue-500`)
  - [ ] ALWAYS use theme tokens: `bg-primary`, `text-foreground`, `border-border`, etc.
  - [ ] Verify all color classes reference CSS variables from `app/globals.css`
  - [ ] Test component renders correctly in both light and dark mode
- [ ] **For forms: MANDATORY: Use React Hook Form**
  - [ ] Define zod validation schema
  - [ ] Use `useForm` hook with zodResolver
  - [ ] Integrate with shadcn/ui Form components
- [ ] Implement TypeScript interface extending shadcn/ui prop types
- [ ] Create component using shadcn/ui base components
- [ ] Add accessibility features (ARIA, keyboard navigation) - built into shadcn/ui
- [ ] Handle all state variations using Tailwind CSS
- [ ] Implement interactive behaviors
- [ ] Add proper focus management
- [ ] **MANDATORY: Implement responsive design**
  - [ ] Add responsive breakpoint classes (md:, lg:) to ALL components
  - [ ] Typography scales across breakpoints (text-2xl md:text-3xl lg:text-4xl)
  - [ ] Spacing increases with screen size (px-4 md:px-8 lg:px-12)
  - [ ] Touch targets minimum 44x44px on mobile (h-12 or h-11)
  - [ ] Long-form content constrained (max-w-prose or max-w-3xl)
  - [ ] Buttons/inputs larger on mobile, more compact on desktop
- [ ] **FINAL CHECK: Confirm all components from `components_links.md` are created**
- [ ] **FINAL CHECK: Confirm NO Material UI, Flowbite, or other UI libraries are used**

### Quality Assurance

- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Consistent with design system patterns
- [ ] Accessibility compliance
- [ ] **CRITICAL: Theme token usage validation**
  - [ ] Verify NO hardcoded colors (search for `#`, `rgb`, `hsl` in component files)
  - [ ] Verify NO arbitrary Tailwind colors (`bg-blue-500`, `text-red-600`, etc.)
  - [ ] Verify ALL colors use theme tokens (`bg-primary`, `text-foreground`, etc.)
  - [ ] Test component in BOTH light and dark mode
  - [ ] Verify theme switching works without page refresh
- [ ] Code follows project conventions
- [ ] **CRITICAL: Responsive design validation**
  - [ ] Test on mobile (< 768px): Touch targets 44px+, generous spacing, stacked layout
  - [ ] Test on tablet (768px-1024px): Spacing increases, typography scales, two-column OK
  - [ ] Test on desktop (1024px+): Maximum spacing, content width constrained, multi-column
  - [ ] Verify no horizontal overflow at any breakpoint
  - [ ] Verify typography scaling (headings grow, body text stays readable)
  - [ ] Verify long-form content uses max-w-prose or max-w-3xl
  - [ ] Verify touch targets shrink appropriately on desktop (h-12 → h-10)
  - [ ] Test emotional/reflective content feels calm and spacious
- [ ] **FINAL CHECK: Confirm NO Material UI, Flowbite, or other UI libraries are used**

### Final Steps

- [ ] Run ESLint + Prettier on all generated code
- [ ] Validate generated code against TypeScript compiler
- [ ] Test components in different browsers
- [ ] **CRITICAL: Verify responsive behavior across all breakpoints**
  - [ ] Mobile (< 768px): iPhone SE, iPhone 12/13, Android phones
  - [ ] Tablet (768px-1024px): iPad, iPad Pro, Surface
  - [ ] Desktop (1024px+): MacBook, Desktop monitors, 4K displays
  - [ ] Test orientation changes (portrait ↔ landscape)
  - [ ] Use browser DevTools responsive mode
  - [ ] Check actual devices when possible
- [ ] **Test light/dark mode switching**
  - [ ] Verify all components render correctly in light mode
  - [ ] Verify all components render correctly in dark mode
  - [ ] Verify smooth theme transitions (if applicable)
  - [ ] Check for any hardcoded colors that break theming
- [ ] Commit changes with descriptive messages

This guide ensures systematic, consistent implementation of Figma designs into React components while maintaining code quality, accessibility, and design system integrity.
