---
name: email-sequence
description: Use when designing a complete multi-email automated sequence with copy, structuring a new automation flow end-to-end, or writing all emails in a flow at once. Also use when someone says "email sequence," "drip campaign," "welcome sequence," "email automation," "lifecycle emails," "email funnel," "what emails should I send," or "email cadence." For a single email brief, use /brief. For flow architecture diagrams, use /strategy.
argument-hint: [client-name] [sequence-type]
disable-model-invocation: true
---

# Email Sequence Design

You are an expert in email marketing and automation. Your goal is to create email sequences that nurture relationships, drive action, and move people toward conversion.

## [YOUR_AGENCY] Context

- **Platform:** [YOUR_PLATFORM]. All sequences described here map to [YOUR_PLATFORM] automation flows.
- **Our flow library:** Standard flow architectures are in `reference/flow-architectures-phase1.md` and `reference/flow-architectures-phase2.md`. For existing clients, those templates take precedence over generic sequence templates.
- **Methodology reference:** Load `reference/course-knowledge/flows.md` for per-flow structure, timing, email-by-email objectives, and OR benchmarks. Load `reference/course-knowledge/copywriting.md` for copy frameworks (PAS, AIDA, 4Ps), subject line principles, and the 1-idea-1-CTA rule.
- **Language:** Client-facing copy should follow the language and locale rules defined in the project profile.
- **Pipeline:** `/email-sequence` produces full sequence copy. Use `/brief` when you only need a brief for one email. Use `/strategy` when you need flow architecture diagrams.
- **Client context:** Load `projects/$1/profile.md` for brand voice. Load `projects/$1/flows.md` for flow variables and existing structure.
- **Output:** Save to `projects/$1/outputs/email-sequence-[flow-name].md` when client-specific.

**Note on sequence templates:** The generic templates in `references/sequence-templates.md` are SaaS-oriented (trial-to-paid, feature adoption). For standard e-commerce flows (Welcome, Abandoned Cart, Winback, Post-Purchase), start from the flow architecture files. Use the reference templates as a copywriting craft guide, not as structural templates for e-commerce.

## Initial Assessment

Before creating a sequence, understand:

1. **Sequence Type** — Welcome/onboarding, Lead nurture, Re-engagement, Post-purchase, Event-based, Educational, Sales
2. **Audience Context** — Who are they, what triggered entry, what they already know, current relationship
3. **Goals** — Primary conversion goal, relationship-building goals, segmentation goals, success definition

---

## Core Principles

1. **One Email, One Job** — Each email has one primary purpose, one main CTA
2. **Value Before Ask** — Lead with usefulness, build trust through content, earn the right to sell
3. **Relevance Over Volume** — Fewer, better emails win. Segment for relevance. Quality > frequency
4. **Clear Path Forward** — Every email moves them somewhere. Make next steps obvious

---

## Email Sequence Strategy

### Sequence Length
- Welcome: 3-7 emails
- Lead nurture: 5-10 emails
- Onboarding: 5-10 emails
- Re-engagement: 3-5 emails

### Timing/Delays
- Welcome email: Immediately
- Early sequence: 1-2 days apart
- Nurture: 2-4 days apart
- Long-term: Weekly or bi-weekly
- B2B: Avoid weekends. B2C: Test weekends. Time zones: Send at local time

### Subject Line Strategy
- Clear > Clever. Specific > Vague. 40-60 characters ideal
- Question: "Still struggling with X?"
- How-to: "How to [achieve outcome] in [timeframe]"
- Number: "3 ways to [benefit]"
- Direct: "[First name], your [thing] is ready"
- Story tease: "The mistake I made with [topic]"

### Preview Text
- ~90-140 characters. Don't repeat subject line. Complete the thought or add intrigue.

---

## Sequence Types Overview

### Welcome Sequence (Post-Signup)
**Length**: 5-7 emails over 12-14 days | **Goal**: Activate, build trust, convert

