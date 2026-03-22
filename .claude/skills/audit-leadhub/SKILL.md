---
name: audit-leadhub
description: Email marketing audit for Leadhub clients. Use for onboarding audits or recurring health checks on Leadhub.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a client-facing email marketing audit for clients on the Leadhub platform. Same 9-section HTML output as the Klaviyo audit, adapted for Leadhub's data availability and dashboard-first data collection.

**Context:** This skill works in two modes:
- **Onboarding audit** — First-time assessment of a client's Leadhub setup. Audit of THEIR previous work, not ours.
- **Recurring audit** — Periodic health check of OUR work managing the client on Leadhub.

The skill detects which mode based on whether a previous audit exists.

**Tone difference:**
- **Onboarding:** Be direct and transparent about what's wrong. The client hired us because something needs to change. Don't soften findings to protect anyone's reputation — this is our honest assessment of the current state.
- **Recurring:** Lead with wins, frame gaps constructively. This is our work being evaluated — balance honesty with progress narrative.

**Platform stance:** Never bash Leadhub or push migration. Be factually transparent about platform limitations, but frame them as constraints we work within — not reasons to leave. All recommendations must be Leadhub-native.

**Revenue projections:** Never promise specific revenue amounts (e.g., "přinese 200–400 tis. Kč"), percentage targets (e.g., "posuneme na 25 %"), or any concrete financial outcomes. Underpromise, overdeliver. Describe the opportunity qualitatively ("výrazně zvýší podíl", "zachytí revenue, které teď odchází") — never quantitatively. Do NOT reference GA4 or Google Analytics as a data source.

**When to use this vs. other audit skills:** Use `/audit-leadhub` when the client's `profile.md` shows `Email platform: Leadhub`. Use `/audit` for Klaviyo, `/audit-ecomail` for Ecomail.

**Data collection philosophy:** Dashboard-first — Leadhub has rich dashboard data (campaign stats, revenue, popup CVR, automation performance). Guide the AM through specific dashboard screens for data. Contact CSV export available for subscriber data. API optional for segment sizes and contact profiles if API key is configured. Shoptet admin provides store-level metrics (revenue, AOV, bestsellers) for cross-referencing.

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
Before I run the analysis, I need a few things from you. Most of this is in the Leadhub dashboard + Shoptet admin:

1. AUDIT PERIOD
   What timeframe should we audit?
   → Onboarding default: last 3 months (recent picture) or last 12 months (full history)
   → Recurring default: last month or last 3 months

2. LEADHUB PLAN TIER
   Platform Pro or Individual? (All paid plans have full features including revenue tracking.)

3. ATTRIBUTION WINDOW
   What attribution window is set in Leadhub?
   → Default is 24h open / 7-day click
   → Other options: 48h/14d, 72h/30d, 30d/30d
   → Check: Leadhub → Nastavení → Konverze (or similar)
   → This is critical for interpreting revenue data correctly

4. CAMPAIGN STATS (from Leadhub dashboard)
   → Leadhub → Kampaně → overview or per-campaign detail
   → For each campaign in the audit period: date, subject, recipients, open rate, click rate, revenue
   → Screenshot or manual entry — no CSV export available
   → Tip: sort by date, screenshot the table for the audit period

5. AUTOMATION STATS (from Leadhub dashboard)
   → Leadhub → Automatické kampaně → overview
   → For each automation: name, trigger type, sent count, open rate, click rate, revenue
   → Note: stats are likely all-time cumulative — we'll need launch dates to estimate period performance
   → When were each automation created/launched?

6. SUBSCRIBER DATA
   → Leadhub → Kontakty → total count
   → Subscriber growth: "3 months ago we had ~X subscribers, now ~Y"
   → Segment list: what segments/audiences exist?

7. POPUP/FORM STATS (from Leadhub dashboard)
   → Leadhub → Formuláře (or Popup) → stats
   → Display count, submissions, conversion rate
   → Leadhub tracks this natively — should be in the dashboard

