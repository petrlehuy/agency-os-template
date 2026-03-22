---
name: brief
description: Create a lean creative brief for a deliverable. Outputs .md (repo) + .docx (for sharing).
argument-hint: [client-name] [deliverable-name]
disable-model-invocation: true
---

## What This Skill Does

Creates a scannable, 1-page-max creative brief for a specific deliverable. The brief tells the creative team WHAT to produce and HOW to approach it — not what the output should say. No draft copy, no example outputs (those are the creative's job).

**Pipeline position:** `/strategy` → client approves → **`/brief`** → creative team produces → `/review`

## Files to Load

1. `projects/$1/profile.md` (brand, voice, audience, products)
2. `projects/$1/deliverables.md` (deliverables status, structure, customizations)
3. `reference/quality-standards.md` (brief quality standards)

[Add your methodology reference files here — copywriting guides, service-specific playbooks, best practice docs]

## Steps

### 1. Identify What to Brief

Ask the user to specify (if not provided via arguments):
- **Client name** — which project
- **What to brief:** which deliverable or campaign

### 2. Load Context

Read the project files. Pull:
- Brand voice, tone, vocabulary from profile
- Deliverable structure and customizations
- Products, positioning, offers
- "What works" and guardrails

### 3. Generate the Brief

Use this lean format for EACH deliverable. Every brief must fit on ~1 page (~30 lines max):

```
# [Deliverable Name] — [Purpose]

## Audience
[2-3 sentences: who this is for, where they are in the journey, their mindset]

## Objective
[1-2 sentences: what this deliverable achieves, primary action]

## Angle
[2-3 sentences: HOW to approach the creative — the strategic direction.
This is NOT draft output. It's the strategic angle the creative should take.]

## Key Content / Products
[Which products/content/assets to highlight, if any.]

## Specs
- **CTA:** [action] → [destination]
- **Offer:** [discount, incentive — or "None"]
- **Format:** [format requirements]
- **Constraints:** [any conditions, splits, segments — or "None"]

## Tone
[1 sentence: tone specifically for this piece — can shift across a sequence]

## What NOT to Do
[3-4 bullet points max — things that would break brand voice or strategy]
```

**Key principles:**
- NO draft output or example phrases — the creative produces the work
- NO benchmark data or lengthy explanations
- The brief = direction, not a first draft
- Each brief must be scannable in under 2 minutes

### 4. Save & Export

**Source files (repo, version-controlled):**
- `projects/$1/outputs/briefs/[deliverable-slug].md`

**Deliverable (.docx for creative team):**
- Generate via: `python tools/md-to-docx.py [output.docx] [input.md files...]`

## Batch Mode

When briefing an entire sequence or all deliverables at once:

### Output
- One .md file per deliverable in `projects/$1/outputs/briefs/`
- One .docx per group for sharing

### Consistency Checks (after all briefs generated)
- Offers don't conflict across deliverables
- Tone progresses naturally across the sequence
- CTAs don't conflict
- Brand voice is consistent across all briefs

## Notes

- If profile is sparse on brand voice, flag what's missing and work with available data
- Brief quality standard: if the creative has to ask for a missing detail, the brief failed
- For full-sequence design WITH copy (not just briefs), use `/email-sequence` instead
- [Add your own brief methodology notes here]

## Delivery

After generating all .docx files, ask the AM:
> "Want me to upload the briefs to the client's shared folder?"

## Next Steps

After briefs are generated and shared:
> "Next: Send briefs to the creative team. After work is done: Run `/review [client]` for QA."
