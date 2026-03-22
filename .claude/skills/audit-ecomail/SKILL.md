---
name: audit-ecomail
description: Email marketing audit for Ecomail clients. Use for onboarding audits or recurring health checks on Ecomail.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a client-facing email marketing audit for clients on the Ecomail platform. Same 9-section HTML output as the Klaviyo audit, adapted for Ecomail's data availability and limitations.

**Context:** This skill works in two modes:
- **Onboarding audit** — First-time assessment of a client's Ecomail setup. Audit of THEIR previous work, not ours.
- **Recurring audit** — Periodic health check of OUR work managing the client on Ecomail.

The skill detects which mode based on whether a previous audit exists.

**Tone difference:**
- **Onboarding:** Be direct and transparent about what's wrong. The client hired us because something needs to change. Don't soften findings to protect anyone's reputation — this is our honest assessment of the current state.
- **Recurring:** Lead with wins, frame gaps constructively. This is our work being evaluated — balance honesty with progress narrative.

**Platform stance:** Never bash Ecomail or push migration. Be factually transparent about platform limitations, but frame them as constraints we work within — not reasons to leave. If the client is staying on Ecomail, all recommendations must be Ecomail-native.

**Revenue projections:** Never promise specific revenue amounts (e.g., "přinese 200–400 tis. Kč"), percentage targets (e.g., "posuneme na 25 %"), or any concrete financial outcomes. Underpromise, overdeliver. Describe the opportunity qualitatively ("výrazně zvýší podíl", "zachytí revenue, které teď odchází") — never quantitatively. Do NOT reference GA4 or Google Analytics as a data source.

**When to use this vs. `/audit`:** Use `/audit-ecomail` when the client's `profile.md` shows `Email platform: Ecomail`. Use `/audit` for Klaviyo clients.

**Data collection philosophy:** Hybrid approach — API for what's fast and reliable, AM for what's faster to look up in the Ecomail dashboard, estimation for automation period stats.

## Files to Load

1. `reference/audit-checklist.md` (audit criteria + benchmarks)
2. `reference/email-strategy.md` (strategic interpretation lens)
3. `reference/flow-architectures-phase1.md` (standard flow structures — for gap analysis)
4. `projects/$1/profile.md` (project profile)
5. `projects/$1/outputs/internal-brief.md` (if exists — red flags and priorities)
6. `projects/$1/outputs/audit.html` (if exists — previous audit for comparison)
7. `reference/html-templates/audit.html` (HTML formatting reference)

## Steps

### 1. Determine Audit Mode

Check if `projects/$1/outputs/audit.html` exists:

**If previous audit exists (Recurring mode):**
- Note the date and key findings from the previous audit
- This audit will compare current state against previous findings
- Ask the AM what has changed since the last audit

**If no previous audit (Onboarding mode):**
- The project profile should exist from `/onboard` or manual AM setup
- If the profile doesn't exist, ask the AM if they've run `/onboard` first

### 2. Gather Context from AM

Present a clear list of what's needed, with exact dashboard navigation:

```
Before I run the export, I need a few things from you. These take ~2 minutes to look up:

1. AUDIT PERIOD
   What timeframe should we audit?
   → Onboarding default: last 3 months (recent picture) or last 12 months (full history)
   → Recurring default: last month or last 3 months

2. ECOMAIL PLAN TIER
   Essential or Marketer+? (Marketer+ has revenue/conversion tracking)

3. SUBSCRIBER GROWTH
   → Ecomail → Kontakty → [main list] → look at subscriber count
   → Or just tell me: "3 months ago we had ~X subscribers, now ~Y"
   → If you can screenshot the growth chart from the dashboard, even better

4. POPUP/FORM DATA
   → Ecomail does NOT track popup submit rates natively
   → What popup tool are you using? (Ecomail built-in, external tool, none?)
   → Any conversion data available from that tool?
   → If no data, we'll note it as a platform limitation

5. TOTAL STORE REVENUE
   → From UpGates admin, Shopify admin, or other e-shop analytics
   → Current period + previous period of same length (for comparison)

6. AUTOMATION LAUNCH DATES (optional)
   → When were each automation created/launched?
   → I'll list the automation names after running the API export
   → If you don't know, I'll estimate from available data

7. PLATFORM DECISION
   → Is this client staying on Ecomail, or migrating to another ESP?
   → If migrating: which platform? (Klaviyo, Mailchimp, etc.)
   → If staying: audit will focus on maximizing Ecomail capabilities

8. KNOWN ISSUES OR FOCUS AREAS
   → Anything specific you want me to check or highlight?
```

