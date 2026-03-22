---
name: audit-omnisend
description: Email marketing audit for Omnisend clients. Use for onboarding audits or recurring health checks on Omnisend.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates a client-facing email marketing audit for clients on the Omnisend platform. Same 9-section HTML output as the Klaviyo/Ecomail audit, adapted for Omnisend's data availability and significant API limitations.

**Context:** This skill works in two modes:
- **Onboarding audit** — First-time assessment of a client's Omnisend setup. Audit of THEIR previous work, not ours.
- **Recurring audit** — Periodic health check of OUR work managing the client on Omnisend.

The skill detects which mode based on whether a previous audit exists.

**Tone difference:**
- **Onboarding:** Be direct and transparent about what's wrong. The client hired us because something needs to change. Don't soften findings to protect anyone's reputation — this is our honest assessment of the current state.
- **Recurring:** Lead with wins, frame gaps constructively. This is our work being evaluated — balance honesty with progress narrative.

**Platform stance:** Never bash Omnisend or push migration. Be factually transparent about platform limitations, but frame them as constraints we work within — not reasons to leave. If the client is staying on Omnisend, all recommendations must be Omnisend-native.

**Revenue projections:** Never promise specific revenue amounts (e.g., "přinese 200–400 tis. Kč"), percentage targets (e.g., "posuneme na 25 %"), or any concrete financial outcomes. Underpromise, overdeliver. Describe the opportunity qualitatively ("výrazně zvýší podíl", "zachytí revenue, které teď odchází") — never quantitatively. Do NOT reference GA4 or Google Analytics as a data source.

**When to use this vs. other audit skills:** Use `/audit-omnisend` when the client's `profile.md` shows `Email platform: Omnisend`. Use `/audit` for Klaviyo, `/audit-ecomail` for Ecomail, `/audit-leadhub` for Leadhub.

**Data collection philosophy:** Hybrid approach — API for campaign engagement stats and automation structure, dashboard for everything the API can't provide (automation stats, revenue, subscriber counts, segments, popup data). Omnisend's API is significantly weaker than Ecomail's or Klaviyo's.

**Critical API limitations (Omnisend-specific):**
- Campaign engagement stats (sent, opened, clicked, bounced, unsubs) ✓ available
- Campaign revenue/conversions ✗ NOT available via API
- Automation structure (name, status, trigger, messages) ✓ available
- Automation performance stats (sent, opens, clicks, revenue) ✗ NOT available via API
- Aggregate subscriber count ✗ NOT available (must paginate all contacts)
- Segments ✗ NOT available via API
- Popup/form data ✗ NOT available via API

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
Before I run the export, I need a few things from you. The Omnisend API has significant gaps — I'll need dashboard data for several items:

1. AUDIT PERIOD
   What timeframe should we audit?
   → Onboarding default: last 3 months (recent picture) or last 12 months (full history)
   → Recurring default: last month or last 3 months

2. OMNISEND PLAN TIER
   Free, Standard, or Pro? (Pro has advanced reporting, web push, Facebook Custom Audiences)

3. AUTOMATION STATS (from Omnisend dashboard — API does NOT provide these)
   → Omnisend → Automation → click into each workflow
   → For each automation: name, status (active/paused/draft), sent count, open rate, click rate, revenue
   → Screenshot the automation list OR provide stats manually
   → This is the #1 most important dashboard data — without it, automation section is very thin

4. REVENUE DATA (from Omnisend dashboard — API does NOT provide campaign revenue)
   → Omnisend → Campaigns → Campaign Reports or Revenue summary
   → Total campaign revenue for audit period
   → Omnisend → Dashboard → Revenue widget (if available)
   → Total automation revenue (from step 3 above)
   → Note: Omnisend tracks revenue if connected to Shopify/WooCommerce/BigCommerce

