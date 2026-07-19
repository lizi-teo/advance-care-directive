-- Heartbeat table to stop the Free plan project being paused for inactivity.
-- Supabase pauses free projects after ~7 days of low user database activity, so
-- a Vercel Cron job hits /api/awake daily and touches this table.
--
-- Named with a leading underscore so it sorts above the product tables in Studio
-- and reads as infrastructure rather than application data.
--
-- Single row (id is pinned to 1) so the table never grows.

CREATE TABLE IF NOT EXISTS _awake (
  id         SMALLINT    PRIMARY KEY DEFAULT 1,
  pinged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ping_count BIGINT      NOT NULL DEFAULT 0,
  source     TEXT,
  CONSTRAINT _awake_single_row CHECK (id = 1)
);

ALTER TABLE _awake ENABLE ROW LEVEL SECURITY;

-- Deliberately NO anon policies. The anon key is public, so an anon-writable
-- heartbeat table would be an open write endpoint. RLS on with zero policies
-- makes this table unreachable except via the service role.

INSERT INTO _awake (id, ping_count, source)
  VALUES (1, 0, 'migration')
  ON CONFLICT (id) DO NOTHING;

-- Atomic touch: bumps the timestamp and the counter in one statement so
-- concurrent pings can't clobber each other's count.
CREATE OR REPLACE FUNCTION ping_awake(ping_source TEXT DEFAULT 'unknown')
RETURNS TIMESTAMPTZ
LANGUAGE sql
AS $$
  INSERT INTO _awake (id, pinged_at, ping_count, source)
    VALUES (1, NOW(), 1, ping_source)
  ON CONFLICT (id) DO UPDATE
    SET pinged_at  = NOW(),
        ping_count = _awake.ping_count + 1,
        source     = EXCLUDED.source
  RETURNING pinged_at;
$$;

-- Only the service role should be able to call this.
REVOKE ALL ON FUNCTION ping_awake(TEXT) FROM PUBLIC, anon, authenticated;
