---
name: case-study-extraction
description: Mine client data for case study proof points — scans Hiro Analytics data across all clients, detects outliers against benchmarks, and surfaces marketing-ready case study material. Updates proof inventory and generates case study briefs.
argument-hint: [client-name or "all"]
disable-model-invocation: true
---

## What This Skill Does

Scans client performance data to automatically detect case study-worthy outliers. Compares each client's metrics against industry benchmarks, their own baseline, and other clients — then surfaces the strongest proof points for marketing materials.

**Two output modes:**
- **Scan mode** (default) — Analyze available data, detect outliers, update `proof-inventory.md`
- **Brief mode** — After scanning, generate a structured case study brief for the strongest candidate

**Supports single-client or cross-client sweep:**
- `/case-study-extraction lyss` — analyze one client
- `/case-study-extraction all` — sweep all clients with available data

## Files to Load

1. `reference/benchmarks.md` (industry thresholds + per-flow RPR ranges)
2. `reference/email-strategy.md` (interpretation framework — volume vs. efficiency, seasonal patterns)
3. `projects/[your-project]/proof-inventory.md` (existing proof points — to avoid duplicates)
4. `projects/$1/profile.md` (client context, package, strategy — load per client)
5. `projects/$1/data/hiro-overview.csv` (monthly aggregates — load per client)
6. `projects/$1/data/hiro-campaigns.csv` (per-campaign data — load per client)
7. `projects/$1/data/hiro-flows.csv` (per-flow data — load per client)

## Steps

### 1. Client Inventory Scan

If argument is a specific client name → target that client only.
If argument is "all" or no argument → scan all projects.

For each project folder in `projects/`:
- Skip internal projects: `_templates`, `_example`, `[your-internal-projects]`
- Check if `data/hiro-overview.csv` exists
- Check file modification date

Classify each client:
- **Fresh data** — CSV exists and is < 30 days old
- **Stale data** — CSV exists but is > 30 days old
- **No data** — no CSV files in `data/`

Present summary:
> "Found X client projects. Y with fresh data, Z with stale data, W with no data."
> [List each with status]

Ask: "Run analysis with available data, or collect fresh data from Hiro first?"

### 2. Data Collection (If Needed)

If the user wants fresh data, reuse the audit skill's Hiro export procedure:

1. Navigate to `https://app.hiroanalytics.com/app/page/home`
2. Verify correct client in bottom-left corner
3. Export 3 CSVs per client:
   - **Campaign Deep Dive** → `projects/{client}/data/hiro-campaigns.csv`
     - Toggle ON: Subject, First-Time vs. Returning, Unsubscribes, Comparison, Day of Week, Segments, CVR
   - **Flow Deep Dive** → `projects/{client}/data/hiro-flows.csv`
     - Toggle ON all additional fields (clicks, unsubs, OR, CR, unsub rate, spam, bounce, AOV, CVR)
   - **Overview / Export Data** → `projects/{client}/data/hiro-overview.csv`
     - Select "All metrics" preset or check all fields, toggle "Show Comparison"
4. Move downloaded CSVs from `~/Downloads/` to `projects/{client}/data/`

Skip clients that already have fresh data.

For cross-client sweep: cycle through each Hiro account, switching clients in the bottom-left dropdown.

### 3. Baseline Check

For each client being analyzed, check if `projects/{client}/profile.md` contains a `## Baseline (Month 0)` section.

**If baseline exists:** Use it for before/after comparisons.

**If baseline doesn't exist:**
1. Look at the earliest month in `hiro-overview.csv` — this is often pre-[YOUR_AGENCY] data
2. Extract: email % of store, monthly email revenue, active flows count
3. Ask the user: "No baseline found for {client}. The earliest Hiro data shows {metrics}. Should I use this as the baseline, or do you have better numbers from the onboarding audit?"
4. If confirmed, add to `projects/{client}/profile.md`:

