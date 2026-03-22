---
name: strategy
description: Create flow architecture diagrams in Excalidraw + HTML strategy document for client approval. Visual-first strategy output.
argument-hint: [client-name]
disable-model-invocation: true
---

## What This Skill Does

Generates two outputs for client strategy presentation:
1. **Excalidraw flow diagrams** — per-flow PNG diagrams (hand-drawn style, transparent background), generated via `tools/generate-flows-[client].mjs`
2. **HTML strategy document** — branded, self-contained HTML with embedded flow PNGs + written explanation per flow

**Pipeline position:** `/onboard` → `/audit` → **`/strategy`** → client approves → `/brief` → cooperator writes → `/review`

**Monthly cycle:** Also used during Phase 2 expansion (months 3-4+) to present new flow additions.

---

## Files to Load

1. `context/packages.md` — package details for scope
2. `reference/flow-architectures-phase1.md` — standard Phase 1 flow structures (always)
3. `reference/flow-architectures-phase2.md` — Phase 2 flow structures (if applicable)
4. `reference/html-templates/strategy.html` — HTML formatting reference
5. `projects/$1/profile.md` — project profile
6. `projects/$1/flows.md` — flow variables and status
7. `projects/$1/outputs/internal-brief.md` — priorities and red flags (if exists)
8. `projects/$1/outputs/audit.html` — audit findings (if exists; also check `audit.md`)

---

## Steps

### 1. Review Context & Determine Scope

Ask the user:
- Which phase(s) to include (Phase 1 only, or Phase 1 + Phase 2)?
- Any specific client requests or flow customizations?
- Audit results if not already loaded

From the loaded files, identify:
- Client-specific variables from `flows.md` (incentives, delays, categories, thresholds)
- Which flows are already live vs. planned
- Audit findings that justify each flow recommendation
- All `[CONFIRM]` items that need client approval
- Email platform — use correct platform terminology from the project profile in flow descriptions

### 2. Define Email Sender Persona

Define who "sends" the emails for this client. This becomes part of the strategy output so the client sees and approves it.

**2a. Choose a name** — based on the client's strongest conversion persona (ICP).
The name should feel relatable to the target audience.
Example: [Client A]'s ICP is women 35-44 → sender = "[Contact from Client A]"
Example: [Client B]'s ICP is women 25-34 → sender = "[Contact from Client B]"

**2b. Define the persona** — 2-3 sentences: who she is, why this name, her personality.
Save to `projects/$1/profile.md` under `## Email Sender Persona`:

```markdown
## Email Sender Persona
- **Jméno:** [Name] z [Brand]
- **Proč [Name]:** [1-2 sentences — maps to which ICP, why this name resonates]
- **Profilová fotka:** AI-generovaná (Instagram-style, casual, ne příliš profesionální). Nano Banana 2.
- **Použití:** Sender name pro všechny designované e-maily. Plain text od zakladatele posílá "[Founder] z [Brand]." Transakční: "[Brand]"
```

**2c. Generate profile picture** — via `tools/generate-sender-photo.py` (Kie.ai Nano Banana 2 API):

Build the prompt based on the ICP research from `/onboard`. The persona should look like someone the target audience would trust and relate to — match age, gender, style, and vibe to the ICP.

```bash
python3 tools/generate-sender-photo.py \
  "Instagram profile picture, casual photo, [age] year old [gender/appearance matching ICP], warm smile, natural light, soft background, [brand-appropriate clothing style], looking at camera, friendly approachable vibe, not too professional, realistic photo" \
  projects/$1/assets/sender-profile.png
```

Then resize for web (300px max dimension):
```bash
sips -Z 300 projects/$1/assets/sender-profile.png --out projects/$1/assets/sender-profile-small.png
```

Requires `KIE_API_KEY` env var. Save as `projects/$1/assets/sender-profile.png`.

**2d. Sender usage rules:**
- Designed emails: "[Persona name] z [Brand]"
- Plain text founder emails: "[Founder name] z [Brand]"
- Transactional: "[Brand]"

### 3. Generate Excalidraw Flow Diagrams

**IMPORTANT: Do NOT use FigJam or `generate_diagram` MCP for flow diagrams. Use `tools/generate-flows-[client].mjs` instead.**

#### 3a. Create client-specific flow generator

