---
name: onboard
description: Use when onboarding a new client, creating client files from intake data, or setting up a new project from scratch.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Onboards a new client from zero to strategy-ready. Takes intake form data, researches the client's website/business, and generates three files: project profile, deliverables tracker, and internal team brief.

**Pipeline position:** `/onboard` is step 1 of a 3-step onboarding pipeline:
1. `/onboard` — Ingest form data, research, generate project files + internal team brief
2. `/audit` — Marketing performance audit using project files + available data
3. `/strategy` — Service strategy document (client-facing)

## Files to Load

1. `context/packages.md`
2. `reference/quality-standards.md`
3. `projects/_templates/profile.md`
4. `projects/_templates/deliverables.md`

[Add your methodology reference files here — service blueprints, standard deliverables lists]

## Steps

### 1. Gather the Intake Data

Ask the AM:
> "Do you have the intake form response for [client]? Paste it here — or if you don't have it yet, I'll ask you the key questions instead."

If AM pastes form data, parse it. If not, ask the key questions conversationally.

[Define your intake form field mapping here. Map each field from your intake form to the appropriate section in profile.md. Example structure:

| Form Field | Maps To |
|---|---|
| Company name | Project folder name + profile header |
| Contact info | `## Contact` in profile |
| Business description | `## Brand` in profile |
| Target audience | `## Audience / ICP` in profile |
| Goals | `## Strategy & Goals` in profile |
| Current tools/platforms | `## Technical Setup` in profile |
| Brand materials | `## Assets` in profile |
| What NOT to do | `## Guardrails / What to Avoid` in profile |]

### 2. Research the Client Website/Business

After receiving form data, visit the client's website URL and gather:
- Product/service catalog structure
- Current lead capture (what's the offer?)
- Visual brand identity (colors, style, positioning)
- Anything that fills gaps in the form data

**Do NOT ask the AM for info that's visible on the website or already in the form.** Research it yourself.

### 2b. Data Completeness Check

After receiving intake data (and website research), evaluate what we have vs. what's missing:

> **Data collected:** [list key data points we have]
>
> **Missing (would improve output quality):**
> - [Missing item] — [where AM can find it] — [what it affects]

Rules:
- Never block on missing data — proceed with available information
- Mark estimated values with `[ESTIMATED]` tag
- `[CONFIRM]` = needs client verification. `[ESTIMATED]` = our best guess.
- Always tell the AM exactly where to find missing data

### 3. Confirm and Fill Gaps (Conversational)

Present findings to the AM in a structured summary with options to confirm or correct. Always offer a suggested answer — AM just confirms or corrects.

### 4. Generate Project Files

#### 4a. Create `projects/[name]/profile.md`

Use the template from `projects/_templates/profile.md`. Populate every section from form data + research + AM confirmations.

#### 4b. Create `projects/[name]/deliverables.md`

Use the template from `projects/_templates/deliverables.md`. Populate with the planned deliverables for this client based on their package.

[Add your deliverable variable mapping here — what service-specific variables need to be set per client?]

### 5. Generate Internal Team Brief

Create `projects/[name]/outputs/internal-brief.md`

**Audience:** Internal team only. Never sent to client.
**Purpose:** Anyone on the team should understand how to work with this client.

[Define your internal brief template here. A recommended structure:

```
# Internal Brief: [CLIENT NAME]
> Generated: [date] | Package: [package] | Phase: Onboarding

## 1. Client Overview
## 2. What They Sell/Do
## 3. Who They Serve
## 4. Brand & Communication
## 5. Current State
## 6. Technical Setup
## 7. Strategic Context
## 8. Opportunities & Recommended Priorities
## 9. Red Flags & Risks
## 10. How to Work With This Client
## 11. Items to Verify [CONFIRM]
## 12. Access Checklist
```]

### 6. Summary Output

After generating all files, present:

1. **Files created** (with paths)
2. **[CONFIRM] items** — list everything needing verification
3. **Red flags** — anything concerning from research
4. **Access checklist** — confirmed vs. pending

## Next Steps

After onboarding is complete:
> "Next: Run `/audit [client]` to assess their current marketing setup."

## Notes

- Every form field must be mapped — don't drop data
- Internal brief must be genuinely useful — not reformatted form data
- Analysis sections must contain actual analysis
- All [CONFIRM] items must appear in the brief
- [Add your own onboarding methodology notes here]
