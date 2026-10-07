-- Let an answer option be retired without deleting it.
-- Deleting would cascade to user_responses and erase saved answers.
ALTER TABLE answer_options
  ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- Retire the dementia question's assisted dying option.
-- People with dementia rarely qualify, and Q13 already covers assisted dying values.
UPDATE answer_options ao
SET is_active = false
FROM questions q
WHERE q.id = ao.question_id
  AND q.question_text LIKE '%condition like dementia or Alzheimer%'
  AND ao.option_text LIKE 'If assisted dying is available where I live%';
