# Routine Prompts

All three routines below are set up at claude.ai/code/routines.

---

## Routine 3: PR Review — Healthcare Checklist

**Trigger:** GitHub event — pull_request.opened
**Filter:** Base branch = `main`
**Repositories:** lizi-teo/advance-care-directive
**Connectors:** None

### Prompt

```
You are reviewing a pull request on an advance care directive web application.
This is a healthcare product used by people making end-of-life decisions —
accuracy, accessibility, and data sensitivity are non-negotiable.

Read the PR diff and check every changed file against this checklist.
Leave an inline comment for every issue found. Be specific — quote the line.
At the end, post a single summary comment with a pass/fail verdict per section.

---

CHECKLIST

1. FORM VALIDATION
   - Every form field that is required has a corresponding Zod schema rule
   - Error messages are in plain language (no technical jargon)
   - Required vs optional fields are visually distinguished

2. DATA PRIVACY
   - No patient data, health decisions, or personal identifiers appear in console.log,
     error messages, analytics events, or any client-visible state
   - Supabase queries use row-level security (RLS) — any new table must have RLS enabled
   - No sensitive fields stored in localStorage or sessionStorage

3. ACCESSIBILITY
   - New UI components have appropriate ARIA labels and roles
   - Interactive elements are keyboard navigable
   - Colour contrast meets WCAG AA minimum (especially for elderly users)
   - Touch targets are at least 44x44px on mobile

4. LANGUAGE AND TONE
   - Any new user-facing copy uses plain, calm language appropriate for end-of-life context
   - No euphemisms that obscure meaning (users must clearly understand what they are signing)
   - No legalese without an accompanying plain-language explanation

5. PDF GENERATION
   - If /features or /components related to PDF are changed, verify the output
     structure still matches the legal advance directive format
   - No fields removed from the PDF output without explicit justification in the PR description

6. SUPABASE MIGRATIONS
   - Any new migration in /supabase is reversible (has a down migration)
   - No columns dropped from existing tables without a data migration strategy
   - New tables have RLS policies defined before data is written to them

7. COMPONENT STORIES
   - Every new component in /components has a matching Storybook story in /stories
   - Existing stories still reflect the component's current props

8. DESIGN SYSTEM
   - No hardcoded hex colours or font sizes — Tailwind tokens only
   - New components follow the spacing and typography scales in
     .docs/typography-system.md

---

Do not comment on code style, formatting, or things outside this checklist.
If a section has no issues, say "✓ clear" and move on.
```

---

## Research Pipeline

---

## Routine 1: Reddit Scraper

**Trigger:** Schedule — one-off at 6pm today, then bi-weekly (every other Sunday 6pm)
**Repositories:** lizi-teo/advance-care-directive (allow unrestricted branch pushes: OFF)
**Connectors:** Reddit MCP

### Prompt

```
Search Reddit for posts from the past 14 days mentioning any of:
"advance directive", "advance care directive", "living will", "advance care planning".

Limit to these 4 subreddits only:
r/eldercare, r/AgingParents, r/endoflife, r/hospice

Hard limits to control scope:
- Process a maximum of 15 posts total
- Only include posts with at least 10 upvotes
- For each post, read the top 3 comments only
- Skip posts that are purely legal questions with no personal experience shared

For each included post, extract only:
- The core pain point in one sentence
- One short anonymised quote (no usernames)
- The subreddit

Group findings into these themes (maximum 5 entries per theme):
1. Emotional / psychological barriers
2. Legal / administrative confusion
3. Family and communication difficulties
4. Healthcare system failures
5. Practical / logistics problems

If a theme has fewer than 2 entries, omit it entirely rather than padding.

Save the raw findings as a markdown file to:
.docs/user-research/insights-archive/YYYY-MM-DD.md

Then create a new branch named claude/research-YYYY-MM-DD and open a pull request
titled "Research: Reddit insights YYYY-MM-DD" targeting main.
The PR body should state only: total posts processed, themes found, date range covered.
```

---

## Routine 2: UX Researcher

**Trigger:** GitHub event — pull_request.opened
**Filter:** Head branch starts with `claude/research`
**Repositories:** lizi-teo/advance-care-directive

### Prompt

```
A new Reddit research file has been committed in .docs/user-research/insights-archive/.
Read the most recent file in that folder.

Also read the following for context on the current product:
- /app (existing screens and flows)
- /features (feature modules)
- /components (UI components)
- .docs/content-management (existing content decisions)

As a UX researcher, produce a synthesis that:
1. Identifies the top 3 pain points most relevant to this product's current gaps
2. Maps each pain point to a specific screen or flow in the existing app
3. Recommends a concrete design change or new feature for each
4. Flags any pain point that appears for the second week in a row (recurring signal)

Format the synthesis as a new dated section and prepend it to:
.docs/user-research/reddit-insights.md

Also update the open PR's description with the full synthesis so it's visible for review.
```
