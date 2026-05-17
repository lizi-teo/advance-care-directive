# Questions Content — Version History

## Summary of changes (v1 → v2)

- Added 2 new questions from the official NSW ACD form: **Bladder & bowels** and **Repositioning in bed**
- Reordered all questions to match the official NSW ACD form sequence
- Rewrote all Tell Me More content: removed Examples sections, moved from instructional tone to empathetic/personal
- Answer options for existing questions unchanged

---

## V1 — Current state in Supabase (as of 2026-05-17)

### Q1 — RECOGNITION | display_order: 1
**id:** `66a1583e-3c27-4e6c-9428-385024b4c399`

**Question:** If you could no longer recognise the people you love

**Options:**
1. I'd want all treatments continued
2. Stop life-extending treatments and allow natural death with comfort care
3. I'm not sure how I'd feel.
4. I'd want my loved ones to decide when the time comes

**Tell Me More:**
This question helps your loved ones understand what quality of life means to you.

For some people, recognising family is essential to finding meaning in life. For others, they feel that life still has value even without this ability.

There's no right or wrong answer—this is deeply personal. Some people choose to write their own statements instead, using their own words to describe what matters most to them.

Examples
- "Being able to recognise my family is what makes life meaningful to me."
- "Even if I can't recognise loved ones, life has value if I can still feel their presence and affection."

---

### Q2 — INDEPENDENCE | display_order: 2
**id:** `203ea410-5fdb-459e-bc0f-735697749d2a`

**Question:** If you needed total help with eating, washing, and dressing

**Options:**
1. Continue treatments; I could adapt to this
2. Stop treatments; my independence is essential to me
3. I'm not sure—it would depend on other factors.
4. I'd want my loved ones to decide

**Tell Me More:**
This explores how important independence and self-care are to you.

Some people feel they could adapt to needing full assistance, while others consider independence essential to their dignity and wellbeing.

Your answer helps your Person Responsible understand your personal boundaries.

You can also write your own statement if you prefer.

Examples
- "I value my privacy and independence. I would not want to live if I needed total help with personal care."
- "I could accept help with eating, washing and dressing if I can still spend time in my garden."

---

### Q3 — COMMUNICATION | display_order: 3
**id:** `6a5bf071-944a-43ce-a5f7-5939dfe707a1`

**Question:** If you could no longer understand others or express your own thoughts

**Options:**
1. Continue treatments; I'd find other ways to connect
2. Stop treatments; being able to communicate is essential to me
3. I'm not sure—it depends on if I could still feel love and connection.
4. I'd want my loved ones to decide

**Tell Me More:**
Communication means different things to different people.

Some feel they could still connect through touch or presence. Others consider the ability to express thoughts and understand others essential to meaningful life.

Many people find it helpful to write their own statement.

Examples
- "It is important for me to be able to communicate in some way, even if I cannot speak."
- "Life has meaning when I can still feel love and connection, even without words."

---

### Q4 — EATING & DRINKING | display_order: 4
**id:** `a49de429-ee29-439d-a816-4eb2c02d7ae1`

**Question:** If you could no longer eat or drink by mouth and needed a feeding tube

**Options:**
1. Continue with a feeding tube; staying alive is worth it
2. Stop life-extending treatments; being able to eat and drink are too important to me
3. I'm not sure—I'd need to know more about my daily life
4. I'd want my loved ones to decide

**Tell Me More:**
For many people, sharing meals and the experience of eating and drinking are deeply meaningful.

This question helps your care team understand how you feel about tube feeding if you can no longer eat naturally.

There's no right answer. Some people would want to continue living with a feeding tube, others would not.

You can also express this in your own words if that feels more comfortable.

Examples
- "Sharing meals with my family is one of life's greatest joys. I would not want a feeding tube."
- "Staying alive is worth it to me, even if I need to be fed through a tube."

---

### Q5 — CPR (THE HEART) | display_order: 5
**id:** `43ab9660-4663-42c6-9047-ad08bc727e4c`

**Question:** If you are very sick and not expected to recover, would you want CPR?

**Options:**
1. Yes. Attempt CPR—I want every chance to live
2. No. Allow a natural death—focus on keeping me comfortable
3. I'm not sure. I'd want my family to decide with the doctors

**Tell Me More:**
CPR involves forceful chest compressions, electric shocks, breathing tubes, and medications. It works best for otherwise healthy people with sudden cardiac events. For people who are already very frail or not expected to recover, CPR rarely works and can cause broken ribs and other injuries.

This is about choosing between every possible intervention versus allowing a natural death with comfort care. Many people prefer to write a personal statement about their wishes around end-of-life interventions.

