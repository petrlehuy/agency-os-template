---
name: review
description: QA review of copywriter output against email best practices, brief compliance, and client-specific standards. Use after copy-editing and before design handoff. Also invoke when someone says "review this copy," "QA this email," "check this against the brief," or "is this ready to send."
argument-hint: [client-name]
disable-model-invocation: true
---

# QA Review — Email Copy

Production pipeline position: Brief (`/brief`) → Copy (cooperator) → Copy Editing (`/copy-editing`) → **QA Review (this skill)** → Design → Client Approval → Implement in Klaviyo

## Files to Load

1. `reference/quality-standards.md` — QA checklist + copy standards
2. `reference/email-strategy.md` — strategic lens: what converts, Czech market context, lessons learned
3. `reference/course-knowledge/copywriting.md` — copy frameworks (PAS, AIDA, 4Ps), subject line principles, 1-idea-1-CTA, specificity standard, research process
4. `projects/$1/profile.md` — brand voice, tone, segments, performance patterns

Load all three before starting. If client not specified via argument, ask for the client name first.

## Steps

### Step 1: Collect Inputs

Ask for anything not already provided:
- The copywriter's output (paste or file path)
- The original brief (if available — enables Layer 1 brief compliance check)
- Client name (if not given via argument)

If the brief is not available, skip Layer 1 and note it in the output.

### Step 2: Run Three-Layer Review

#### Layer 1: Brief Compliance (skip if no brief provided)

| # | Criterion | Severity |
|---|-----------|----------|
| 1.1 | Goal delivery — copy achieves the stated brief objective | Critical |
| 1.2 | Required elements present — discount codes, products, CTAs, links | Critical |
| 1.3 | Audience match — tone and content fit the target segment | Major |
| 1.4 | Length and format — matches brief specifications | Minor |

Rate each: **PASS** / **FAIL** / **N/A**

#### Layer 2: Email Best Practices

Use the QA checklist from `reference/quality-standards.md`. Check in this order (highest impact first):

| # | Criterion | Severity |
|---|-----------|----------|
| 2.1 | Conversion focus — reader knows within 3 seconds what the ask is | Critical |
| 2.2 | CTA placement — one primary CTA, at minimum above the fold | Critical |
| 2.3 | Subject line — 30-50 chars, mobile preview, interesting/personal/unorthodox | Critical |
| 2.4 | Compliance — unsubscribe mechanism, no misleading claims | Critical |
| 2.5 | Preview text — complements subject, does not repeat it | Major |
| 2.6 | Hook — ATF grabs attention within first 1-2 lines | Major |
| 2.7 | Triangle structure — hook → support → CTA | Major |
| 2.8 | Sell the click — email drives to site, doesn't try to close in inbox | Major |
| 2.9 | Benefits over features — lead with what the reader gains | Major |
| 2.10 | Czech market calibration — authentic and clever, not US-aggressive | Major |
| 2.11 | CTA copy — specific, action-oriented, not generic ("Nakoupit") | Major |
| 2.12 | Write for 1 person — personal address, not "dear customers" | Minor |
| 2.13 | Copy length appropriate for email type | Minor |
| 2.14 | Specifics vs. vague claims — "přes 475 hodnocení" not "oblíbený produkt" | Minor |
| 2.15 | Mobile-friendly — short paragraphs, easy to scan | Minor |

Rate each: **PASS** / **FAIL** / **N/A**

#### Layer 3: Client-Specific Intelligence

Using `projects/$1/profile.md` and `reference/email-strategy.md` Section 7 (Lessons Learned):

| # | Criterion | Severity |
|---|-----------|----------|
| 3.1 | Brand voice match — tone matches client's profile | Major |
| 3.2 | Language and phrases — uses client's preferred vocabulary, avoids no-go words | Major |
| 3.3 | Conversion pattern match — this content type works for this client | Minor |
| 3.4 | Client guardrails — respects promo frequency cap, brand positioning, segment rules | Major |

Rate each: **PASS** / **FAIL** / **N/A**