5. SUBSCRIBER COUNT & GROWTH
   → Omnisend → Audience → total subscriber count
   → "3 months ago we had ~X subscribers, now ~Y"
   → Segment list: what segments exist?
   → If you can screenshot the audience overview, that helps

6. POPUP/FORM DATA
   → Omnisend → Forms → each form's stats
   → Display count, submissions, conversion rate
   → Omnisend has native form/popup tracking — should be in the dashboard

7. STORE REVENUE (from e-shop admin)
   → From Shopify/WooCommerce admin or other e-shop analytics
   → Current period + previous period of same length (for comparison)

8. ATTRIBUTION MODEL
   → Omnisend default: "Omnisend-assisted" model (open within 5 days OR click within 5 days before purchase)
   → Check: Omnisend → Settings → Store settings → Attribution (if configurable)
   → Note: differs from Klaviyo's 5-day open / 5-day click model

9. PLATFORM DECISION
   → Is this client staying on Omnisend, or migrating to another ESP?
   → If migrating: which platform? (Klaviyo, Mailchimp, etc.)
   → If staying: audit will focus on maximizing Omnisend capabilities

10. KNOWN ISSUES OR FOCUS AREAS
    → Anything specific you want me to check or highlight?
```

Wait for AM responses before proceeding. Not everything is required — work with what's provided. Items 3, 4, and 5 are most critical since API doesn't cover them.

### 3. Run Omnisend API Export

Check `.env` for `[CLIENT]_OMNISEND_API_KEY` or `OMNISEND_API_KEY`.

Run the export tool:

```bash
python3 tools/omnisend-export.py $1 --period [days] --top 3
```

Options:
- `--period 365` for full year (onboarding), `--period 90` for last 3 months (recurring)
- `--top 3` selects top 3 by open rate + bottom 3 by engagement + 3 most recent for analysis selection (default, max ~9)

This saves to `projects/$1/data/omnisend-export.json` containing:
- **Campaigns:** per-campaign engagement stats (sent, opened, clicked, bounced, unsubscribed) + calculated rates — but NO revenue
- **Automations:** structure only (name, status, trigger, messages) — NO performance stats
- **Contacts:** total count (from pagination, may be -1 if unavailable)
- **Summary:** aggregate campaign stats + `data_gaps` array listing what's missing

Read the export file and note:
- Campaign count and aggregate engagement (OR, CR, CTR)
- Which automations exist and their status (enabled/disabled/draft)
- Which campaigns were selected for content analysis
- The `data_gaps` list — these are what the AM needs to fill from the dashboard

After reading the export, present the automation names to the AM and ask about launch dates if not already provided.

**API call budget:** ~20-50 calls for a typical client. Campaigns have 1 RPS limit (0.2s sleep between calls). Completes in <60 seconds.

**Data source mapping:**

| Audit section | Data source |
|---------------|-------------|
| 1. Executive Summary | API export (engagement) + AM dashboard (revenue, growth) |
| 2. Revenue & Attribution | AM dashboard (campaign + automation revenue) + AM (store revenue) |
| 3. Deliverability & Sending | API export (campaign delivery + engagement stats) |
| 4. Flows/Automations | API export (structure) + AM dashboard (automation performance stats) + flow-architectures-phase1.md (gap analysis) |
| 5. Campaigns | API export (per-campaign engagement) + AM dashboard (revenue) + content analysis |
| 6. Database Growth | AM dashboard (subscriber counts, segments, popup stats) |
| 7. Focus for Next Month | Analysis of all above |
| 8. A/B Test Ideas | Analysis + content findings |

### 4. Content & Creative Analysis

Analyze actual email content — not just metrics. This is the differentiator.

#### 4a. Campaign Content Analysis (Chrome DevTools)

Omnisend provides campaign archive/preview URLs. If available, for selected campaigns (max ~6):
- Open the archive URL via Chrome DevTools MCP (`navigate_page`)
- Take a screenshot (`take_screenshot`)
- Analyze: subject line, copy quality, CTA strength, layout, brand consistency

If Chrome DevTools is unavailable, analyze based on subject lines, from names, and campaign metadata from the API export.

#### 4b. Visual Analysis (selective)

For the top performer and worst performer only (2 campaigns max):
- Full screenshot via Chrome DevTools
- Note visual design quality, mobile-readiness, brand consistency
- Compare against each other for contrast

#### 4c. Automation Email Analysis

For automations with enabled status, analyze:
- Is the automation trigger appropriate?
- Message count and subjects — is the sequence well-structured?
- What's missing vs. Phase 1 architecture?
- If AM provides automation email screenshots, analyze content quality

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

If AM provides automation stats from the dashboard AND launch dates:

```
Automatizace: "Welcome Flow"
Spuštěna: květen 2023 (~34 měsíců)
Dashboard stats: 5 200 odesláno, 156 000 Kč revenue
Odhadovaný měsíční průměr: ~153 odesláno, ~4 588 Kč/měsíc
Odhad za poslední 3 měsíce: ~459 odesláno, ~13 765 Kč
```

Show in audit as `[ODHAD]` with methodology note:
> "Omnisend neposkytuje statistiky automatizací za konkrétní období přes API. Zobrazujeme celkové údaje z dashboardu od spuštění s odhadem měsíčního průměru."

If launch date is unknown, show dashboard stats as-is with "celkově od spuštění" label.

If no dashboard stats provided by AM, show API structure data only with "Omezení dat" callout.

### 6. Pre-Analysis: Find the Story

Before writing any section, complete this analysis:

1. **Revenue decomposition** (if AM dashboard data available): Campaign revenue + automation revenue = total email revenue? What's the split?
2. **Root cause chains:** When a metric is low, trace why. Example: low automation revenue → most automations disabled → not configured properly.
3. **Cross-section links:** Connect sections. Example: no welcome automation (Section 4) → popup has no follow-up (Section 6) → missed revenue opportunity (Section 2).
4. **Campaign pattern analysis:** Enhanced with content findings from Step 4. Which content types perform best? What subject line patterns work?
5. **Volume vs. efficiency:** Separate delivery count from rate story.
6. **Setup maturity assessment:** How complete is the email infrastructure vs. what's standard?
7. **Infrastructure gap sizing:** What's the gap between current Omnisend setup and our standard Phase 1? What will the client gain from our management?
8. **API vs. dashboard data reconciliation:** Note where API campaign stats and dashboard stats differ (different time windows, calculation methods).

### 7. Generate Audit HTML

Using the analyzed data, AM answers, content analysis, and strategy reference, generate a structured audit. Use the same HTML template, CSS, and components as the Klaviyo audit.

**Header metadata format:**
```
Období: [date range] | Srovnání: [comparison] | Zdroj: Omnisend API + dashboard | Platforma: Omnisend [Free/Standard/Pro]
```

---

**Section 1: Executive Summary**

- Verdict box: 2-3 sentence assessment of overall email marketing health and setup maturity
- KPI grid (4-6 metrics). Adapt to available data:
  - **Always available (from API):** Campaign OR (průměr), Campaign CR (průměr), Aktivní automatizace
  - **If AM provides dashboard data:** Total databáze, E-mail attributed revenue, E-mail % z obratu
  - **If no revenue data from AM:** Replace with Unsub rate, Bounce rate, or Automation count
- Lead with what's working well
- Color coding: `.pos` (green) for wins, `.caution` (orange) for areas to improve, `.neg` (red) for problems

**Section 2: Revenue & Attribution**

- **If AM provides revenue data from dashboard:**
  - Campaign revenue + automation revenue + total
  - Store revenue (from AM) + email % of total
  - Campaign vs. automation split
  - Same table format as Klaviyo audit, adapted column names
- **If no revenue data from AM:**
  - Show store revenue (from AM) as context
  - Insufficient data callout:
    ```html
    <div class="callout orange">
      <div class="callout-title">Omezení dat: Revenue attribution</div>
      <p>Omnisend API neposkytuje revenue data z kampaní ani automatizací.
      Pro přesné vyhodnocení revenue je potřeba export z Omnisend dashboardu,
      případně propojení se Shopify/WooCommerce analytikou.</p>
    </div>
    ```
- **Attribution model callout (ALWAYS include):**
  ```html
  <div class="callout blue">
    <div class="callout-title">Attribution model</div>
    <p>Omnisend používá model „Omnisend-assisted" — konverze je přiřazena e-mailu,
    pokud příjemce otevře e-mail nebo klikne do 5 dnů před nákupem.
    Při srovnání s jinými platformami (Klaviyo: 5d open / 5d click)
    berte rozdíl v atribuci v úvahu.</p>
  </div>
  ```
- Never skip this section — always show it with honest context

**Section 3: Doručitelnost & Sending**

- Aggregate delivery stats from campaigns (API data)
- Table: Odesláno, OR, CR, Unsub rate, Bounce rate, Complaint rate
- Same benchmarks as Klaviyo: OR 35-45%, Unsub < 0.3%, Bounce < 0.4%, Spam/Complaint < 0.05%
- Note: Omnisend's open rate uses unique opens / sent. Factor in Apple MPP impact.
- If AM provides automation delivery stats from dashboard, include those too

**Section 4: Automatizace (Flows)**

Use "automatizace" / "workflow" terminology — Omnisend calls them "workflows" in the UI.

- List existing automations with status from API export: name, status (enabled/disabled/draft), trigger, message count
- **If AM provides dashboard stats:** Add sent, OR, CR, revenue columns from dashboard data
- **If no dashboard stats:** Show structure only with "Omezení dat" callout:
  ```html
  <div class="callout orange">
    <div class="callout-title">Omezení dat: Statistiky automatizací</div>
    <p>Omnisend API neposkytuje výkonnostní statistiky automatizací (odesláno, otevření, kliky, revenue).
    Zobrazujeme pouze strukturu (název, status, trigger, počet zpráv).
    Pro kompletní vyhodnocení je potřeba export z Omnisend dashboardu.</p>
  </div>
  ```
- Show estimated period stats if dashboard data + launch dates available (marked `[ODHAD]`)
- **Setup gap analysis table:** Compare what exists vs. Phase 1 architecture from `reference/flow-architectures-phase1.md`
  ```html
  <table class="data-table">
    <thead><tr><th>Automatizace</th><th>Status</th><th>Priorita</th></tr></thead>
    <tbody>
      <tr><td>Welcome Flow</td><td><span class="badge good">Aktivní</span> / <span class="badge bad">Chybí</span></td><td>Kritická</td></tr>
      <!-- ... -->
    </tbody>
  </table>
  ```
- Content analysis from Step 4c woven in
- If automation is disabled → flag as deactivated, ask AM for context

**Section 5: Kampaně**

- Aggregate table: Kampaní odesláno, Total sent, Průměrné OR, Průměrné CR
- Per-campaign table: Datum, Předmět, Odesláno, OR, CR, badge
  - If AM provides revenue data, add Revenue column
- **Content analysis section** (differentiator):
  - Green callout: What's working in their content (based on Step 4a)
  - Yellow/orange callout: What needs improvement
  - Specific references to individual campaigns

**Section 6: Růst databáze**

- Use AM's dashboard data for growth narrative: "Databáze vzrostla z ~X na ~Y za posledních Z měsíců"
- KPI cards: Total databáze, segment count
- **Popup/form data:** If AM provides Omnisend form stats, show display count, submissions, CVR
- If no popup data:
  ```html
  <div class="callout orange">
    <div class="callout-title">Omezení dat: Popup konverze</div>
    <p>Omnisend API neposkytuje data o výkonnosti formulářů.
    Pro vyhodnocení popup CVR je potřeba export z Omnisend dashboardu (Forms → jednotlivý formulář → statistiky).</p>
  </div>
  ```
- Engagement estimation: Omnisend doesn't expose "Engaged 90D" via API
  - If segments exist that approximate engagement, reference them
  - Otherwise, estimate from aggregate open rates, label as `[ODHAD]`

**Section 7: Focus / Plán spolupráce**

For **onboarding audits**, rename to **"Plán spolupráce — Onboarding"** and map to our phased onboarding tiers from `reference/audit-checklist.md`:

```
Tier 1 — Stop the bleeding (Týden 1)
→ Fix deliverability (engagement-based segmentation, stop full-list sends)
→ Clean database if bloated
→ Fix broken technical issues (e.g., abandoned cart not triggering)

