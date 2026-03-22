---
name: content-plan
description: Generate monthly content ideas and a campaign calendar for a client. Use when planning campaigns, creating a content calendar, or preparing a monthly campaign plan.
argument-hint: [client-name] [month]
disable-model-invocation: true
---

## What This Skill Does

Generates a monthly campaign calendar and brainstorming overview for a specific client and month. Used internally by the AM to prep for strategic calls and plan execution.

**This is an internal document** — for AM use, not sent directly to the client. It may be shown at the strategic call as a discussion starting point, but campaigns are managed in Freelo.

**Production context:** The content plan feeds into `/call-prep` for strategic call prep. Individual campaigns from the plan get briefed via `/brief`.

**Default mode:** Planning one month ahead (buffer before strategic call). Output labeled "Draft pro strategický call."

**Post-call adjustment mode:** `/content-plan adjust [client] [month]` — see Step 6.

## Files to Load

1. `reference/course-knowledge/campaigns.md` (campaign strategy — content mix, frequency, seasonal calendar, what converts, booster)
2. `reference/email-strategy.md` (strategic lens — non-discount structure, proven patterns, market insights, lessons learned)
3. `reference/sops/campaigns-30-ideas.md` (30 proven campaign types — use these as the source of campaign ideas, not generic brainstorming)
4. `reference/benchmarks.md` (industry benchmarks for performance context)
5. `projects/$1/profile.md` (brand, voice, products, what works, seasonal patterns)
6. Most recent audit for this client — find it by checking `projects/$1/outputs/` for the latest `audit*.html` or `audit*.md`. If multiple exist, take the most recent by date in filename. Load it for performance data and insights.
7. `reference/html-templates/audit.html` (visual design reference — copy CSS, SVG logos, and component patterns from this file)

## Steps

### Step 0: Determine Target Month

Parse arguments: `$1` = client name, `$2` = month (optional).

**If month is not provided:** Default to next calendar month from today's date. State: "Planning for [Month Year] — one month ahead."

### Step 1: Seasonal Event Assessment + Offer Logic

**This is the most important step. Run it before building anything.**

**Evaluate the target month for known seasonal events** from the market calendar relevant to your clients:

| Month | Major events |
|-------|-------------|
| January | New Year |
| February | Valentine's Day (14/2) |
| March | International Women's Day (8/3) |
| April | Easter |
| May | Mother's Day (2nd Sunday) |
| June | — |
| July–August | Summer slow season |
| September | Back to school |
| October | — |
| November | Black Friday |
| December | Christmas / Holiday season |

*Customize this calendar to your market and client base.*

**If a major seasonal event exists in the target month:**

→ The client will almost certainly run an all-channel campaign for it. Do NOT invent a separate subscriber offer.

→ Instead, note the event and ask:
> "Co plánujete na [event]? Jaká bude nabídka / akce na webu a sociálních sítích?"

→ Once you know (or assume) what the client plans, think about how to position it optimally in email:
- **Proven tactic — early access teaser:** Plain text email to subscribers ("Tohle posílám jen vám. [Akce] jde za 48h do světa — ale ty máš přístup teď.") → subscribers get a head start before public launch. Proven to work for Black Friday, Valentine's, and any major sale.
- **Subscriber-first framing:** Even if it's the same offer as on the website, email subscribers get it first. That exclusivity is the value.
- **Timing layering:** Teaser email (early access) → main launch email → follow-up/urgency email. 3 touchpoints around one event.

**If no major seasonal event in the target month:**

→ Propose a creative subscriber-exclusive offer. These are offers that only exist for people on the email list — not on the website, not on social media.

**Proven creative offer types (use these as inspiration, adapt to client):**

| Type | How it works |
|------|-------------|
| **Kredit kampaň** | Plain text email: "Máš [X] Kč kreditu dostupného v obchodě — platí 3 dny." The "credit" IS a discount code, just framed differently. Feels personal and surprising. Extremely high-converting. |
| **Replenishment segment** | Identify customers who bought product X but haven't reordered within the expected cycle (e.g., paste users who haven't reordered in 90 days). Send them a "Dochází ti [produkt]?" email with an exclusive offer. Very high CVR because it's perfectly timed. |
| **VIP founder appreciation** | Segment top 10% of customers by revenue. Founder records a personal selfie-style video or writes a plain text email: "Tohle jsme poslali jen [X] lidem." Exclusive discount code. Very exclusive, very personal. |
| **Early access to new product** | Subscribers see a new product/flavor/collab before it goes public. No discount needed — the exclusivity is the value. |
| **Subscriber-only flash sale** | 24-48h window, only in email, never advertised on other channels. "Kdo ví, tak ví." |

