---
name: figma-ds
description: Add or update design system items in Figma — variables, colors, typography, spacing tokens, components, and styles. Expects a Figma URL and a description of what to add.
disable-model-invocation: false
allowed-tools: mcp__figma__use_figma, mcp__figma__get_design_context, mcp__figma__search_design_system, mcp__figma__get_variable_defs, mcp__figma__get_metadata, mcp__figma__get_screenshot, mcp__figma__create_new_file
---

# Figma Design System

The user wants to add or update design system items in Figma. The input is: $ARGUMENTS

## Steps

1. **Parse the Figma URL** — extract `fileKey` and `nodeId` from the URL.
2. **Read existing design system** — call `search_design_system` and `get_variable_defs` to understand what already exists. Avoid duplicating tokens, colors, or components that are already defined.
3. **Read current state** — if a specific node is referenced, call `get_design_context` to see the current design before making changes.
4. **Make changes** — use `use_figma` to execute Figma Plugin API code to add or update the requested items. This can include:
   - **Variables/tokens**: colors, spacing, typography, border radius, opacity
   - **Styles**: color styles, text styles, effect styles, grid styles
   - **Components**: create or update components with proper variants, auto layout, and properties
   - **Documentation**: add descriptions to components and variables
5. **Verify** — after changes, call `get_screenshot` or `get_design_context` to confirm the result looks correct.
6. **Report back** — summarize what was added/changed and provide the Figma link.

## Rules
- Always check existing design system assets before creating new ones
- Use Figma variables (not raw hex values) for all token-based properties
- Organize variables into proper collections and groups (e.g., `color/primary/500`)
- Use auto layout for all component structures
- Add descriptions to variables and components for documentation
- Follow naming conventions: lowercase with `/` separators for variables, PascalCase for components
- When creating color variables, include all necessary modes (e.g., light/dark)
- For the font "Inter", the style is "Semi Bold" (with a space), not "SemiBold"
- Use `figma.setCurrentPageAsync(page)` instead of setting `figma.currentPage` directly