### Step 3: Determine Verdict

Count failures by severity:

| Verdict | Condition |
|---------|-----------|
| **Ready to Send** | 0 Critical FAILs, ≤ 1 Major FAIL |
| **Needs Revisions** | 0 Critical FAILs, ≥ 2 Major FAILs |
| **Major Rework Needed** | ≥ 1 Critical FAIL |

### Step 4: Deliver Review

## Output Format

```
## Review: [email type] — [client name]
**Reviewed:** [date]
**Brief provided:** Yes / No

### Verdict: Ready to Send / Needs Revisions / Major Rework Needed

### Scorecard

**Layer 1: Brief Compliance**
- [PASS/FAIL/N/A] 1.1 Goal delivery: [specific note]
- [PASS/FAIL/N/A] 1.2 Required elements: [specific note]
- [PASS/FAIL/N/A] 1.3 Audience match: [specific note]
- [PASS/FAIL/N/A] 1.4 Length/format: [specific note]

**Layer 2: Email Best Practices**
- [PASS/FAIL/N/A] 2.1 Conversion focus (Critical): [specific note]
- [PASS/FAIL/N/A] 2.2 CTA placement (Critical): [specific note]
- [PASS/FAIL/N/A] 2.3 Subject line (Critical): [specific note]
- [PASS/FAIL/N/A] 2.4 Compliance (Critical): [specific note]
- [PASS/FAIL/N/A] 2.5 Preview text (Major): [specific note]
- [PASS/FAIL/N/A] 2.6 Hook (Major): [specific note]
- [PASS/FAIL/N/A] 2.7 Triangle structure (Major): [specific note]
- [PASS/FAIL/N/A] 2.8 Sell the click (Major): [specific note]
- [PASS/FAIL/N/A] 2.9 Benefits over features (Major): [specific note]
- [PASS/FAIL/N/A] 2.10 Czech market (Major): [specific note]
- [PASS/FAIL/N/A] 2.11 CTA copy (Major): [specific note]
- [PASS/FAIL/N/A] 2.12 Write for 1 person (Minor): [specific note]
- [PASS/FAIL/N/A] 2.13 Copy length (Minor): [specific note]
- [PASS/FAIL/N/A] 2.14 Specifics (Minor): [specific note]
- [PASS/FAIL/N/A] 2.15 Mobile-friendly (Minor): [specific note]

**Layer 3: Client Intelligence**
- [PASS/FAIL/N/A] 3.1 Brand voice: [specific note]
- [PASS/FAIL/N/A] 3.2 Language/phrases: [specific note]
- [PASS/FAIL/N/A] 3.3 Conversion pattern: [specific note]
- [PASS/FAIL/N/A] 3.4 Client guardrails: [specific note]

---

### What's Working
- [specific positive — acknowledge the good, be genuine]

### Issues to Fix

**Critical** (must fix before send):
- [criterion #] [issue] → [why it matters] → [specific suggested fix with example language]

**Major** (should fix):
- [criterion #] [issue] → [why] → [specific fix]

**Minor** (nice to fix):
- [criterion #] [issue] → [why] → [specific fix]

### Optional Improvements
- [nice-to-have that doesn't block sending]
```

## Notes

- Be specific: "Subject line is 61 characters — cut to under 50 for mobile preview" not "subject line too long"
- Reference the standard you're checking against (cite quality-standards.md or email-strategy.md section)
- The output should be copy-paste ready for forwarding to the copywriter
- If copy needs structural work before QA, recommend `/copy-editing` (Seven Sweeps) first
- Default sending segment is Engaged 90D unless the brief specifies otherwise
- Check `email-strategy.md` Section 7 (Lessons Learned) for client-specific conversion patterns
- For non-discount emails: check for structural fixes from email-strategy.md Section 1 (social proof early, CTA near top, "reason to act now")

## Related Skills

- `/copy-editing` — run Seven Sweeps BEFORE this review if copy needs structural improvement
- `/brief` — generates the brief this review checks against
- `/email-sequence` — for full flow copy, review each email individually
