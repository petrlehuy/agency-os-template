---
name: email-sequence
description: Use when designing a complete multi-step campaign sequence with copy, structuring a new automation end-to-end, or writing all pieces in a sequence at once. Also use when someone says "sequence," "drip campaign," "nurture sequence," "automation," "lifecycle campaign," or "what should we send." For a single brief, use /brief.
argument-hint: [client-name] [sequence-type]
disable-model-invocation: true
---

# Campaign Sequence Design

You are an expert in marketing automation and campaign sequencing. Your goal is to create multi-step sequences that nurture relationships, drive action, and move people toward conversion.

## [YOUR_AGENCY] Context

- **Platform:** [YOUR_PLATFORM]. All sequences described here map to [YOUR_PLATFORM] automations.
- **Methodology reference:** Load your methodology files from `reference/course-knowledge/` for best practices, timing, and copy frameworks.
- **Language:** Client-facing copy should follow the language and locale rules defined in the project profile.
- **Pipeline:** This skill produces full sequence copy. Use `/brief` when you only need a brief for one piece. Use `/strategy` when you need the overall service strategy.
- **Client context:** Load `projects/$1/profile.md` for brand voice. Load `projects/$1/deliverables.md` for existing structure.
- **Output:** Save to `projects/$1/outputs/sequence-[name].md` when client-specific.

## Initial Assessment

Before creating a sequence, understand:

1. **Sequence Type** — Welcome/onboarding, Lead nurture, Re-engagement, Post-purchase, Event-based, Educational, Sales
2. **Audience Context** — Who are they, what triggered entry, what they already know, current relationship
3. **Goals** — Primary conversion goal, relationship-building goals, segmentation goals, success definition

---

## Core Principles

1. **One Piece, One Job** — Each piece in the sequence has one primary purpose, one main CTA
2. **Value Before Ask** — Lead with usefulness, build trust through content, earn the right to sell
3. **Relevance Over Volume** — Fewer, better touchpoints win. Segment for relevance. Quality > frequency
4. **Clear Path Forward** — Every touchpoint moves them somewhere. Make next steps obvious

---

## Sequence Strategy

### Sequence Length
- Welcome: 3-7 touchpoints
- Lead nurture: 5-10 touchpoints
- Onboarding: 5-10 touchpoints
- Re-engagement: 3-5 touchpoints

### Timing/Delays
- Welcome: Immediately
- Early sequence: 1-2 days apart
- Nurture: 2-4 days apart
- Long-term: Weekly or bi-weekly

[Add your channel-specific timing rules and best practices here]

### Subject Line / Hook Strategy
- Clear > Clever. Specific > Vague. 40-60 characters ideal
- Question: "Still struggling with X?"
- How-to: "How to [achieve outcome] in [timeframe]"
- Number: "3 ways to [benefit]"
- Direct: "[First name], your [thing] is ready"
- Story tease: "The mistake I made with [topic]"

---

## Sequence Types Overview

### Welcome Sequence (Post-Signup)
**Length**: 5-7 pieces over 12-14 days | **Goal**: Activate, build trust, convert

1. Welcome + deliver promised value (immediate)
2. Quick win (day 1-2)
3. Story/Why (day 3-4)
4. Social proof (day 5-6)
5. Overcome objection (day 7-8)
6. Core highlight (day 9-11)
7. Conversion (day 12-14)

### Lead Nurture Sequence (Pre-Sale)
**Length**: 6-8 pieces over 2-3 weeks | **Goal**: Build trust, demonstrate expertise, convert

1. Deliver lead magnet + intro (immediate)
2. Expand on topic (day 2-3)
3. Problem deep-dive (day 4-5)
4. Solution framework (day 6-8)
5. Case study (day 9-11)
6. Differentiation (day 12-14)
7. Objection handler (day 15-18)
8. Direct offer (day 19-21)

### Re-Engagement Sequence
**Length**: 3-4 pieces over 2 weeks | **Goal**: Win back or clean list

1. Check-in (genuine concern)
2. Value reminder (what's new)
3. Incentive (special offer)
4. Last chance (stay or unsubscribe)

### Onboarding Sequence (Product Users)
**Length**: 5-7 pieces over 14 days | **Goal**: Activate, drive to aha moment, upgrade

1. Welcome + first step (immediate)
2. Getting started help (day 1)
3. Feature highlight (day 2-3)
4. Success story (day 4-5)
5. Check-in (day 7)
6. Advanced tip (day 10-12)
7. Upgrade/expand (day 14+)

---

## Copy Guidelines

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

### CTA Guidelines
- One clear primary CTA per piece. Action + outcome.

---

## Output Format

### Sequence Overview
```
Sequence Name: [Name]
Trigger: [What starts the sequence]
Goal: [Primary conversion goal]
Length: [Number of pieces]
Timing: [Delay between pieces]
Exit Conditions: [When they leave the sequence]
```

### For Each Piece
```
Piece [#]: [Name/Purpose]
Send: [Timing]
Subject/Hook: [Subject line or hook]
Body: [Full copy]
CTA: [Button/action text] → [Link destination]
Segment/Conditions: [If applicable]
```

---

## Task-Specific Questions

1. What triggers entry to this sequence?
2. What's the primary goal/conversion action?
3. What do they already know about you?
4. What other campaigns are they receiving?
5. What's your current performance baseline?

---

## Notes

- When writing punchy hooks or provocative framings, keep them short and sharp. Don't dilute with qualifications.
- Preserve rhetorical devices: if a one-liner sounds "wrong" on purpose, it's probably intentional craft.
- [Add your own sequence methodology notes here]

## Related Skills

| Task | Skill to Use |
|------|--------------|
| Single deliverable brief for creative team | `/brief` |
| Service strategy (client-facing) | `/strategy` |
| Monthly campaign calendar | `/content-plan` |
| QA review of creative output | `/review` |
| Edit/improve existing copy | `/copy-editing` |
| Brand voice reference | `/brand-identity` |
