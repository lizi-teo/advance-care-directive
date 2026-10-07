-- Reduce the values warm-up from 5 pages to 3 by merging categories. No words are lost.
--   What I stand for                        -> Who I am
--   What sustains me: Community, Helping others -> Connection
--   What sustains me: everything else       -> How I live
-- Also remove the duplicate "Together" (Connection already has "Togetherness").

UPDATE values_words
SET category_id = (SELECT id FROM values_categories WHERE name = 'Who I am'),
    display_order = display_order + 20
WHERE category_id = (SELECT id FROM values_categories WHERE name = 'What I stand for');

UPDATE values_words
SET category_id = (SELECT id FROM values_categories WHERE name = 'Connection'),
    display_order = display_order + 20
WHERE word IN ('Community', 'Helping others')
  AND category_id = (SELECT id FROM values_categories WHERE name = 'What sustains me');

UPDATE values_words
SET category_id = (SELECT id FROM values_categories WHERE name = 'How I live'),
    display_order = display_order + 20
WHERE category_id = (SELECT id FROM values_categories WHERE name = 'What sustains me');

DELETE FROM values_words
WHERE word = 'Together'
  AND category_id = (SELECT id FROM values_categories WHERE name = 'Connection');

-- Both categories are empty now.
DELETE FROM values_categories WHERE name IN ('What I stand for', 'What sustains me');

-- Prompts now cover the merged words.
UPDATE values_categories SET prompt_text = 'Choose words that protect your sense of self and the principles you want decisions to respect.'
WHERE name = 'Who I am';

UPDATE values_categories SET prompt_text = 'Think about what makes a day feel like yours, and what helps you feel steady.'
WHERE name = 'How I live';
