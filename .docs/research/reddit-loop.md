/loop 7d

Fetch the top Reddit posts from the past week using WebFetch across these 6 URLs:

1. https://www.reddit.com/search.json?q=advance+care+directive+australia&sort=top&t=week&limit=5
2. https://www.reddit.com/search.json?q=advance+care+plan+NSW&sort=top&t=week&limit=5
3. https://www.reddit.com/r/Alzheimers/search.json?q=advance+care+directive&sort=top&t=week&limit=5
4. https://www.reddit.com/r/dementia/search.json?q=advance+care&sort=top&t=week&limit=5
5. https://www.reddit.com/r/palliativecare/search.json?q=advance+care&sort=top&t=week&limit=5
6. https://www.reddit.com/r/CancerSupport/search.json?q=advance+care+directive&sort=top&t=week&limit=5

Rules:
- Only include posts with 5+ upvotes
- Deduplicate posts that appear across multiple sources
- Use claude-haiku-4-5-20251001 for analysis
- If fewer than 3 posts meet the threshold across all sources, log "no activity this week" and stop

Analyse for:
- Pain points specific to Australian users (NSW paperwork, legal confusion, GP conversations)
- What Alzheimer's and dementia caregivers struggle with when completing this for a loved one
- What terminally ill people wish they had known earlier about advance care planning
- Language real people use — not clinical or legal terms

Append a summary (max 200 words) to .docs/research/reddit-insights.md with today's date
and which subreddits had activity. Do not overwrite existing entries.
