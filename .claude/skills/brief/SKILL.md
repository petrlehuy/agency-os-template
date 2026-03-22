---
name: brief
description: Create a lean copywriter brief for a flow email or campaign. Outputs .md (repo) + .docx (for sharing).
argument-hint: [client-name] [flow-name | campaign-name]
disable-model-invocation: true
---

## What This Skill Does

Creates a scannable, 1-page-max copywriter brief for a specific flow email or campaign. The brief tells the copywriter WHAT to write about and HOW to approach it — not what the copy should say. No draft copy, no example subject lines (those are the copywriter's job).

**Pipeline position:** `/strategy` → client approves → **`/brief`** → cooperator writes copy → `/review`

## Files to Load

1. `projects/$1/profile.md` (brand, voice, audience, products)
2. `projects/$1/flows.md` (flow variables, structure, customizations)
3. `reference/quality-standards.md` (brief quality standards)
4. `reference/course-knowledge/copywriting.md` (always — copy frameworks, subject line principles, research process, 1-idea-1-CTA rule)
5. `reference/course-knowledge/flows.md` (if briefing a flow email — per-flow structure, timing, copy objective, email-by-email playbook)
6. `reference/course-knowledge/campaigns.md` (if briefing a campaign — content mix, segmentation, booster, A/B testing, naming convention)
7. `reference/flow-architectures-phase1.md` (if briefing a Phase 1 flow email)
8. `reference/flow-architectures-phase2.md` (if briefing a Phase 2 flow email)

## Steps

### 1. Identify What to Brief

Ask the user to specify (if not provided via arguments):
- **Client name** — which project
- **What to brief:** flow email (which flow, which email #) or campaign (concept/angle)

Example invocations:
- `/brief [example-client] welcome-flow` — all emails in welcome flow
- `/brief [example-client] abandoned-cart-email-1` — single email
- `/brief [example-client] march-promo` — campaign brief

### 2. Load Context

Read the project files. Pull:
- Brand voice, tone, vocabulary from profile
- Flow structure, variables, and customizations from flows.md
- Email sender persona from profile
- Products, bestsellers, offers
- "What works" and guardrails

### 3. Generate the Brief

Use this lean format for EACH email. Every brief must fit on ~1 page (~30 lines max):

```
# [Flow Name] — Email [#] — [Purpose]

**Timing:** [when this email is sent — delay, trigger]
**Exit:** [when subscriber exits / what skips this email]

## Audience
[2-3 sentences: who gets this, where they are in the journey, their mindset]

## Objective
[1-2 sentences: what this email achieves, primary CTA]

## Angle
[2-3 sentences: HOW to approach the copy — the creative direction.
This is NOT draft copy. It's the strategic angle the copywriter should take.]

## Products
[Which products/categories to highlight, if any. "None" if not product-focused.]

## Specs
- **CTA:** [button text] → [destination URL/page]
- **Kód/Nabídka:** [discount code, offer — or "Žádný"]
- **Sender:** [sender persona from profile, e.g. "[Contact] from [Brand]"]
- **Podmínka:** [any conditions, splits, segments — or "Žádná"]

## Tón
[1 sentence: tone specifically for this email — can shift across the sequence]

## Co nedělat
[3-4 bullet points max — things that would break brand voice or strategy]
```

**Key principles:**
- NO draft copy or example phrases — the copywriter writes the creative
- NO example subject lines — that's the copywriter's job
- NO benchmark data or lengthy explanations
- The brief = direction, not a first draft
- Each brief must be scannable in under 2 minutes

### 4. Save & Export

**Source files (repo, version-controlled):**
- Single email: `projects/$1/outputs/briefs/[flow-slug]-email-[#].md`
- Campaign: `projects/$1/outputs/briefs/campaign-[slug].md`

**Deliverable (.docx for cooperator):**
- Generate via: `python tools/md-to-docx.py [output.docx] [input.md files...]`
- Single flow: one .docx with all emails in that flow
- Batch: one .docx per flow, or one combined .docx

Example:
```bash
python tools/md-to-docx.py \
  projects/$1/outputs/briefs/welcome-flow-briefs.docx \
  projects/$1/outputs/briefs/welcome-email-*.md \
  --title "Welcome Flow — Briefs pro copywritera"
```

## Batch Mode

When briefing an entire flow or all Phase 1 flows at once:

### Invocation
- `/brief [example-client] welcome-flow` — all emails in one flow
- `/brief [example-client] all-phase-1` — all emails across all Phase 1 flows

### Output
- One .md file per email in `projects/$1/outputs/briefs/`
- Naming: `[flow-slug]-email-[#].md` (e.g., `welcome-email-1.md`, `abandoned-cart-email-2.md`)
- One .docx per flow for sharing

### Consistency Checks (after all briefs generated)
- Welcome incentive matches popup offer
- Abandoned flows don't repeat the same angle across site/product/cart
- First-purchase vs. returning splits handled consistently
- Sunset flow is always plain text
- CTA destinations don't conflict
- Tone progresses naturally across the customer journey
- Sender persona is consistent across all briefs

## Notes

- If profile is sparse on brand voice, flag what's missing and work with available data
- For flow emails, always position within the sequence — the copywriter needs journey context
- Default segment is Engaged 90D unless AM specifies otherwise
- Brief quality standard: if the copywriter has to ask for a missing detail, the brief failed
- For full-sequence design WITH copy (not just briefs), use `/email-sequence` instead

## Delivery

After generating all .docx files, ask the AM:
> "Want me to upload the briefs (.docx) to the client's Google Drive folder?"

## Next Steps

After briefs are generated and shared:
> "Next: Send briefs to cooperator. After copy is written: Run `/review [client]` for QA."
