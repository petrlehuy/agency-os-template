---
name: audit
description: Generate a comprehensive email marketing audit for a client. Use when auditing a client's email setup, evaluating platform configuration, assessing email marketing health, or running a recurring performance audit.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a client-facing email marketing audit. Evaluates performance, identifies opportunities, and presents a focused action plan for the next month.

**Context:** This skill works in two modes:
- **Onboarding audit** — Step 2 of the onboarding pipeline (`/onboard` → `/audit` → `/strategy`). First-time evaluation of a new client's email setup.
- **Recurring audit** — Periodic health check for active clients. Evaluates current performance against previous audit, includes period-over-period trends.

The skill detects which mode to use based on whether a previous audit exists.

## Files to Load

1. `reference/audit-checklist.md` (audit criteria + benchmarks)
2. `reference/email-strategy.md` (strategic interpretation lens — living document with decision frameworks, market insights, lessons learned)
3. `reference/flow-architectures-phase1.md` (standard flow structures)
4. `projects/$1/profile.md` (project profile — should exist from `/onboard` or AM setup)
5. `projects/$1/outputs/internal-brief.md` (if exists — for red flags and priorities)
6. `projects/$1/outputs/audit.html` (if exists — previous audit for comparison. Also check `audit.md` for older audits.)
7. `reference/html-templates/audit.html` (HTML formatting reference — load before generating output)

## Steps

### 1. Determine Audit Mode

Check if `projects/$1/outputs/audit.html` exists (also check `audit.md` for older audits):

**If previous audit exists (Recurring mode):**
- Note the date and key findings from the previous audit
- This audit will compare current state against previous findings
- Ask the AM what has changed since the last audit (new flows launched, campaigns run, list growth initiatives)

**If no previous audit (Onboarding mode):**
- The project profile should exist from `/onboard` or manual AM setup
- If the profile doesn't exist, ask the AM if they've run `/onboard` first
- If the AM wants to audit without onboarding, ask for the essential client data

If the profile has [CONFIRM] items, note which remain unresolved.

### 2. Gather Audit Data

**Always ask the AM before generating:**

- **Audit period:** What timeframe should this audit cover?
  - Last year / Last 3 months / Last month / Month-to-date / Last 30 days
- **Comparison period:** What should we compare against?
  - Previous month / Previous period (same length) / Previous year (YoY)
