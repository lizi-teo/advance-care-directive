-- Add tell_me_more column to questions table
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS tell_me_more TEXT;

-- Update Question 1: Recognition
UPDATE questions
SET tell_me_more = 'This question helps your loved ones understand what quality of life means to you. For some people, recognising family is essential to finding meaning in life. For others, they feel that life still has value even without this ability.

There''s no right or wrong answer—this is deeply personal. Some people choose to write their own statements instead, using their own words to describe what matters most to them.'
WHERE question_text LIKE '%could no longer recognise the people you love%';

-- Update Question 2: Independence
UPDATE questions
SET tell_me_more = 'This explores how important independence and self-care are to you. Some people feel they could adapt to needing full assistance, while others consider independence essential to their dignity and wellbeing.

Your answer helps your Person Responsible understand your personal boundaries. You can also write your own statement if you prefer, such as "I value my privacy" or "I could accept help with care if I can still enjoy nature."'
WHERE question_text LIKE '%needed total help with eating, washing, and dressing%';

-- Update Question 3: Communication
UPDATE questions
SET tell_me_more = 'Communication means different things to different people. Some feel they could still connect through touch or presence. Others consider the ability to express thoughts and understand others essential to meaningful life.

Many people find it helpful to write their own statement, like "It is important for me to be able to communicate in some way, even if I cannot speak" or "Life has meaning when I can still feel love and connection."'
WHERE question_text LIKE '%could no longer understand others or express your own thoughts%';

-- Update Question 4: Eating & Drinking
UPDATE questions
SET tell_me_more = 'For many people, sharing meals and the experience of eating and drinking are deeply meaningful. This question helps your care team understand how you feel about tube feeding if you can no longer eat naturally.

There''s no right answer. Some people would want to continue living with a feeding tube, others would not. You can also express this in your own words if that feels more comfortable.'
WHERE question_text LIKE '%could no longer eat or drink by mouth%'
   OR question_text LIKE '%needed a feeding tube%';

-- Update Question 5: CPR
UPDATE questions
SET tell_me_more = 'CPR involves forceful chest compressions, electric shocks, breathing tubes, and medications. It works best for otherwise healthy people with sudden cardiac events. For people who are already very frail or not expected to recover, CPR rarely works and can cause broken ribs and other injuries.

This is about choosing between every possible intervention versus allowing a natural death with comfort care. Many people prefer to write a personal statement about their wishes around end-of-life interventions.'
WHERE question_text LIKE '%very sick and not expected to recover%'
  AND question_text LIKE '%CPR%';

-- Update Question 6: Life Support (Breathing Machines)
UPDATE questions
SET tell_me_more = 'Mechanical ventilation means a tube in your throat connected to a machine that breathes for you. If you''re not expected to recover, this could prolong your life but not improve your condition.

Some people want every chance to live, even temporarily. Others prefer to let nature take its course with comfort measures only. You can express your wishes using the options provided or write your own statement.'
WHERE question_text LIKE '%machine to breathe for you%'
   OR question_text LIKE '%not expected to recover%' AND caption LIKE '%Life Support%';

-- Update Question 7: Medical Treatments (Antibiotics/Medications)
UPDATE questions
SET tell_me_more = 'When recovery isn''t expected, treatments like antibiotics or heart medications might prolong life but won''t change the overall outcome. Some people want all available treatments, while others prefer to focus on comfort only.

This question helps doctors know whether to provide life-prolonging treatments or focus entirely on keeping you comfortable and pain-free. As with all questions, you can write your own statement using your own words if you prefer.'
WHERE question_text LIKE '%antibiotics or heart medications%'
   OR (question_text LIKE '%not expected to recover%' AND caption LIKE '%Medical%');

-- Verify the updates
SELECT id, caption, question_text,
       CASE
         WHEN tell_me_more IS NOT NULL THEN 'Updated'
         ELSE 'Missing'
       END as status
FROM questions
ORDER BY id;
