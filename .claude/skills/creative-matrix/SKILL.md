---
name: creative-matrix
description: Use when building a paid ads creative matrix, evaluating ad creative performance, or iterating on ad creatives. This is for paid ads projects only — NOT for email marketing or standard [YOUR_AGENCY] retention clients.
argument-hint: [client-name] [build|evaluate|iterate]
disable-model-invocation: true
---

## What This Skill Does

Manages the full creative pipeline for paid ad creatives: building a strategic matrix of ad concepts, evaluating performance data to find winners and losers, and briefing iteration batches that leverage winning elements.

**Context:** This skill is for paid ads projects only (Meta Ads, Google Ads, TikTok, LinkedIn). It applies to projects with paid acquisition — a "creative" here means a visual asset for digital ads (static banner or video).

**Multi-matrix architecture (optional):**
For more complex funnels, you can layer multiple matrices that feed into each other. For simpler projects, a single creative matrix works fine.

[Define your matrix architecture here if you use a multi-matrix system — e.g., offer matrix feeding into creative matrix.]

**Three modes:**
- **build** — Create a new creative matrix from scratch (pain points × audience levels × visual approaches)
- **evaluate** — Analyze performance data from a running batch, identify winning and losing elements
- **iterate** — Brief the next batch of creatives using evaluation insights

## Files to Load

1. `projects/$1/profile.md` (ICPs, pain points, positioning, brand voice, constraints)
2. `projects/$1/outputs/creative-matrix.md` (if exists — the current matrix, needed for evaluate and iterate)
3. `projects/$1/outputs/creative-evaluation-batch-*.md` (if exists — load most recent, needed for iterate)

## Steps

### 1. Determine Mode

Parse `$2` argument. If not provided, ask:

> "What mode do you want to run?
> - **build** — Create a new creative matrix from scratch
> - **evaluate** — Analyze performance data, identify winning and losing elements
> - **iterate** — Brief the next batch using evaluation insights"

Validate prerequisites:
- **build** — Needs the project profile with ICPs and pain points. If profile is sparse, flag what's missing.
- **evaluate** — Needs `projects/$1/outputs/creative-matrix.md` to exist. If not found, suggest running build first.
- **iterate** — Needs both `creative-matrix.md` and at least one `creative-evaluation-batch-*.md`. If evaluation doesn't exist, suggest running evaluate first.

---

### 2. BUILD Mode — Create the Creative Matrix

#### 2a. Gather Inputs

Pull ICPs, pain points, and proof from the project profile. Then confirm with the AM.

**If using multi-matrix architecture:** Load your matrix reference files first.

[Add your reference file paths here]

**X-axis — audience levels (matrix columns):**

Determine audience levels from the profile. Ask:

> "I found these audience segments: [list]. These will be the matrix columns. Correct?"

If the profile contains psychographic archetypes, use those as a tagging layer inside each cell, not as columns.

[Define how you segment your audience within the matrix — as columns, tags, or layers]

**Pain points — include sub-pain points:**

Pull both the main pain point categories AND detailed sub-bullets (the raw language prospects use).

> "I found these pain points with sub-bullets: [list with sub-bullets]. Add, remove, or confirm?"

**Visual approaches — with sub-types:**

> "Default visual approaches and sub-types:
> - **Talking Head** — a profil, b-rolls
> - **B-roll** — filming, lifestyle, caption-IG, inspirational quote style
> - **Storytelling** — progression shots, before/after, storytelling
> - **Podcast** — interview style, clip from existing episode
> - **Note/Tweet** — text only
> - **Testimonials** — interview, review compilation, written questions + video
>
> Which work for this client? Any to add, remove, or modify based on their assets and capabilities?"

Also gather:
- **Proof points** — What results, testimonials, case studies, or data can be referenced?
- **Constraints** — Any assets, testimonials, or approaches that CANNOT be used in ads? (Check the profile for restrictions like "X testimonial cannot be used in ads")

#### 2b. Generate the Matrix

Create a grid document:

**Header:**
- Client name, date, Batch 1
- ICPs (columns)
- Pain points (rows)
- Visual approaches (sidebar reference)

**Left column — pain points with sub-bullets:**

Each pain point row starts with the main pain point label and its sub-pain points (raw prospect language) listed as bullets. These sub-bullets are source material for hooks and copy — they're how real prospects describe the problem.

**Body — for each pain point x targeting ICP cell, generate 1-2 creative concepts:**

| Field | Description |
|-------|-------------|
| Hook | First 3 seconds / headline — what stops the scroll. Pull language from sub-pain points when possible. |
| Angle | Which pain point, how it frames the problem for this targeting ICP |
| Archetype | Which prospect archetype this concept speaks to (e.g., "Burned Buyer", "Capacity Crunch"). One concept can speak to multiple archetypes. |
| Visual approach | Which format + sub-type best serves this concept (e.g., "Talking Head — a profil", "B-roll — caption-IG") |
| Proof element | What case study, stat, or testimonial supports it |
| CTA direction | What action the ad drives |

Group by pain point (row), with sub-columns for each targeting ICP.

