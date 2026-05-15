CREATE TABLE IF NOT EXISTS witness_signatures (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            TEXT        NOT NULL,
  witness_name          TEXT        NOT NULL,
  witness_signature_url TEXT        NOT NULL,
  witnessed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS witness_signatures_session_id_idx ON witness_signatures (session_id);

ALTER TABLE witness_signatures ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "anon can insert witness signatures"
    ON witness_signatures FOR INSERT TO anon
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "anon can read witness signatures"
    ON witness_signatures FOR SELECT TO anon
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