Check if `tools/generate-flows-[client].mjs` exists. If not, create it by copying `tools/generate-flows.mjs` (reference implementation) and:
- Change `OUT_DIR` to `projects/$1/outputs/flow-diagrams`
- Replace all flow content with client-specific Mermaid definitions from `flows.md`
- Use `omitBackground: true` in the screenshot call for transparent PNG output
- Remove white background from `html, body` and `#wrap` elements

**CRITICAL:** Transparent background requires these two changes:
1. In HTML template: `html, body { background: transparent; }` and `#wrap { background: transparent; }`
2. In screenshot call: `const png = await wrap.screenshot({ type: 'png', omitBackground: true });`

#### 3b. Mermaid Flow Definitions

For each flow, use compact `flowchart LR` syntax. Color classes:

```javascript
const TRIGGER  = 'fill:#2d6a4f,stroke:#1b4332,color:#ffffff,font-weight:bold';
const EMAIL    = 'fill:#b7e4c7,stroke:#52b788,color:#1b4332';
const ENDNODE  = 'fill:#f1f3f5,stroke:#adb5bd,color:#495057';
const MOVETO   = 'fill:transparent,stroke:#339af0,color:#1864ab,font-weight:bold';
const DECISION = 'fill:#ffc9c9,stroke:#c92a2a,color:#1a1a2e,font-weight:bold';
```

Node types:
- `(["Text"]):::trigger` — Trigger/start nodes (dark green stadium)
- `["Text"]:::email` — Email action nodes (light green rect)
- `(("Text")):::decision` — Decision splits (pink circle)
- `(["Text"]):::moveto` — Routes to another flow (blue dashed stadium)
- `(["Text"]):::endnode` — Exit/end nodes (grey stadium)

**Typography rules in node text:**
- Non-breaking space after single-letter prepositions in languages where this applies (e.g., `"v\u00A0databázi"` in Czech, or equivalent in other languages)
- Non-breaking hyphen in compound words: `"re\u2011engagement"`

#### 3c. Run the generator

```bash
cd tools && node generate-flows-[client].mjs
```

Output: `projects/$1/outputs/flow-diagrams/NN-slug.png` (10 files)

Also create output directory first if needed:
```bash
mkdir -p projects/$1/outputs/flow-diagrams projects/$1/assets
```

#### 3d. Verify output

Check that 10 PNG files were created. Spot-check one PNG visually — should show hand-drawn style diagram on transparent background.

### 4. Generate HTML Strategy Document

Use `reference/html-templates/strategy.html` as the **formatting reference**, but the true visual reference is `projects/[example-client]/outputs/strategy.html` (the approved design). Study its:
- CSS (no borders on callouts, KPI cards, or flow-cards — flat fills only)
- Flow card structure (see Section 4b)
- Sender persona card with embedded photo
- Hover action buttons on flow diagrams

Generate a **complete, self-contained HTML file** with ALL CSS inline in a `<style>` tag.

#### 4a. Document Sections

**Header — reference pattern (REQUIRED):**

Copy the exact SVG logo from `projects/[example-client]/outputs/flow-strategy.html` (black version for header, white version for footer). Use this structure:
```html
<body><!-- border-top: 4px solid var(--accent) on body; padding: 0 40px 0 -->
<div class="doc-inner"><!-- padding-top: 44px -->
  <div class="doc-header">
    <div class="logo-wrap">[SVG LOGO — black paths]</div>
    <div class="doc-label">E-mailová strategie</div><!-- blue, uppercase, small -->
    <h1>[Client Name] — Phase [X] Setup</h1>
    <div class="meta">Balíček: [package] | Fáze: Phase [X] | Datum: [month year]</div>
  </div>
```

**Required header/body CSS:**
```css
body { border-top: 4px solid var(--accent); padding: 0 40px 0; /* NO overflow-x: hidden */ }
.doc-inner { padding-top: 44px; }
.logo-wrap { margin-bottom: 20px; }
.logo-wrap svg { height: 28px; width: auto; }
.doc-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); margin-bottom: 8px; }
h2 { font-weight: 600; /* NOT 800 */ border-bottom: none; /* NO underline */ margin-top: 60px; }
```

