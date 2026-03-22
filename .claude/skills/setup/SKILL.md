---
name: setup
description: First-run wizard — configures the entire workspace by asking questions and replacing all placeholders. Run this once after cloning the template.
---

## What This Skill Does

Interactive setup wizard that transforms the generic Agency OS template into YOUR agency's workspace. Asks questions in logical phases, then automatically replaces all `[PLACEHOLDER]` values across every file.

**Run this once after cloning.** Can be re-run safely — it detects which phases are already complete and skips them.

## Steps

### 0. Detect Progress

Before asking anything, check which phases are already done:

```
Phase 1 (Identity):       grep -r "\[YOUR_AGENCY\]" CLAUDE.md
Phase 2 (Platform):       grep -r "\[YOUR_PLATFORM\]" CLAUDE.md
Phase 3 (Communication):  grep -r "\[YOUR_CHANNEL\]" CLAUDE.md
Phase 4 (Business Model): grep -r "\[PRICE\]" context/agency.md
Phase 5 (Brand):          grep -r "\[YOUR_ICP_SEGMENT" .claude/skills/creative-matrix/SKILL.md
Phase 6 (Credentials):    test -f .env
Phase 7 (Methodology):    test -f SETUP-CHECKLIST.md
```

If a phase's placeholder is gone, it's done. Skip to the first incomplete phase.

Report progress: "Phases 1-3 complete. Starting Phase 4: Business Model."

If ALL phases are done: "Setup is complete! Your workspace is fully configured. Run `/audit` or `/brief` to start working."

---

### Phase 1: Agency Identity

**Ask these questions** (use AskUserQuestion for the first, then follow up conversationally):

1. **What's your agency name?**
2. **What's the founder/owner's first name?**
3. **Describe your agency in one sentence** (what you do + for whom, e.g., "Email marketing agency. Klaviyo-focused, serving Czech e-commerce brands.")
4. **What market do you serve?** (e.g., "Czech e-commerce", "US SaaS", "European DTC brands")
5. **Year founded?**
6. **Team size?**

**Apply — find-and-replace across ALL files:**

| Find | Replace with |
|------|-------------|
| `[YOUR_AGENCY]` | Agency name (e.g., "RetentionUp") |
| `[YOUR_AGENCY_NAME]` | Agency name |
| `[YOUR_DESCRIPTION — e.g., ...]` | The full one-sentence description (remove the "e.g." hint) |
| `[FOUNDER_NAME]` | Founder name |
| `[YOUR_MARKET]` | Market description |
| `[YEAR]` (in context/agency.md only) | Year founded |
| `[NUMBER]` (in context/agency.md only) | Team size |

Use `grep -r` to find all files containing each placeholder, then use the Edit tool to replace in each file. The `[YOUR_AGENCY]` placeholder appears in 30+ files — use a systematic approach:

```bash
grep -rl "\[YOUR_AGENCY\]" --include="*.md" --include="*.html" --include="*.js" --include="*.mjs" --include="*.css" --include="*.json" .
```

Then replace in each file found.

**After applying:** Tell the user how many files were updated. Commit the changes: "Phase 1 complete — agency identity configured across X files."

---

### Phase 2: Platform & Tools

**Ask:**

1. **What's your primary marketing/automation platform?** (e.g., Klaviyo, Mailchimp, ActiveCampaign, HubSpot, Ecomail)
2. **What PM tool do you use?** (e.g., Freelo, Notion, Asana, ClickUp, Linear)
3. **What analytics tool?** (e.g., Hiro Analytics, Google Analytics, Mixpanel)
4. **What CRM?** (e.g., HubSpot, Pipedrive, Close, Salesforce, or "none")

**Apply:**

| Find | Replace with |
|------|-------------|
| `[YOUR_PLATFORM]` | Primary platform name |
| `[PLATFORM]` | Same platform name |
| `[PM Tool]` | PM tool name |
| `[Analytics]` | Analytics tool name |
| `[CRM]` | CRM tool name |

**After applying:** Commit. "Phase 2 complete — platform and tools configured."

---

### Phase 3: Communication & Integrations

**Ask:**

1. **Do you use Slack for notifications?** (Y/N)
   - If yes: **What channel name?** (e.g., `#ai-assistant`)
   - If yes: **What's the channel ID?** (Found in Slack: right-click channel → View channel details → scroll to bottom)
2. **Do you use Google Drive for client file sharing?** (Y/N)
   - If yes: **What Google account email?** (e.g., `you@agency.com`)
   - If yes: **What's the Drive base path?** (The folder path inside "My Drive" where your agency folder lives, e.g., `01 Areas/MyAgency`)

**Apply:**

| Find | Replace with |
|------|-------------|
| `[YOUR_CHANNEL]` | Channel name (or remove Slack references if N) |
| `[YOUR_SLACK_CHANNEL_ID]` | Channel ID (or remove) |
| `[YOUR_EMAIL]` | Google account email (or remove Drive references if N) |
| `[YOUR_DRIVE_PATH]` | Drive base path (or remove) |

If the user doesn't use Slack: note in CLAUDE.md that Slack integration is not configured.
If the user doesn't use Google Drive: note that Drive sync is not configured.

**After applying:** Commit. "Phase 3 complete — communication integrations configured."

---

### Phase 4: Business Model

**Ask conversationally — this phase needs freeform answers:**

