---
name: search
description: Search the workspace knowledge base — SOPs, methodology, benchmarks, client profiles, and outputs. Use when looking for a specific SOP, methodology note, benchmark, or client data without reading entire files.
argument-hint: "[query]"
---

## What This Skill Does

Searches across the [YOUR_AGENCY] knowledge base using targeted grep/glob. Returns relevant snippets without loading whole files into context. Useful for quickly finding a specific SOP, benchmark, client stat, or methodology note.

Inspired by QMD's structured multi-query approach, adapted to use built-in tools — no external CLI required.

## Arguments

`$1` — Search query (natural language or keywords)

If omitted, ask: "What are you looking for?"

## Knowledge Base Map

| Location | What's Here | Best For |
|----------|-------------|----------|
| `reference/sops/` | SOPs | Step-by-step platform procedures |
| `reference/course-knowledge/` | 9 methodology files | Campaigns, flows, copy, deliverability |
| `reference/email-strategy.md` | Strategic lens + market insights | Data interpretation, decision trees |
| `reference/benchmarks.md` | Industry benchmarks + client data | Open rates, RPR, popup CVR |
| `reference/flow-architectures-*.md` | Phase 1 + Phase 2 flow blueprints | Flow design and sequencing |
| `projects/*/profile.md` | Client brand, audience, products, performance | Client-specific data |
| `projects/*/flows.md` | Flow build status + per-flow performance | What's live per client |
| `context/` | Business context, service packages | [YOUR_AGENCY] internal info |

## Steps

### 1. Parse the Query

From `$1`, extract:
- **Keywords** (exact terms: flow names, platform feature names, metric names) → for grep
- **Topic area** (which part of the KB is most likely to have this?) → to scope searches
- **Client name** (if present) → scope to `projects/[client]/`

### 2. Run Searches in Parallel

Always run at least two searches: keyword grep + filename/folder scan.

**Keyword grep across reference:**
```bash
grep -r -l -i "[keyword]" reference/
grep -r -i -n "[keyword]" reference/benchmarks.md reference/email-strategy.md
```

**SOP filename scan (when looking for a platform procedure):**
```bash
ls reference/sops/ | grep -i "[keyword]"
```

**Client-specific search (when client name is in query):**
```bash
grep -i -n "[keyword]" projects/[client]/profile.md projects/[client]/flows.md
```

**Broad project search (when no specific client):**
```bash
grep -r -l -i "[keyword]" projects/
```

### 3. Read Relevant Sections

From the search results, identify the 3-5 most relevant files. Read only the relevant sections (use offset/limit to target specific lines, not whole files).

If a SOP is found, read the first 40 lines to confirm it's the right one, then offer to read the rest.

### 4. Present Results

```
## Search: "[query]"

### [Source file] — [Brief description of what was found]

> [Relevant excerpt — 3-10 lines, verbatim from the file]

---

### [Source file] — [Brief description]

> [Relevant excerpt]

---

**Want the full file?** Say "read [filename]" or ask a follow-up question.
```

If multiple results, rank by relevance (most specific match first).

### 5. If No Results

Broaden the search:
- Try synonyms or adjacent terms (e.g., "welcome flow" → "welcome series", "welcome email")
- Check if the topic is covered under a different section
- Tell the user: "Searched [locations], didn't find [query]. Tried [synonym] — nothing either. This topic may not be in the reference library yet."

## Example Queries

```
/search welcome flow SOP
→ Scans reference/sops/ for "welcome", returns Welcome Series SOP

/search benchmark open rate
→ Returns relevant section from reference/benchmarks.md

/search abandoned cart flow [example-client]
→ Scopes to projects/[example-client]/flows.md, returns cart abandonment data

/search post-purchase sequence methodology
→ Returns from reference/course-knowledge/ + reference/flow-architectures-*.md

/search deliverability warm-up steps
→ Returns from reference/sops/ + reference/course-knowledge/deliverability.md
```

## Notes

- This skill is for **finding** content — not for loading everything before an audit or brief. Skills that generate outputs load their own specific files.
- For brand research on an external client website, use `/brand-identity` instead.
- For searching within a specific file you already know, just read it directly — this skill is for when you don't know which file contains the answer.
