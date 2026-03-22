---
name: deploy
description: Deploy HTML outputs to hosting. Reviews what's ready, runs the deploy, and returns clean client-facing URLs. Use before sharing any report link with a client.
argument-hint: "[client-name] [report-name]"
disable-model-invocation: true
---

## What This Skill Does

Handles the full deployment pipeline for client-facing HTML outputs. Guides through: check → confirm → deploy → return URL. Never deploys without AM review.

**Deploy target:** Configure your deployment platform (Vercel, Netlify, etc.) and domain in this skill after setup.

## Arguments

- `$1` — Client slug (e.g., `[example-client]`) — optional, scopes the check
- `$2` — Report name without extension (e.g., `audit`) — optional

## Steps

### 1. Check Available Outputs

List HTML files ready for deployment:

```bash
find projects/*/outputs/ -name "*.html" | sort
```

If `$1` is provided, scope to `projects/$1/outputs/`.

Show the AM a clear list of available reports.

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

Open the selected HTML file(s) in Chrome using chrome-devtools MCP before deploying.

Tell the AM: "Opened in Chrome — looks good to deploy?"

Wait for confirmation before proceeding. If they find an issue, stop and let them fix it.

### 4. Deploy

[Configure your deployment command here. Examples:]

**Vercel:**
```bash
vercel deploy --prod --yes
```

**Netlify:**
```bash
netlify deploy --prod
```

**Manual:** Copy the HTML file to your hosting provider.

Wait for the deploy to complete and capture the output URL.

### 5. Return Clean URLs

Report to the AM:
```
Deployed:

  [YOUR_DOMAIN]/[client]/[report-name]

Ready to share with the client.
```

Then ask: **"Post this link to Slack (#[YOUR_CHANNEL])?"**

If yes, post using the Slack MCP.

## Notes

- Configure your deployment platform, domain, and commands in this skill after running `/setup`
- Never deploy without AM review and confirmation
- If deploy fails, check your platform CLI is installed and authenticated
