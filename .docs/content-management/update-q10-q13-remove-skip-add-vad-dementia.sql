-- ============================================================
-- ACD Questions -- v3 patch (run AFTER add-q10-q13-dementia-pain-place-vad.sql)
-- Run in Supabase SQL Editor
--
-- Changes:
--   1. Q10 (dementia) -- remove skip option, add VAD preference option
--   2. Q11 (pain)     -- remove skip option
--   3. Q12 (place)    -- remove skip option
--   4. Q13 (VAD)      -- remove skip option
-- ============================================================


-- ============================================================
-- Q10: Remove skip, add VAD dementia option
-- ============================================================
DELETE FROM answer_options
WHERE option_text = 'This doesn''t apply to me — I''d prefer to skip this question.'
  AND question_id = (
    SELECT id FROM questions
    WHERE question_text LIKE '%condition like dementia or Alzheimer%'
  );

INSERT INTO answer_options (question_id, option_text, option_order)
SELECT id, 'If assisted dying is available where I live, I would want to explore that option while I still have capacity — not wait until this stage.', 5
FROM questions
WHERE question_text LIKE '%condition like dementia or Alzheimer%';


-- ============================================================
-- Q11: Remove skip
-- ============================================================
DELETE FROM answer_options
WHERE option_text = 'This doesn''t apply to me — I''d prefer to skip this question.'
  AND question_id = (
    SELECT id FROM questions
    WHERE question_text LIKE '%managing pain and discomfort at the end of my life%'
  );


-- ============================================================
-- Q12: Remove skip
-- ============================================================
DELETE FROM answer_options
WHERE option_text = 'This doesn''t apply to me — I''d prefer to skip this question.'
  AND question_id = (
    SELECT id FROM questions
    WHERE question_text LIKE '%possible to choose, I would prefer to die%'
  );


-- ============================================================
-- Q13: Remove skip
-- ============================================================
DELETE FROM answer_options
WHERE option_text = 'This doesn''t apply to me — I''d prefer to skip this question.'
  AND question_id = (
    SELECT id FROM questions
    WHERE question_text LIKE '%values about voluntary assisted dying%'
  );


-- ============================================================
-- VERIFY
-- ============================================================
SELECT
  q.display_order,
  q.caption,
  ao.option_order,
  ao.option_text
FROM questions q
JOIN answer_options ao ON ao.question_id = q.id
WHERE q.display_order BETWEEN 10 AND 13
ORDER BY q.display_order, ao.option_order;
