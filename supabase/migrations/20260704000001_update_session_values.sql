-- Add migration tracking for session_values (was created manually in dashboard).
-- Also adds selected_by_category to store per-category selections alongside the flat array.

CREATE TABLE IF NOT EXISTS session_values (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     TEXT        NOT NULL,
  selected_words TEXT[]      NOT NULL DEFAULT '{}',
  values_note    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE session_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert session values"
  ON session_values FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon can read session values"
  ON session_values FOR SELECT TO anon
  USING (true);

-- Per-category breakdown: [{category: "Connection", words: ["Belonging", "Family"]}, ...]
ALTER TABLE session_values
  ADD COLUMN IF NOT EXISTS selected_by_category JSONB;
