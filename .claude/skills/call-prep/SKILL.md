---
name: call-prep
description: Prepare a strategic call agenda and talking points for a client. Use when preparing for a monthly call, client meeting, or strategy session.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a complete strategic call prep package: client-facing agenda + internal AM notes. Automatically aggregates data from the client's latest audit, content plan, and flow status — so the AM doesn't have to manually reference or paste data.

**Monthly cycle position:** This skill is typically run after `/audit` and `/content-plan` have been generated for the period.

## Files to Load

1. `projects/$1/profile.md` (client profile — always loaded)
2. `projects/$1/deliverables.md` (deliverables status — if exists)
3. `projects/$1/outputs/audit.html` (latest audit findings — if exists. Also check `audit.md` for older audits.)
4. `projects/$1/outputs/content-plan-*.*` (latest content plan — load the most recently modified file matching this pattern, check both .html and .md)

**If files 2-4 don't exist:** Note which are missing and ask the AM if they have the data to share manually. The skill works without them but produces better output when they're available.

## Steps

### 1. Assess Available Context

After loading files, summarize what's available:

> "Here's what I found for [client]:
> - Profile: loaded
> - Flow status: [loaded / not found]
> - Latest audit: [loaded / not found]
> - Content plan: [loaded — which month / not found]
>
> Anything missing that you'd like to add before I generate the prep?"

If key files are missing, suggest running the relevant skill first (e.g., "No audit found — consider running `/audit $1` first for a richer call prep"). But don't block — generate with what's available.

### 2. Ask for Additions

Ask the AM:
- **Any specific topics to address** this call? (client concerns, upsells, contract renewals, scope changes)
- **Any wins to highlight** that aren't captured in files?
- **Any sensitive topics** to handle carefully?

### 3. Generate Call Prep Document

Create a two-part document:

#### Part 1: Client-Facing Agenda

A brief, shareable agenda (Czech). 4-5 items max.

```
# Strategicky call: [Client Name]
**Datum:** [date or "TBD"]

## Agenda
1. Vysledky za uplynule obdobi (X min)
2. Obsah na pristi mesic (X min)
3. Automatizace a optimalizace (X min)
4. Otevrena diskuze (X min)
```

#### Part 2: Internal AM Prep Notes

**Performance Review Talking Points**
- Lead with wins (pull from audit: top-performing campaigns, flow revenue, list growth)
- Key metrics to highlight (3-5 most important numbers — with context)
- How to frame any underperformance (context + plan to fix)
- If audit exists: progress on audit action items

**Content Plan Presentation**
- How to present the content plan (start with the "why" behind the mix)
- Key campaigns to emphasize (tie to client goals from profile)
- Where to get client input (their promotions/launches/events)
- Pull key points from content plan if loaded

**Deliverables Update**
- What's been built/optimized since last call (from deliverables tracking)
- What's planned next
- Any results from recent changes
- If audit exists: which audit recommendations have been addressed

**Strategic Recommendations**
- 1-2 bigger ideas to propose (synthesized from audit trends + content plan opportunities)
- Frame as "based on what we're seeing in the data, we recommend..."

**Internal Notes (don't share with client)**
- Anything to be cautious about (underperformance, client frustration)
- Upsell opportunities (if they'd benefit from more campaigns/flows/Phase 2)
- Renewal/contract considerations
- Questions to ask the client (gather intel for better work)
- Outstanding [CONFIRM] items from project files

## Output

Save as `projects/$1/outputs/call-prep-[month].md`

Use the current month for the filename (e.g., `call-prep-march.md`).

Format as a clean document. Part 1 (agenda) should be copy-pasteable to send to the client. Part 2 (internal notes) is for the AM only.

## Pre-Send Document Review

After generating the call prep document, run the Document Review loop on Part 1 (Client-Facing Agenda) before presenting to the AM. Part 2 (Internal AM Prep Notes) is internal-only and skips review.

**The loop:**
1. Run Document Review (reviewer agent, Document Review mode) on Part 1 only
2. For each Category A/C FAIL → auto-fix in the document (these are clear-cut — don't ask, just fix)
3. For each Category B flag → ask the AM the targeted question → AM confirms keep or fix
4. For each Category D WARN → include in the review report for AM awareness
5. Re-run review on the updated document
6. Repeat until VERDIKT = "Připraveno k odeslání"

The AM only gets asked Category B questions — they never manually fix anything. The reviewer + skill handle all edits.

## Notes

- The value of this skill is aggregation — pulling together scattered data into one actionable document
- If no audit or content plan exists, the prep will be thinner. Note what's missing and suggest running the relevant skills first
- Always check for [CONFIRM] items in project files — these are potential conversation topics for the call
- Performance framing matters: lead with wins, provide context for misses, always have a forward plan
- Part 2 is NOT client-facing. Be direct and honest about risks, concerns, and opportunities