Wait for AM responses before proceeding. Not everything is required — work with what's provided.

### 3. Run Ecomail API Export

Check `.env` for `[CLIENT]_ECOMAIL_API_KEY` or `ECOMAIL_API_KEY`.

Run the export tool:

```bash
python3 tools/ecomail-export.py $1 --period [days] --top 3
```

Options:
- `--period 365` for full year (onboarding), `--period 90` for last 3 months (recurring)
- `--compare` to also fetch comparison period campaigns
- `--top 3` selects top 3 by revenue + bottom 3 by engagement + 3 most recent for template download (default, max ~9 templates)
- `--skip-templates` to skip template downloads entirely

This saves to `projects/$1/data/ecomail-export.json` containing:
- **Lists:** subscriber counts, segments defined
- **Campaigns:** per-campaign stats (recipients, opens, clicks, bounces, unsubs, conversions, revenue) + `archive_url` + `template_id`
- **Automations:** per-automation all-time stats + per-email step breakdowns
- **Summary:** totals for quick reference
- **Compare campaigns:** (if `--compare` used) previous period campaigns

Also saves to `projects/$1/data/templates/`:
- Raw HTML for selected campaigns' email templates (for content analysis)

Read the export file and note:
- Total subscribers across lists
- Campaign count and aggregate performance
- Which automations are active (triggered > 0) vs. inactive
- Total campaign revenue and automation revenue (if Marketer+)
- Which campaigns were selected for content analysis

After reading the export, present the automation names to the AM and ask about launch dates (Step 2, item 6) if not already provided.

**API call budget:** ~36 calls for a typical client, ~125 for large clients. No pagination. Completes in <30 seconds.

**Data source mapping:**

| Audit section | Data source |
|---------------|-------------|
| 1. Executive Summary | Export summary + AM (store revenue, growth context) |
| 2. Revenue & Attribution | Export (campaign + automation revenue) + AM (store revenue) |
| 3. Deliverability & Sending | Export (campaign + automation delivery stats) |
| 4. Flows/Automations | Export (automation stats) + flow-architectures-phase1.md (gap analysis) |
| 5. Campaigns | Export (per-campaign stats) + content analysis |
| 6. Database Growth | AM (subscriber counts, growth narrative) + Export (segments) |
| 7. Focus for Next Month | Analysis of all above |
| 8. A/B Test Ideas | Analysis + content findings |

### 4. Content & Creative Analysis

Analyze actual email content — not just metrics. This is the differentiator.

#### 4a. Campaign Content Analysis (Subagent)

For each selected campaign template (max ~9), launch a **Sonnet subagent** to analyze the HTML:

```
Subagent prompt:
Read the HTML file at [path]. This is an email template from [brand].
Extract and analyze:
1. COPY: Subject line quality, headline, body copy tone, CTA text and strength, personalization usage, preheader
2. STRUCTURE: Layout (single column, multi-column), sections, visual hierarchy, image-to-text ratio
3. STRATEGY: What's the email goal? Promotional/educational/brand? Is the angle clear?
4. TECHNICAL: Alt text on images, responsive indicators, sender name/preheader in code
5. RATING: Score 1-5 on copy quality, design quality, strategic clarity

Return a ~200-word structured summary. Do NOT return the raw HTML.
```

This keeps raw HTML out of the main context (saves 50-100K tokens). Main context only sees summaries.