```markdown
## Baseline (Month 0)
- Date: YYYY-MM-DD
- Email % of store: X%
- Monthly email revenue: [CURRENCY] X
- Welcome Flow RPR: [CURRENCY] X (or n/a)
- Popup CVR: X%
- Active flows: X
- Engaged 90D: X (X% of list)
```

### 4. Outlier Detection

Load all available CSVs + `reference/benchmarks.md`. Run three layers of detection.

#### Layer A — Absolute Outliers (vs. Industry Benchmarks)

Compare each metric against the benchmark tiers. Flag anything that hits **"Excellent"** or exceeds the typical range.

<!-- Fill in your own benchmark thresholds below, based on your market and service area. The examples below are placeholders — replace with values from your reference/benchmarks.md. -->

**Flows (Pillar 1 — Automation):**
| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| Welcome Flow RPR > [YOUR_BENCHMARK] | Above typical range top | Exact RPR, delivery count, monthly revenue |
| Any flow RPR > 1.5× its typical range top | Per-flow from benchmarks.md | Flow name, RPR, typical range |
| Flow revenue > 70% of total email revenue | High automation ratio | Percentage, absolute flow revenue |
| Single flow monthly revenue > [YOUR_THRESHOLD] | Major revenue generator | Flow name, revenue, delivery count |

**Campaigns (Pillar 2 — Database Conversion):**
| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| Campaign RPR > [YOUR_BENCHMARK] | Top-tier single campaign | Campaign name, RPR, subject, recipients |
| Campaign CTOR > 10% (with offer) | "Excellent" threshold | Campaign name, CTOR, revenue |
| Campaign CTOR > 7% (without offer) | "Excellent" threshold | Campaign name, CTOR, type |
| Campaign CVR > 0.15% | Strong conversion | Campaign name, CVR, revenue |

**List Growth (Pillar 3 — Capture):**
| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| Popup CVR > 8% (with discount) | "Excellent" threshold | CVR, form name, time period |
| Popup CVR > 4% (without discount) | "Excellent" threshold | CVR, form name |
| Engaged 90D > 50% of total list | "Excellent" threshold | Segment size, total list, percentage |

**Attribution (Pillar 4 — Revenue Share):**
| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| Email % of total revenue > 35% | Above "Good" range | Percentage, absolute email revenue, store revenue |
| Email % of total revenue > 40% | "Excellent" range | Same + month |

#### Layer B — Trend Outliers (Growth Trajectories)

Requires ≥ 3 months of data. Skip for clients with < 3 months history.

**Compound Effect (Pillar 5 — Složený efekt):**
| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| Email revenue 2×+ from baseline | Doubled since onboarding | Baseline → current, timeframe, growth % |
| MoM email revenue growth > 30% | Acceleration | Month, growth %, absolute numbers |
| Email revenue > 100% growth in first 90 days | Rapid onboarding impact | Start → end, timeframe |
| 3+ consecutive months email % increasing | Sustained channel growth | Month-by-month trend, start → current |

**List Growth trends (Pillar 3):**
| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| Popup CVR improved > 100% from baseline | Dramatic improvement | Before → after, timeframe |

#### Layer C — Relative Outliers (Cross-Client Ranking)

Only runs in "all" mode with ≥ 2 clients. Rank each client on key metrics:

| Metric | Best performer gets flagged for | Pillar |
|--------|--------------------------------|--------|
| Welcome Flow RPR | Highest across all clients | 1 — Flows |
| Total flow revenue | Highest absolute | 1 — Flows |
| Best single campaign RPR | Highest across all clients | 2 — Campaigns |
| Popup CVR | Highest across all clients | 3 — List Growth |
| Email % of total store | Highest across all clients | 4 — Attribution |
| Revenue growth rate (% over first 6 months) | Fastest trajectory | 5 — Compound |

#### Handling Short-History Clients (< 3 months)

- Run Layer A (absolute outliers) — single-month metrics can qualify
- Skip Layer B (trend outliers) — not enough data points
- Include in Layer C rankings if running cross-client
- Tag any findings as: `[early signal — confirm next month]`

