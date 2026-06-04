For building the app (Claude Code agents you can use now):

/code-review — run this after building each feature (signatures, PDF, Supabase saves). Especially important here since it's health/legal data.
/security-review — before you ship. Your app stores sensitive medical decisions; worth a dedicated pass on RLS policies, storage access, and session handling.
/verify — after implementing a feature, this drives the browser and checks it actually works end-to-end (e.g. does signing redirect correctly, does the witness link work).
For building INTO the app (Claude API agents):

You already have one planned (/api/enhance). Two more that would genuinely add value given your 9 questions:

Plain language explainer — user taps "Tell me more" on a question (e.g. CPR, ventilators), Claude explains it in simple terms without medical jargon. Low risk, high value for this audience.
Completeness reviewer — before the user signs, Claude reads back their answers and flags anything that seems contradictory or vague. Like a soft sanity check before a legal document is finalised.

  - /vercel:react-best-practices — React patterns and best practices
  - /vercel:shadcn — shadcn/ui component guidance 
  - /vercel:next-cache-components — Next.js caching and components
  - /ux-review — UX review for health tech (specific to your project)