#### 2c. Recommend First Batch

At the bottom of the matrix:
- Total creative concepts generated
- Distribution by visual approach and ICP
- **Recommended first batch** (10-20 creatives) with rationale — cover multiple pain points, ICPs, and visual approaches for maximum learning. No spray and pray — every creative in the first batch follows the established strategy.

#### 2d. Visual Grid Output (Optional)

Ask:

> "Want me to generate a visual grid of the matrix as a PNG?"

If yes, generate an HTML file with a CSS grid layout that mirrors the matrix structure:

- **Header row:** ICP columns (purple headers with role + company size)
- **Pain point sections:** White card rows, one per pain point, containing:
  - Left column: pain point label + sub-pain point bullets
  - One concept card per ICP column, showing: concept ID, hook, angle, proof, CTA, archetype tag, visual approach tag
  - Two rows of cards if 2 concepts per cell
- **Sidebar:** Visual approaches reference with color-coded cards and sub-types
- **Styling:** Clean, professional, Google Docs-friendly. Use color tags for archetypes and visual approaches.

See `projects/[example-project]/reference/creative-matrix-grid.html` as the reference template.

Save the HTML to `projects/$1/reference/creative-matrix-grid.html`, then use Chrome DevTools MCP to:
1. Navigate to the local HTML file (`file:///` URL)
2. Resize the page to 1400px wide
3. Take a full-page screenshot
4. Save as `projects/$1/reference/creative-matrix.png`

**Note:** Do NOT use the Figma MCP `generate_diagram` tool for the matrix — it uses Mermaid.js which can only produce flowcharts, not grid layouts. The HTML approach produces a proper grid matching the expected format (see `reference/creative-matrix-example.png`).

---

### 3. EVALUATE Mode — Analyze Performance Data

#### 3a. Gather Performance Data

Ask:

> "How would you like to provide the performance data?
> 1. **Paste a table** — Copy from ad manager (columns: creative name/ID, spend, impressions, CPC, CTR, CPA, ROAS, CVR)
> 2. **Paste a screenshot** — I'll read the data from the image
> 3. **Describe results** — Tell me which creatives performed best/worst and any metrics you have"

Parse whichever format is provided. If screenshot, extract the data from the image.

Minimum data needed per creative:
- Creative identifier (name, number, or description matching the matrix)
- At least one performance metric (CPC, CTR, CPA, ROAS, or CVR)
- Spend (to filter out insufficient data)

#### 3b. Data Sufficiency Check

> "What minimum spend qualifies a creative for evaluation? (Suggested: $50-100 or equivalent in local currency)"

Filter out creatives below threshold. Flag any with fewer than 1,000 impressions as potentially unreliable.

> "I see [X] creatives with sufficient data and [Y] with too little spend/impressions. Proceeding with [X]. Include the low-data ones with a caveat?"

#### 3c. Rank and Classify

Ask which metric to optimize for:

> "Which metric should I rank by? Default: CPA (cost per acquisition). Other options: CTR, CPC, ROAS, CVR."

Rank all creatives by the chosen metric. Classify:
- **Top 10%** — Winners
- **Middle 80%** — Average (note any trending up or down)
- **Bottom 10%** — Losers

For small batches (fewer than 20 creatives): top 2-3 and bottom 2-3.

#### 3d. Extract Winning Elements

Analyze what the top performers have in common across these dimensions:
- **Hook type** — What kind of opening stopped the scroll?
- **Pain point** — Which pain points resonated?
- **ICP targeting** — Which ICP responded better?
- **Visual approach** — Which format performed best?
- **Proof element** — What kind of social proof was used?
- **Tone/messaging** — Any common messaging patterns?
- **Length/format** — Short vs. long, structural patterns

Present as a clear **Winning Elements** list.

#### 3e. Extract Losing Elements

Same analysis for bottom performers:
- Which hooks fell flat?
- Which pain points didn't resonate?
- Which visual approaches underperformed?
- Any common anti-patterns?

Present as a clear **Losing Elements** list.

#### 3f. Creative Fatigue Assessment

For top performers specifically:
- Are any showing signs of fatigue? (declining CTR/CVR over time, increasing CPC)
- Estimated remaining runway before they need replacement
- **Urgency flag:** how soon does the next batch need to be ready?

#### 3g. Visual Output (Optional)

If the AM wants a visual summary, generate an HTML file with a grid layout showing:
- Ranked creatives with color coding (green = winners, yellow = average, red = losers)
- Winning and losing elements side by side
- Fatigue indicators

Use Chrome DevTools MCP to screenshot and save as `projects/$1/reference/creative-evaluation-batch-[N].png`.

---

### 4. ITERATE Mode — Brief the Next Batch

#### 4a. Load Previous Context

Load the most recent `creative-evaluation-batch-*.md`. Summarize:

> "Based on the last evaluation (Batch [N], [date]):
> - **Winning elements:** [list]
> - **Losing elements:** [list]
> - **Fatigue status:** [summary]
>
> Ready to brief the next batch?"

#### 4b. Define Iteration Strategy

