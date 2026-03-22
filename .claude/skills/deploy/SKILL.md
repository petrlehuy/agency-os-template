---
name: deploy
description: Deploy HTML reports to Vercel ([YOUR_DOMAIN]). Reviews what's ready, runs the deploy, and returns clean client-facing URLs. Use before sharing any report link with a client.
argument-hint: "[client-name] [report-name]"
disable-model-invocation: true
---

## What This Skill Does

Handles the full deployment pipeline for client-facing HTML reports. Guides through: check → confirm → deploy → return URL. Never deploys without AM review.

Adapted from a release skill process — careful, step-by-step, no surprises.

**Deploy target:** `reports/` folder → Vercel project `[YOUR_VERCEL_PROJECT]` → `[YOUR_DOMAIN]`

## Arguments

- `$1` — Client slug (e.g., `[example-client]`) — optional, scopes the check
- `$2` — Report name without extension (e.g., `audit`) — optional

## Steps

### 1. Check What's in `reports/`

List client subfolders and their HTML files:

```bash
find reports/ -name "*.html" | sort
```

If `$1` is provided, scope to `reports/$1/`.

Show the AM a clear list:
```
Reports available in reports/:
  [example-client]/audit.html
  [example-client]/content-plan-april.html
  [client-a]/audit.html
  ...
```

Also check: are there HTML files in `projects/*/outputs/` that belong in `reports/` but haven't been moved yet? If yes, flag: "Found [file] in projects/outputs/ — should I copy it to reports/ first?"

### 2. Confirm Which Report(s) to Deploy

If `$1` and `$2` are both provided and the file exists → skip this step, proceed directly.

Otherwise:

```
AskUserQuestion:
  header: "Deploy Which?"
  question: "Which report(s) should go live now?"
  [list each available HTML as an option]
  multiSelect: true
```

### 3. Open for Final Review

Open the selected HTML file(s) in Chrome using chrome-devtools MCP before deploying:

```
Open: reports/[client]/[report].html in Chrome
```

Tell the AM: "Opened in Chrome — looks good to deploy?"

Wait for confirmation before proceeding. If they find an issue, stop and let them fix it.

### 4. Copy from outputs/ if Needed

If the source file lives in `projects/[client]/outputs/` and needs to go to `reports/[client]/`, copy it:

```bash
cp projects/[client]/outputs/[file].html reports/[client]/[file].html
```

Create the `reports/[client]/` folder if it doesn't exist.

### 5. Run Vercel Deploy

From the `reports/` folder:

```bash
cd reports && vercel deploy --prod --yes
```

If Vercel isn't linked (no `.vercel/project.json`), link it first:

```bash
cd reports && vercel link --project [YOUR_VERCEL_PROJECT] --yes
```

Wait for the deploy to complete and capture the output URL.

### 6. Return Clean URLs

Map the deployed file to its clean URL:

`reports/[client]/[filename].html` → `[YOUR_DOMAIN]/[client]/[filename]`

Report to the AM:
```
✓ Deployed:

  [YOUR_DOMAIN]/[example-client]/audit
  [YOUR_DOMAIN]/[example-client]/content-plan-april

Ready to share with the client.
```

Then ask: **"Post this link to Slack (#[YOUR_CHANNEL])?"**

If yes, post using the Slack MCP (`mcp__slack-agenthic__slack_post_message`, channel `[YOUR_SLACK_CHANNEL_ID]`).

## URL Structure

| `reports/` path | Live URL |
|-----------------|----------|
| `reports/[example-client]/audit.html` | `[YOUR_DOMAIN]/[example-client]/audit` |
| `reports/[client-a]/strategy.html` | `[YOUR_DOMAIN]/[client-a]/strategy` |
| `reports/[client-b]/content-plan-april.html` | `[YOUR_DOMAIN]/[client-b]/content-plan-april` |

## Notes

- `reports/vercel.json` handles clean URLs (no `.html`) and noindex headers
- The `reports/` folder is linked to `[YOUR_VERCEL_PROJECT]` via `reports/.vercel/project.json`
- Never create a new Vercel project — always deploy through `[YOUR_VERCEL_PROJECT]`
- If deploy fails, check: `vercel --version`, Vercel login status (`vercel whoami`), and that `reports/.vercel/project.json` exists
- The `reports/.gitignore` may exclude certain files — check if the target HTML is tracked before assuming it's deployed