State the chosen offer clearly and justify it in 1-2 sentences.

### Step 2: Gather Additional Inputs

Ask the AM:
- **Any specific launches, collaborations, or events** this month
- **Anything from the audit** that should drive the content focus (low click rate → CTA placement. Low engagement → pattern interrupt campaign.)
- **Campaign frequency** (confirm from profile: Essential = 1/week → 4–5 campaigns/month, Growth = 2-3/week → 8–10 campaigns/month)

If audit data is loaded, surface the most relevant insight here automatically. Example: "Audit shows click rate at 0,40 % — below 0,5 % benchmark. Content plan should prioritize campaigns with stronger CTA placement."

**If generating without AM input:** Proceed with assumptions from profile.md. Note what's assumed: "Předpokládám, že [X] — AM prosím potvrď před call." Include in Section 1 (blue callout) rather than blocking generation.

### Step 3: Seasonal Hooks

Based on the target month, identify 1-2 seasonal angles relevant to your market (from campaigns.md):
- These become candidates in the calendar — AM decides which to use
- If a major event was identified in Step 1, this step expands on how to leverage it in email specifically

### Step 4: Generate Monthly Overview + Campaign Calendar

**Monthly overview:**
- Key dates and events for the month
- Recommended campaign mix (promo vs. educational vs. social proof vs. storytelling)
- Tie to what works for this client (from profile "What Works" + audit insights)
- Reference any lessons from previous audits: "Last month's X campaign got Y% CVR — repeat the angle/format"

**Campaign calendar table — 4 columns:**

| # | Datum | Typ | Popis kampaně |
|---|-------|-----|---------------|

**Badge CSS classes (use exactly these in the Typ cell):**
```html
<span class="badge seasonal">Sezónní</span>         <!-- seasonal events, promos -->
<span class="badge edu">Vzdělávací ✦</span>          <!-- educational with conversion structure -->
<span class="badge social">Social proof</span>       <!-- reviews, testimonials -->
<span class="badge social">UGC</span>                <!-- user-generated content -->
<span class="badge retention">Retention</span>       <!-- replenishment, win-back, VIP -->
<span class="badge editorial">Editoriál</span>       <!-- bestsellers, seasonal roundups -->
```

**A/B tag — only on campaigns participating in a monthly test:**
```html
<span class="ab-tag">A/B: Test 1</span>
<span class="ab-tag">A/B: Test 2</span>
```
Only campaigns that are part of one of the 2–3 monthly A/B tests get a tag. The tag references the test number defined in Section 5. Campaigns not participating in any test have no tag. Do NOT add a tag to every campaign.

**Popis kampaně column format:**
```html
<strong>Název kampaně</strong>
<small>Angle a pozicování — proč tato kampaň funguje, jaká emoce nebo přístup ji táhne. 1–2 věty. Žádné instrukce k provedení, žádné zmínky o segmentu nebo CTA.</small>
```
The `<small>` is angle/positioning only — why this campaign is good, what emotion or brand story it taps into. Not how to execute it. No subject line suggestions, no segment logic, no CTA instructions — those belong in `/brief`.

**After the table:** Always add a note line:
```html
<p class="note">✦ Vzdělávací kampaně s konverzní strukturou — podrobné zadání ve /brief. &nbsp;&nbsp;|&nbsp;&nbsp; A/B: kampaně označené Test 1/2 jsou součástí měsíčních testů — detaily v sekci 5. AM rozhoduje, které spustit.</p>
```

**Pull campaign ideas primarily from `campaigns-30-ideas.md`** — use the proven types (FAQ, recenze, founder story, replenishment, UGC, early access, credits, mýty vs. fakta, jak používat, bestsellery, teasery, vzkaz od foundera, etc.) adapted to the client's context and products. Don't brainstorm generic ideas when proven types exist.

### Step 5: Strategy Rationale + A/B Tests

