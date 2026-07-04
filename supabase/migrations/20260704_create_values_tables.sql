-- Values categories and words, driven from Supabase instead of hardcoded in frontend.

CREATE TABLE IF NOT EXISTS values_categories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  prompt_text   TEXT        NOT NULL,
  display_order INT         NOT NULL DEFAULT 0
);

ALTER TABLE values_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can read values categories"
  ON values_categories FOR SELECT TO anon
  USING (true);


CREATE TABLE IF NOT EXISTS values_words (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID        NOT NULL REFERENCES values_categories(id) ON DELETE CASCADE,
  word          TEXT        NOT NULL,
  display_order INT         NOT NULL DEFAULT 0
);

ALTER TABLE values_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can read values words"
  ON values_words FOR SELECT TO anon
  USING (true);


-- Seed categories
WITH cats AS (
  INSERT INTO values_categories (name, prompt_text, display_order) VALUES
    ('Connection',      'Choose the words that capture what connection means to you.',           1),
    ('Who I am',        'Choose words that protect your sense of self.',                         2),
    ('How I live',      'Think about the texture of a day that still feels like yours.',         3),
    ('What I stand for','These are the principles you would want decisions to respect.',         4),
    ('What sustains me','Pick the supports that help you feel steady and cared for.',            5)
  RETURNING id, name
)
-- Seed words
INSERT INTO values_words (category_id, word, display_order)
SELECT c.id, w.word, w.ord FROM cats c
JOIN (VALUES
  ('Connection',       'Belonging',      1),
  ('Connection',       'Closeness',      2),
  ('Connection',       'Family',         3),
  ('Connection',       'Friendship',     4),
  ('Connection',       'Loyalty',        5),
  ('Connection',       'Togetherness',   6),
  ('Connection',       'Together',       7),

  ('Who I am',         'Being myself',   1),
  ('Who I am',         'Courage',        2),
  ('Who I am',         'Dignity',        3),
  ('Who I am',         'Gentleness',     4),
  ('Who I am',         'Humour',         5),
  ('Who I am',         'Independence',   6),
  ('Who I am',         'Integrity',      7),
  ('Who I am',         'Resilience',     8),
  ('Who I am',         'Strength',       9),

  ('How I live',       'Adventure',      1),
  ('How I live',       'Creativity',     2),
  ('How I live',       'Freedom',        3),
  ('How I live',       'Joy',            4),
  ('How I live',       'Playfulness',    5),
  ('How I live',       'Simplicity',     6),
  ('How I live',       'Stillness',      7),
  ('How I live',       'Warmth',         8),

  ('What I stand for', 'Compassion',     1),
  ('What I stand for', 'Faith',          2),
  ('What I stand for', 'Goodness',       3),
  ('What I stand for', 'Honesty',        4),
  ('What I stand for', 'Justice',        5),
  ('What I stand for', 'Kindness',       6),
  ('What I stand for', 'Legacy',         7),
  ('What I stand for', 'Truth',          8),
  ('What I stand for', 'Wisdom',         9),

  ('What sustains me', 'Acceptance',     1),
  ('What sustains me', 'Beauty',         2),
  ('What sustains me', 'Community',      3),
  ('What sustains me', 'Ease',           4),
  ('What sustains me', 'Enough',         5),
  ('What sustains me', 'Growth',         6),
  ('What sustains me', 'Home',           7),
  ('What sustains me', 'Nature',         8),
  ('What sustains me', 'Peace',          9),
  ('What sustains me', 'Security',       10),
  ('What sustains me', 'Helping others', 11),
  ('What sustains me', 'Spirituality',   12)
) AS w(cat_name, word, ord) ON c.name = w.cat_name;
