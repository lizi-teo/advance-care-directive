Fetch the following Australian government and health authority pages using WebFetch and check for any changes to advance care directive legislation, forms, or requirements.

Pages to check:
1. https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/services/primary+and+specialised+services/advance+care+directives/advance+care+directives
2. https://www.health.nsw.gov.au/patients/acp/Pages/default.aspx
3. https://www.advancecareplanning.org.au/resources/advance-care-directives
4. https://www.health.qld.gov.au/clinical-practice/guidelines-procedures/patient-healthcare-rights/advance-care-planning
5. https://www.health.vic.gov.au/patient-care/advance-care-planning

For each page, look for:
- Any mention of updated forms, new legislation, or changed requirements
- New downloadable documents or form links
- Changes to witness requirements, capacity rules, or who can complete a directive
- State-specific changes (SA, NSW, QLD, VIC)

Rules:
- If no changes are detected on any page, log "no regulatory changes detected this week" and stop — do not append to the output file
- Only append if there is something actionable or noteworthy

Append findings to .docs/research/regulatory-changes.md with today's date. Format:

## [date]
**[State/Source]:** [what changed or was found]
**Action needed:** [yes/no — and if yes, what]

After appending, commit the change with message "research: regulatory monitor [date]".
