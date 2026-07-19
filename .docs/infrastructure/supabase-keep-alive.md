# Supabase Keep-Alive

Set up 19 July 2026. Stops the Supabase Free plan project from being paused for inactivity.

---

## The Problem

Supabase **pauses Free plan projects after ~7 days of low database activity**.

The commonly-cited "90 days" is a different thing — that's the window to *restore* a project that has **already** been paused, from within Supabase Studio. Miss that and the project may be unrecoverable.

Supabase's own guidance: *"a few user requests to the database each day over the previous week is enough."*

This app has no guaranteed daily traffic, so without a heartbeat the database would eventually pause.

---

## How It Works

```
Vercel Cron (07:00 + 19:00 UTC daily)
        │
        ▼
GET /api/awake  ──(Authorization: Bearer CRON_SECRET)
        │
        ├─► ping_awake()  → updates the _awake row
        └─► SELECT from values_categories  → exercises the real read path
                │
                ▼
        Supabase sees daily activity → project stays awake

Claude routine (every 2 days)
        │
        ▼
GET /api/awake/status  ──(no auth)
        │
        └─► stale? → loud alert
```

---

## The Pieces

| Piece | Location | Purpose |
|-------|----------|---------|
| `_awake` table | `supabase/migrations/20260719_create_awake.sql` | Single-row heartbeat record |
| `ping_awake()` | same migration | Atomic upsert + counter increment |
| `/api/awake` | `app/api/awake/route.ts` | Cron endpoint, writes the heartbeat |
| `/api/awake/status` | `app/api/awake/status/route.ts` | Public staleness check, no credentials |
| Cron schedule | `vercel.json` | Two daily entries |
| Watchdog | Claude cloud routine | Alerts if the heartbeat stops |

### The `_awake` table

```sql
CREATE TABLE IF NOT EXISTS _awake (
  id         SMALLINT    PRIMARY KEY DEFAULT 1,
  pinged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ping_count BIGINT      NOT NULL DEFAULT 0,
  source     TEXT,
  CONSTRAINT _awake_single_row CHECK (id = 1)
);
```

Named with a **leading underscore** so it sorts above the product tables in Studio and reads as infrastructure rather than application data.

`CHECK (id = 1)` pins it to a single row, so the table never grows and costs nothing against the 500MB free-tier cap.

---

## Key Decisions (and why)

### Vercel Cron, not a Claude agent, does the pinging

The original idea was a Claude cloud agent clicking a button on the site. Rejected because a cron job is free, deterministic, and lives in the same project — whereas a scheduled agent costs tokens per run and can fail for model or harness reasons. Pinging is dumb work; give it to dumb, reliable infrastructure.

The Claude agent still earns its place, but as the **watchdog** — the part that requires judgement.

### Two cron entries, not one

Vercel **Hobby caps each cron at once per day** with ±59min precision. Expressions like `0 */12 * * *` are **rejected at deploy time**. Two separate daily entries is the workaround, and gives redundancy so one failed run doesn't erode the 7-day budget.

### `_awake` is the only table with NO anon policy

Every other table in this schema grants blanket `anon` INSERT/SELECT. The anon key is **public** (it ships in the browser bundle), so an anon-writable heartbeat table would be an open write endpoint for anyone.

RLS enabled with **zero policies** = invisible to `anon`, reachable only via the service role. `ping_awake()` is likewise `REVOKE`d from `PUBLIC, anon, authenticated`.

### The status endpoint is public but exposes nothing

Reading `_awake` requires the service role. Handing a full RLS-bypassing credential to a scheduled cloud agent just to read one timestamp is a bad trade.

So `/api/awake/status` returns only **derived** staleness — never the row:

```json
{ "stale": false, "hours_since_ping": 7.2, "stale_after_hours": 36, "ping_count": 12 }
```

An attacker learns the heartbeat is healthy. Not worth protecting. Returns **503 when stale**, so any uptime monitor can alert on status code alone.

### Env vars are checked before the bearer comparison

The obvious guard is:

```ts
if (header !== `Bearer ${process.env.CRON_SECRET}`)   // ⚠️ BUG
```

If `CRON_SECRET` is ever missing, this becomes `Bearer undefined` — and anyone sending that literal string authenticates. The route checks the env vars **exist** first, returning 500. Verified: with `CRON_SECRET` unset, `Bearer undefined` gets 500, not 200.

### Watchdog runs every 2 days, not weekly

Originally planned as weekly. That's wrong: with a 7-day pause threshold, if the cron breaks right after a weekly check you'd be alerted 7 days later — exactly as the project pauses. Zero margin.

