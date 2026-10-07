-- ============================================================
-- ACD Questions -- v3 Migration
-- Run in Supabase SQL Editor
--
-- Changes:
--   1. Update Q5 (eating/drinking) tell_me_more to scope away from dementia
--   2. Insert Q10 -- Memory & cognitive decline
--   3. Insert Q11 -- Pain & comfort
--   4. Insert Q12 -- Place of care
--   5. Insert Q13 -- Voluntary assisted dying
--
-- Uses dollar-quoting for multi-line strings to avoid encoding issues.
-- ============================================================


-- ============================================================
-- STEP 1: Update Q5 tell_me_more to scope away from dementia
-- ============================================================
UPDATE questions
SET tell_me_more = $$Food and drink are woven into so much of what makes life feel human — sharing meals, the simple act of swallowing, tasting something you love. When that's no longer possible, a feeding tube can sustain the body, but it changes the experience of living.

• Some people feel that staying alive is worth it, even with a feeding tube.
• Others feel that being unable to eat or drink naturally would change their quality of life too much.

Neither feeling is wrong.

This question covers situations like illness or injury. If dementia or memory loss is a specific concern for you, there is a separate question for that later.$$
WHERE question_text LIKE '%could no longer eat or drink by mouth%';


-- ============================================================
-- STEP 2: Insert Q10 -- Memory & cognitive decline
-- ============================================================
INSERT INTO questions (caption, question_text, tell_me_more, display_order)
VALUES (
  'MEMORY & MIND',
  'If you were to develop a condition like dementia or Alzheimer''s, and reached a stage where you could no longer recognise your loved ones or make decisions for yourself',
  $$Dementia affects each person differently, and it can be hard to know now how you'll feel later. For many people, sharing these wishes early — while they still can — brings real peace of mind.

• Some people feel that even in advanced dementia, life still holds value, and want all care continued.
• Others feel that if they can no longer recognise the people they love, they would not want treatments that only prolong life.

If you answer this question, your wishes here take priority over your earlier answer about tube feeding — specifically in the context of dementia.

Assisted dying cannot be requested in this document, or by your family on your behalf. You must ask for it yourself, while you can still make your own decisions. Most people with dementia alone do not qualify. If this matters to you, talk to your doctor early. A later question lets you record your values about assisted dying.$$,
  10
);

WITH new_q AS (
  SELECT id FROM questions
  WHERE question_text LIKE '%condition like dementia or Alzheimer%'
)
INSERT INTO answer_options (question_id, option_text, option_order)
SELECT new_q.id, opts.option_text, opts.option_order
FROM new_q, (VALUES
  ('Keep me alive. Continue all treatments, including tube feeding.', 1),
  ('Let me die naturally. Stop treatments that only keep me alive, such as tube feeding. Keep me comfortable and free from pain.', 2),
  ('I''m not sure. It would depend on my condition at the time.', 3),
  ('Let my loved ones or substitute decision-maker decide when the time comes.', 4)
) AS opts(option_text, option_order);


-- ============================================================
-- STEP 3: Insert Q11 -- Pain & comfort
-- ============================================================
INSERT INTO questions (caption, question_text, tell_me_more, display_order)
VALUES (
  'PAIN & COMFORT',
  'When it comes to managing pain and discomfort at the end of my life',
  $$This is one of the most personal questions in end-of-life care. There is no medical reason to suffer — but people have very different priorities.

• Some people want to be completely free from pain, even if strong medications mean they sleep more or become less conscious sooner.
• Others want to stay as awake and present as possible — to have conversations, to say goodbye — even if that means tolerating more discomfort.

Sharing your preference helps your care team understand what comfort means to you.$$,
  11
);

WITH new_q AS (
  SELECT id FROM questions
  WHERE question_text LIKE '%managing pain and discomfort at the end of my life%'
)
INSERT INTO answer_options (question_id, option_text, option_order)
SELECT new_q.id, opts.option_text, opts.option_order
FROM new_q, (VALUES
  ('I want maximum pain relief, even if it may shorten my life.', 1),
  ('I want pain relief balanced with staying as alert and present as possible.', 2),
  ('I want to stay as conscious as I can, even if that means more discomfort.', 3),
  ('Let my loved ones, substitute decision-maker and care team decide what''s best.', 4)
) AS opts(option_text, option_order);


-- ============================================================
-- STEP 4: Insert Q12 -- Place of care
-- ============================================================
INSERT INTO questions (caption, question_text, tell_me_more, display_order)
VALUES (
  'PLACE OF CARE',
  'If it were possible to choose, I would prefer to die',
  $$Where we die matters deeply to many people, even when it's not always possible to plan for. Sharing your preference gives your loved ones and care team something to work towards.

• Home deaths are possible with the right support in place — many people find this the most peaceful option.
• Hospices and palliative care settings specialise in comfort and dignity.
• Hospitals offer the most medical support but can feel less personal.

There's no wrong answer — including having no preference at all.$$,
  12
);

WITH new_q AS (
  SELECT id FROM questions
  WHERE question_text LIKE '%possible to choose, I would prefer to die%'
)
INSERT INTO answer_options (question_id, option_text, option_order)
SELECT new_q.id, opts.option_text, opts.option_order
FROM new_q, (VALUES
  ('At home, surrounded by the people I love.', 1),
  ('In a hospice or palliative care setting.', 2),
  ('In a hospital, with full medical support nearby.', 3),
  ('I don''t have a strong preference. Let my loved ones or substitute decision-maker decide.', 4)
) AS opts(option_text, option_order);


-- ============================================================
-- STEP 5: Insert Q13 -- Voluntary assisted dying
-- ============================================================
INSERT INTO questions (caption, question_text, tell_me_more, display_order)
VALUES (
  'CHOOSING MY OWN ENDING',
  'If I were suffering from a terminal illness with no prospect of recovery, these are my values about voluntary assisted dying',
  $$Voluntary assisted dying (also called medical assistance in dying) is legal in some places, including parts of Australia, New Zealand, Canada, and other countries. It always requires a separate legal process — it cannot be requested through an advance care document, and the person must have capacity to make the request at the time.

This question captures your values only. It will appear in your document so your loved ones and care team understand what matters to you. If this is important to you, speak with your doctor about what is available where you live.

Neither choosing this option nor declining it is more courageous or more moral. This is simply about what feels right for you.$$,
  13
);

WITH new_q AS (
  SELECT id FROM questions
  WHERE question_text LIKE '%values about voluntary assisted dying%'
)
INSERT INTO answer_options (question_id, option_text, option_order)
SELECT new_q.id, opts.option_text, opts.option_order
FROM new_q, (VALUES
  ('I would want to explore this option if I met the legal requirements where I live.', 1),
  ('I would not want this — I prefer a natural death with comfort care.', 2),
  ('I am open to it but would want my loved ones closely involved in the decision.', 3),
  ('I have personal, cultural, or religious reasons that mean this is not right for me.', 4)
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