### 5. Freelo Context Enrichment (Optional)

**Requires Freelo MCP to be configured in `.mcp.json`.**

If Freelo is available, for each detected outlier:
1. Search Freelo for the client project
2. Search comments for the flow/campaign name (or related keywords)
3. Look for:
   - Strategy discussions that led to the result
   - Client feedback or reactions
   - Implementation notes (what was changed/built)
   - Timeline (when was it implemented → how long to results)
4. Summarize the qualitative context in 1-2 sentences

This adds the "story" to the number. Skip if Freelo is not configured — the skill works without it.

### 6. Update Proof Inventory

Compare detected outliers against existing entries in `projects/[your-project]/proof-inventory.md`.

**For each new outlier not already in the inventory:**
- Determine the correct pillar table (1–5)
- Determine the proof tier:
  - **Tier A** — client naming confirmed in the Client Roster table
  - **Tier B** — no naming permission, use anonymized
  - **Tier C** — benchmark/aggregate data, no client needed
- Format the new row:

```markdown
| [description] | ClientName | A/B/C | [metric] [auto-detected YYYY-MM-DD] |
```

**For existing entries with updated data:**
- Update the metric value if the new number is stronger
- Add date tag: `[updated YYYY-MM-DD]`

**For the Headline Numbers table:**
- Check if any new outlier beats an existing headline stat
- If yes, add or replace the row

Present all changes to the user as a diff before writing:
> "Found X new proof points and Y updates. Here's what I'd add/change..."

Only write after user confirms.

### 7. Generate Case Study Brief (On Request)

After updating the inventory, offer:
> "Strongest new candidate: [client] — [headline stat]. Want me to generate a case study brief?"

If yes, generate a structured brief. Output as markdown in `projects/[your-project]/outputs/case-study-brief-{client}.md`.

**Brief structure:**

```markdown
# Case Study Brief — {Client Name}

## Headline Stat
[The single most impressive number — this leads the case study]

## Client Context
- Industry: [from profile.md]
- Product: [from profile.md]
- List size: [from data]
- Package: [from profile.md]

## Before (Baseline)
[Metrics at onboarding — from Baseline section in profile.md]

## What We Did
[From Freelo project history + profile.md strategy notes + flow architectures]
- Key changes implemented
- Timeline
- Strategic approach

## After (Current)
[Current metrics with % improvement vs. baseline]

## Key Insight
[What made this work — from email-strategy.md methodology]

## Supporting Data
[Secondary metrics that reinforce the main story]

## Proof Tier
[A/B/C — what can be shown publicly]

## Recommended Use
[Where this case study works best: landing page, ad script, sales call, social proof section]
```

For the strongest candidates, offer to also generate a polished HTML case study using an existing case study as a structural reference (e.g., `projects/[example-project]/outputs/drafts/case-study-v2.md`).

## Output

**Primary output:** Updated `projects/[your-project]/proof-inventory.md`
**Secondary output:** Case study brief(s) in `projects/[your-project]/outputs/`
**Side effect:** Baseline sections added to client profiles where missing

## Notes

- This skill is purely analytical — it doesn't create or modify any client-facing documents
- The proof inventory is the source of truth for all marketing proof points
- Always present changes for approval before writing to proof-inventory.md
- When running cross-client analysis, never share one client's exact numbers with another client — this is internal [YOUR_AGENCY] data only
- Freelo enrichment is a bonus, not a requirement — the skill works without it
- For clients where naming permission is "Named (carefully)", flag the proof point with a note to review usage context
- Run this monthly, ideally after completing that month's audit cycle for all clients — freshest data, least extra work
- The `[auto-detected]` tag in proof entries distinguishes machine-found points from manually curated ones — [FOUNDER_NAME] can review and confirm or remove

## Next Steps

After case study extraction:
> "Proof inventory updated. Next options:"
> - "Run `/copywriting` to write a case study page from the brief"
> - "Run `/brief` to create a cooperator brief for the case study copy"
> - "Update the proof-inventory decision log if naming permissions changed"
