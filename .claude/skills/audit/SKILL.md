---
name: audit
description: Generate a comprehensive marketing performance audit for a client. Use when auditing a client's current setup, evaluating performance health, or running a recurring check-in.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a client-facing marketing performance audit. Evaluates performance, identifies opportunities, and presents a focused action plan for the next period.

**Two modes:**
- **Onboarding audit** — Step 2 of the onboarding pipeline (`/onboard` → `/audit` → `/strategy`). First-time evaluation of a new client's setup.
- **Recurring audit** — Periodic health check for active clients. Evaluates current performance against previous audit, includes period-over-period trends.

The skill detects which mode to use based on whether a previous audit exists.

## Files to Load

1. `projects/$1/profile.md` (project profile)
2. `projects/$1/outputs/internal-brief.md` (if exists — for red flags and priorities)
3. `projects/$1/outputs/audit.html` (if exists — previous audit for comparison)
4. `reference/html-templates/audit.html` (HTML formatting reference — load before generating output)

[Add your reference files here — methodology docs, benchmarks, checklists that your audits draw from. Example: `reference/audit-checklist.md`, `reference/benchmarks.md`]

## Steps

### 1. Determine Audit Mode

Check if `projects/$1/outputs/audit.html` exists:

**If previous audit exists (Recurring mode):**
- Note the date and key findings from the previous audit
- This audit will compare current state against previous findings
- Ask the AM what has changed since the last audit

**If no previous audit (Onboarding mode):**
- The project profile should exist from `/onboard` or manual AM setup
- If the profile doesn't exist, ask the AM if they've run `/onboard` first

### 2. Gather Audit Data

**Always ask the AM before generating:**

- **Audit period:** What timeframe should this audit cover?
- **Comparison period:** What should we compare against?
- **Any known issues** they want specifically checked
- **External factors** during this period that may have affected performance

[Add your data collection process here — what analytics platform do you pull from? What exports do you need? What manual data does the AM provide?]

### 2b. Collect Data from Analytics

[Define your data collection pipeline here. For each data source:
- Where to find it (URL, export location, API)
- What fields/metrics to collect
- How to organize the exported data (e.g., `projects/$1/data/`)
- Any automation scripts that help with collection]

### 2c. Interactive Analysis — Ask AM About Anomalies

After collecting data but BEFORE generating the audit, scan for anomalies and ask the AM 3-5 targeted questions. These are NOT generic questions — they're driven by specific data points that look unusual.

[Define your anomaly detection approach:
- What thresholds flag a metric for investigation?
- What kinds of disconnects do you look for?
- How do you identify outlier performance?]

This step is what makes the audit operationally grounded — the AM's context fills gaps that data alone can't.

### 3. Pre-Analysis

Before writing any audit section, complete your analysis checklist. The goal is to find the narrative thread that connects all sections — data tells a story, not just shows numbers.

[Add your pre-analysis methodology here:
- What patterns do you look for before writing the audit narrative?
- What diagnostic logic do you follow when a metric drops or spikes?
- How do you connect findings across different sections of the audit?]

### 4. Generate Audit

Using the analyzed data, AM answers, and methodology reference, generate a structured audit.

[Define your audit sections here. A typical structure:

- **Executive Summary** — Verdict box, KPI grid, lead with wins
- **Core Performance Sections** — 3-5 sections covering your key service areas. Each with period comparison, context, and insights.
- **Focus for Next Period** — Maximum 3 items, the most impactful things you'll work on
- **Closing** — Confident, positive note. Leave the client feeling comfortable and confident.]

### 4b. Recurring Audit: Progress Assessment

**Skip this section for onboarding audits.**

For recurring audits, weave progress narrative into the relevant sections above. Reference the previous audit's findings where relevant.

## Output

Save as `projects/$1/outputs/audit-[period].html`

### Output Format: Branded HTML

Before generating the output, read `reference/html-templates/audit.html` as your formatting reference. Study:
- The document structure (header, verdict, sections, closing, footer)
- The CSS variables and component classes
- How metrics are presented
- How findings are contextualized

Generate a **complete, self-contained HTML file** following the reference template's structure and branding. The HTML file must include:
- All CSS inline in a `<style>` tag (copy from the reference template)
- Google Fonts import for Manrope
- All content in the `<body>`

**Write the audit in the client's language following any locale-specific style rules defined in the project profile.**

## Notes

- The audit is **client-facing** — it builds confidence and shows progress
- Lead with wins. Be transparent about gaps, but always frame as "what we're improving next"
- Never say "this is broken" — say "here's what we're working on"
- Use benchmarks to contextualize findings
- If data is limited, note what you can't assess and why
- For recurring audits, frame findings as progress narrative
- Every insight should be cross-referenced to data in another section
- [Add your own audit methodology notes here]

### 5. Pre-Send Document Review

After generating the audit HTML, run the Document Review loop before presenting to the AM.

## Delivery

After the document review passes, ask the AM:
> "Want me to upload the audit to the client's shared folder?"

## Next Steps

After audit is complete:
> "Next: Run `/strategy [client]` for a service strategy document."
