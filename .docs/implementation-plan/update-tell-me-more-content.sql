-- Update tell_me_more content with shorter, bulleted format
-- Use this to update your Supabase database

-- Question 1: Recognition
UPDATE questions
SET tell_me_more = 'This question helps your loved ones understand what quality of life means to you.

• For some people, recognising family is essential to finding meaning in life.
• For others, life still has value even without this ability.

There''s no right or wrong answer—this is deeply personal. You can write your own statement using your own words.'
WHERE question_text LIKE '%could no longer recognise the people you love%';

-- Question 2: Independence
UPDATE questions
SET tell_me_more = 'This explores how important independence and self-care are to you.

• Some people feel they could adapt to needing full assistance.
• Others consider independence essential to their dignity and wellbeing.

Your answer helps your Person Responsible understand your personal boundaries.'
WHERE question_text LIKE '%needed total help with eating, washing, and dressing%';

-- Question 3: Communication
UPDATE questions
SET tell_me_more = 'Communication means different things to different people.

• Some feel they could still connect through touch or presence.
• Others consider the ability to express thoughts essential to meaningful life.

You can write your own statement to describe what communication means to you.'
WHERE question_text LIKE '%could no longer understand others or express your own thoughts%';

-- Question 4: Eating & Drinking
UPDATE questions
SET tell_me_more = 'For many people, sharing meals is deeply meaningful.

This question helps your care team understand how you feel about tube feeding.

• Some people would want to continue living with a feeding tube.
• Others would not want tube feeding.

There''s no right answer. You can express this in your own words if that feels more comfortable.'
WHERE question_text LIKE '%could no longer eat or drink by mouth%'
   OR question_text LIKE '%needed a feeding tube%';

-- Question 5: CPR
UPDATE questions
SET tell_me_more = 'CPR involves forceful chest compressions, electric shocks, breathing tubes, and medications.

• It works best for otherwise healthy people with sudden cardiac events.
• For people who are very frail or not expected to recover, CPR rarely works and can cause broken ribs and other injuries.

This is about choosing between every possible intervention versus allowing a natural death with comfort care.'
WHERE question_text LIKE '%very sick and not expected to recover%'
  AND question_text LIKE '%CPR%';

-- Question 6: Life Support (Breathing Machines)
UPDATE questions
SET tell_me_more = 'Mechanical ventilation means a tube in your throat connected to a machine that breathes for you.

If you''re not expected to recover, this could prolong your life but not improve your condition.

• Some people want every chance to live, even temporarily.
• Others prefer to let nature take its course with comfort measures only.'
WHERE question_text LIKE '%machine to breathe for you%'
   OR (question_text LIKE '%not expected to recover%' AND caption LIKE '%Life Support%');

-- Question 7: Medical Treatments
UPDATE questions
SET tell_me_more = 'When recovery isn''t expected, these treatments might prolong life but won''t change the overall outcome.

• Some people want all available treatments.
• Others prefer to focus on comfort only.

This question helps doctors know whether to provide life-prolonging treatments or focus entirely on keeping you comfortable and pain-free.'
WHERE question_text LIKE '%antibiotics or heart medications%'
   OR (question_text LIKE '%not expected to recover%' AND caption LIKE '%Medical%');

-- Verify the updates
SELECT id, caption,
       LEFT(tell_me_more, 50) as content_preview,
       CASE
         WHEN tell_me_more LIKE '%•%' THEN '✓ Has bullets'
         ELSE 'No bullets'
       END as format_check
FROM questions
ORDER BY id;