#### 4b. Visual Analysis (Chrome DevTools — selective)

For the top performer and worst performer only (2 campaigns max):
- Open the `archive_url` via Chrome DevTools MCP (`navigate_page`)
- Take a screenshot (`take_screenshot`)
- Note visual design quality, mobile-readiness, brand consistency

Skip this step if Chrome DevTools is unavailable — template HTML analysis from 4a is sufficient.

#### 4c. Automation Email Analysis

For automations with sent > 0, analyze purpose and stats. If template content is available, apply the same subagent analysis as 4a.

Evaluate:
- Is the automation trigger appropriate?
- Is the email content aligned with the trigger moment?
- What's missing vs. Phase 1 architecture?

#### 4d. Synthesize Content Findings

- Group campaigns by content type: promotional, educational, seasonal, product launch, brand
- Rate overall email marketing maturity (1-5 scale):
  1. No systematic approach, sporadic sends
  2. Regular sends but no strategy, generic content
  3. Consistent frequency, some segmentation, decent content
  4. Strategic approach, good content, effective automations
  5. Advanced: personalization, A/B testing, data-driven optimization
- Identify top 2-3 content strengths
- Identify top 2-3 content weaknesses
- Note brand voice consistency across all emails

### 5. Automation Period Estimation

Automation stats from Ecomail are all-time cumulative. If we have the launch date (from AM or from `created_at` in export):

```
Flow: "poděkování za nákup"
Created: September 2022 (~42 months ago)
All-time: 7,782 triggers, 192K Kč revenue
Estimated monthly: ~185 triggers, ~4,589 Kč/month
Estimated last 3 months: ~555 triggers, ~13,767 Kč
```

Show in audit as `[ODHAD]` with methodology note:
> "Ecomail neposkytuje statistiky automatizací za konkrétní období. Zobrazujeme celkové údaje od spuštění s odhadem měsíčního průměru."

If launch date is unknown, show all-time stats only with transparent note.

### 6. Pre-Analysis: Find the Story

Before writing any section, complete this analysis:

1. **Revenue decomposition** (if Marketer+ data available): Campaign revenue + automation revenue = total email revenue? What's the split?
2. **Root cause chains:** When a metric is low, trace why. Example: low automation revenue → most automations inactive → not configured with e-shop integration.
3. **Cross-section links:** Connect sections. Example: no welcome automation (Section 4) → popup has no follow-up (Section 6) → missed revenue opportunity (Section 2).
4. **Campaign pattern analysis:** Enhanced with content findings from Step 4. Which content types perform best? What subject line patterns work?
5. **Volume vs. efficiency:** Separate delivery count from rate story.
6. **Setup maturity assessment:** How complete is the email infrastructure vs. what's standard?
7. **Infrastructure gap sizing:** What's the gap between current Ecomail setup and our standard Phase 1? What will the client gain from our management?

### 7. Generate Audit HTML

Using the analyzed data, AM answers, content analysis, and strategy reference, generate a structured audit. Use the same HTML template, CSS, and components as the Klaviyo audit.

**Header metadata format:**
```
Období: [date range] | Srovnání: [comparison] | Zdroj: Ecomail API + analýza obsahu | Platforma: Ecomail [Essential/Marketer+]
```

---

**Section 1: Executive Summary**

- Verdict box: 2-3 sentence assessment of overall email marketing health and setup maturity
- KPI grid (4-6 metrics). Adapt to available data:
  - **Always available:** Total databáze, Campaign OR (průměr), Campaign CR (průměr), Aktivní automatizace
  - **If Marketer+ with revenue:** E-mail attributed revenue, E-mail % z obratu
  - **If no revenue data:** Replace with Unsub rate, Bounce rate, or Database health metrics
- Lead with what's working well
- Color coding: `.pos` (green) for wins, `.caution` (orange) for areas to improve, `.neg` (red) for problems

**Section 2: Revenue & Attribution**

