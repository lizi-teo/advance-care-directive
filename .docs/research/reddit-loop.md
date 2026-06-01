/loop 7d

Search Reddit for advance care directive discussions from the past week using the Tavily API.

Run 6 searches via WebFetch (POST to https://api.tavily.com/search) with this JSON body structure:
- api_key: process.env.TAVILY_API_KEY
- search_depth: "basic"
- max_results: 5
- days: 7
- include_domains: ["reddit.com"]

Queries:
1. "advance care directive australia"
2. "advance care plan NSW"
3. "advance care directive site:reddit.com/r/Alzheimers"
4. "advance care site:reddit.com/r/dementia"
5. "advance care site:reddit.com/r/palliativecare"
6. "advance care directive site:reddit.com/r/CancerSupport"

Rules:
- Deduplicate posts that appear across multiple queries
- If fewer than 3 unique results total, log "no activity this week" and stop

Analyse for:
- Pain points specific to Australian users (NSW paperwork, legal confusion, GP conversations)
- What Alzheimer's and dementia caregivers struggle with when completing this for a loved one
- What terminally ill people wish they had known earlier about advance care planning
- Language real people use — not clinical or legal terms

Append a summary (max 200 words) to .docs/research/reddit-insights.md with today's date
and which topics had activity. Do not overwrite existing entries.