**Rationale (1 dark callout):** Why this mix — tie to client goals, audit insights, and what works. Max 5 bullet points.

**A/B tests — 2–3 monthly tests:**

Define 2–3 A/B tests for the month. Each test runs across **multiple campaigns** (ideally 3–5) to build statistical significance — not 1 test per campaign. Include a short intro:

> "Navrhujeme [X] testy na [měsíc]. Každý běží napříč více kampaněmi, aby se dosáhlo statistické signifikance — AM rozhoduje, které spustit a aktivně sleduje výsledky."

For each test, use a `callout green` box with these 4 fields:
- **callout-title:** "A/B Test [N] — [Short name]: [Varianta A] vs. [Varianta B]"
- **Co plánujeme:** which campaigns (by number) participate, what the variable is, what stays constant
- **Hypotéza:** what you expect to happen and why — grounded in the brand or audit data
- **Co sledujeme:** what insight the result will unlock (beyond just the number)
- **Optimalizujeme:** the primary metric (open rate / click rate / CVR / RPR)

**Test selection logic:** Pick tests that are:
1. **Actionable** — the variable can be cleanly isolated across campaigns
2. **Informative** — the result shapes future decisions beyond this month
3. **Grounded** — tied to an audit insight or a known brand hypothesis

Good recurring test types: předmět tón (senzorický vs. přímý), CTA umístění (nahoře vs. dole), formát obsahu (vizuální vs. plain text), délka emailu (krátký vs. rozvinutý), urgence typ (čas vs. množství).

### Step 6: Post-Call Adjustment Mode

**Triggered by:** `/content-plan adjust [client] [month]` or "adjust the content plan based on [call notes]"

1. Load existing plan from `projects/$1/outputs/content-plan-[month].html`
2. Ask AM for call notes: what was confirmed, what changed, what's added or removed
3. Apply changes to the calendar and rationale
4. Output explanation of what changed
5. Save revised version as `projects/$1/outputs/content-plan-[month]-v2.html`
6. Copy to `reports/[client-slug]/content-plan-[month]-[year]-v2.html`

## Output

Save as `projects/$1/outputs/content-plan-$2.html`

Normalize the month to lowercase English (e.g., `content-plan-april.html`).

Also copy to `reports/[client-slug]/content-plan-[month]-[year].html` for Vercel deployment.

### Output Format: Branded HTML — Audit Visual Style

Copy the full CSS and SVG logos from `reference/html-templates/audit.html`. The content-plan is part of the same document family as the audit — they must look identical in structure and typography.

**CSS additions specific to content-plan (add to the audit CSS base):**
```css
/* Campaign type badges */
.badge.seasonal  { background: var(--orange-bg); color: #C07A20; }
.badge.edu       { background: var(--blue-bg); color: var(--accent); }
.badge.social    { background: var(--green-bg); color: var(--green); }
.badge.retention { background: #F5F0FF; color: #7C3AED; }
.badge.editorial { background: var(--bg-light); color: var(--muted); }

/* A/B tag */
.ab-tag { display: inline-block; background: var(--highlight); color: #8B7A1A; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 20px; margin-top: 4px; }

/* Draft badge in header */
.draft-badge { display: inline-block; background: var(--highlight); color: #8B7A1A; font-size: 12px; font-weight: 700; padding: 3px 12px; border-radius: 20px; margin-top: 12px; }

/* Ask blockquote (seasonal event question) */
blockquote { border-left: 3px solid #C07A20; padding: 10px 16px; margin: 14px 0; font-style: italic; font-size: 15px; color: var(--text); background: rgba(246, 173, 85, 0.12); border-radius: 0 8px 8px 0; }

/* Table cell descriptions */
.data-table td small { font-size: 12px; color: var(--muted); display: block; margin-top: 3px; line-height: 1.45; }
```

**Header:** Black SVG logo (copy from audit.html) + `doc-label` = "Plán kampaní — Interní dokument" + `h1` = "[Client] — [Month] [Year]" + `subtitle` + `meta` line (package, segment, author, date) + `<div class="draft-badge">Draft pro strategický call</div>`

**Footer:** Dark background, white SVG logo (copy from audit.html), footer-meta = "[Month Name] [Year] | [YOUR_DOMAIN]"