**Required footer — MUST include `.doc-footer` CSS (often forgotten):**
```css
.doc-footer { background: var(--text); margin: 56px -40px 0; padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; }
.doc-footer .footer-logo svg { height: 20px; width: auto; display: block; }
.doc-footer .footer-meta { font-size: 13px; color: var(--muted); }
```
```html
<div class="doc-footer">
  <div class="footer-logo">[SVG LOGO — white paths]</div>
  <div class="footer-meta">[YOUR_AGENCY] | [Client Name] | [Month Year]</div>
</div>
```
⚠️ **NEVER use `overflow-x: hidden` on body** — it breaks the footer's `margin: 56px -40px 0` negative-margin technique and the dark background won't render.

**Section 1 — Přehled:**
- Verdict box (`background: var(--blue-bg)` — light blue, NOT dark): 2-3 sentences — what we're building and why. No timeline promises ("do X týdnů") — clients will hold you to it.
- KPI grid (3 cards, NO borders): Počet automatizací / E-mailů celkem / Balíček (package name)
  - **NEVER include the platform name as a KPI** — adds zero value, every client knows the platform
- Blue callout: Výchozí situace — neutral description of current state. **Never frame as "broken promise"** (e.g., "subscribers were promised an email they never got"). Neutral: "pop-up and automation were paused; this strategy builds from scratch."

**Section 2 — Strategie růstu databáze:**
Yellow callout box — current popup state, recommendation, conversion goal, guardrail.

**Section 3 — Navržené automatizace:**
Group flows by customer journey stage with stage labels:
- **Akvizice nových kontaktů** (`.stage-label.acquisition`): Pop-up, Welcome Flow(s)
- **Záchrana nedokončených nákupů** (`.stage-label.recovery`): Abandoned Site, Product, Cart
- **Po nákupu** (`.stage-label.postpurchase`): Customer Thank You, Upsell/Cross-sell
- **Retence a reaktivace** (`.stage-label.retention`): Winback, Sunset

#### 4b. Flow Card Structure

Each flow uses this exact structure:

```html
<div class="flow-card" data-flow-index="[N]">
<div class="flow-header">
  <span class="flow-num">#[N]</span>
  <span class="flow-title">[Flow Name]</span>
</div>
<div class="flow-body">
  <p><strong>Kdo dostane tuto flow:</strong> [Detailed description of who enters — conditions, exclusions, edge cases]</p>
  <p class="trigger-note">Trigger: [trigger description]&nbsp;·&nbsp;[X] e-mailů</p>
  <p><strong>Proč tato flow:</strong> [1-2 sentences grounded in THIS client's audit findings — why this matters for them specifically]</p>
  <p><strong>Jak funguje:</strong></p>
  <ul>
    <li><strong>E-mail 1 (timing):</strong> [Description]</li>
    <li><strong>E-mail 2 (timing):</strong> [Description]</li>
    <!-- etc. -->
  </ul>
</div>
<div class="flow-diagram">
  <img alt="[Flow name] flow diagram" src="flow-diagrams/[NN-slug].png"/>
  <div class="flow-actions">
    <button class="flow-btn-download" data-flow-name="[slug]" type="button">&#11015; Stáhnout</button>
    <button class="flow-btn-upload" type="button">&#128444; Nahradit obrázek</button>
    <input accept="image/*" class="flow-upload-input" style="display:none" type="file"/>
  </div>
</div>
</div>
```

**IMPORTANT CSS for flow diagrams:** The `flow-diagram` div should have `background: white; border-radius: 8px;` so the transparent PNG renders on a clean white background inside the card. Do NOT use `mix-blend-mode: multiply`.

**Flow diagram slug naming:** The slug must match the actual flow purpose. Example: if Flow #9 is "Replenishment Reminder", the slug is `09-replenishment.png`, NOT `09-winback.png`. Update both the generator and the HTML img src together.

**Section 4 — Kdo vám bude psát (Sender Persona) — reference pattern (REQUIRED):**
```html
<h2>4. Kdo vám bude psát</h2>
<!-- Main persona: photo + description -->
<div class="persona-card">
  <img alt="[Name] z [Brand]" class="persona-avatar-img" src="data:image/png;base64,[BASE64_OF_SENDER_PHOTO]"/>
  <div class="persona-info">
    <h3 style="margin: 0 0 8px;">[Name] z [Brand]</h3>
    <p>[2-3 sentences: who they are, why this name, personality aligned with ICP]</p>
  </div>
</div>
<!-- 3-column sender grid: designed / plain text / transactional -->
<div class="sender-grid">
  <div class="sender-col">
    <div class="sender-avatar" style="background: var(--accent);">[Initial]</div>
    <h4>Grafické e-maily</h4>
    <div class="sender-name">[Name] z [Brand]</div>
    <p>[Which flows — welcome, cart, upsell, etc.]</p>
  </div>
  <div class="sender-col">
    <div class="sender-avatar" style="background: var(--text);">[Initial]</div>
    <h4>Plain text e-maily</h4>
    <div class="sender-name">[Founder] (zakladatel)</div>
    <p>[Which flows — winback, sunset, etc.]</p>
  </div>
  <div class="sender-col">
    <div class="sender-avatar" style="background: var(--text);">[B]</div>
    <h4>Transakční e-maily</h4>
    <div class="sender-name">[Brand]</div>
    <p>Systémové e-maily — potvrzení objednávky, sledování zásilky.</p>
  </div>
</div>
```