Examples:
- "I do not want to struggle to breathe. If I'm not expected to recover, let me die naturally with comfort care."
- "I want every chance to live, even if recovery is unlikely. Attempt CPR."

---

### Q6 — LIFE SUPPORT (VENTILATORS) | display_order: 6
**id:** `a8a83e37-8dff-465c-b921-686d6ea17d76`

**Question:** If you are not expected to recover, would you want a machine to breathe for you?

**Options:**
1. Yes. I'd want this if it might help
2. No. I wouldn't want to be kept alive this way
3. I'm not sure. I'd need to know the specific situation

**Tell Me More:**
Mechanical ventilation means a tube in your throat connected to a machine that breathes for you.

If you're not expected to recover, this could prolong your life but not improve your condition.

Some people want every chance to live, even temporarily. Others prefer to let nature take its course with comfort measures only.

You can express your wishes using the options provided or write your own statement.

Examples:
- "I do not want to be kept alive on a breathing machine if there's no hope of recovery."
- "I would want a ventilator if it gives me time to say goodbye to my family, even briefly."

---

### Q7 — INFECTIONS & MEDICATIONS | display_order: 7
**id:** `4a1a82e9-5d1d-4ac1-ba01-71d3ee63bc2f`

**Question:** If you are not expected to recover, would you want antibiotics or heart medications to prolong your life?

**Options:**
1. Yes. Keep treating infections and supporting my body
2. No. Just focus on my comfort and ease my symptoms
3. It depends. Some medications yes, others no

**Tell Me More:**
When recovery isn't expected, treatments like antibiotics or heart medications might prolong life but won't change the overall outcome.

Some people want all available treatments, while others prefer to focus on comfort only.

This question helps doctors know whether to provide life-prolonging treatments or focus entirely on keeping you comfortable and pain-free.

As with all questions, you can write your own statement using your own words if you prefer.

Examples:
- "I do not want to be in pain. Just focus on my comfort, not prolonging my life."
- "Keep treating infections and supporting my body for as long as possible."

---
---

## V2 — New version (to be applied via SQL)

### Q1 — RECOGNITION | display_order: 1 (unchanged)
**id:** `66a1583e-3c27-4e6c-9428-385024b4c399`

**Question:** If you could no longer recognise the people you love *(unchanged)*

**Options:** *(unchanged)*
1. I'd want all treatments continued
2. Stop life-extending treatments and allow natural death with comfort care
3. I'm not sure how I'd feel.
4. I'd want my loved ones to decide when the time comes

**Tell Me More (rewritten):**
The people we love are often at the heart of what makes life feel meaningful. Imagining a world where those faces no longer feel familiar is one of the hardest things to sit with.

• For some, life still holds warmth and meaning even without the ability to recognise loved ones.
• For others, that recognition is so fundamental that life without it wouldn't feel like their own.

Neither answer is wrong. This is about what matters most to you.

---

### Q2 — DIGNITY & PERSONAL CARE | display_order: 2 (NEW)

**Question:** If you could no longer control your bladder or bowels, and needed help with your personal care

**Options:**
1. Continue treatments. I could adapt to this with the right support.
2. Stop treatments. My dignity and bodily independence matter deeply to me.
3. I'm not sure — it would depend on my overall condition.
4. I'd want my loved ones to decide when the time comes.

**Tell Me More:**
Losing control of your bladder or bowels is more common than many people realise in serious illness. It's also one of the hardest things to imagine.

• Some people feel they could adapt with the right personal care and support.
• For others, this would deeply affect their sense of dignity and self.

There's no right or wrong answer. Sharing how you feel helps the people who care for you understand what matters most to you.

---

### Q3 — INDEPENDENCE | display_order: 3 (was 2)
**id:** `203ea410-5fdb-459e-bc0f-735697749d2a`

**Question:** If you needed total help with eating, washing, and dressing *(unchanged)*

**Options:** *(unchanged)*
1. Continue treatments; I could adapt to this
2. Stop treatments; my independence is essential to me
3. I'm not sure—it would depend on other factors.
4. I'd want my loved ones to decide

**Tell Me More (rewritten):**
Being able to care for yourself — to wash, dress, and eat on your own — is something most of us take for granted. Needing full help with these things is a significant shift in how you move through the world.

• Some people feel they could adapt, knowing that being cared for is still a form of being loved.
• For others, that independence is so tied to their sense of self that losing it would feel like losing too much.

There's no right or wrong answer.

---

### Q4 — MOVEMENT & PHYSICAL CARE | display_order: 4 (NEW)

**Question:** If your body could no longer move itself, and you needed someone to turn and reposition you in bed

**Options:**
1. Continue treatments. I feel I could find peace in being cared for this way.
2. Stop treatments. Being able to move my own body is fundamental to who I am.
3. I'm not sure — it would depend on the full picture of my health.
4. I'd want my loved ones to decide when the time comes.

