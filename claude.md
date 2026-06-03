# Claude Instructions

## Custom Shortcuts

### #f
When I type `#f`, follow the instructions in:
`/Users/lizzieteo/Development/advance-care-directive/.docs/figma-to-react/figma-to-react-checklist.md`

### #fig
When I type `#fig`, use Figma MCP commands in this order:
- **Get variables (ALWAYS REQUIRED - must be done FIRST)**
- Get code
- Get image

**CRITICAL: Getting variables is more important than getting design. Variables must always be retrieved first to ensure proper token mapping.**

### #cl
When I type `#cl`, reference the file at:
`/Users/lizzieteo/Development/advance-care-directive/.docs/figma-to-react/components_links.md`

### /style
When I type `/style`, follow the instructions in:
`/Users/lizzieteo/Development/advance-care-directive/.docs/figma-to-react/styling-guidelines.md`

## Scheduling & Loops

### /loop
Runs a prompt repeatedly on an interval. Usage: `/loop 7d <prompt>` — or paste the contents of a loop file directly.
- The interval goes before the prompt: `7d`, `1h`, `5m`, etc.
- The loop self-paces between runs and persists across sessions.
- To run the Reddit routine: copy the contents of `.docs/research/reddit-loop.md` and paste it as a `/loop 7d` command.

### /schedule
Creates a scheduled remote agent (cron job) that runs on a recurring schedule without needing the app open.
- Usage: `/schedule` — Claude will ask for the task and schedule interactively.
- Good for weekly research, reminders, or any recurring task.
- To run the Reddit routine on a schedule: use `/schedule` and reference `.docs/research/reddit-loop.md` as the task.

## Cloud Routines

### Reddit Research Routine
The weekly Reddit research routine lives at `.docs/research/reddit-loop.md`.

**Important:** Cloud remote agents block outbound calls to `api.tavily.com`. The routine must use WebFetch against Reddit's public `.json` endpoints directly (no API key required) — never Tavily. If the routine is updated, keep it on the Reddit JSON approach or it will silently fail in the cloud.
