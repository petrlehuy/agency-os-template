---
name: pause-work
description: Save session state before pausing. Captures what was done, what's pending, blockers, and next step into a handoff file. Use when ending a session mid-task, switching contexts, or handing off to a future session.
disable-model-invocation: true
---

## What This Skill Does

Creates a `plans/session-handoff-[YYYY-MM-DD].md` that fully captures where you left off. Prevents context loss between sessions. Adapted from the GSD "pause-work" pattern.

## Steps

### 1. Gather State Automatically

Run these without asking the user:

```bash
git log --oneline -8          # Recent commits
git status --short            # What's changed but not committed
git diff --stat HEAD          # What's modified
```

Also check:
- Active project folders: `ls -lt projects/ | head -10`
- Pending plans: `grep -r "- \[ \]" plans/ 2>/dev/null` (open action items)
- Recent outputs: any `.html` newer than the last commit in `projects/*/outputs/`

### 1.5. Skill Lesson Check

If any skill was run during this session AND the user made corrections to its output:
1. Check if the "permanent or one-time?" question was already asked for each correction
2. If any correction was missed (the question wasn't asked), ask now:
   "During this session you corrected [skill] output: [describe the fix]. Should this be built into the skill for future instances, or was it a one-time adjustment?"
3. Apply the user's answer (patch SKILL.md `## Notes` + log in `memory/skill-lessons.md`, or skip)

### 2. Ask One Question

```
AskUserQuestion:
  header: "Session Status"
  question: "Where are you leaving off?"
  options:
    - label: "Clean stop — all done"
      description: "Everything is committed, nothing pending"
    - label: "Mid-task — continue here next session"
      description: "Work in progress, specific next action exists"
    - label: "Blocked — waiting on something"
      description: "Stuck or waiting for client input / approval"
    - label: "Planned but not started"
      description: "Know what to do, haven't begun"
```

If "Mid-task" or "Blocked", follow up: **"What's the exact next action?"** (free text, one line).

### 3. Write the Handoff File

Create `plans/session-handoff-[YYYY-MM-DD].md`:

```markdown
# Session Handoff — [date]

**Status:** [Clean stop / Mid-task / Blocked / Planned]
**Next action:** [one-line description, or "n/a"]

## Done This Session

[3-6 bullets from recent git commits + file changes — be specific]
- [e.g. "Completed [client] audit HTML — projects/[client]/outputs/audit.html"]
- [e.g. "Updated projects/[client]/profile.md with March performance data"]

## In Progress

[Any uncommitted changes or partial work — from git status output]
- [file]: [what state it's in]

[If nothing: "None — all changes committed."]

## Blockers / Waiting

[Anything blocking progress]
- [e.g. "Waiting for client to send March platform export"]

[If none: "None."]

## Open Plans

[Any plans/ files with unchecked items — from grep output]
- [file]: [what's open]

[If none: "None."]

## Active Projects This Session

[List which project folders had activity]
- [project-slug]: [what was touched]
```

### 4. Offer to Commit Uncommitted Work

If `git status` shows uncommitted changes, ask:

```
AskUserQuestion:
  header: "Commit Changes"
  question: "Stage and commit the open changes as WIP?"
  options:
    - label: "Yes — commit as WIP"
      description: "Saves everything with a 'wip:' prefix commit message"
    - label: "No — leave uncommitted"
      description: "I'll handle it manually"
```

If yes, stage only tracked modified files (no `git add -A`):

```bash
git add -u
git commit -m "wip: pause session [date] — [one-line status]"
```

### 5. Confirm

Tell the AM:
- Handoff file saved: `plans/session-handoff-[date].md`
- Whether changes were committed or left open
- **Resume tip:** "Next session: read `plans/session-handoff-[date].md` first."

## Notes

- Uses `git add -u` (only tracks already-tracked files) — never stages new sensitive files
- Does NOT deploy or push — only local commit
- If the AM declines to commit, the handoff file still gets written (it's untracked, captured in next git status)
- If a handoff file for today already exists, overwrite it (same-day updates)