**Required CSS for sender section:**
```css
.persona-card { display: flex; align-items: center; gap: 20px; background: var(--bg-light); border-radius: 15px; padding: 24px 28px; margin: 18px 0; }
.persona-avatar-img { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.sender-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0; }
.sender-col { background: var(--bg-light); border-radius: 15px; padding: 20px 22px; }
.sender-avatar { width: 40px; height: 40px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; margin-bottom: 12px; }
.sender-name { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
```

Embed the sender photo as base64 (use `projects/$1/assets/sender-profile-small.png`):
```bash
python3 -c "import base64; print(base64.b64encode(open('projects/$1/assets/sender-profile-small.png','rb').read()).decode())"
```

**Section 5 — Co od vás potřebujeme:**
Blue callout with `.checklist` of all `[CONFIRM]` items + approval items.
Add orange callout for technical verification items (integrations, tracking, tags).

**Section 6 — Co bude následovat:**
Dark callout + Phase 2 table (same format as the reference strategy).

**Footer:**
```html
<div class="spacer"></div>
<p class="note" style="text-align:center">[YOUR_AGENCY]&nbsp; | &nbsp;[Client Name]&nbsp; | &nbsp;[Month Year]</p>
```

#### 4c. Required JavaScript

Include at the bottom of `<body>`:
```javascript
// Upload button handler
document.querySelectorAll('.flow-btn-upload').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.nextElementSibling;
    if (input && input.type === 'file') input.click();
  });
});
// File input: replace diagram PNG + save to localStorage
document.querySelectorAll('.flow-upload-input').forEach(input => {
  input.addEventListener('change', () => {
    if (!input.files[0]) return;
    const card = input.closest('.flow-card');
    const idx  = card.dataset.flowIndex;
    const img  = card.querySelector('.flow-diagram img');
    const reader = new FileReader();
    reader.onloadend = () => {
      if (img) img.src = reader.result;
      localStorage.setItem('flow-diagram-' + idx, reader.result);
    };
    reader.readAsDataURL(input.files[0]);
    input.value = '';
  });
});
// Download button handler
document.querySelectorAll('.flow-btn-download').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.flow-card');
    const img  = card.querySelector('.flow-diagram img');
    if (!img) return;
    const a = document.createElement('a');
    a.href = img.src;
    a.download = (btn.dataset.flowName || 'flow-diagram') + '.png';
    a.click();
  });
});
// Restore uploaded diagrams from localStorage
document.querySelectorAll('.flow-card').forEach(card => {
  const idx   = card.dataset.flowIndex;
  const saved = localStorage.getItem('flow-diagram-' + idx);
  if (saved) {
    const img = card.querySelector('.flow-diagram img');
    if (img) img.src = saved;
  }
});
```

#### 4d. Writing Style

- **Language:** Follow the project profile language. Professional but approachable. No overselling.
- **Entry conditions:** Detailed entry conditions — who gets in, who is excluded, what edge cases exist. Use platform-specific terminology from [YOUR_PLATFORM].
- **Proč tento flow:** 1-2 sentences grounded in audit findings — don't make generic claims.
- **Jak funguje:** Numbered email list with timing. Mention content splits explicitly (e.g., "Varianta A: ... Varianta B: ...").
- All `[CONFIRM]` items must appear in Section 5.

### 5. Save Outputs

Save the HTML file to:
- `projects/$1/outputs/strategy.html` (primary)
- `reports/[client-slug]/strategy.html` (Vercel deployment copy)

Also copy the flow-diagrams folder:
```bash
cp -r projects/$1/outputs/flow-diagrams reports/[client-slug]/flow-diagrams
```

### 6. Present Summary

