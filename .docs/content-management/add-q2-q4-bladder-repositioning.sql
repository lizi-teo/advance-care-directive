-- ============================================================
-- ACD Questions — v2 Migration
-- Run in Supabase SQL Editor
--
-- Changes:
--   1. Reorder existing 7 questions to match official NSW ACD form sequence
--   2. Insert 2 new questions: Bladder/bowels (Q2) and Repositioning (Q4)
--   3. Rewrite tell_me_more for all 7 existing questions
-- ============================================================


-- ============================================================
-- STEP 1: Shift all existing questions out of the way
-- ============================================================
UPDATE questions SET display_order = display_order + 100;


-- ============================================================
-- STEP 2: Re-assign display_orders for existing questions
-- New order: 1, 3, 5, 6, 7, 8, 9 (leaving 2 and 4 for new questions)
-- ============================================================
UPDATE questions SET display_order = 1
WHERE question_text LIKE '%could no longer recognise the people you love%';

UPDATE questions SET display_order = 3
WHERE question_text LIKE '%needed total help with eating, washing%';

UPDATE questions SET display_order = 5
WHERE question_text LIKE '%could no longer eat or drink by mouth%';

UPDATE questions SET display_order = 6
WHERE question_text LIKE '%could no longer understand others or express your own thoughts%';

UPDATE questions SET display_order = 7
WHERE question_text LIKE '%very sick and not expected to recover%'
  AND question_text LIKE '%CPR%';

UPDATE questions SET display_order = 8
WHERE question_text LIKE '%machine to breathe for you%';

UPDATE questions SET display_order = 9
WHERE question_text LIKE '%antibiotics or heart medications%';


-- ============================================================
-- STEP 3: Rewrite tell_me_more for all 7 existing questions
-- ============================================================

-- Q1: Recognition
UPDATE questions
SET tell_me_more = 'The people we love are often at the heart of what makes life feel meaningful. Imagining a world where those faces no longer feel familiar is one of the hardest things to sit with.

• For some, life still holds warmth and meaning even without the ability to recognise loved ones.
• For others, that recognition is so fundamental that life without it wouldn''t feel like their own.

Neither answer is wrong. This is about what matters most to you.'
WHERE question_text LIKE '%could no longer recognise the people you love%';

-- Q3: Independence
UPDATE questions
SET tell_me_more = 'Being able to care for yourself — to wash, dress, and eat on your own — is something most of us take for granted. Needing full help with these things is a significant shift in how you move through the world.

• Some people feel they could adapt, knowing that being cared for is still a form of being loved.
• For others, that independence is so tied to their sense of self that losing it would feel like losing too much.

There''s no right or wrong answer.'
WHERE question_text LIKE '%needed total help with eating, washing%';

-- Q5: Eating & Drinking
UPDATE questions
SET tell_me_more = 'Food and drink are woven into so much of what makes life feel human — sharing meals, the simple act of swallowing, tasting something you love. When that''s no longer possible, a feeding tube can sustain the body, but it changes the experience of living.

• Some people feel that staying alive is worth it, even with a feeding tube.
• Others feel that being unable to eat or drink naturally would change their quality of life too much.

Neither feeling is wrong.'
WHERE question_text LIKE '%could no longer eat or drink by mouth%';

-- Q6: Communication
UPDATE questions
SET tell_me_more = 'Being able to speak, to be understood, to follow a conversation — it''s how most of us stay connected to the people we love. Losing that ability is something many people find deeply confronting.

• Some people feel they could still experience connection through presence, touch, and expression — even without words.
• For others, the ability to communicate is so central to who they are that life without it would feel unrecognisable.

What matters is what feels true for you.'
WHERE question_text LIKE '%could no longer understand others or express your own thoughts%';

-- Q7: CPR
UPDATE questions
SET tell_me_more = 'CPR is physically intense — forceful chest compressions, electric shocks, breathing tubes, and strong medications. It can feel hard to reconcile with the idea of a peaceful end.

• In otherwise healthy people, CPR can be life-saving.
• For someone who is very unwell or not expected to recover, it rarely works and can cause pain and injury.

