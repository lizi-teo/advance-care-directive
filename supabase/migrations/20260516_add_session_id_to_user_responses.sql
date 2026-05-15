ALTER TABLE user_responses
  ADD COLUMN IF NOT EXISTS session_id TEXT;

CREATE INDEX IF NOT EXISTS user_responses_session_id_idx ON user_responses (session_id);