After completing all outputs, report:
- HTML file location(s)
- Email sender persona (name, rationale)
- List of `[CONFIRM]` items awaiting client approval

### 7. Pre-Send Document Review

After generating the strategy HTML, run the Document Review loop before presenting to the AM.

**The loop:**
1. Run Document Review (reviewer agent, Document Review mode) on the generated HTML
2. For each Category A/C FAIL → auto-fix in the HTML
3. For each Category B flag → ask the AM the targeted question → AM confirms keep or fix
4. For each Category D WARN → include in the review report for AM awareness
5. Re-run review on the updated document
6. Repeat until VERDIKT = "Připraveno k odeslání"
7. Then open in Chrome

The AM only gets asked Category B questions — they never manually fix anything.

Then ask the AM:
> "Want me to upload the strategy outputs (HTML, sender profile photo) to the client's Google Drive folder?"

## Next Steps

After strategy is generated:
> "Next: Send strategy to client for approval (Freelo + Loom). After approval: Run `/brief [client]` to generate briefs for cooperator."

---

## Flow Generator Config (`tools/generate-flows-[client].mjs`)

**Mermaid settings:**
- `look: 'handDrawn'`, `theme: 'base'`, `curve: 'basis'`
- `fontSize: '44px'`, `lineColor: '#333333'`
- `padding: 20`, `nodeSpacing: 80`, `rankSpacing: 80`, `wrappingWidth: 350`
- `viewport: 2400×1400`, `deviceScaleFactor: 2`
- Edge labels: `font-size: 22px`, transparent background
- Arrow stroke: `2.5px`

**Transparent background (REQUIRED):**
- HTML: `background: transparent` on `html, body` and `#wrap`
- Screenshot: `omitBackground: true` in `wrap.screenshot()` call

**SVG post-processing (automatic):**
- Hachure → solid fills: removes rough.js diagonal hatching, inserts clean SVG rect/ellipse as fill background
- Circle detection uses CSS class `decision`
- Fill shapes are 2px inset so hand-drawn outline always covers edges
- Virgil font enforced on all text, viewBox auto-fitted

**Content rules:**
- **Moveto nodes:** Never prefix with "→" — the arrow already shows direction.
- **Email count:** Diagram must match the text description. Verify before output.
- **Complex flows (3+ decisions):** Consider `flowchart TB` layout.
- **Reference style:** `reference/flow-strategy-template/`
- **Upsell/Cross-sell E2 timing:** E2 in each branch fires +1D after E1 (e.g., E1A at +14D, E2A at +1D — NOT +16D from trigger). Label as "+1D" in the diagram node. Sending E2 16 days after purchase kills context — the contact has forgotten E1. The two emails are a series, not standalone sends.
- **Flow priority & conflict management (Welcome vs. Abandonment):** Welcome flow must have exit conditions for `Viewed Product` and `Started Checkout`. When a contact shows buying intent, Welcome exits and the higher-RPR abandonment flow takes over. See `reference/flow-architectures-phase1.md` → Flow Priority & Conflict Management for full implementation details and client argument.

---

## CSS Design System

The strategy HTML uses the **same design system as the audit template** (`reference/html-templates/audit.html`):

**Key rules (do not deviate):**
- KPI cards: `background: var(--bg-light); border-radius: 15px;` — NO border
- Callout boxes: flat fills per type — NO border
- Flow cards: `background: var(--bg-light); border-radius: 15px;` — NO border
- Flow diagram container: `background: white; border-radius: 8px;` — this is where the transparent PNG renders
- Persona card: `background: var(--bg-light); border-radius: 15px; display: flex; gap: 24px;`
- Persona photo: `width: 120px; height: 120px; border-radius: 50%; object-fit: cover;`

**The reference for the correct design is:** `projects/[example-client]/outputs/strategy.html`

---

## Flow Strategy Quality Checklist

Before finalizing any flow strategy HTML output, verify:

### Language & Typography
- Follow locale-specific grammar rules for the client's language. Apply correct grammatical gender and declension where required.
- Always use proper diacritics for the target language.
- **Non-breaking spaces:** Use `\u00A0` after single-letter prepositions in node text where applicable.
- **Non-breaking hyphens:** Use `\u2011` in compound words that shouldn't break: `"re\u2011engagement"`.

