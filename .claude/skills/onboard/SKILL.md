---
name: onboard
description: Use when onboarding a new client, creating client files from Tally form data, or setting up a new project from scratch.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Onboards a new client from zero to strategy-ready. Takes Tally onboarding form data, researches the client's website, and generates three files: project profile, flow tracking, and internal team brief.

**Pipeline position:** `/onboard` is step 1 of a 3-step onboarding pipeline:
1. `/onboard` — Ingest form data, research, generate project files + internal team brief
2. `/audit` — Email marketing audit using project files + available data
3. `/strategy` — Flow/automation strategy + list growth plan (client-facing, Czech)

## Files to Load

1. `context/packages.md`
2. `reference/flow-architectures-phase1.md`
3. `reference/quality-standards.md`
4. `projects/_templates/profile.md`
5. `projects/_templates/flows.md`

## Steps

### 1. Gather the Tally Form Data

Ask the AM:
> "Do you have the Tally onboarding form response for [client]? Paste it here — or if you don't have it yet, I'll ask you the key questions instead."

If AM pastes form data, parse it using the field mapping below. If not, ask the key questions conversationally.

**Note:** `/onboard` is standalone. After completion, it suggests the next step in the pipeline.

### Tally Form Field Mapping

**From Krok #1 (Basic Info):**
| Form Field | Maps To |
|---|---|
| Název e-shopu | Project folder name + profile header |
| Contact: Jméno, Pozice, Email, Telefon | `## Contact` in profile |

**From Krok #3 (Tool Access):**
| Form Field | Maps To |
|---|---|
| Brand materials folder link | `## Assets` in profile |
| Brand preferences/notes | `## Brand Voice` in profile |
| Analytics tools used | `## Tools` in profile |
| Current ESP | `## Technical Setup` — migration status |
| E-commerce platform | `## Technical Setup` — platform |
| Notes | `## Notes` in profile |