- **Updated annual revenue target** for the client (targets change — don't use outdated profile data)
- **Any site-wide campaigns** during this period that caused the main popup to be turned off? (Black Friday, major promotions, etc.)
- **Engaged segment size** (the "Engaged 90D" or similar segment — how many contacts are in it?)
- **Total database size** (from [YOUR_PLATFORM] directly)
- **When were the current flows launched?** (Never assume — needed to frame flow history accurately. If unsure, omit any 'first month of flows' claims entirely.)
- **What is the agreed campaign frequency** (campaigns/week or /month)? (Don't frame agreed standards as new improvements.)
- **Are any third-party tools handling automations?** (e.g., Elevar for abandoned flow identification, Yotpo for reviews.) If yes, acknowledge them in the audit — never write recommendations that imply the obvious hasn't been done.
- Any known issues they want specifically checked

### 2b. Collect Data from Hiro Analytics

Validated via Scribe SOP at `reference/hiro scribd export tutorial.pdf`. Automated using Chrome DevTools MCP.

**Setup:**
1. Navigate to `https://app.hiroanalytics.com/app/page/home`
2. Verify client name in bottom-left corner
3. Date ranges are set per-screen (each Deep Dive screen has its own date picker in the top-right)

---

**Export A: Campaign Deep Dive** → `projects/$1/data/hiro-campaigns.csv`

1. Click "Campaigns" (sidebar) → "Campaign Deep Dive" (sub-tab)
2. Set Current Period: click date fields → use calendar picker to select custom start/end dates
3. Previous Period sets automatically (or set manually)
4. Toggle ON all 7 fields in the right panel:
   - Show Subject ✓
   - Show First-Time vs. Returning ✓
   - Show Unsubscribes ✓
   - Show Comparison ✓
   - Show Day of Week ✓
   - Show Segments ✓
   - Show CVR ✓
5. Click "Download" button (bottom-right of the campaign table)
6. CSV downloads to `~/Downloads/`

**Export B: Flow Deep Dive** → `projects/$1/data/hiro-flows.csv`

1. Click "Flows" (sidebar) → "Flow Deep Dive" (sub-tab)
2. Toggle ON: "Show Comparison"
3. Click "Fields" selector → check all relevant fields:
   - Email Clicks, Email Unsubscribes, Email Open Rate, Email Click Rate
   - Email Unsubscribe Rate, Email Spam Complaint Rate, Email Spam Complaints
   - Email Bounce Rate, Email Bounces, Email Average Order Value, Email Conversion Rate
   - (Keep defaults: Total Flow Revenue, Total Flow Deliveries, Email Revenue, Email Deliveries, Revenue Per Recipient, Flow Repeat Revenue, Flow First Time Revenue)
4. Click "Download" button
5. CSV downloads to `~/Downloads/`

**Export C: Overview / Aggregate Export** → `projects/$1/data/hiro-overview.csv`

1. Click "Reporting" (sidebar) → "Export Data"
2. Check "Saved Exports" dropdown — select "All metrics" preset if it exists
3. If no preset: click metrics selector and check ALL available data fields
4. Toggle "Show Comparison" ON
5. Click "Export" button
6. CSV downloads to `~/Downloads/`

**Screenshot D: List Growth** (cannot be exported)

1. Click "List Growth" (sidebar) → "Subscriber Trends" (sub-tab)
2. Screenshot the page (subscriber trends chart + data table)
3. Click "Form Performance" (sub-tab)
4. Screenshot the popup/form data table
5. Click "Segment Growth" (sub-tab) — if engaged segment data is visible, screenshot

---

**Post-collection:**
- Move downloaded CSVs from `~/Downloads/` to `projects/$1/data/`
- Parse all 3 CSVs + extract data from List Growth screenshots
- Cross-check: campaign revenue + flow revenue ≈ total email attributed revenue

**Data source mapping:**

| Audit section | Data source |
|---------------|-------------|
| 1. Executive Summary (KPIs) | Overview CSV + AM (engaged 90D) |
| 2. Revenue & Attribution | Overview CSV (revenue + store revenue) |
| 3. Deliverability & Sending | Overview CSV (deliveries, rates) + Campaign CSV (campaign count) |
| 4. Flows | Overview CSV (aggregates) + Flow Deep Dive CSV (per-flow) |
| 5. Campaigns | Overview CSV (aggregates) + Campaign Deep Dive CSV (per-campaign) |
| 6. Database Growth | List Growth screenshots + Overview CSV (subscribers, forms if available) + AM (total DB, engaged 90D) |
| 7. Focus for Next Month | Analysis of all above + Strategy reference |
| 8. A/B Test Ideas | Analysis of all above + Strategy reference |

### 2c. Interactive Analysis — Ask AM About Anomalies

After collecting data but BEFORE generating the audit, scan for anomalies and ask the AM 3-5 targeted questions. These are NOT generic questions — they're driven by specific data points that look unusual.

**The skill should:**
1. Compare current vs. previous period — flag any metric with >30% change
2. Look for disconnects (e.g., store revenue up but email revenue down — why?)
3. Identify outlier campaigns/flows (much better or worse than average)
4. Check if known patterns from `reference/email-strategy.md` apply (seasonal drop, popup-off period, etc.)
5. Ask the AM ONLY about things data can't explain

**Example questions format:**
- "Welcome Flow revenue dropped 55% while RPR stayed stable. Did popup traffic or conversion change?"
- "Campaign #7 went to only 1,332 recipients vs. ~14K average. Targeted test or error?"
- "[Metric X] seems unusual given [context Y]. What's your read on this?"

If campaign count is >30% lower than the previous period, ask the AM: "Were campaigns postponed or delayed?" Frame neutrally in the output — never as a failure without confirmation.

This step is what makes the audit operationally grounded — the AM's context fills gaps that data alone can't.

### 2d. Outlier Creative Analysis

After analyzing the data, if specific campaigns or flows stand out as outliers (much better or worse than average), go back into Hiro Analytics via Chrome DevTools to screenshot their creative:

1. Go to Campaign Deep Dive → click on the specific outlier campaign row
2. Screenshot the creative (design + copy) of that campaign
3. Same for Flow Deep Dive → click on specific outlier flow → screenshot the email content
4. **Only screenshot what stands out — NOT everything.** This is selective analysis.

Use the creative screenshots to add specific content recommendations to the audit (what worked visually/copy-wise, what didn't).

### 3. Pre-Analysis: Find the Story

Before writing any audit section, complete this analysis checklist. The goal is to find the narrative thread that connects all sections — data tells a story, not just shows numbers.

**Analysis checklist:**

1. **Revenue decomposition:** Campaign revenue + flow revenue = email attributed revenue? If not, investigate the gap.

2. **Root cause chain:** When a metric drops, trace the cause chain. Example: flow revenue ↓ → Welcome Flow revenue ↓ → popup submits ↓ → fewer visitors OR popup turned off? Follow the chain to the root.

3. **Cross-section links:** Map connections between sections that tell the same story from different angles. Example: popup rate (Section 6) explains Welcome Flow (Section 4) explains flow revenue (Section 2). Make these connections explicit in the audit.

4. **Campaign pattern analysis:** Group campaigns by type (discount, educational, seasonal, urgency, new product). Compare performance within and across groups. Identify what CONTENT works, not just what METRICS say.

5. **Volume vs. efficiency:** When deliveries drop but rates improve, always separate the two stories — you're reaching fewer people more effectively. Both matter. Never celebrate higher rates if volume dropped significantly without acknowledging it.

6. **Seasonal/context filter:** Before attributing changes to "performance," eliminate external factors (fewer sending days, holiday effects, popup off during promotions, seasonal traffic patterns). Reference `email-strategy.md` Market Insights for seasonal patterns.

**Root Cause Diagnostic Trees:**

- **Flow revenue down → Check:** Welcome Flow triggers (popup rate), Abandoned flow triggers (identification/tagging), flow RPR changes. If RPR is stable but volume is down → trigger problem. If RPR dropped → flow content/timing problem.
- **Campaign revenue down → Check:** Fewer campaigns sent? Fewer recipients per campaign? Lower RPR? Different campaign mix (more educational, less promotional)?
- **Subscriber growth slowing → Check:** Popup views down (less traffic)? Submit rate down (popup fatigue/wrong offer)? Unsubscribes up (sending too much or irrelevant content)?

**Strategy lens:** Reference `email-strategy.md` Section 4 (Metric Interpretation) for decision trees and Section 7 (Lessons Learned) for patterns observed in previous client work.

### 4. Generate Audit

Using the analyzed data, AM answers, and strategy reference, generate a structured audit with the following sections (in order):

**Section 1: Executive Summary**
- Verdict box: 2-3 sentence assessment of overall email marketing health
- KPI grid: 4-6 key metrics with period comparison and trend indicators
- Lead with wins — what's working well
- **KPI color coding:** Use `.pos` (green) for wins, `.caution` (orange) for metrics that are down but explainable — not hiding negatives, but contextualizing them honestly. Use `.neg` (red) only for genuinely problematic metrics. Honest color coding builds trust.
- **Document title format:** `Client Name — měsíc rok` (e.g., "Northman — únor 2026"). The `doc-label` div handles the type ("E-mailový audit"). Never put "opakující se" or "recurring" in the title or subtitle.

**Section 2: Revenue & Attribution**
- Period comparison table (current vs. comparison period)
- Email revenue, total store revenue, email % of total
- Campaign revenue vs. flow revenue split (target range: 40/60, 50/50, or 60/40)
- Context callout interpreting the numbers — trace the root cause if revenue changed significantly

**Section 3: Deliverability & Sending**
- Show both absolute recipient count AND percentage metrics together
- Open rate, click rate, unsubscribe rate, bounce rate
- Compare recipients between periods: similar recipients + lower OR = real deliverability issue; fewer recipients + higher OR = tighter targeting
- **Click rate: compare ONLY to client's own trend (MoM, YoY) — NEVER to fixed benchmarks.** Click rate varies too much by industry, product type, and list quality for universal ranges. In the deliverability table, use "Trend ↑/↓/→ YoY" instead of a numeric benchmark. A gradual increase is positive regardless of absolute number. Focus on unique clicks.

**Section 4: Flows / Automations**
- Flow performance table: flow name, revenue, deliveries, RPR, rating
- **Trigger volume analysis:** When RPR is healthy but deliveries are low, highlight the growth opportunity — "If we doubled deliveries to [flow], revenue would roughly double." The biggest lever is often increasing triggers (better tagging, identification), not optimizing the flow itself.
- **Welcome Flow ↔ Popup correlation:** If Welcome Flow revenue dropped significantly, cross-check:
  - Were there site-wide campaigns during this period? (from AM input in Step 2)
  - Did popup submit rate drop compared to previous period?
  - If both true → explain this is expected behavior (popup turned off during promotions), not a performance issue
- Flow revenue distribution (optional Chart.js doughnut if useful)
- **Welcome Flow dominance:** If Welcome Flow represents >60% of total flow revenue, add a green callout stating this is normal across clients — it reflects strong popup + onboarding, not a concentration risk.
- **For recurring audits:** Frame established flows as stable infrastructure. The insight is about trigger volume and optimization opportunities, not about the flows existing.
- **No Phase 1 gap analysis for clients with 1+ year history.** Never include a "Srovnání s Phase 1 architekturou" section or equivalent for recurring clients. All Phase 1 flows are live — auditing their existence is noise. Focus on their performance.

**Section 5: Campaigns**
- Aggregate metrics: campaigns sent, total deliveries, total revenue, RPR
- **Per-campaign breakdown table:** date, subject line, deliveries, open rate, click rate, revenue
- **Content analysis:** Group campaigns by content type (discount, educational, seasonal, urgency, new product). Compare performance within groups to find what content patterns work. Identify outliers — targeted-segment sends (small recipient count) will have different metrics than full-list sends.
- If outlier creatives were screenshotted, reference specific design/copy elements that contributed to performance
- Use common sense on depth — enough to be actionable, not overwhelming
- **Segment naming:** When describing who a campaign was sent to, use exact platform segment names from [YOUR_PLATFORM]. Precision signals professionalism.
- **Don't invent terminology:** If a pivot changed the angle or framing of a campaign, describe what actually happened in plain terms. Don't call a broad resend a "referral mechanism" or similar if that's not what [YOUR_PLATFORM] shows.
- **Keep the headline stat clean:** If the key story is a revenue multiple (7.6×), don't dilute it by adding an RPR comparison to a fundamentally different campaign. Different audience sizes make RPR comparisons misleading.

**Section 6: Růst databáze (Database Growth)**
- **Main popup only:** Analyze the primary signup popup (usually named "newsletter" or similar). Exclude informational overlays and campaign-specific banners — only include forms where submitting creates a [YOUR_PLATFORM] subscriber.
- Popup conversion rate vs. benchmark (5-8% with offer, 2-4% without)
- **Two growth metrics side by side (only these two):**
  - Total database size + growth (absolute + %)
  - Engaged segment (90D) size + growth (absolute + %)
- Exclude operational send segments (e.g., New subscribers 10D) — those are internal targeting slices, not health metrics.
- If total DB grows but engaged segment doesn't → flag as quality problem
- Net subscriber growth (new vs. unsubscribes)
- **Cross-reference with Section 4:** If popup rate dropped, connect to Welcome Flow revenue impact

**Section 7: Focus pro příští měsíc (Focus for Next Month)**
- **Maximum 3 items** — the most impactful things we'll work on
- Must be realistic given capacity constraints (we have multiple clients)
- Pick low-hanging fruits or highest-impact items
- Frame as "what we're doing next" — not "everything that's wrong"
- **Don't frame agreed standards as new improvements.** If a campaign frequency is already agreed, say "počet kampaní bude X" — not "zvyšujeme na X". Only use uplift framing for something genuinely above the current agreement.
- **Lever titles = focus areas, not tasks.** ✓ "Abandoned Cart — dosah flow" / ✗ "Ověřit, zda trigger oprava funguje". A focus area describes where attention goes. A task describes a single action. Titles should be broad enough to cover everything we'll do in that area.
- **Describe PROCESS and EFFORT, not numeric targets.** Example: "Budeme testovat umístění CTA a sledovat dopad na proklikovost" — NOT "Zvýšit CR na 0,6%". The client wants to know what we're DOING, not what we're hoping for.
- **No `.lever-goal` divs.** Do not include granular numeric targets inside lever cards (e.g., "Cíl: 800 doručení → +32 000 Kč"). These read as KPI commitments, create unnecessary pressure, and age poorly. The lever body should describe the situation and approach — the result is implied.
- Each item: clear focus-area title, why it matters (context from data), what we'll actually do

**Section 8: A/B test nápady (A/B Test Ideas)**
- 2-3 suggested A/B tests grounded in actual audit findings
- e.g., subject line tests, send time tests, content format tests
- Tie each suggestion to data observed in the audit
- Reference `email-strategy.md` A/B Testing Priorities for prioritization
- **Respect the promo frequency cap** (from profile.md). For educational e-mails: suggest positioning/angle tests — never "add an offer" if the strategy limits promos.

**Section 9: Closing**
- End on a confident, positive note
- Highlight progress and positive trajectory
- Reassure that gaps are known and being actively addressed
- Leave the client feeling comfortable and confident in the partnership
- The AM will reinforce this tone on the strategy call

**Sections NOT included (intentionally removed):**
- ~~Account & Technical Setup~~ — not useful; we don't have API access for new clients, and for recurring clients it's noise
- ~~E-Commerce Context~~ — only include as a brief context note in the header if it drives specific actions (e.g., email % of total revenue). Don't dedicate a full section to it.
- ~~Data Gaps~~ — data is available in Hiro Analytics or our own analysis; this section doesn't add value

### 4b. Recurring Audit: Progress Assessment

**Skip this section for onboarding audits.**

For recurring audits, weave progress narrative into the relevant sections above (don't create separate progress sections). In each section, reference the previous audit's findings where relevant: "Last audit identified X. Current state: Y."

## Output

Save as `projects/$1/outputs/audit-[month]-[year].html` (e.g., `audit-february-2026.html`). Use the full month name in English for the filename, year in 4 digits.

Also copy to `reports/[client-slug]/audit-[month]-[year].html` when deploying to Vercel (client-facing URL at `app.[YOUR_DOMAIN]/[client]/audit-[month]-[year]`). `reports/` is the Vercel deployment root — copy there only when deploying, not as the primary save location.

### Output Format: Branded HTML

Before generating the output, read `reference/html-templates/audit.html` as your formatting reference. Study:
- The document structure (header, verdict, sections, closing, footer)
- The CSS variables and component classes
- How metrics are presented using `.kpi-grid` and `.data-table`
- How findings are contextualized using `.callout` variants

Generate a **complete, self-contained HTML file** following the reference template's structure and branding. The HTML file must include:
- All CSS inline in a `<style>` tag (copy from the reference template)
- Google Fonts import for Manrope
- Chart.js CDN script tag (only if you include charts)
- All content in the `<body>`

**Component usage guide:**
- `.verdict` — Executive summary verdict box (always present, always first after title)
- `.kpi-grid` + `.kpi` — Key metrics. Color coding: `.pos` (green) for wins, `.caution` (orange) for down but explainable, `.neg` (red) for problematic, plain for neutral.
- `.data-table` — Metric comparison tables, flow performance tables, per-campaign tables. Numbers/percentages/currency stay on one line (`white-space: nowrap` is default). For text columns (subject lines, flow names, metric descriptions), add `class="text-left"` on `<td>` and `style="text-align:left"` on the matching `<th>`.
- `.callout.green` — Positive findings, things working well
- `.callout.red` — Issues that need attention (frame constructively)
- `.callout.orange` — Nuanced context, things that need interpretation
- `.callout.yellow` — General highlights, recommendations ([YOUR_AGENCY] signature)
- `.callout.blue` — Forward-looking points, strategic opportunities
- `.callout.dark` — Summary/takeaway boxes, closing section
- `.lever` — Focus items for next month (max 3: `.l1`, `.l2`, `.l3`)
- `.badge` — Inline status labels (`.good`, `.warn`, `.bad`)
- Chart.js doughnut — Only when comparing distributions (e.g., flow revenue split). Include data inline in `<script>`. Always set `height="180"` and `style="max-height:180px"` — charts are supplementary, never dominant. **Chart color QA:** Every slice must be visually distinct from the background (`#F3F5F7`) and from every other slice. Default 2-slice palette: `['#316CF0', '#2A9D8F']`. Never use `#F3F5F7` as a chart color — it's invisible on the background.

**Write the audit in the client's language following any locale-specific style rules defined in the project profile.** Lead with wins, use data to support conclusions, frame gaps constructively, end on a positive note. Do NOT generate a markdown file — the output is HTML.

## Notes

- The audit is **client-facing** — it builds confidence and shows progress, not lists everything broken
- Lead with wins. Be transparent about gaps, but always frame as "what we're improving next"
- Never say "this is broken" — say "here's what we're working on"
- Use benchmarks from the audit checklist to contextualize findings, but for click rate always compare to the client's own trend
- Reference `email-strategy.md` for strategic interpretation — metric interpretation frameworks, market context, and lessons learned from other clients
- If data is limited (e.g., new platform migration), note what you can't assess and why
- Reference specific flow architectures from the reference file when identifying gaps
- For recurring audits, frame findings as progress narrative: "Last audit identified X. Current state: Y. Impact: Z."
- Recurring audits should be more concise than onboarding audits — focus on what changed and what needs attention
- The closing must leave the client feeling confident and comfortable — the AM will reinforce this on the call
- Every insight should be cross-referenced to data in another section — isolated observations are less convincing than connected narratives
- **Don't over-highlight minor discrepancies.** If flow deliveries don't add up perfectly, campaign counts have small rounding differences, or a metric has a minor unexplained gap — don't call it out. Clients won't notice, and highlighting it invites unnecessary questions that undermine confidence. Focus on tržby, KPIs, and trajectory. Only flag discrepancies that are material (>10% of the total) and affect the narrative.
- Focus items (Section 7) describe process, not numeric targets — "what we're doing" not "what we're hoping for"
- **No explicit "proactive" claims.** Never describe an action as proactive in client-facing copy. If we pivoted a campaign, caught an issue, or improved a setup — describe what happened and the result. The initiative is self-evident. Claiming it sounds defensive.
- **Data-only claims.** Never state seasonal or historical patterns that aren't in `email-strategy.md` or confirmed by the AM in the data session. "Q4 buyers tend to purchase in Jan-Feb" — only include if you have data or AM confirmation. Speculation in a client-facing doc erodes trust.
- **No superlatives without a valid sample.** Never write "nejlepší měsíc v historii", "historický výkon", or any all-time record claim unless the client has at least 2+ years of data to compare against. A single data point is not a record — it's a baseline. State the number and what drove it. The win is self-evident; inflating it sounds like agency spin and gives clients grounds to dismiss the whole audit.
- **Callout discipline — state the fact, then stop.** After describing a situation and the action taken, do not add hedging follow-up sentences ("výsledek zatím není průkazný", "doporučujeme ověřit"). These belong in the internal brief, not the client-facing audit. The audit reports what happened; the call discussion handles what to watch.
- **Language quality.** Write naturally in the client's language. Avoid translated-feeling sentence structures. If a sentence feels like a translation, rewrite it from the ground up in the target language's logic.

### 5. Pre-Send Document Review

After generating the audit HTML, run the Document Review loop before presenting to the AM.

**The loop:**
1. Run Document Review (reviewer agent, Document Review mode) on the generated HTML
2. For each Category A/C FAIL → auto-fix in the HTML (these are clear-cut — don't ask, just fix)
3. For each Category B flag → ask the AM the targeted question → AM confirms keep or fix
4. For each Category D WARN → include in the review report for AM awareness
5. Re-run review on the updated document
6. Repeat until VERDIKT = "Připraveno k odeslání"
7. Then proceed to Delivery (open in Chrome / offer PDF export)

The AM only gets asked Category B questions — they never manually fix anything. The reviewer + skill handle all edits.

## Delivery

After the document review passes, ask the AM:
> "Want me to upload the audit (HTML/PDF) to the client's Google Drive folder?"

## Next Steps

After audit is complete:
> "Next: Run `/strategy [client]` for flow architecture + client-facing strategy."