Every 2 days caps alert latency at 2 days, leaving 5 days to fix it.

---

## Environment Variables

| Variable | Where | Notes |
|----------|-------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Production, `.env.local` | Server-only. **Never** prefix `NEXT_PUBLIC_` |
| `CRON_SECRET` | Vercel Production, `.env.local` | Any random string; Vercel injects it into cron requests |

`CRON_SECRET` isn't something you look up — you invent it. It's a shared password between Vercel Cron and the endpoint. Generate with `openssl rand -hex 32`.

---

## The Watchdog Routine

- **Manage at:** https://claude.ai/code/routines/trig_01WyBUmLNBrKTibuGZQKydgL
- **Schedule:** `0 22 */2 * *` — every 2 days, 22:00 UTC (8am Sydney)
- **Model:** `claude-sonnet-5`
- **MCP connectors:** none (deliberately cleared — a heartbeat checker has no business with Gmail/Drive/Calendar)

Routines sync across CLI, desktop, and web. From the browser you can view past run transcripts, pause, edit, delete, or **Run now**.

---

## Verifying It Works

Healthy state, no credentials needed:

```bash
curl https://advance-care-directive.vercel.app/api/awake/status
# → {"stale":false,"hours_since_ping":7.2,...}   HTTP 200
```

**`ping_count` should increase by 2 per day.** That's the real proof the scheduler is firing — the endpoint working on demand doesn't prove the cron invokes it.

Manual ping (needs the secret from `.env.local`):

```bash
source .env.local
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://advance-care-directive.vercel.app/api/awake
```

Confirm anon is locked out:

```bash
source .env.local
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/_awake?select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"
# → []   (row exists but RLS hides it)
```

---

## If The Heartbeat Stops

Work through in order:

1. **Vercel → Project → Cron Jobs** — did the runs execute? Did they fail?
2. **Vercel → Settings → Environment Variables** — do `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` still exist in Production? A rotated or deleted key breaks the route silently.
3. **`vercel.json`** — do the two cron entries still exist? A merge could drop them.
4. **Is Supabase already paused?** If so, resume from the Supabase dashboard immediately.

**Immediate stopgap:** manually ping the endpoint (above), or just load the app. Either resets the inactivity clock while you investigate.

---

## Known Issues

- **Vercel preview env vars won't set** via CLI 54.7.1 — fails even using Vercel's own suggested command. Doesn't matter (crons are production-only). Retry after `npm i -g vercel@latest`.
- **Two GitHub accounts** are authenticated (`lizzie-teo` and `lizi-teo`). This repo belongs to `lizi-teo`; pushes 403 if the wrong one is active. Fix: `gh auth switch --user lizi-teo`.
- **`.gitignore`** now has `!.env.local.example` — the blanket `.env*` rule was excluding the template, so documented variable names never reached the repo.

---

## Alternatives Considered

| Option | Verdict |
|--------|---------|
| **`pg_cron` inside Postgres** | ❌ Trap. Internal scheduled SQL isn't "user database activity" — the request must arrive over the REST/pooler surface. |
| **GitHub Actions cron** | ❌ GitHub **disables scheduled workflows after 60 days of no commits**, silently reintroducing the exact failure mode being fixed. |
| **External pinger** (cron-job.org, UptimeRobot) | ⚠️ Viable third layer — free, and survives Vercel outages. Can point at `/api/awake/status` and alert on the 503. |
| **Supabase Pro ($25/mo)** | ✅ The only permanent fix. Paid projects are never paused. Everything here is a workaround for staying free. |

---

## Related

- [Project Pausing | Supabase Docs](https://supabase.com/docs/guides/platform/free-project-pausing)
- [Cron Jobs Usage & Pricing | Vercel Docs](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- PRs [#1](https://github.com/lizi-teo/advance-care-directive/pull/1) and [#2](https://github.com/lizi-teo/advance-care-directive/pull/2)

---

## Unrelated Issues Found Along The Way

Surfaced while exploring the schema, **not** addressed:

- `session_values` and `signatures` both grant `anon` SELECT with `USING (true)`. Since the anon key is public, **anyone can read every session's data**, not just their own. The `20260518` migration comment reasons that session IDs are unguessable UUIDs — but that only holds if a caller must supply the ID, which RLS does not enforce.
- `session_values` is insert-only (`useValuesSubmit.ts` appends rather than upserts), with no index on `session_id`. Readers must order by `created_at` and take the latest.