**From Krok #4 part 1 (Store Info):**
| Form Field | Maps To |
|---|---|
| Cíle pro tento rok (yearly goals) | `## Strategy & Goals` |
| 90-day success criteria | `## Strategy & Goals` |
| Průměrné PNO (avg cost ratio) | `## Performance` baseline |
| Doba mezi objednávkami (time between orders) | `[winback_delay]` + `[replenishment_delay]` in flows |
| Co nechcete dělat (what NOT to do) | `## Guardrails / What to Avoid` |
| Cesta zákazníka (customer journey) | `## Customer Journey` + flow variable inputs |
| Frekvence nových produktů (new product frequency) | `## Campaign Context` |
| Bestsellery | `[bestseller_categories]` in flows |
| Co fungovalo/nefungovalo (what worked/didn't) | `## What Works / What to Avoid` |

**From Krok #4 part 2 (Store Info continued):**
| Form Field | Maps To |
|---|---|
| Cílová skupina (target audience) | `## Audience / ICP` |
| Tone of voice | `## Brand Voice` |
| Hodnoty, vize, mise (values, vision, mission) | `## Brand` |
| 5 konkurentů (competitors) | `## Competitive Context` |
| Proč lidé nakupují / USP | `## Positioning` |
| Slevy ano/ne + detaily (discounts) | `[welcome_incentive]` + flow strategy context |

**Fields NOT used for onboarding** (operational only):
- Invoice email (Krok #1)
- Payment confirmation upload (Krok #2)
- Shopify Collaborator code (Krok #3)
- Access confirmation Y/N fields (Krok #3)

### 2. Research the Client Website

After receiving form data, visit the client's website URL and gather:
- Product catalog structure (categories, price range, hero products)
- Current popup / email capture (what's the offer? what does it look like?)
- Visual brand identity (colors, style, premium vs. value positioning)
- Any email signup confirmation or existing email footer
- Anything that fills gaps in the form data

**Do NOT ask the AM for info that's visible on the website or already in the form.** Research it yourself.

### 2b. Data Completeness Check

After receiving the Tally form data (and website research), evaluate what we have vs. what's missing. Present a completeness summary:

> **Data collected:** [list key data points we have]
>
> **Missing (would improve output quality):**
> - [Missing item] — [where AM can find it] — [what it affects]
>
> **Missing (nice to have, will estimate):**
> - [Missing item] — [default estimate]

Key data points to check:
- AOV (if missing → estimate from website price range, mark `[ESTIMATED]`)
- Database size (if missing → note in profile, affects flow volume estimates)
- Repeat purchase rate (if missing → use industry default for product type)
- Current campaign frequency (if missing → ask AM)
- Existing automations in old ESP (if migrating → affects audit baseline)

Rules:
- Never block on missing data — proceed with available information
- Mark estimated values with `[ESTIMATED]` tag in generated files
- `[CONFIRM]` = needs client verification. `[ESTIMATED]` = our best guess from available data.
- Always tell the AM exactly where to find missing data

### 3. Confirm and Fill Gaps (Conversational)

Present findings to the AM in a structured summary with options to confirm or correct:

> "Based on the form and my website research, here's what I've got for [Client]:
>
> **Brand voice:** [description] — Sound right, or should I adjust?
>
> **Welcome incentive:** [what you found] — Keep this for the welcome flow?
>
> **Reorder cycle:** [client's answer] — I'll use [X]D for winback delay. OK?
>
> **Primary upsell:** [suggestion based on catalog] — Agree, or different idea?
>
> **Missing:** [what you need from AM]"

Rules:
- Ask ONE thing at a time (or small batches of 2-3 related items)
- Always offer a suggested answer — AM just confirms or corrects
- Flag `[CONFIRM]` on anything you're guessing
- Don't ask about things you can figure out from the form or website
- If the AM says "looks good" or "yeah" — take it and move on

### 4. Generate Project Files

#### 4a. Create `projects/[name]/profile.md`

Use the template from `projects/_templates/profile.md`. Populate every section from form data + research + AM confirmations.

Key section sources:
- **Brand & Positioning:** Form (tone of voice, values, USP, competitors) + website research
- **Audience / ICP:** Form (cílová skupina) + website product positioning
- **Products:** Website research (categories, bestsellers, price range) + form
- **Strategy & Goals:** Form (yearly goals, 90-day criteria, PNO target)
- **What Works / What to Avoid:** Form (what worked/didn't + what they don't want)
- **Customer Journey:** Form (customer journey description)
- **Campaign Context:** Form (new product frequency) + discount details
- **Technical Setup:** Form (ESP, platform, analytics tools)
- **Performance:** Leave as "[Baseline to be set after audit]"
- **Flow Status:** "Phase 1 — Planned"
- **Email Sender Persona:** Leave as placeholder — populated during `/strategy`

#### 4b. Create `projects/[name]/flows.md`

Use the template from `projects/_templates/flows.md`. Populate variables:

| Variable | Source |
|---|---|
| `[welcome_incentive]` | Form (discounts) or website popup |
| `[primary_upsell]` | Website research (most obvious cross-sell) |
| `[winback_delay]` | Form (doba mezi objednávkami) |
| `[replenishment_delay]` | Form (same as winback for most clients) |
| `[bestseller_categories]` | Form (bestsellery) + website |
| `[vip_threshold]` | Estimate: 3-5x estimated AOV (ask AM if unknown) |
| `[review_timing]` | Product type: consumables 14D, durables 30D, fashion 21D |

Mark all Phase 1 flows as "Planned." Phase 2 as "Not started."
Flag uncertain variables with `[CONFIRM]`.

### 5. Generate Internal Team Brief

Create `projects/[name]/outputs/internal-brief.md`

**Language:** Czech.
**Audience:** Internal team only. Never sent to client.
**Purpose:** Anyone on the team should understand how to work with this client.

#### Brief Template

```
# Interní brief: [CLIENT NAME]
> Vygenerováno: [date] | Balíček: [package] | Fáze: Onboarding

---

## 1. Klient v kostce
<!-- 3-5 sentences: who they are, what they sell, why they came to us -->

## 2. Co prodávají
- Hlavní produkty:
- Cenový rozsah:
- Bestsellery:
- AOV: [value or [CONFIRM]]
- Cyklus opakovaného nákupu:
- Sezónní vzorce:

## 3. Komu prodávají
- Primární cílová skupina:
- Sekundární segmenty:
- Proč nakupují:
- Cesta zákazníka:

## 4. Brand a komunikace
- Osobnost značky:
- Tón komunikace:
- Slovník značky:
- Co nepoužívat:
- Vzorová komunikace:

## 5. Aktuální stav e-mail marketingu
- Platforma:
- Velikost databáze:
- Existující automatizace:
- Popup / lead capture:
- Frekvence kampaní:
- Známé problémy:

## 6. Technický setup
- E-commerce platforma:
- Integrace / rizika:
- Analytics:
- Stav přístupů:

## 7. Strategický kontext
- Cíle klienta (rok):
- 90denní cíle:
- PNO target:
- Co fungovalo / nefungovalo:
- Co klient výslovně nechce:

## 8. Příležitosti a doporučené priority
1. [Priority — why and expected impact]
2. [Priority — why and expected impact]
3. [Priority — why and expected impact]

## 9. Red flags a rizika
- [Flag]

## 10. Přístup ke značce — jak s nimi pracovat
<!-- Practical guidance for copywriter/designer -->

## 11. Položky k ověření [CONFIRM]
| Položka | Navrhovaná hodnota | Zdroj |

## 12. Přístupy — checklist
| Přístup | Stav |
|---|---|
| Klaviyo | [confirmed/pending] |
| E-commerce admin | [confirmed/pending] |
| Analytics | [confirmed/pending] |
| Brand materiály | [confirmed/pending] |
```

#### Content Guidelines

**Section 8 (Příležitosti):** Analytical synthesis, not transcription. Look at gaps, low-hanging fruit, product catalog opportunities, brand strengths email can amplify.

**Section 9 (Red flags):** Specific and actionable. E.g.: "Custom platform — verify Klaviyo integration before build."

**Section 10 (Přístup ke značce):** Practical guidance: how copywriter should write, what design direction, what content angles, what mistakes to avoid.

**Section 11 ([CONFIRM]):** Consolidate ALL [CONFIRM] items from both files into one table.

### 5b. Generate .docx for Internal Brief

After saving the .md file, generate a .docx version for sharing with the team:

```bash
python tools/md-to-docx.py \
  projects/[name]/outputs/internal-brief.docx \
  projects/[name]/outputs/internal-brief.md \
  --title "Interní brief: [CLIENT NAME]"
```

### 6. Summary Output

After generating all files, present:

1. **Files created** (with paths):
   - `projects/[name]/profile.md`
   - `projects/[name]/flows.md`
   - `projects/[name]/outputs/internal-brief.md`
   - `projects/[name]/outputs/internal-brief.docx`

2. **[CONFIRM] items** — list everything needing verification

3. **Red flags** — anything concerning from research

4. **Access checklist** — confirmed vs. pending

5. **Google Drive:** Ask the AM:
   > "Want me to upload the internal brief (.docx) to the client's Google Drive folder?"

## Next Steps

After onboarding is complete:
> "Next: Run `/audit [client]` to assess their current email setup."

## Notes

- Every form field must be mapped — don't drop data
- Flow variables must be reasonable for the product type
- Internal brief must be in Czech and genuinely useful — not reformatted form data
- Sections 8 and 10 must contain actual analysis
- All [CONFIRM] items must appear in the brief's Section 11
