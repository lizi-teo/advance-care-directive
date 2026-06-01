# Routine Prompts — User Research Pipeline

Two routines power this folder. Set them up at claude.ai/code/routines.

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
