---
name: organize-drive
description: Google Drive hygiene scan — finds loose files, empty folders, duplicates, and stale content. Organizes everything into the correct folder. Use periodically or when Drive feels messy.
disable-model-invocation: true
---

## What This Skill Does

Scans the [YOUR_AGENCY] Google Drive for organizational issues: loose files, empty folders, duplicates, stale content, and misplaced items. Reports findings first, then fixes with user approval.

**When to run:** Monthly, after onboarding a new client, after a hiring round, or whenever someone says "Drive is a mess."

## Prerequisites

- `gws` CLI installed and authenticated (`which gws` + `gws auth status`)
- If not available, stop and tell the user to install it

## Google Drive Structure Reference

The canonical structure lives in `Operations/SOPs/SOP — Google Drive Structure` (Google Doc). The folder tree:

```
~ [YOUR_AGENCY]/  (inside My Drive → 01 Areas)
├── Clients/                    One folder per active client
│   ├── Templates/              Client report templates, audit checklists
│   ├── 00 Ex-clients/          Inactive clients
│   └── 01 Meet Recordings/     Call recordings
├── Growth/                     Marketing, sales, partnerships
│   ├── Content/
│   ├── Inbound/
│   ├── Outbound/
│   ├── Paid Ads/
│   ├── Partnerships/
│   ├── Results/
│   ├── Templates/
│   └── Website/
├── Operations/                 Running the business
│   ├── Brand/                  Logo, signature, brand assets
│   ├── Legal/                  Active legal documents
│   ├── People/                 Hiring, contracts, onboarding
│   │   ├── Archive/
│   │   ├── Contract Templates/
│   │   ├── Hiring/
│   │   ├── Job Postings/
│   │   ├── Onboarding/
│   │   └── Contracts/          Active team contracts
│   ├── SOPs/
│   └── Tools/                  AM Tracker, [YOUR_AGENCY] OS
├── Finance/                    P&Ls, bookkeeping, planning
├── Products/                   Digital products ([Your Products])
└── 00 Archive/                 Everything inactive
    └── Ex-employees/           Former team shared drives
```

## Folder IDs

```
~ [YOUR_AGENCY]:   [YOUR-FOLDER-ID]
Clients:           [YOUR-FOLDER-ID]
Growth:            [YOUR-FOLDER-ID]
Operations:        [YOUR-FOLDER-ID]
Finance:           [YOUR-FOLDER-ID]
Product Dev:       [YOUR-FOLDER-ID]
00 Archive:        [YOUR-FOLDER-ID]
Ops/People:        [YOUR-FOLDER-ID]
Ops/Brand:         [YOUR-FOLDER-ID]
Ops/Tools:         [YOUR-FOLDER-ID]
Ops/SOPs:          [YOUR-FOLDER-ID]
Ops/Legal:         [YOUR-FOLDER-ID]
Clients/Templates: [YOUR-FOLDER-ID]
Growth/Templates:  [YOUR-FOLDER-ID]
Archive/Ex-emp:    [YOUR-FOLDER-ID]
```

## Steps

### 1. Scan

Use `gws drive files list` via Python (for robust handling of names with spaces/emoji). Run these checks:

**Check 1 — Loose Files (HIGH)**

For each top-level folder AND key subfolders (Operations/People, Growth, etc.), list all items. Flag any non-folder files sitting at root level of a folder that has subfolders for organization. These are misplaced.

```python
# Pattern for listing folder contents
gws drive files list --params '{"q": "'FOLDER_ID' in parents", "fields": "files(id,name,mimeType)", "pageSize": 100}'
```

**Check 2 — Empty Folders (MEDIUM)**

For each folder found, check if it has 0 children. Empty folders are clutter.

**Check 3 — Duplicate Names (MEDIUM)**

Within each parent folder, flag any two items with the same name. Common after copy-paste or accidental creation.

**Check 4 — .DS_Store Files (LOW)**

Find and flag any `.DS_Store` files synced from Mac. These are junk.

**Check 5 — Stale Content (LOW)**

Flag files with `modifiedTime` older than 18 months that are NOT in `00 Archive/`. These may belong in archive.

### 2. Report

Present findings in conversation:

```
# Google Drive Health Report
> Scanned: [date] | Folders checked: [N] | Issues found: [N]

## HIGH — Loose Files
| File | Current Location | Suggested Move |
|------|-----------------|----------------|
| ... | ... | ... |

## MEDIUM — Empty Folders
- [list]

## MEDIUM — Duplicates
- [list]

## LOW — Junk Files
- [list]

## LOW — Stale Content (candidates for archive)
- [list]
```

Do NOT save the report — display it in conversation only.

### 3. Fix (With User Approval)

After presenting the report, ask: **"Which fixes should I apply? Pick by number, category, or say 'all'."**

**Safe auto-fixes (apply without per-item confirmation):**
- Delete `.DS_Store` files
- Delete confirmed empty folders

**Confirm per item:**
- Move loose files to suggested destination
- Move stale content to `00 Archive/`
- Delete duplicate files (keep the newer one)

**Never auto-fix:**
- Delete any non-junk file outright (only move to archive)
- Move files in `Finance/` (financial docs are sensitive — always confirm)
- Rename anything (naming is a human decision)

### 4. Routing

When done, suggest: "Run `/optimize-workspace` next to clean up the local workspace too."

## Notes

- Always use Python wrapper for `gws` commands — file names containing spaces, emoji, or special characters break bash loops
- The `gws drive files list` command uses `--params` with JSON, not `--query`
- Moving files: `gws drive files update --params '{"fileId": "ID", "addParents": "DEST", "removeParents": "SOURCE"}'`
- Deleting: `gws drive files delete --params '{"fileId": "ID"}'`
- Creating folders: `gws drive files create --json '{"name": "NAME", "mimeType": "application/vnd.google-apps.folder", "parents": ["PARENT_ID"]}'`
- This skill is diagnostic-first. Present the full picture before touching anything.
- When categorizing loose files, use the "What am I doing when I use this?" rule to determine the correct folder.