### Flow Descriptions
- **"Kdo dostane tuto flow:"** is required — detailed entry conditions, exclusions, edge cases.
- **"trigger-note" class:** `Trigger: [description]&nbsp;·&nbsp;[count] e-mailů` — italic, muted, appears after "Kdo dostane".
- **Conditional branches within a flow:** When a flow has two customer categories (e.g., matcha vs. supplements), use separate labeled branches with their own email list. Do NOT collapse two variants into a single "Varianta A: ... Varianta B: ..." bullet. Use "Větev A — [Label]:" / "Větev B — [Label]:" as subheadings within the `<ul>`.
- **Email count in trigger-note must match the actual email count.** If 2 branches × 2 emails = 4 emails, write "4 e-maily (2 větve × 2)".
- **Welcome New Subscriber flow — always LINEAR, no decision branches.** 4 emails in sequence. Do NOT split by product category (matcha vs. supplements) in the diagram. Category personalization belongs in the copywriter brief — the email content adapts, the flow structure does not branch. The diagram should be: Trigger → E1 → E2 → E3 → E4 → Další flows.
- **Welcome Re-subscribe flow — NO decision branch.** This flow is always one email for everyone. [YOUR_PLATFORM] recognizes re-subscribers as existing contacts — they do NOT receive the popup discount code. The email must acknowledge this situation with a friendly, slightly humorous tone and welcome them back warmly with news and bestsellers. NEVER add a decision branch splitting by purchase history — the entry conditions description clarifies who gets the flow, the email itself is universal.
- **Don't cite empty metrics negatively.** E.g., "0% CTR, 0 Kč revenue" on a nurturing/UX flow is misleading — the flow isn't for revenue, it's for relationship building. Omit revenue metrics for flows that aren't designed for direct conversion.

### Section 5 Checklist — Items to EXCLUDE
Never include these in the client checklist:
- ❌ Platform access provisioning — always done before this phase
- ❌ Platform integration verification — not the client's responsibility; the agency handles this
- ❌ Attribution window confirmation — always standard; never needs confirmation
Include only: strategy approval, incentive confirmations, content decisions, VIP thresholds, sender persona approval.

### Section 6 Phase 2 Table — consistency with Phase 1
When a flow is moved FROM Phase 2 to Phase 1, immediately update the Phase 2 table and text to reflect the change. Example: if Replenishment Reminder is added to Phase 1, Customer Winback replaces it in Phase 2. Never have the same flow in both phases.

### Sender Persona
- Profile picture must be generated via `tools/generate-sender-photo.py` before writing HTML — NEVER use a placeholder SVG.
- Use the **reference sender section pattern** (`.persona-card` + `.sender-grid` 3-column), NOT the old `persona-rules` pattern.
- **Photo style:** Front-facing camera close-up selfie — face and shoulders, warm smile, no phone visible. NOT mirror selfies (bathroom context inappropriate for client-facing docs), NOT professional headshots. Prompt example: "Close-up selfie photo, [age] year old [nationality] woman, warm genuine smile, friendly and approachable, front-facing camera shot, face and shoulders only, no phone visible, natural light from window, casual everyday clothes, [brand-appropriate vibe], real person not model, soft background, authentic candid feel"
- Minimum 96px render size. Resize to 300px max before base64 embedding.
- Embed as base64 in `<img src="data:image/png;base64,...">` — do NOT use relative path.

### Template Alignment
- Matches reference design: no borders on cards/callouts, flat fills, Manrope font.
- Header uses `.logo-wrap` + `.doc-label` + h1 structure, NOT just `<div class="brand">[YOUR_AGENCY]</div>`.
- `.verdict` box uses `background: var(--blue-bg)` — light blue. NOT dark background.
- h2 headings: `font-weight: 600`, no `border-bottom`. NOT font-weight 800 or underlined.
- `.doc-footer` CSS must be present — it's frequently forgotten. Check before finalizing.
- No `overflow-x: hidden` on body — breaks footer negative-margin background.
- Flow diagram PNGs have transparent background — no need for `mix-blend-mode: multiply`.
- Flow diagram container has `background: white` to render transparent PNGs cleanly.

### Section 2 — Database Growth Strategy

**Use the client's specific data when available** — prefer the exact figure (e.g., "7,7 %") over the generic range. If no specific client data is available, use the agency benchmark range (6–8 %) as a reference.

**"Above average" (nadprůměrný) means ABOVE the benchmark ceiling** — only use it if the result clearly exceeds the top of the range (e.g., >8 % CVR). A result within the range (e.g., 7,7 % within 6–8 %) is "solidní výsledek v rámci standardního rozsahu." A result below the range is a flag, not a neutral observation.