**Tell Me More:**
When someone can no longer shift their own weight, carers carefully reposition them every few hours to prevent pain and pressure injuries. It's a level of physical dependence that can feel difficult to imagine.

• For some, being cared for in this way feels okay — love can be expressed through that kind of gentle, attentive care.
• For others, losing that physical independence would feel like losing too much of themselves.

Neither feeling is wrong.

---

### Q5 — EATING & DRINKING | display_order: 5 (was 4)
**id:** `a49de429-ee29-439d-a816-4eb2c02d7ae1`

**Question:** If you could no longer eat or drink by mouth and needed a feeding tube *(unchanged)*

**Options:** *(unchanged)*
1. Continue with a feeding tube; staying alive is worth it
2. Stop life-extending treatments; being able to eat and drink are too important to me
3. I'm not sure—I'd need to know more about my daily life
4. I'd want my loved ones to decide

**Tell Me More (rewritten):**
Food and drink are woven into so much of what makes life feel human — sharing meals, the simple act of swallowing, tasting something you love. When that's no longer possible, a feeding tube can sustain the body, but it changes the experience of living.

• Some people feel that staying alive is worth it, even with a feeding tube.
• Others feel that being unable to eat or drink naturally would change their quality of life too much.

Neither feeling is wrong.

---

### Q6 — COMMUNICATION | display_order: 6 (was 3)
**id:** `6a5bf071-944a-43ce-a5f7-5939dfe707a1`

**Question:** If you could no longer understand others or express your own thoughts *(unchanged)*

**Options:** *(unchanged)*
1. Continue treatments; I'd find other ways to connect
2. Stop treatments; being able to communicate is essential to me
3. I'm not sure—it depends on if I could still feel love and connection.
4. I'd want my loved ones to decide

**Tell Me More (rewritten):**
Being able to speak, to be understood, to follow a conversation — it's how most of us stay connected to the people we love. Losing that ability is something many people find deeply confronting.

• Some people feel they could still experience connection through presence, touch, and expression — even without words.
• For others, the ability to communicate is so central to who they are that life without it would feel unrecognisable.

What matters is what feels true for you.

---

### Q7 — CPR (THE HEART) | display_order: 7 (was 5)
**id:** `43ab9660-4663-42c6-9047-ad08bc727e4c`

**Question:** If you are very sick and not expected to recover, would you want CPR? *(unchanged)*

**Options:** *(unchanged)*
1. Yes. Attempt CPR—I want every chance to live
2. No. Allow a natural death—focus on keeping me comfortable
3. I'm not sure. I'd want my family to decide with the doctors

**Tell Me More (rewritten):**
CPR is physically intense — forceful chest compressions, electric shocks, breathing tubes, and strong medications. It can feel hard to reconcile with the idea of a peaceful end.

• In otherwise healthy people, CPR can be life-saving.
• For someone who is very unwell or not expected to recover, it rarely works and can cause pain and injury.

This is about choosing between every possible intervention and allowing a natural death, with care focused entirely on comfort.

---

### Q8 — LIFE SUPPORT (VENTILATORS) | display_order: 8 (was 6)
**id:** `a8a83e37-8dff-465c-b921-686d6ea17d76`

**Question:** If you are not expected to recover, would you want a machine to breathe for you? *(unchanged)*

**Options:** *(unchanged)*
1. Yes. I'd want this if it might help
2. No. I wouldn't want to be kept alive this way
3. I'm not sure. I'd need to know the specific situation

**Tell Me More (rewritten):**
A ventilator breathes for you — a tube placed in the throat, connected to a machine. If recovery isn't expected, it can keep the body alive but won't change the outcome.

• Some people want every chance, however small — even if it means time on a machine.
• Others feel that being kept alive this way would not reflect the kind of life, or death, they want.

Both are deeply human responses to an impossibly hard situation.

---

### Q9 — INFECTIONS & MEDICATIONS | display_order: 9 (was 7)
**id:** `4a1a82e9-5d1d-4ac1-ba01-71d3ee63bc2f`

**Question:** If you are not expected to recover, would you want antibiotics or heart medications to prolong your life? *(unchanged)*

**Options:** *(unchanged)*
1. Yes. Keep treating infections and supporting my body
2. No. Just focus on my comfort and ease my symptoms
3. It depends. Some medications yes, others no

**Tell Me More (rewritten):**
When someone isn't expected to recover, treatments like antibiotics or heart medications can extend life — but they can't change the direction things are heading.

• Some people want every available treatment continued for as long as possible.
• Others would rather their care team focus entirely on keeping them comfortable and free from pain.

There's no wrong answer. This is about what matters most to you.