8. SHOPTET ADMIN DATA
   → Total store revenue for audit period + comparison period (same length)
   → Order count and AOV (average order value)
   → Top products/categories by revenue (optional but valuable)
   → Repeat purchase rate (if available in Shoptet analytics)
   → NOTE: Don't ask AM for automation launch dates — get these from the Leadhub internal API (Step 5a)

9. KNOWN ISSUES OR FOCUS AREAS
   → Anything specific you want me to check or highlight?
```

Wait for AM responses before proceeding. Not everything is required — work with what's provided.

### 3. Organize Collected Data

Unlike Klaviyo/Ecomail audits, there's no automated API export for Leadhub. Organize the AM-provided data:

**From Leadhub dashboard:**
- Campaign stats table (per-campaign: date, subject, recipients, OR, CR, revenue, deliveries)
- Automation stats (per-automation: name, trigger, sent, OR, CR, revenue)
- Subscriber total + growth narrative
- Popup/form stats (displays, submissions, CVR)
- Segment/audience list

**From Shoptet admin:**
- Store revenue (current period + comparison)
- Order count, AOV
- Top products/categories
- Repeat purchase rate (if available)

**From Leadhub API (optional, if API key available):**
Check `.env` for `[CLIENT]_LEADHUB_API_KEY` or `LEADHUB_API_KEY`. If available, can pull:
- Segment sizes (for engagement estimation)
- Contact profile data for sampling

**Data source mapping:**

| Audit section | Data source |
|---------------|-------------|
| 1. Executive Summary | All sources combined |
| 2. Revenue & Attribution | Leadhub dashboard (campaign + automation revenue) + Shoptet admin (store revenue) |
| 3. Deliverability & Sending | Leadhub dashboard (campaign + automation delivery stats) |
| 4. Automatizace | Leadhub dashboard (automation stats) + flow-architectures-phase1.md (gap analysis) |
| 5. Kampaně | Leadhub dashboard (per-campaign stats) + content analysis |
| 6. Růst databáze | Leadhub dashboard (subscriber count, growth, popup stats, segments) |
| 7. Focus for Next Month | Analysis of all above |
| 8. A/B Test Ideas | Analysis + content findings |

### 4. Content & Creative Analysis

Analyze actual email content — not just metrics. This is the differentiator.

#### 4a. Campaign Content Analysis (Subagent)

If campaign email HTML or screenshots are available, launch a **Sonnet subagent** for each (max ~9):

```
Subagent prompt:
Read the HTML file at [path] / Analyze this email screenshot. This is an email template from [brand].
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

If the AM provides email preview URLs or archive links, for the top performer and worst performer only (2 campaigns max):
- Open the URL via Chrome DevTools MCP (`navigate_page`)
- Take a screenshot (`take_screenshot`)
- Note visual design quality, mobile-readiness, brand consistency

Skip this step if no preview URLs are available or Chrome DevTools is unavailable — template analysis from 4a is sufficient.

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

### 5a. Get Automation States via Leadhub Internal API

**Always run this step for onboarding audits.** The Leadhub public API only exposes contacts/segments — but the dashboard's internal REST API exposes automation metadata including `state` (active/paused/draft), `created`, and `lastUpdated`. Access this via Chrome DevTools MCP using the authenticated browser session.

**How to get the businessId:**
Extract from the Leadhub dashboard URL while browser is open: `app.leadhub.co/businesses/{businessId}/...`

**How to fetch automation metadata:**
For each automation ID from the campaign stats CSV, run via `mcp__chrome-devtools__evaluate_script`:

```javascript
async () => {
  const businessId = "{businessId}";
  const campaignId = "{campaignId}";
  const res = await fetch(`/api/v1/businesses/${businessId}/campaigns/${campaignId}`, {
    headers: { "Accept": "application/json" }
  });
  return await res.json();
}
```

**What the response gives you:**
- `state`: `"active"` | `"paused"` | `"draft"` — the actual current status
- `created`: ISO timestamp — when it was first created in Leadhub
- `lastUpdated`: ISO timestamp — last state change (for paused automations, this is when it was paused)
- `trigger`: what triggers the automation

