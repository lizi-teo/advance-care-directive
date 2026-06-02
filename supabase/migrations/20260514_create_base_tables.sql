-- Base tables that existed before migration tracking began.
-- questions, answer_options, and user_responses were created directly
-- in the hosted Supabase dashboard; this file recreates them for local dev.

CREATE TABLE IF NOT EXISTS questions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  caption       TEXT,
  question_text TEXT        NOT NULL,
  image_url     TEXT,
  tell_me_more  TEXT,
  display_order INT         NOT NULL DEFAULT 0
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can read questions"
  ON questions FOR SELECT TO anon
  USING (true);


CREATE TABLE IF NOT EXISTS answer_options (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text  TEXT NOT NULL,
  option_order INT  NOT NULL DEFAULT 0
);

ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can read answer options"
  ON answer_options FOR SELECT TO anon
  USING (true);


CREATE TABLE IF NOT EXISTS user_responses (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID,
  question_id      UUID        NOT NULL REFERENCES questions(id),
  answer_option_id UUID        NOT NULL REFERENCES answer_options(id),
  free_text_note   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert user responses"
  ON user_responses FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon can read user responses"
  ON user_responses FOR SELECT TO anon
  USING (true);