Tier 2 — Build the foundation (Týdny 1-2)
→ Pop-up optimization + Welcome Flow
→ Core abandon workflows (cart, product browse if available)
→ Post-purchase workflow review

Tier 3 — Complete the MVP (Týdny 2-4)
→ Remaining core workflows (winback, sunset, basic upsell)
→ Campaign calendar + first campaigns under our management
→ Segmentation setup

Tier 4 — Expand & optimize (Průběžně)
→ A/B testing
→ Workflow optimization based on data
→ Phase 2 workflows
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
- For staying clients: frame as "začátek systematické práce s e-mailingem na Omnisendu"
- For migrating clients: frame migration as exciting next step, highlight what we'll carry forward
- Highlight content strengths and what we'll build on
- End confident and positive

---

### 7b. Recurring Audit: Progress Assessment

**Skip for onboarding audits.**

For recurring audits, weave progress narrative into relevant sections. Reference previous audit findings: "Minulý audit identifikoval X. Aktuální stav: Y."

### Insufficient Data Callout Pattern

When a section can't be fully evaluated due to platform/API limitations:

```html
<div class="callout orange">
  <div class="callout-title">Omezení dat: [What's missing]</div>
  <p>[WHY — Omnisend API limitation, not configured, data not provided by AM.]</p>
  <p>[What we CAN say based on available data.]</p>
  <p>[When/how this data will become available — dashboard export, AM follow-up, migration to Klaviyo.]</p>
</div>
```