**No campaign detail cards** — this is a calendar overview, not a detailed brief.

Generate a **complete, self-contained HTML file** with all CSS inline in a `<style>` tag.

**Write in the client's language following any locale-specific style rules defined in the project profile.**

## Document Structure

```
Header
  └── black SVG logo + doc-label "Plán kampaní — Interní dokument"
      + h1 "[Client] — [Month] [Year]"
      + subtitle "Měsíční kampaňový plán"
      + meta (package | segment | author | date)
      + draft-badge "Draft pro strategický call"

0. Nabídka / Sezónní příležitost
   → Major event month: callout.orange
     ├── callout-title: "Sezónní událost: [Event] ([Date])"
     ├── context paragraph
     ├── <blockquote>Co plánujete na [event]? Jaká bude nabídka / akce na webu a SoMe?</blockquote>
     └── early access tactic as <ul> with 3 bullets (teaser → launch → urgency)
   → Quiet month: callout.blue
     └── proposed subscriber-exclusive offer + 1-sentence justification

1. Klíčové příležitosti měsíce
   ├── callout.yellow — key dates as <ul>
   └── callout.blue — performance context (audit insight OR "audit not available" note)

2. Mix kampaní
   └── kpi-grid (3 cards) — campaign type counts with kpi-delta describing what's included
       + <p class="note"> explaining ✦ mark

3. Kampaňový kalendář
   └── data-table (4 columns only: # | Datum | Typ | Popis kampaně)
       ├── Typ cell: badge + optional <span class="ab-tag">A/B: Test N</span> (only if campaign participates in a monthly test)
       └── Popis kampaně cell: <strong>name</strong> + <small>angle/positioning description — why this campaign works, what emotion it taps. No implementation notes, no subject lines, no segment info.</small>
       + <p class="note"> after table

4. Proč tento mix
   └── callout.dark — 5 bullets max, ties each decision to client data / methodology

5. A/B testy
   ├── short intro paragraph stating number of tests and that each runs across multiple campaigns
   └── 2–3 callout.green boxes (one per monthly test)
       ├── callout-title: "A/B Test N — [Short name]: [A] vs. [B]"
       ├── Co plánujeme: which campaigns participate, what the variable is
       ├── Hypotéza: expected outcome + why, grounded in brand/audit
       ├── Co sledujeme: what the result will unlock for future decisions
       └── Optimalizujeme: [primary metric]

Footer
  └── dark bg + white SVG logo + "[Month] [Year] | [YOUR_DOMAIN]"
```

## Pre-Send Document Review

After generating the content-plan HTML, run the Document Review loop before presenting to the AM.

**The loop:**
1. Run Document Review (reviewer agent, Document Review mode) on the generated HTML
2. For each Category A/C FAIL → auto-fix in the HTML (these are clear-cut — don't ask, just fix)
3. For each Category B flag → ask the AM the targeted question → AM confirms keep or fix
4. For each Category D WARN → include in the review report for AM awareness
5. Re-run review on the updated document
6. Repeat until VERDIKT = "Připraveno k odeslání"
7. Then open in Chrome / offer PDF export

The AM only gets asked Category B questions — they never manually fix anything. The reviewer + skill handle all edits.

## Notes

- Campaign ideas should come from `campaigns-30-ideas.md` first — these are proven types
- Max 1 sitewide discount email per month (except Q4). Subscriber-exclusive offers are separate.
- Always reference audit data when available — "Audit ukazuje X → proto volíme Y"
- The educational email structural requirements (CTA early, social proof early, reason to act now) belong in the `/brief` — not here. Just mark with ✦ in the calendar.
- The calendar table has NO subject lines and NO segment column. Subject lines are the copywriter's job (briefed via `/brief`). Segments are operational detail for platform setup.
- The `<small>` description in the Popis cell is angle/positioning only — the "why" and "what emotion". Never the "how."
- A/B tests: 2–3 per month, each spanning multiple campaigns for statistical significance. Not 1 per campaign.
- This document is shown at the strategic call and adjusted together with the client. Keep it clean and scannable.

## Related Skills

- `/call-prep` — loads this content plan as input for strategic call agenda
- `/brief` — generates copywriter briefs for individual campaigns (including educational structure)
- `/audit` — source of performance data referenced in the plan
