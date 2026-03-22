---
name: case-study-extraction
description: Mine client data for case study proof points — scans performance data across clients, detects outliers against benchmarks, and surfaces marketing-ready case study material. Updates proof inventory and generates case study briefs.
argument-hint: [client-name or "all"]
disable-model-invocation: true
---

## What This Skill Does

Scans client performance data to automatically detect case study-worthy outliers. Compares each client's metrics against industry benchmarks, their own baseline, and other clients — then surfaces the strongest proof points for marketing materials.

**Two output modes:**
- **Scan mode** (default) — Analyze available data, detect outliers, update proof inventory
- **Brief mode** — After scanning, generate a structured case study brief for the strongest candidate

**Supports single-client or cross-client sweep:**
- `/case-study-extraction clientname` — analyze one client
- `/case-study-extraction all` — sweep all clients with available data

## Files to Load

1. `reference/benchmarks.md` (industry thresholds)
2. `projects/$1/profile.md` (client context, package, strategy — load per client)

[Add your analytics data source files here — load per client. Example: `projects/$1/data/overview.csv`, `projects/$1/data/campaigns.csv`]

## Steps

### 1. Client Inventory Scan

If argument is a specific client name → target that client only.
If argument is "all" or no argument → scan all projects.

For each project folder in `projects/`:
- Skip internal projects: `_templates`, `_example`
- Check if analytics data exists
- Check file modification date

Classify each client:
- **Fresh data** — data exists and is < 30 days old
- **Stale data** — data exists but is > 30 days old
- **No data** — no data files

### 2. Data Collection (If Needed)

[Define your data collection process here — how to export fresh data from your analytics platform]

### 3. Baseline Check

For each client being analyzed, check if `projects/{client}/profile.md` contains a `## Baseline` section.

**If baseline exists:** Use it for before/after comparisons.

**If baseline doesn't exist:**
1. Look at the earliest available data
2. Ask the user to confirm baseline metrics
3. Add baseline section to profile.md

### 4. Outlier Detection

Load all available data + `reference/benchmarks.md`. Run detection layers.

[Define your outlier detection approach here. Recommended structure:

**Layer A — Absolute Outliers (vs. Industry Benchmarks):**
Compare each metric against benchmark tiers. Flag anything that hits "Excellent" or exceeds the typical range.

Add your metrics and thresholds per service area. Example structure:

| Signal | Threshold | What to capture |
|--------|-----------|----------------|
| [Metric] > [YOUR_BENCHMARK] | Above typical range | Exact value, volume, context |

**Layer B — Trend Outliers (Growth Trajectories):**
Requires ≥ 3 months of data. Skip for clients with short history.

Add your growth trajectory thresholds here — what rate of improvement is "case study worthy"?

**Layer C — Relative Outliers (Cross-Client Ranking):**
Only runs in "all" mode with ≥ 2 clients. Rank each client on key metrics.]

### 5. Update Proof Inventory

Compare detected outliers against existing entries in your proof inventory file.

**For each new outlier not already in the inventory:**
- Determine the correct category
- Determine the proof tier (named client / anonymized / aggregate)
- Format the new entry

Present all changes to the user as a diff before writing. Only write after user confirms.

### 6. Generate Case Study Brief (On Request)

After updating the inventory, offer:
> "Strongest new candidate: [client] — [headline stat]. Want me to generate a case study brief?"

If yes, generate a structured brief:

```markdown
# Case Study Brief — {Client Name}

## Headline Stat
[The single most impressive number]

## Client Context
- Industry: [from profile.md]
- Service package: [from profile.md]

## Before (Baseline)
[Metrics at onboarding]

## What We Did
[Key changes implemented, timeline, approach]

## After (Current)
[Current metrics with % improvement vs. baseline]

## Key Insight
[What made this work]

## Supporting Data
[Secondary metrics that reinforce the story]

## Proof Tier
[Named / Anonymized / Aggregate — what can be shown publicly]

## Recommended Use
[Where this case study works best: landing page, ad, sales call, social proof]
```

## Output

**Primary output:** Updated proof inventory
**Secondary output:** Case study brief(s) in `projects/` outputs
**Side effect:** Baseline sections added to client profiles where missing

## Notes

- This skill is purely analytical — it doesn't create or modify any client-facing documents
- Always present changes for approval before writing to the proof inventory
- When running cross-client analysis, never share one client's exact numbers with another
- Run this periodically, ideally after completing audit cycles — freshest data, least extra work
- [Add your own case study methodology notes here]

## Next Steps

After case study extraction:
> "Proof inventory updated. Next options:"
> - "Run `/copywriting` to write a case study page from the brief"
> - "Run `/brief` to create a creative brief for the case study copy"