Rules:
- Never skip a section silently — always show the callout
- Never blame the client — frame as platform limitation
- Always mention when/how the data WILL be available
- If we can make any observation despite limited data, include it
- Expect MORE "Omezení dat" callouts than Ecomail/Klaviyo audits — Omnisend API is the weakest of the four platforms

## Output

Save as `projects/$1/outputs/audit-omnisend.html`

Note: Uses `audit-omnisend.html` filename (not `audit.html`) to avoid overwriting a current Klaviyo audit if the client has migrated. For clients still on Omnisend with no other audit, `audit.html` is also acceptable.

Also copy to `reports/[client-slug]/audit-omnisend.html` for Vercel deployment.

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
- For migrating clients, the audit doubles as a migration baseline — document everything quantitatively for before/after comparison
- For staying clients, focus on maximizing Omnisend capabilities
- Omnisend has MORE "Omezení dat" callouts than other platforms — this is expected and honest
- The attribution model callout in Section 2 is permanent — never skip it
- Cross-reference data across sections — isolated observations are less convincing
- Every insight should connect to an action item in Section 7 or 8
- Dashboard data from AM is critical — without it, Sections 2 (revenue), 4 (automation performance), and 6 (growth) will be significantly thinner
- If this is a historical/migration audit (client already moved to Klaviyo), frame the output as a baseline document, not a current-state audit

## Delivery

After generating the audit HTML, ask the AM:
> "Want me to upload the audit (HTML/PDF) to the client's Google Drive folder?"

## Next Steps

After audit is complete:
> "Next: Run `/strategy [client]` for flow architecture + client-facing strategy."