**Structure of the pop-up callout (yellow box):**
1. **Výchozí situace** — old state with specific client numbers (CVR, old minimum, old effective discount %). Show the math: `200 Kč / 700 Kč = 28 %`.
2. **Co měníme** — exact change + math showing the improvement: old % → new %. Include AOV context to justify the new minimum ("AOV is ~X Kč, so the new minimum is naturally achieved by most orders").
3. **Cíl Phase 1** — maintain CVR at the specific historical number. Verify the minimum change had no negative impact.
4. **Testování v Phase 2** — future A/B test plan: test discount amount (e.g., 200 → 150 Kč) vs. minimum spend increase, measure submit rate impact. Goal: find the lowest-cost offer that still converts.

**When recommending a minimum order change:**
- Show old effective discount %: `old_discount / old_minimum`
- Show new effective discount %: `old_discount / new_minimum`
- Justify the new minimum against AOV: new minimum should be ≤ AOV so most orders naturally qualify
- Never recommend reducing the discount amount in Phase 1 — only the minimum. Reducing the offer amount is a Phase 2 test.

**Frame as "improvement to unit economics," not "the mechanism is broken."** The pop-up worked — we're making it cheaper, not fixing a failure.

---

## Error Handling

| Scenario | Action |
|----------|--------|
| `generate-flows-[client].mjs` doesn't exist | Create it (copy from the reference implementation, adapt content). This is always needed for a new client. |
| Flow PNG generation fails | Check Mermaid syntax. Simplify complex flows. Try `flowchart TB` for 3+ decision flows. |
| `generate-sender-photo.py` fails | Check `KIE_API_KEY` env var. Use placeholder and note in summary for manual follow-up. |
| `flows.md` has `[CONFIRM]` variables | Render literally in diagram and HTML. Consolidate all in Section 5. |
| No audit file available | Generate strategy based on architecture + profile. Mark audit-dependent insights: "Bude upřesněno po auditu." |

---

## Notes

- This is a **client-facing** document — professional tone, no internal notes
- Per flow: concise but complete. "Kdo dostane" should be thorough (clients need to understand the logic).
- Focus on WHAT THE CLIENT GETS, not technical platform implementation details
- Every flow recommendation must be grounded in audit findings, not generic claims
- FigJam diagrams are obsolete — use `tools/generate-flows-[client].mjs` exclusively
- Flow images use transparent background — render them on `background: white` container in HTML

## Quality Standard

The **[example strategy]** is the reference for output quality. Before delivering any strategy, verify it matches this bar:

**Section 2:**
- [ ] Specific CVR number used when available; range only as fallback. Framing: "solidní výsledek" if within benchmark, "nadprůměrný" only if above the ceiling (>8 %)
- [ ] Unit economics math shown: old minimum → new minimum, old % → new %
- [ ] AOV cited to justify new minimum
- [ ] Phase 1 goal: maintain CVR. Phase 2 plan: test offer variables

**Flow diagrams:**
- [ ] Welcome New: linear (Trigger → E1 → E2 → E3 → E4 → Další flows), zero branches
- [ ] Welcome Re-subscribe: 1 email, no branches, humorous pop-up discount acknowledgment
- [ ] Upsell E2: labeled "+1D" (after E1), never a fixed day from trigger
- [ ] Every diagram matches its text description exactly — email count, timing, branches

**"Kdo dostane tuto flow" quality:**
- [ ] Entry conditions clearly stated
- [ ] Exit conditions stated for Welcome, Abandoned Product, Abandoned Cart
- [ ] Flow priority logic explained (Welcome yields to Abandoned Product, Abandoned Product yields to Abandoned Cart)
- [ ] Abandoned Site entry filter mentioned (subscribed >7 days)
- [ ] Abandoned Cart: highest priority, Smart Sending OFF noted

**Section 5:**
- [ ] No forbidden checklist items (platform access, integration verification, attribution window)
- [ ] Only: strategy approval, incentive confirmation, sender persona approval, content decisions

**Visual:**
- [ ] Sender photo: front-facing selfie, no phone visible, close crop, warm smile
- [ ] Footer CSS present (`.doc-footer` with negative margin)
- [ ] Verdict box: light blue background, not dark
- [ ] h2: font-weight 600, no border-bottom