- **If Marketer+ with revenue data:**
  - Campaign revenue + automation revenue + total
  - Store revenue (from AM) + email % of total
  - Campaign vs. automation split
  - Same table format as Klaviyo audit, adapted column names
- **If Essential (no revenue data):**
  - Show store revenue (from AM) as context
  - Insufficient data callout:
    ```html
    <div class="callout orange">
      <div class="callout-title">Omezení dat: Revenue attribution</div>
      <p>Ecomail na tarifu Essential nesleduje konverze ani revenue z e-mailů.
      Nemůžeme proto přesně vyhodnotit, kolik tržeb e-mailing přímo generuje.
      Doporučujeme upgrade na Marketer+ pro konverzní tracking.</p>
    </div>
    ```
- Never skip this section — always show it with honest context

**Section 3: Doručitelnost & Sending**

- Aggregate delivery stats from campaigns + automations
- Table: Recipients, OR, CR, Unsub rate, Bounce rate, Spam rate
- Same benchmarks as Klaviyo: OR 35-45%, Unsub < 0.3%, Bounce < 0.4%, Spam < 0.05%
- Note: Ecomail's `openrate` field may use different calculation than Klaviyo (check against unique_opens / sent)

**Section 4: Automatizace (Flows)**

- List existing automations with stats table: name, triggered, sent, open rate, click rate, conversions (if available), rating badge
- Show all-time stats clearly labeled. Add estimated period stats if launch dates available (marked `[ODHAD]`)
- Note: "Ecomail neposkytuje statistiky automatizací za konkrétní období. Zobrazujeme celkové údaje od spuštění s odhadem měsíčního průměru."
- **Setup gap analysis table:** Compare what exists vs. Phase 1 architecture from `reference/flow-architectures-phase1.md`
  ```html
  <table class="data-table">
    <thead><tr><th>Flow</th><th>Status</th><th>Priorita</th></tr></thead>
    <tbody>
      <tr><td>Welcome Flow</td><td><span class="badge good">Aktivní</span> / <span class="badge bad">Chybí</span></td><td>Kritická</td></tr>
      <!-- ... -->
    </tbody>
  </table>
  ```
- Content analysis from Step 4c woven in
- If automation has zero triggers but exists → flag as misconfigured

**Section 5: Kampaně**

- Aggregate table: Kampaní odesláno, Total deliveries, Revenue (if available), RPR (if available)
- Per-campaign table: Datum, Předmět, Recipients, OR, CR, Revenue (if Marketer+), badge
- **Content analysis section** (unique to Ecomail audit):
  - Green callout: What's working in their content (based on Step 4a)
  - Yellow/orange callout: What needs improvement
  - Specific references to individual campaigns

**Section 6: Růst databáze**

- Use AM's dashboard data for growth narrative: "Databáze vzrostla z ~X na ~Y za posledních Z měsíců"
- KPI cards: Total databáze, segment count
- Note: Ecomail doesn't have Klaviyo's "Engaged 90D" concept
  - If segments exist that approximate engagement (e.g., "nenakoupili", "neaktivita"), reference them
  - Otherwise, estimate engagement from open rates: ~% of subscribers who opened at least 1 email
- Popup/form data from AM. If unavailable:
  ```html
  <div class="callout orange">
    <div class="callout-title">Omezení dat: Popup konverze</div>
    <p>Ecomail nativně nesleduje konverzní poměr popup formulářů.
    Pro přesné měření doporučujeme implementovat tracking přes Google Tag Manager
    nebo použít dedikovaný popup nástroj s vlastní analytikou.</p>
  </div>
  ```

**Section 7: Focus / Plán spolupráce**

For **onboarding audits**, rename to **"Plán spolupráce — Onboarding"** and map to our phased onboarding tiers from `reference/audit-checklist.md`:

```
Tier 1 — Stop the bleeding (Týden 1)
→ Fix deliverability (Engaged 90D segment, stop full-list sends)
→ Clean database if bloated
→ Fix broken technical issues (e.g., abandoned cart not triggering)

Tier 2 — Build the foundation (Týdny 1-2)
→ Pop-up optimization + Welcome Flow
→ Core abandon flows (cart, product if platform supports)
→ Post-purchase flow review

Tier 3 — Complete the MVP (Týdny 2-4)
→ Remaining core flows (winback, sunset, basic upsell)
→ Campaign calendar + first campaigns under our management
→ Segmentation setup

Tier 4 — Expand & optimize (Průběžně)
→ A/B testing
→ Flow optimization based on data
→ Phase 2 flows
→ Content system
```

Use `.lever` cards for Tier 1-3. Tier 4 is mentioned as "co přijde dál" — not a lever card.

For **recurring audits**, keep the standard "Focus pro příští měsíc" format — maximum 3 `.lever` cards, grounded in data + content analysis, framed as process not targets.

**Section 8: A/B test nápady**

For **onboarding audits**: significantly reduce this section. A/B testing is Tier 4 (ongoing optimization), not something we start with. Include:
- Brief note: "A/B testování je součástí fáze průběžné optimalizace."
- 2-3 test ideas framed as "co budeme testovat, až bude infrastruktura hotová"
- No full section — can be a short callout or merged into Section 7's Tier 4 mention

For **recurring audits**: full section with tied-to-data test recommendations.

**Section 9: Závěr**

- Standard closing callout (dark)
- For staying clients: frame as "začátek systematické práce s e-mailingem na Ecomailu"
- For migrating clients: frame migration as exciting next step
- Highlight content strengths and what we'll build on
- End confident and positive

---

### 7b. Recurring Audit: Progress Assessment

**Skip for onboarding audits.**

For recurring audits, weave progress narrative into relevant sections. Reference previous audit findings: "Minulý audit identifikoval X. Aktuální stav: Y."

### Insufficient Data Callout Pattern

When a section can't be fully evaluated due to platform limitations:

```html
<div class="callout orange">
  <div class="callout-title">Omezení dat: [What's missing]</div>
  <p>[WHY — platform limitation, plan tier, not configured.]</p>
  <p>[What we CAN say based on available data.]</p>
  <p>[When/how this data will become available — migration, upgrade, configuration.]</p>
</div>
```

Rules:
- Never skip a section silently — always show the callout
- Never blame the client — frame as platform limitation
- Always mention when/how the data WILL be available
- If we can make any observation despite limited data, include it

## Output

Save as `projects/$1/outputs/audit.html`

For recurring audits, this overwrites the previous version.

Also copy to `reports/[client-slug]/audit.html` for Vercel deployment.

### Output Format: Branded HTML

Before generating, read `reference/html-templates/audit.html` as formatting reference. Generate a **complete, self-contained HTML file** with:
- All CSS inline in `<style>` (copy from reference template)
- Google Fonts import for Manrope
- Chart.js CDN script tag (only if charts are used)

**Component usage:** Same as `/audit` — `.verdict`, `.kpi-grid`, `.kpi`, `.data-table`, `.callout` (green/red/orange/yellow/blue/dark), `.lever`, `.badge`, Chart.js doughnut.

**Write in Czech with proper diacritics (háčky, čárky).** Always: á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý, ž. Write "e-mail" (hyphenated). Lead with wins, frame gaps constructively.

## Notes

- The audit is **client-facing** — builds confidence and shows progress
- Lead with wins. Frame gaps as "what we're improving next"
- Content analysis is the differentiator — go beyond metrics, show you understand their emails
- For migrating clients, the audit doubles as a migration business case. For staying clients, focus on maximizing Ecomail capabilities.
- The content analysis section (Section 5) should give the client "aha moments" about their own emails
- Cross-reference data across sections — isolated observations are less convincing
- Every insight should connect to an action item in Section 7 or 8

## Delivery

After generating the audit HTML, ask the AM:
> "Want me to upload the audit (HTML/PDF) to the client's Google Drive folder?"

## Next Steps

After audit is complete:
> "Next: Run `/strategy [client]` for flow architecture + client-facing strategy."