Ask:

> "For the next batch, how should we iterate?
> 1. **Double down on winners** — Variations of top performers (lower risk, optimize what works)
> 2. **Explore new territory** — Test new pain points or visual approaches not yet tried (higher risk, expand reach)
> 3. **Mix** — 60% winner variations + 40% new explorations (recommended)"

#### 4c. Generate Iteration Brief

For each creative in the new batch:

| Field | Description |
|-------|-------------|
| Batch | Batch N+1 |
| Concept | Hook + angle + visual approach + proof + CTA |
| Lineage | Which winning element(s) it leverages, or "NEW" if exploring |
| Avoids | Which losing elements it explicitly steers away from |
| Reference | Which top performer inspired it (if a variation) |
| Hypothesis | What this creative tests (e.g., "Tests whether 'agency PTSD' pain works with B-roll") |

#### 4d. Coverage Analysis

Show which matrix cells (pain point x ICP x visual approach) have been:
- Tested with sufficient data
- Produced winners
- Produced losers
- Remain untested

Highlight untested combinations as opportunities for exploration.

#### 4e. Production Notes

For each creative, add:
- Filming/design requirements
- Assets needed (screenshots, testimonials, footage)
- Estimated production effort (light/medium/heavy)

#### 4f. Visual Output (Optional)

If the AM wants a visual summary, generate an HTML file with a grid layout showing the updated matrix with:
- Color coding: tested cells (green/red by result) vs. untested cells (gray)
- Iteration lineage annotations (which winner inspired which new concept)
- New batch concepts highlighted

Use Chrome DevTools MCP to screenshot and save as `projects/$1/reference/creative-iteration-batch-[N].png`.

---

## Output

**Markdown files (source of truth):**
- **Build mode:** `projects/$1/outputs/creative-matrix.md`
- **Evaluate mode:** `projects/$1/outputs/creative-evaluation-batch-[N].md` (N = batch number)
- **Iterate mode:** `projects/$1/outputs/creative-iteration-batch-[N].md` (N = next batch number)

**HTML grid files (visual source):**
- **Build mode:** `projects/$1/reference/creative-matrix-grid.html`
- **Evaluate mode:** `projects/$1/reference/creative-evaluation-batch-[N]-grid.html`
- **Iterate mode:** `projects/$1/reference/creative-iteration-batch-[N]-grid.html`

**PNG screenshots (visual reference, generated from HTML via Chrome DevTools):**
- **Build mode:** `projects/$1/reference/creative-matrix.png`
- **Evaluate mode:** `projects/$1/reference/creative-evaluation-batch-[N].png`
- **Iterate mode:** `projects/$1/reference/creative-iteration-batch-[N].png`

Format markdown for Google Docs copy-paste. Use tables for the matrix grid. Clean headers and bullet points. No markdown code blocks in the output.

The matrix file (`creative-matrix.md`) is overwritten on rebuild. Evaluations and iterations are batch-numbered to preserve history. PNG files follow the same naming convention and are saved to `reference/` (not `outputs/`) for easy visual reference. The HTML grid template at `projects/[example-project]/reference/creative-matrix-grid.html` serves as the reference for the expected visual format. See also `reference/creative-matrix-example.png` for the generic grid structure.

## Notes

- **Paid ads only.** This skill is for paid ad creative management on platforms like Meta, Google, TikTok, LinkedIn.
- **Data-only judgement.** Creatives are evaluated ONLY by performance data (CPC, CTR, CPA, ROAS, CVR). Never judge subjectively — "ugly" ads that perform well are winners.
- **Creative fatigue is inevitable.** Every top performer will decline. The pipeline exists to have fresh creatives ready before winners fatigue. Flag urgency when top performers show declining metrics.
- **Minimum viable data.** Don't evaluate creatives with insufficient spend or impressions. Premature kills waste potential winners. Let the AM set thresholds.
- **Batch 1 is strategic, not random.** The first batch should cover multiple pain points, ICPs, and visual approaches for maximum learning.
- **Screenshots are valid input.** The AM may paste screenshots from ad dashboards. Read them as images and extract the data.
- **Project constraints matter.** Always check the profile for restrictions (e.g., "X testimonial cannot be used in ads"). These are hard constraints.
- **Language.** Creative concepts should be in the language of the target audience. Evaluation analysis follows whatever language the AM uses.
- **The matrix is a living document.** After each evaluate/iterate cycle, tested cells gain data and untested cells become priorities.
- **Hook format.** Hooks should be multi-sentence script drafts (3-5 sentences) that the founder or talent can riff on when filming — not one-liners or headlines. All strategy, analysis, and rationale can stay in English for quality.
- **HTML grid is primary.** Always generate the HTML grid (`reference/creative-matrix-grid.html`) — it's the production artifact the AM works from. The markdown file is a reference backup, not the working document.
- **Multi-matrix architecture (optional).** [Define your multi-matrix system here if applicable]
- **Every hook needs a proof point.** Pair each hook with a specific result, testimonial, or data point. Generic authority claims belong on landing pages, not in ad creatives.