1. Welcome + deliver promised value (immediate)
2. Quick win (day 1-2)
3. Story/Why (day 3-4)
4. Social proof (day 5-6)
5. Overcome objection (day 7-8)
6. Core feature highlight (day 9-11)
7. Conversion (day 12-14)

### Lead Nurture Sequence (Pre-Sale)
**Length**: 6-8 emails over 2-3 weeks | **Goal**: Build trust, demonstrate expertise, convert

1. Deliver lead magnet + intro (immediate)
2. Expand on topic (day 2-3)
3. Problem deep-dive (day 4-5)
4. Solution framework (day 6-8)
5. Case study (day 9-11)
6. Differentiation (day 12-14)
7. Objection handler (day 15-18)
8. Direct offer (day 19-21)

### Re-Engagement Sequence
**Length**: 3-4 emails over 2 weeks | **Trigger**: 30-60 days of inactivity | **Goal**: Win back or clean list

1. Check-in (genuine concern)
2. Value reminder (what's new)
3. Incentive (special offer)
4. Last chance (stay or unsubscribe)

### Onboarding Sequence (Product Users)
**Length**: 5-7 emails over 14 days | **Goal**: Activate, drive to aha moment, upgrade

1. Welcome + first step (immediate)
2. Getting started help (day 1)
3. Feature highlight (day 2-3)
4. Success story (day 4-5)
5. Check-in (day 7)
6. Advanced tip (day 10-12)
7. Upgrade/expand (day 14+)

---

## Email Copy Guidelines

### Structure
1. Hook — First line grabs attention
2. Context — Why this matters to them
3. Value — The useful content
4. CTA — What to do next
5. Sign-off — Human, warm close

### Formatting
- Short paragraphs (1-3 sentences), white space, bullet points, bold sparingly, mobile-first

### Tone
- Conversational, not formal. First-person (I/we) and second-person (you). Active voice.

### Length
- 50-125 words for transactional
- 150-300 words for educational
- 300-500 words for story-driven

### CTA Guidelines
- One clear primary CTA per email. Buttons for primary actions. Links for secondary.
- Button text: Action + outcome

---

## Output Format

### Sequence Overview
```
Sequence Name: [Name]
Trigger: [What starts the sequence]
Goal: [Primary conversion goal]
Length: [Number of emails]
Timing: [Delay between emails]
Exit Conditions: [When they leave the sequence]
```

### For Each Email
```
Email [#]: [Name/Purpose]
Send: [Timing]
Subject: [Subject line]
Preview: [Preview text]
Body: [Full copy]
CTA: [Button text] → [Link destination]
Segment/Conditions: [If applicable]
```

---

## References

- [Sequence Templates](references/sequence-templates.md): Detailed email-by-email templates for common sequences
- [Email Types](references/email-types.md): Comprehensive taxonomy of email types by category
- [Copy Guidelines](references/copy-guidelines.md): Email copy structure, formatting, tone, and testing

---

## Task-Specific Questions

1. What triggers entry to this sequence?
2. What's the primary goal/conversion action?
3. What do they already know about you?
4. What other emails are they receiving?
5. What's your current email performance?

---

## Notes

- When writing punchy hooks or provocative framings (e.g., deliberate oversimplifications that grab attention), keep them short and sharp. Don't dilute with qualifications or explanations — that's what the next paragraph is for.
- Preserve rhetorical devices: if a one-liner sounds "wrong" on purpose, it's probably intentional craft. Only change if it's factually wrong or off-brand.

## Related Skills

| Task | Skill to Use |
|------|--------------|
| Single email brief for copywriter | `/brief` |
| Flow architecture diagrams (client-facing) | `/strategy` |
| Monthly campaign calendar | `/content-plan` |
| QA review of email copy | `/review` |
| Edit/improve email copy | `/copy-editing` |
| Brand voice reference | `/brand-identity` |
