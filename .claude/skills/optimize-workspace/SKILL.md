---
name: optimize-workspace
description: Workspace health scan — finds bloat, stale files, drift, and waste. Use when optimizing the workspace, reducing context window usage, cleaning up after heavy sessions, or running periodic hygiene checks.
disable-model-invocation: true
---

## What This Skill Does

Scans the workspace for bloat, drift, and waste. Reports findings by impact. Fixes only with explicit user approval. This is a diagnostic-first tool — it never modifies anything without confirmation.

**When to run:** After heavy sessions, before starting a new project, or whenever the workspace feels sluggish.

## Files to Load

None. This skill scans the filesystem directly. Loading heavy files would defeat the purpose.

## Steps

### 1. Scan the Workspace

Run these 8 checks. Use subagents or parallel bash commands where possible to minimize token cost.

**Check 1 — Oversized Files (HIGH)**

Find all `.md` and `.html` files (excluding `node_modules/`, `.git/`). Flag:
- Markdown files over 300 lines
- HTML files over 500 lines
- Any single file over 1,000 lines

For each, report: path, line count, what it contains, whether it could be split or archived.

**Check 2 — Duplicate Content (HIGH)**

Scan `projects/*/outputs/` for duplicate or near-identical files across projects. Quantify total duplicated lines.

**Check 3 — Tracked Binaries (HIGH)**

List all `.png`, `.pdf`, `.docx`, `.jpg`, `.jpeg`, `.gif` files tracked by git. Flag:
- Individual files over 1 MB
- Total tracked binary size over 10 MB
- Binaries not referenced by any `.md` or `.html` file in the workspace

Report total size and list top offenders.

**Check 4 — Orphaned References (MEDIUM)**

For each file in `reference/` (excluding `html-templates/`), grep across all `.md` and SKILL.md files to check if it's referenced. Files not mentioned anywhere are orphaned.

**Check 5 — CLAUDE.md Drift (MEDIUM)**

Compare the tables in CLAUDE.md against the actual filesystem:
- Skills table vs. directories in `.claude/skills/`
- Agents table vs. files in `.claude/agents/`
- Commands table vs. files in `.claude/commands/`

Flag any mismatches (missing entries, extra entries, stale descriptions).

**Check 6 — Skill Size Audit (MEDIUM)**

List all `SKILL.md` files with line counts. Flag any over 200 lines. For those, estimate what portion is reusable template content that could be extracted to a supporting file.

**Check 7 — Stale Memory (LOW)**

Find all `MEMORY.md` files (global and project-level). Read each and flag:
- References to completed or outdated work
- "On the horizon" items that may already be done
- Entries that contradict current workspace state

**Check 8 — Superseded Outputs (LOW)**

In each `projects/*/outputs/`, check for:
- Both `.md` and `.html` versions of the same output (the HTML is current format)
- Draft files that have been finalized
- Files from previous months that are no longer active

### 2. Generate Report

Present findings in conversation using this format:

```
# Workspace Health Report
> Scanned: [date] | Files checked: [N] | Issues found: [N]

## HIGH Impact
### [Finding Title]
- **What:** [description]
- **Where:** [file path(s)]
- **Why it matters:** [token cost / git bloat / context waste]
- **Suggested fix:** [specific action]
- **Estimated savings:** [lines / MB]

## MEDIUM Impact
[same format]

## LOW Impact
[same format]

## Summary
| Category | Issues | Est. Savings |
|----------|--------|-------------|
| ... | ... | ... |
```

Token estimation: ~1 token per 4 characters, or ~1.3 tokens per word.

Do NOT save the report as a file — display it in conversation only. This keeps the skill lightweight and disposable.

### 3. Fix (With User Approval)

After presenting the report, ask: **"Which fixes would you like me to apply? Pick by number, category, or say 'all'."**

**Safe auto-fixes (apply without per-item confirmation):**
- Update CLAUDE.md tables to match actual workspace state
- Add binary patterns to `.gitignore`

**Confirm per item (list each action before executing):**
- Archive orphaned files → move to `reference/_archive/` or `projects/*/archive/`
- Split oversized files into modular pieces
- Remove superseded `.md` outputs when `.html` version exists
- Update stale memory entries

**Never auto-fix:**
- Delete any file outright (only archive/move)
- Change skill logic or behavior (only structural refactoring like extracting templates)
- Run `git rm` on tracked binaries (provide commands for user to run manually)

For tracked binaries, output the exact `git rm --cached` commands the user would need to run, but do NOT execute them.

## Core Principle: Quality First

**Never suggest removing or trimming files that skills actually load for output quality.** A large project file (like a 3,000-line project brief) is expensive in tokens but worth every token if it makes audits, strategies, and briefs better. The cost is worth it for quality.

Only flag files as removable when they are **100% unnecessary** — truly orphaned, never loaded by any skill, duplicated with no purpose, or superseded by a newer format.

When reporting oversized files, categorize them:
- **Active context** — loaded by skills, contributes to output quality. Report the size for awareness but do NOT suggest trimming or splitting. Mark as: `[KEEP — used by /skill-name]`
- **Unused bloat** — not referenced by any skill or project file. Safe to archive. Mark as: `[ARCHIVE — unreferenced]`
- **Git-only bloat** — binaries that exist on disk for human reference but are never loaded into Claude context. Safe to .gitignore. Mark as: `[GITIGNORE — human-only reference]`

## Notes

- This skill should be cheap to run — it uses filesystem commands, not heavy file reads
- Run checks in parallel (subagents or concurrent bash) to minimize wall time
- When estimating token savings, focus on files that skills actually load — a large file that nothing references has zero context impact
- If no issues are found in a category, skip it in the report (don't pad with "all clear" messages)
- The goal is actionable findings, not a comprehensive inventory. Flag only things worth fixing.
- **Never compromise output quality for token savings.** If a file is large but feeds into a skill that produces client-facing work, leave it alone.
