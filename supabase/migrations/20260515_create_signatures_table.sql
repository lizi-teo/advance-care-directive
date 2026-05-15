-- Create signatures table to record signed directives
CREATE TABLE IF NOT EXISTS signatures (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT        NOT NULL,
  signed_name TEXT       NOT NULL,
  signature_url TEXT     NOT NULL,
  signed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS signatures_session_id_idx ON signatures (session_id);

-- Enable RLS
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Allow anon inserts (same pattern as user_responses)
CREATE POLICY "anon can insert signatures"
  ON signatures FOR INSERT TO anon
  WITH CHECK (true);

-- Only service role can read (signatures are private)
CREATE POLICY "service role can read signatures"
  ON signatures FOR SELECT TO service_role
  USING (true);