This is about choosing between every possible intervention and allowing a natural death, with care focused entirely on comfort.'
WHERE question_text LIKE '%very sick and not expected to recover%'
  AND question_text LIKE '%CPR%';

-- Q8: Life Support
UPDATE questions
SET tell_me_more = 'A ventilator breathes for you — a tube placed in the throat, connected to a machine. If recovery isn''t expected, it can keep the body alive but won''t change the outcome.

• Some people want every chance, however small — even if it means time on a machine.
• Others feel that being kept alive this way would not reflect the kind of life, or death, they want.

Both are deeply human responses to an impossibly hard situation.'
WHERE question_text LIKE '%machine to breathe for you%';

-- Q9: Infections & Medications
UPDATE questions
SET tell_me_more = 'When someone isn''t expected to recover, treatments like antibiotics or heart medications can extend life — but they can''t change the direction things are heading.

• Some people want every available treatment continued for as long as possible.
• Others would rather their care team focus entirely on keeping them comfortable and free from pain.

There''s no wrong answer. This is about what matters most to you.'
WHERE question_text LIKE '%antibiotics or heart medications%';


-- ============================================================
-- STEP 4: Insert Q2 — Bladder & bowel control
-- ============================================================
INSERT INTO questions (caption, question_text, tell_me_more, display_order)
VALUES (
  'DIGNITY & PERSONAL CARE',
  'If you could no longer control your bladder or bowels, and needed help with your personal care',
  'Losing control of your bladder or bowels is more common than many people realise in serious illness. It''s also one of the hardest things to imagine.

• Some people feel they could adapt with the right personal care and support.
• For others, this would deeply affect their sense of dignity and self.

There''s no right or wrong answer. Sharing how you feel helps the people who care for you understand what matters most to you.',
  2
);

WITH new_q AS (
  SELECT id FROM questions
  WHERE question_text LIKE '%could no longer control your bladder or bowels%'
)
INSERT INTO answer_options (question_id, option_text, option_order)
SELECT new_q.id, opts.option_text, opts.option_order
FROM new_q, (VALUES
  ('Continue treatments. I could adapt to this with the right support.', 1),
  ('Stop treatments. My dignity and bodily independence matter deeply to me.', 2),
  ('I''m not sure — it would depend on my overall condition.', 3),
  ('I''d want my loved ones to decide when the time comes.', 4)
) AS opts(option_text, option_order);


-- ============================================================
-- STEP 5: Insert Q4 — Repositioning in bed
-- ============================================================
INSERT INTO questions (caption, question_text, tell_me_more, display_order)
VALUES (
  'MOVEMENT & PHYSICAL CARE',
  'If your body could no longer move itself, and you needed someone to turn and reposition you in bed',
  'When someone can no longer shift their own weight, carers carefully reposition them every few hours to prevent pain and pressure injuries. It''s a level of physical dependence that can feel difficult to imagine.

• For some, being cared for in this way feels okay — love can be expressed through that kind of gentle, attentive care.
• For others, losing that physical independence would feel like losing too much of themselves.

Neither feeling is wrong.',
  4
);

WITH new_q AS (
  SELECT id FROM questions
  WHERE question_text LIKE '%body could no longer move itself%'
)
INSERT INTO answer_options (question_id, option_text, option_order)
SELECT new_q.id, opts.option_text, opts.option_order
FROM new_q, (VALUES
  ('Continue treatments. I feel I could find peace in being cared for this way.', 1),
  ('Stop treatments. Being able to move my own body is fundamental to who I am.', 2),
  ('I''m not sure — it would depend on the full picture of my health.', 3),
  ('I''d want my loved ones to decide when the time comes.', 4)
) AS opts(option_text, option_order);


-- ============================================================
-- VERIFY: Final question order and option counts
-- ============================================================
SELECT
  q.display_order,
  q.caption,
  LEFT(q.question_text, 60) AS question_preview,
  COUNT(ao.id) AS option_count
FROM questions q
LEFT JOIN answer_options ao ON ao.question_id = q.id
GROUP BY q.id, q.display_order, q.caption, q.question_text
ORDER BY q.display_order;
