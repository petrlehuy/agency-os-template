---
name: review
description: QA review of creative output against best practices, brief compliance, and client-specific standards. Use after the creative team delivers and before client handoff. Also invoke when someone says "review this," "QA this," "check this against the brief," or "is this ready to send."
argument-hint: [client-name]
disable-model-invocation: true
---

# QA Review — Deliverable Output

Production pipeline position: Brief (`/brief`) → Creative team produces → Copy Editing (`/copy-editing`) → **QA Review (this skill)** → Client Approval → Implement

## Files to Load

1. `reference/quality-standards.md` — QA checklist + standards
2. `projects/$1/profile.md` — brand voice, tone, segments, performance patterns

[Add your methodology reference files here — strategic lens docs, market context, lessons learned files]

Load all before starting. If client not specified via argument, ask for the client name first.

## Steps

### Step 1: Collect Inputs

Ask for anything not already provided:
- The creative team's output (paste or file path)
- The original brief (if available — enables Layer 1 brief compliance check)
- Client name (if not given via argument)

If the brief is not available, skip Layer 1 and note it in the output.

### Step 2: Run Multi-Layer Review

[Define your QA review layers here. A recommended structure:]

#### Layer 1: Brief Compliance (skip if no brief provided)

[Define 3-5 criteria that check the output against the original brief. Examples:

| # | Criterion | Severity |
|---|-----------|----------|
| 1.1 | Goal delivery — output achieves the stated brief objective | Critical |
| 1.2 | Required elements present — all specified elements included | Critical |
| 1.3 | Audience match — tone and content fit the target segment | Major |
| 1.4 | Length and format — matches brief specifications | Minor |

Rate each: **PASS** / **FAIL** / **N/A**]

#### Layer 2: Quality Best Practices

[Define your quality checklist here. Load criteria from `reference/quality-standards.md`. Examples:

| # | Criterion | Severity |
|---|-----------|----------|
| 2.1 | Conversion focus — reader knows within 3 seconds what the ask is | Critical |
| 2.2 | CTA clarity — primary action is obvious | Critical |
| 2.3 | Headline/hook effectiveness | Critical |
| 2.4 | Compliance — no misleading claims | Critical |
| 2.5 | Benefits over features | Major |
| 2.6 | Specificity vs. vague claims | Minor |

Add your own criteria based on your service area and quality standards.
Rate each: **PASS** / **FAIL** / **N/A**]

#### Layer 3: Client-Specific Intelligence

[Define criteria that check against the specific client's preferences and rules. Examples:

| # | Criterion | Severity |
|---|-----------|----------|
| 3.1 | Brand voice match — tone matches client's profile | Major |
| 3.2 | Language and phrases — uses client's preferred vocabulary | Major |
| 3.3 | Client guardrails — respects stated constraints | Major |

Rate each: **PASS** / **FAIL** / **N/A**]

### Step 3: Determine Verdict

[Define your pass/fail thresholds. Example:

| Verdict | Condition |
|---------|-----------|
| **Ready to Send** | 0 Critical FAILs, ≤ 1 Major FAIL |
| **Needs Revisions** | 0 Critical FAILs, ≥ 2 Major FAILs |
| **Major Rework Needed** | ≥ 1 Critical FAIL |]

### Step 4: Deliver Review

## Output Format

```
## Review: [deliverable type] — [client name]
**Reviewed:** [date]
**Brief provided:** Yes / No

### Verdict: Ready to Send / Needs Revisions / Major Rework Needed

### Scorecard

**Layer 1: Brief Compliance**
- [PASS/FAIL/N/A] 1.1 [criterion]: [specific note]
...

**Layer 2: Quality Best Practices**
- [PASS/FAIL/N/A] 2.1 [criterion]: [specific note]
...

**Layer 3: Client Intelligence**
- [PASS/FAIL/N/A] 3.1 [criterion]: [specific note]
...

---

### What's Working
- [specific positive — acknowledge the good, be genuine]

### Issues to Fix

**Critical** (must fix before delivery):
- [criterion #] [issue] → [why it matters] → [specific suggested fix]

**Major** (should fix):
- [criterion #] [issue] → [why] → [specific fix]

**Minor** (nice to fix):
- [criterion #] [issue] → [why] → [specific fix]

### Optional Improvements
- [nice-to-have that doesn't block delivery]
```

## Notes

- Be specific: cite the exact issue and a concrete fix, not vague feedback
- Reference the standard you're checking against
- The output should be copy-paste ready for forwarding to the creative team
- If output needs structural work before QA, recommend `/copy-editing` (Seven Sweeps) first
- [Add your own QA methodology notes here]

## Related Skills

- `/copy-editing` — run Seven Sweeps BEFORE this review if output needs structural improvement
- `/brief` — generates the brief this review checks against
- `/email-sequence` — for full sequence copy, review each piece individually
