---
name: content-plan
description: Generate monthly content ideas and a campaign calendar for a client. Use when planning campaigns, creating a content calendar, or preparing a monthly plan.
argument-hint: [client-name] [month]
disable-model-invocation: true
---

## What This Skill Does

Generates a monthly campaign calendar and brainstorming overview for a specific client and month. Used internally by the AM to prep for strategic calls and plan execution.

**This is an internal document** — for AM use, not sent directly to the client. It may be shown at the strategic call as a discussion starting point.

**Production context:** The content plan feeds into `/call-prep` for strategic call prep. Individual campaigns from the plan get briefed via `/brief`.

**Default mode:** Planning one month ahead.

**Post-call adjustment mode:** `/content-plan adjust [client] [month]` — see Step 5.

## Files to Load

1. `projects/$1/profile.md` (brand, voice, products, what works, seasonal patterns)
2. Most recent audit for this client — find it by checking `projects/$1/outputs/` for the latest `audit*.html` or `audit*.md`
3. `reference/html-templates/audit.html` (visual design reference — copy CSS, SVG logos, and component patterns)

[Add your methodology reference files here — campaign strategy guides, proven campaign types, benchmarks, market calendars]

## Steps

### Step 0: Determine Target Month

Parse arguments: `$1` = client name, `$2` = month (optional).

**If month is not provided:** Default to next calendar month from today's date.

### Step 1: Seasonal Event Assessment

**This is the most important step. Run it before building anything.**

Evaluate the target month for known seasonal events relevant to your market and clients.

[Define your seasonal calendar here — what events matter for your clients? Customize by market.]

**If a major seasonal event exists in the target month:**
- Ask the AM what the client is planning for it
- Think about how to position your service around it

**If no major seasonal event:**
- Propose a creative campaign concept

[Add your proven campaign/offer types here — what kinds of campaigns consistently work for your clients?]

### Step 2: Gather Additional Inputs

Ask the AM:
- **Any specific launches, events, or initiatives** this month
- **Anything from the audit** that should drive the content focus
- **Campaign frequency** (confirm from profile)

### Step 3: Seasonal Hooks

Based on the target month, identify 1-2 seasonal angles relevant to your market.

### Step 4: Generate Monthly Overview + Campaign Calendar

**Monthly overview:**
- Key dates and events for the month
- Recommended campaign mix
- Tie to what works for this client (from profile + audit insights)

**Campaign calendar table:**

| # | Date | Type | Campaign Description |
|---|------|------|---------------------|

[Define your campaign type badges and categories here]

**Pull campaign ideas from your proven campaign types reference** — use tested formats adapted to the client's context.

### Step 5: Post-Call Adjustment Mode

**Triggered by:** `/content-plan adjust [client] [month]`

1. Load existing plan
2. Ask AM for call notes: what was confirmed, what changed
3. Apply changes
4. Save revised version

## Output

Save as `projects/$1/outputs/content-plan-$2.html`

### Output Format: Branded HTML

Copy the full CSS and SVG logos from `reference/html-templates/audit.html`. The content-plan is part of the same document family as the audit — they must look identical in structure and typography.

Generate a **complete, self-contained HTML file** with all CSS inline in a `<style>` tag.

**Write in the client's language following any locale-specific style rules defined in the project profile.**

## Pre-Send Document Review

After generating the content-plan HTML, run the Document Review loop before presenting to the AM.

## Notes

- Campaign ideas should come from your proven campaign types first
- Always reference audit data when available
- The calendar table has NO implementation details — those belong in `/brief`
- This document is shown at the strategic call and adjusted together with the client. Keep it clean and scannable.
- [Add your own content planning methodology notes here]

## Related Skills

- `/call-prep` — loads this content plan as input for strategic call agenda
- `/brief` — generates creative briefs for individual campaigns
- `/audit` — source of performance data referenced in the plan
