# UX Recommendations
Derived from Reddit research cross-referenced with the current app. Updated as new research comes in.

---

## 2026-06-02

### Top 3 Most Impactful UX Changes

---

**1. Bridge the terminology gap on the homepage**

**Problem** — r/AskAnAustralian post was titled "DNR" and had dozens of responses from people who didn't know they were already talking about an advance care directive. Real language: "DNR", "who speaks for you", "advance care plan." Nobody Googles "advance care directive."

**Current state** — The homepage hero uses "Advance Care Directive" exclusively, four times. The word "DNR" appears nowhere. A 60-year-old who searches "DNR form Australia" and lands here may not recognise this as the right place.

**Recommended change** — Add a single line under the hero description that bridges the gap: *"You may know this as a DNR, advance care plan, or 'living will' — this is all the same thing."* No new component needed — one `<p>` tag in the existing hero text block (`app/(marketing)/page.tsx:43–48`).

**Effort** — Low

---

**2. Put urgency messaging front and centre**

**Problem** — r/Alzheimers post titled "Too late" — the recurring theme from caregivers is: *"I wish we'd done it at diagnosis, not at the hospital."* The window closes faster than people expect.

**Current state** — The only urgency signal on the homepage is *"especially when time is short"* buried in the About section (`app/(marketing)/page.tsx:152`), well below the fold. The CTA says "Start my directive" — no reason to do it *today* versus next month.

**Recommended change** — Add a short callout above or near the CTA button:

> *"If you've been putting this off — now is the right time. It takes 15 minutes, and capacity to complete it can disappear without warning."*

Style it as a soft warm banner (not an alert/warning — keep it human). This directly addresses the "I'll do it later" mental model that causes the "too late" failure.

**Effort** — Low

---

**3. Add a one-screen "what you'll be asked" warm-up before Q1**

**Problem** — r/dementia: *"We didn't know what the form would ask. Some questions about resuscitation caught us completely off guard."* Emotional ambush at Q1 is a drop-off risk.

**Current state** — Clicking "Start my directive" routes immediately to `/qa` and the first question appears. There's no preview, no framing, no sense of what's ahead. The breathing overlay is available mid-flow but there's no onboarding moment. The first question a user sees could be about resuscitation preferences — confronting without preparation.

**Recommended change** — Insert a single pre-flow screen between the CTA and Q1 that shows: (a) how many questions, (b) a plain-language list of the topic areas ("your values, who speaks for you, medical treatment preferences"), and (c) "You can pause any time." Implement as a `showIntro` state gate in `app/qa/page.tsx` before the `AnimatePresence` question flow begins.

**Effort** — Medium