**State interpretation:**
| State | Meaning |
|-------|---------|
| `active` | Currently sending |
| `paused` | Was active, then manually stopped. `lastUpdated` = deactivation date |
| `draft` | Never activated — created but never turned on. Stats are always zero |

**Key findings to look for:**
- Welcome automation `paused` while popup is still live → CRITICAL (see Section 4 generation rules below)
- Automation in `draft` that has been there for months → misconfiguration or abandoned intent
- `created` date = actual setup date. Use `lastUpdated` for when `paused` state was set to determine deactivation date.
- For `active` automations: active period = `created` → today
- For `paused` automations: active period = [activation date confirmed by AM or inferred] → `lastUpdated`

**Note on creation vs. activation date:** `created` is when the automation was added to Leadhub, not when it was turned on. If the AM set it up before going live, these differ. When possible, confirm activation date with AM — otherwise use `created` as a conservative estimate and note the uncertainty.

### 5b. Automation Period Estimation

Automation stats from Leadhub are all-time cumulative with no period filter. Now that you have exact state data from Step 5a, use it to determine the comparison window.

**When exact active period is known (active or paused with confirmed dates):**

Filter Shoptet admin to the same window (`Celkové statistiky` → fill Datum od / Datum do → FILTROVAT). This makes the comparison exact — **remove [ODHAD]** and show:
> "Data automatizací jsou kumulativní za celé aktivní období ([datum od] – [datum do]). Shoptet data jsou filtrována na shodné období pro přesné srovnání."

**When active period is only partially known (created date confirmed, still active):**

```
Automatická kampaň: "poděkování za nákup"
Spuštěna: září 2022 (~42 měsíců)
Celkově: 7 782 odesláno, 192 000 Kč revenue
Odhadovaný měsíční průměr: ~185 odesláno, ~4 589 Kč/měsíc
Odhad za poslední 3 měsíce: ~555 odesláno, ~13 767 Kč
```

Show as `[ODHAD]` with note: "Leadhub neposkytuje statistiky automatických kampaní za konkrétní období. Zobrazujeme celkové údaje od spuštění s odhadem měsíčního průměru."

**When state is `draft`:** Never calculate revenue estimates — the automation was never active. Show "0 odeslaných — nikdy aktivováno" in the audit.

### 6. Pre-Analysis: Find the Story

Before writing any section, complete this analysis:

1. **Revenue decomposition:** Campaign revenue + automation revenue = total email revenue. What's the split? Cross-reference with Shoptet store revenue for email % of total.
2. **Root cause chains:** When a metric is low, trace why. Example: low automation revenue → most automations inactive → not configured with Shoptet integration triggers.
3. **Cross-section links:** Connect sections. Example: no welcome automation (Section 4) → popup has no follow-up (Section 6) → missed revenue opportunity (Section 2).
4. **Campaign pattern analysis:** Enhanced with content findings from Step 4. Which content types perform best? What subject line patterns work?
5. **Volume vs. efficiency:** Separate delivery count from rate story.
6. **Setup maturity assessment:** How complete is the email infrastructure vs. what's standard?
7. **Infrastructure gap sizing:** What's the gap between current Leadhub setup and our standard Phase 1? What will the client gain from our management?

### 7. Generate Audit HTML

Using the analyzed data, AM answers, content analysis, and strategy reference, generate a structured audit. Use the same HTML template, CSS, and components as the Klaviyo audit.

**Header metadata format:**
```
Období: [date range] | Srovnání: [comparison] | Zdroj: Leadhub dashboard + Shoptet admin | Platforma: Leadhub [tier]
```

---

**Section 1: Executive Summary**

- Verdict box: 2-3 sentence assessment of overall email marketing health and setup maturity
- KPI grid (4-6 metrics). Revenue is always available on Leadhub:
  - **Standard KPIs:** Total databáze, Campaign OR (průměr), Campaign CR (průměr), Aktivní automatizace, E-mail attributed revenue, E-mail % z obratu
- Lead with what's working well
- Color coding: `.pos` (green) for wins, `.caution` (orange) for areas to improve, `.neg` (red) for problems

**Section 2: Revenue & Attribution**

