---
name: export-pdf
description: Export an HTML report to PDF for client sharing. Use when converting audits, content plans, or strategies to PDF format for Google Drive, email, or Slack delivery.
argument-hint: [client-name] [report-type]
---

## What This Skill Does

Converts an HTML report to a branded PDF using Puppeteer. The PDF preserves the full layout, styling, and charts from the HTML version. Ready to share with clients via Google Drive, email, or Slack.

## Arguments

- `$1` — Client slug (e.g., `[example-client]`)
- `$2` — Report type: `audit`, `content-plan`, `strategy`, or a specific filename

If `$2` is omitted, list all HTML files in `projects/$1/outputs/` and ask which one to export.

## Steps

### 1. Find the HTML file

Look for the report in `projects/$1/outputs/`:

- If `$2` is `audit` → find the most recent `audit*.html`
- If `$2` is `content-plan` → find the most recent `content-plan*.html`
- If `$2` is `strategy` → find the most recent `strategy*.html`
- If `$2` is a specific filename → use it directly
- If `$2` is omitted → list all `.html` files in the outputs folder and ask which one

If the file doesn't exist, tell the AM and stop.

### 2. Generate the PDF

Run the Puppeteer script:

```bash
cd [repo-root] && node tools/html-to-pdf.mjs [input.html] [output.pdf]
```

The output PDF goes in the same directory as the input HTML, with the same name but `.pdf` extension.

### 3. Confirm & Offer Google Drive Copy

Tell the AM:
- Where the PDF was saved
- The file size
- Open the PDF for review (use `open` command on macOS)

Then ask: **"Copy to client's Google Drive folder?"**

If yes, copy the PDF to the client's Google Drive Documents folder:

```
~/Library/CloudStorage/GoogleDrive-[YOUR_EMAIL]/My Drive/[YOUR_DRIVE_PATH]/Clients/[Client Display Name]/Documents/
```

**Client slug → Google Drive folder name mapping:**
Look up the folder name in the Clients directory. The folder name is the client's display name (e.g., `[example-client]` → `[Example Client]`, `[client-a]` → `[Client Display Name]`). List the directory to find the exact match if unsure.

After copying, confirm: "Copied to Google Drive — it'll sync to the shared folder automatically."

## Examples

```
/export-pdf [example-client] audit
→ Exports projects/[example-client]/outputs/audit.html → audit.pdf

/export-pdf [client-a] content-plan
→ Exports projects/[client-a]/outputs/content-plan-march-2026.html → content-plan-march-2026.pdf

/export-pdf [example-client]
→ Lists all HTML files in outputs/, asks which to export
```

## Notes

- The script uses `waitUntil: 'networkidle0'` so Chart.js charts render before capture
- PDF format is A4 with 20mm top/bottom and 15mm left/right margins
- `printBackground: true` preserves colored backgrounds and callout boxes
- If Puppeteer isn't installed, run `cd tools && npm install` first
