---
name: strategy
description: Create a service strategy document for client approval. Visual-first strategy output with branded HTML.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a client-facing strategy document that outlines your proposed service approach, deliverables, and implementation plan.

**Pipeline position:** `/onboard` → `/audit` → **`/strategy`** → client approves → `/brief` → creative team executes → `/review`

## Files to Load

1. `context/packages.md` — package details for scope
2. `reference/html-templates/strategy.html` — HTML formatting reference
3. `projects/$1/profile.md` — project profile
4. `projects/$1/deliverables.md` — deliverables status (if exists)
5. `projects/$1/outputs/internal-brief.md` — priorities and red flags (if exists)
6. `projects/$1/outputs/audit.html` — audit findings (if exists)

[Add your methodology reference files here — service blueprints, architecture templates, best practice guides]

## Steps

### 1. Review Context & Determine Scope

Ask the user:
- Which service phase(s) to include?
- Any specific client requests or customizations?
- Audit results if not already loaded

From the loaded files, identify:
- Client-specific variables from deliverables tracking
- Which deliverables are already live vs. planned
- Audit findings that justify each recommendation
- All `[CONFIRM]` items that need client approval

### 2. Generate Strategy Document

Use `reference/html-templates/strategy.html` as the **formatting reference**.

Generate a **complete, self-contained HTML file** with ALL CSS inline in a `<style>` tag.

**Document sections:**

[Define your strategy document structure here. A typical structure:

**Section 1 — Overview:**
- Verdict box: 2-3 sentences — what we're building and why
- KPI grid: 3-4 key summary stats
- Current state assessment

**Section 2 — Growth Strategy:**
- Your approach to growing the client's business
- Key metrics and targets

**Section 3 — Proposed Deliverables:**
- Group deliverables by category or customer journey stage
- For each deliverable: who it's for, why it matters, how it works

**Section 4 — What We Need From You:**
- Checklist of all `[CONFIRM]` items + approval items

**Section 5 — What Comes Next:**
- Future phases, timeline, roadmap]

### 3. Save Outputs

Save the HTML file to:
- `projects/$1/outputs/strategy.html`

### 4. Present Summary

After completing outputs, report:
- HTML file location(s)
- List of `[CONFIRM]` items awaiting client approval

### 5. Pre-Send Document Review

After generating the strategy HTML, run the Document Review loop before presenting to the AM.

Then ask the AM:
> "Want me to upload the strategy to the client's shared folder?"

## Next Steps

After strategy is generated:
> "Next: Send strategy to client for approval. After approval: Run `/brief [client]` to generate briefs for the creative team."

## CSS Design System

The strategy HTML uses the **same design system as the audit template** (`reference/html-templates/audit.html`):

**Key rules (do not deviate):**
- KPI cards: `background: var(--bg-light); border-radius: 15px;` — NO border
- Callout boxes: flat fills per type — NO border
- Cards: `background: var(--bg-light); border-radius: 15px;` — NO border

## Notes

- This is a **client-facing** document — professional tone, no internal notes
- Focus on WHAT THE CLIENT GETS, not technical implementation details
- Every recommendation should be grounded in audit findings
- [Add your own strategy methodology notes here]