Revenue tracking is available on all paid Leadhub plans — always show the full revenue section:
- Campaign revenue + automation revenue + total
- Store revenue (from Shoptet) + email % of total
- Campaign vs. automation split
- Same table format as Klaviyo audit, adapted column names

**Attribution window callout (ALWAYS include):**
```html
<div class="callout blue">
  <div class="callout-title">Attribution window</div>
  <p>Leadhub přiřazuje konverzi e-mailu, pokud příjemce otevře e-mail do [X]h
  a/nebo klikne do [Y] dnů před nákupem (aktuální nastavení klienta: [Xh open / Yd click]).
  Toto okno je konfigurovatelné — při srovnání s jinými platformami (Klaviyo: 5d open / 5d click)
  berte rozdíl v atribuci v úvahu.</p>
</div>
```

Fill in the actual window values from AM's answer in Step 2. This callout is permanent — include it in every audit, onboarding or recurring.

**Section 3: Doručitelnost & Sending**

- Aggregate delivery stats from campaigns + automations
- Table: Recipients, OR, CR, Unsub rate, Bounce rate, Spam rate
- Same benchmarks as Klaviyo: OR 35-45%, Unsub < 0.3%, Bounce < 0.4%, Spam < 0.05%
- Note: verify how Leadhub calculates open rate (unique opens / delivered vs. sent)

**Section 4: Automatizace**

Use "automatické kampaně" / "automatizace" terminology — NOT "flows".

- List existing automations with stats table: name, trigger, sent, open rate, click rate, revenue (if available), rating badge
- Show all-time stats clearly labeled. Period note depends on Step 5a/5b:
  - If exact active period known and Shoptet filtered to match: no [ODHAD] — state the exact period
  - If period estimated: mark `[ODHAD]` with methodology note
- **Show actual API-verified states in the table** (from Step 5a), not just "0 odeslaných". Use:
  - `<span class="badge good">Aktivní</span>` for `state: active`
  - `<span class="badge warn">Pozastavena</span>` for `state: paused` (include "od [date]" in the cell)
  - `<span class="badge bad">Nikdy nespuštěno</span>` for `state: draft`

- **CRITICAL CHECK — Paused welcome automation with active popup:**
  Before writing Section 4, check: Is the welcome automation `paused` or `draft` while the client's popup is still live and promising a discount?
  If yes → add a red KRITICKÉ callout BEFORE the stats table:
  ```html
  <div class="callout red">
    <div class="callout-header">
      <span class="callout-title">KRITICKÉ: Welcome automatizace pozastavena — noví odběratelé nedostávají slíbenou slevu</span>
    </div>
    <ul>
      <li><strong>Automatizace "[name]" je pozastavena od [date]</strong> — [reason if known, e.g. "zastavena před valentýnskou akcí a nikdy znovu nespuštěna"]</li>
      <li><strong>Pop-up stále slibuje [X]% slevu</strong>, ale každý nový odběratel od [date] nedostane žádný e-mail ani kód. Za [N dní] se mohlo přihlásit ~[N] nových kontaktů (odhad z průměrného denního tempa) bez jakékoliv onboarding komunikace.</li>
      <li><strong>Finanční dopad:</strong> Welcome automatizace nesla [%] z obratu za dobu své aktivity (RPR [Kč]/recipient). [qualitative impact statement]</li>
      <li><strong>Akce — priorita 0:</strong> [action item]</li>
    </ul>
  </div>
  ```
  This is the most urgent finding in any audit where it occurs.

- **Setup gap analysis table:** Compare what exists vs. Phase 1 architecture from `reference/flow-architectures-phase1.md`
  ```html
  <table class="data-table">
    <thead><tr><th>Automatizace</th><th>Status</th><th>Priorita</th></tr></thead>
    <tbody>
      <tr><td>Welcome automatizace</td><td><span class="badge good">Aktivní</span> / <span class="badge bad">Chybí</span></td><td>Kritická</td></tr>
      <!-- ... -->
    </tbody>
  </table>
  ```
- Content analysis from Step 4c woven in
- `draft` automation with 0 sends → "nikdy aktivováno" — do NOT call it "misconfigured", it was simply never turned on