1. **How many service tiers/packages do you offer?** What are their names and prices?
2. **What's included in each package?** (3-5 key deliverables per tier)
3. **What does your monthly cycle look like?** (What happens in week 1, 2, 3, 4?)
4. **What are your onboarding steps?** (From signed contract to first deliverable)
5. **What key metrics do you track?** (3-5 metrics you report on)

**Apply — rewrite these files with real content (not just placeholder replacement):**

- `context/agency.md` — Fill in the service tiers table, monthly cycle, tools section, onboarding steps, and metrics. Preserve the markdown structure.
- `context/packages.md` — Fill in package details, deliverables, one-time services, and compensation structure.

**After applying:** Commit. "Phase 4 complete — business model documented."

---

### Phase 5: Brand & Positioning

**Ask:**

1. **Describe your brand voice** — tone, language style, key phrases you use, things to avoid
2. **Who's your ideal customer?** (ICP) — describe 1-2 segments with demographics, company profile, pain points
3. **Do you have a flagship program or product?** What's it called? What's the price point?
4. **What's your website URL?** (optional — can run `/brand-identity` to extract deeper brand data)

**Apply:**

| Find | Replace with |
|------|-------------|
| `[YOUR_ICP_SEGMENT_1]` | First ICP segment description |
| `[YOUR_ICP_SEGMENT_2]` | Second ICP segment description |
| `[YOUR_PROGRAM]` | Program/product name |
| `[YOUR_PRICING]` | Price point |

Also create:
- `brand-assets/voice.md` — Write brand voice guidelines based on their answers
- `brand-assets/icp.md` — Write ICP definition based on their answers

If the user provided a website URL, suggest: "Want me to run `/brand-identity` on your website for a deeper brand extraction?"

**After applying:** Commit. "Phase 5 complete — brand and positioning configured."

---

### Phase 6: Credentials

**Ask:**

"Which of these API keys do you have ready right now? You can add the rest later."

Present a checklist:
- Anthropic API key (for workflows)
- [Platform] API key (whatever they said in Phase 2)
- PM tool API key
- Slack bot token
- Analytics API key
- Any others from `.env.example`

**Apply:**

- Copy `.env.example` → `.env`
- Fill in each key the user provides
- Leave others as empty strings with a `# TODO` comment
- Copy `.mcp.example.json` → `.mcp.json`
- Fill in tokens for configured MCP servers

**After applying:** Do NOT commit `.env` or `.mcp.json` (they're in `.gitignore`). Tell the user: "Credentials saved locally. These files are gitignored — they stay on your machine only."

---

### Phase 7: Methodology & Checklist

**Don't ask questions — guide the user:**

Explain what still needs manual content:

```
Your workspace is configured! Here's what's left to fill in manually:

METHODOLOGY (what makes your agency unique):
  reference/course-knowledge/  — Your frameworks and best practices by topic
                                  Create files like: campaigns.md, flows.md,
                                  copywriting.md, deliverability.md
                                  These power the /brief, /review, and
                                  /email-sequence skills.

  reference/sops/              — Step-by-step procedures for your platform
                                  Create files for each task: e.g.,
                                  create-welcome-flow.md, setup-popup.md

  reference/benchmarks.md      — Your industry benchmarks and client
                                  performance data (open rates, click rates,
                                  revenue per recipient, etc.)

BRAND ASSETS:
  reference/brand-assets/      — Logo SVGs, brand colors, typography

  brand-assets/                — Market positioning files (these power
                                  /creative-matrix and /copywriting skills)

You can add these over time. Claude gets smarter as you add more reference material.
```

**Apply:** Create `SETUP-CHECKLIST.md` at the root:

```markdown
# Setup Checklist

## Completed
- [x] Phase 1: Agency Identity
- [x] Phase 2: Platform & Tools
- [x] Phase 3: Communication & Integrations
- [x] Phase 4: Business Model
- [x] Phase 5: Brand & Positioning
- [x] Phase 6: Credentials

## Still Needed (add over time)
- [ ] Methodology files in `reference/course-knowledge/`
- [ ] SOPs in `reference/sops/`
- [ ] Benchmarks in `reference/benchmarks.md`
- [ ] Logo SVGs in `reference/brand-assets/`
- [ ] Google Drive folder IDs in organize-drive skill (if using Drive)
- [ ] Report domain + Vercel project in deploy skill (if deploying reports)
```

Adjust the checklist based on which phases were actually completed vs. skipped.

**After applying:** Commit. "Setup complete — workspace configured and ready to use."

Final message: "Your Agency OS is ready! Try `/audit [client-name]` to run your first audit, or create a new project with `cp -r projects/_templates projects/[client-name]`."

---

## Notes

- Always use `grep -rl` to find files before replacing — don't assume which files contain a placeholder
- For `[YOUR_AGENCY]` replacements, use find-and-replace across the entire workspace (it appears in 30+ files)
- For `[YEAR]` and `[NUMBER]`, only replace in `context/agency.md` — these tokens are too generic to replace globally
- Phase 4 requires rewriting files with real content, not just swapping placeholders — use the user's answers to write natural prose
- Never commit `.env` or `.mcp.json` — they contain secrets and are gitignored
- If a user wants to skip a phase, let them. Mark it as skipped in the checklist.
- The `[YOUR-FOLDER-ID]` placeholders (15 of them in organize-drive skill) are left for the checklist — too many IDs to collect interactively
- The `[YOUR_DOMAIN]` and `[YOUR_VERCEL_PROJECT]` placeholders are left for the checklist — deployment setup is optional