**Section 5: Kampaně**

- Aggregate table: Kampaní odesláno, Total deliveries, Revenue, RPR
- Per-campaign table: Datum, Předmět, Recipients, OR, CR, Revenue, badge
- **Content analysis section** (differentiator):
  - Green callout: What's working in their content (based on Step 4a)
  - Yellow/orange callout: What needs improvement
  - Specific references to individual campaigns

**Section 6: Růst databáze**

- Use AM's dashboard data for growth narrative: "Databáze vzrostla z ~X na ~Y za posledních Z měsíců"
- KPI cards: Total databáze, segment count, popup CVR
- **Popup/form data:** Leadhub tracks popup CVR natively — show display count, submissions, and conversion rate directly. No "Omezení dat" callout needed.
- Engagement estimation: Leadhub doesn't have Klaviyo's "Engaged 90D" concept
  - If segments exist that approximate engagement (e.g., "neaktivní", "nenakoupili"), reference them
  - Otherwise, estimate engagement from open rates: ~% of subscribers who opened at least 1 email, label as `[ODHAD]`

**Section 7: Focus / Plán spolupráce**

For **onboarding audits**, rename to **"Plán spolupráce — Onboarding"** and map to our phased onboarding tiers from `reference/audit-checklist.md`:

```
Tier 1 — Stop the bleeding (Týden 1)
→ Fix deliverability (engagement-based segmentation, stop full-list sends)
→ Clean database if bloated
→ Fix broken technical issues (e.g., abandoned cart not triggering)

Tier 2 — Build the foundation (Týdny 1-2)
→ Pop-up optimization + Welcome automatizace
→ Core abandon automatizace (opuštěný košík, prohlížení produktu)
→ Post-purchase automatizace review

Tier 3 — Complete the MVP (Týdny 2-4)
→ Remaining core automatizace (winback, sunset, basic upsell)
→ Campaign calendar + first campaigns under our management
→ Segmentation setup

Tier 4 — Expand & optimize (Průběžně)
→ A/B testing
→ Automatizace optimization based on data
→ Phase 2 automatizace
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
- Frame as "začátek systematické práce s e-mailingem na Leadhubu"
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
  <p>[WHY — platform limitation, not configured, data not provided by AM.]</p>
  <p>[What we CAN say based on available data.]</p>
  <p>[When/how this data will become available — configuration, next audit cycle, AM follow-up.]</p>
</div>
```

Rules:
- Never skip a section silently — always show the callout
- Never blame the client — frame as platform limitation or data gap
- Always mention when/how the data WILL be available
- If we can make any observation despite limited data, include it
- Note: Revenue and popup CVR should NOT need this callout on Leadhub — they're natively available

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
- Focus on maximizing Leadhub capabilities — never push migration
- Leadhub is MORE capable than Ecomail in some areas (revenue tracking on all plans, native popup CVR) — reflect this positively
- The attribution window callout in Section 2 is permanent — never skip it
- Shoptet data gives a more complete picture than Klaviyo/Ecomail audits — use it to cross-reference email revenue against store revenue
- The content analysis section (Section 5) should give the client "aha moments" about their own emails
- Cross-reference data across sections — isolated observations are less convincing
- Every insight should connect to an action item in Section 7 or 8
- **Automation states must be API-verified** — never infer state from "0 odeslaných" alone. Always run Step 5a.
- **[ODHAD] is removable** — if you have exact activation/deactivation dates AND filter Shoptet to the same window, show exact numbers instead. Remove the [ODHAD] note.
- **draft vs. paused are fundamentally different findings:** `draft` = intent that was never executed; `paused` = a revenue-generating system that was deliberately stopped (far more urgent)
- **Welcome automation paused + popup active = the most urgent finding in any Leadhub audit.** Treat as CRITICAL red callout, not a regular gap item.

## Delivery

After generating the audit HTML, ask the AM:
> "Want me to upload the audit (HTML/PDF) to the client's Google Drive folder?"

## Next Steps

After audit is complete:
> "Next: Run `/strategy [client]` for flow architecture + client-facing strategy."
