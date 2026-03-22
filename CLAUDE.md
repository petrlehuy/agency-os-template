# [YOUR_AGENCY] OS

[YOUR_DESCRIPTION — e.g., "Social media agency workspace. Full-service content + paid ads for DTC brands." or "CRO agency. Conversion optimization for e-commerce brands doing $1M+/year."]

Founded by [FOUNDER_NAME].

> **First run?** If you see `[YOUR_AGENCY]` above (still a placeholder), this workspace hasn't been configured yet. Run `/setup` to launch the setup wizard — it'll ask about your agency and automatically configure everything.

---

## How This Works

This workspace IS the agent. It follows the WAT framework (Workflows, Agents, Tools):

- **Skills** — Interactive workflows triggered by `/slash-command` or natural language. Live in `.claude/skills/`. These are what Claude uses during conversation to execute structured tasks.
- **Agents** — AI personalities with specific roles (researcher, reviewer, documenter). Live in `.claude/agents/`. Called when a task needs a distinct perspective or capability.
- **Workflows** — Self-contained deployable units for automated execution. Live in `workflows/`. Each is a complete WAT system deployed to Modal, Make, n8n, or similar.

**Claude's role in production:** Creates thorough briefs (so nothing gets missed), QA-reviews copywriter output against best practices + project-specific data. Does NOT replace the copywriter — improves inputs and catches issues in outputs.

**Production pipeline:** Brief (Claude) → Copy (cooperator) → QA Review (Claude) → Design (designer) → Client Approval → Implement in [PLATFORM]

---

## Session Start

When beginning a new session:

**Step 0 — Setup check (ALWAYS run first):**
Check if `[YOUR_AGENCY]` still appears literally in this file (line 1). If it does, the workspace has NOT been configured yet. Do NOT proceed with normal work. Instead:
1. Tell the user: "This workspace hasn't been set up yet. The files are full of placeholders that need your agency's real info. Let's run `/setup` first — it takes about 10 minutes and configures everything."
2. Wait for the user to confirm, then run `/setup`.
3. Do NOT offer to do any other work until setup is complete. If they ask to skip, warn them that skills will reference placeholder names and produce broken output.

**If setup is complete (no `[YOUR_AGENCY]` placeholder found), proceed normally:**
1. Sync with remote: check `git status` for uncommitted changes (flag if any), then `git checkout main && git pull`
2. List all folders in `projects/` to see active work
3. Briefly confirm readiness (5-8 lines max):
   - Who [YOUR_AGENCY] is and how the pipeline works
   - Which projects are loaded
   - What skills and commands are available
4. Ask what to work on this session

**Do NOT read `context/agency.md` at session start** — this file contains detailed business context (monthly cycle, tools, onboarding steps) that skills and commands load only when needed. Everything required for orientation is already in this CLAUDE.md.

---

## Philosophy & Guardrails

### Core Principles
- Profit over revenue. Optimize for margin, not top-line growth.
- Fewer clients, higher quality. Never sacrifice service quality to add clients.
- Systems over people. Automate and systematize before hiring.
- Founder time is the scarcest resource. Every process should minimize founder involvement.

### Agent Guardrails
- Never send anything to a client without AM review and approval.
- Never promise timelines, pricing, or scope changes to clients.
- Never modify a live [PLATFORM] flow or campaign without explicit instruction.
- When unsure about brand voice or strategy, flag it for the AM — don't guess.
- Default to quality over speed. A late deliverable that's on-brand beats a fast one that's off.

### Operational Defaults
- Project files are the source of truth for brand voice, tone, segments, and performance data.
- When creating outputs, format for easy copy-paste into Google Docs, Slack, or [PLATFORM].
- Skills and commands only load the reference files they need — each specifies its own file list.
- When loading files for a skill or command, skip any file already read in this session — don't re-read it.

---

## GSD — Internal Development Projects

GSD (Get Shit Done) is installed globally. Use it automatically — never ask [FOUNDER_NAME] to run GSD commands manually.

**Use GSD when:** building or upgrading internal systems — tools, skills, workflows, automations, or any multi-step dev work with a clear output.

**Don't use GSD for:** client deliverables (audits, strategies, briefs, content plans) — those use the skills above.

### When to engage automatically

| Situation | Action |
|-----------|--------|
| Starting a new internal build (tool, skill, workflow) | `/gsd:new-project` to set up `.planning/` with PROJECT.md + ROADMAP.md |
| `.planning/` exists in the folder | Run `/gsd:progress` first to orient, then continue the active phase |
| Task is 3+ steps and produces something tangible | `/gsd:plan-phase` → `/gsd:execute-phase` |
| Quick ad-hoc task within an active GSD project | `/gsd:quick [task]` |
| Ending a work session on a GSD project | `/gsd:pause-work` to save state |

### Rules
- Never ask [FOUNDER_NAME] to run `/gsd:*` commands — use them yourself as part of doing the work.
- GSD's `.planning/` folder lives inside whichever project folder you're building in.
- GSD's `/gsd:pause-work` supersedes the custom `/pause-work` skill for dev projects.

---

## Architecture

Two levels:

**Global workspace** (this folder) — The agent. Contains skills, agents, context, reference materials, and project data. This is where interactive Claude Code sessions happen.

**Workflow units** (`workflows/[name]/`) — Self-contained, deployable WAT systems. Each has:
- `CLAUDE.md` — Agent instructions
- `workflows/` — Markdown SOPs
- `tools/` — Python scripts for deterministic execution
- `.tmp/` — Disposable intermediates
- `.env` — Credentials

Deploy just the workflow folder. The global workspace stays local.

---

## Connected Tools (MCP)

<!-- Update this table with your actual MCP integrations -->

| Tool | Server | Purpose |
|------|--------|---------|
| **Slack** | `slack` | Post notifications to `#[YOUR_CHANNEL]` channel |
| **[PM Tool]** | `[server-name]` | Project management integration |
| **Chrome DevTools** | `chrome-devtools` | Browser automation for exports, screenshots, and page interactions |

See `.mcp.example.json` for configuration template. Copy to `.mcp.json` and fill in your tokens.

---

## Skills

| Skill | Purpose |
|-------|---------|
| `/onboard` | Client files + internal team brief from form data |
| `/audit` | Marketing performance audit — onboarding or recurring. Outputs branded HTML. |
| `/strategy` | Service strategy document (HTML) |
| `/brief` | Creative brief for a deliverable |
| `/content-plan` | Monthly content ideas + campaign calendar. Outputs branded HTML. |
| `/call-prep` | Strategic call agenda + talking points |
| `/skill-builder` | Build or audit Claude Code skills |
| `/brand-identity` | Extract brand identity from website or guidelines doc |
| `/creative-matrix` | Paid ads creative pipeline: build matrix, evaluate, iterate |
| `/export-pdf` | Convert HTML report to PDF for client sharing |
| `/optimize-workspace` | Workspace health scan — finds bloat, drift, orphaned files |
| `/copy-editing` | Improve existing copy before QA review (Seven Sweeps) |
| `/copywriting` | Write new marketing copy for landing pages, case studies, homepages |
| `/content-strategy` | Macro content strategy: pillars, topic clusters, editorial calendar |
| `/email-sequence` | Design multi-step campaign sequence with full copy |
| `/review` | QA review of output — structured PASS/FAIL scorecard with severity levels |
| `/loom-transcript` | Fetch and display full transcript from a Loom video URL |
| `/ui-ux-pro-max` | UI/UX design intelligence — build, review, or improve interfaces |
| `/excalidraw-visuals` | Generate hand-drawn diagram PNGs from a description |
| `/pause-work` | Save session state before pausing |
| `/search` | Search the workspace knowledge base without loading whole files |
| `/deploy` | Deploy HTML outputs to hosting |
| `/setup` | First-run wizard — configures the entire workspace interactively |

**First run:** `/setup` — configures all placeholders across the workspace.

**Onboarding pipeline:** `/onboard` → `/audit` → `/strategy` → client approves → `/brief` → cooperator writes → `/review`. Each skill suggests the next step.

**Monthly cycle:** `/audit` → `/content-plan` → `/call-prep` → strategic call.

---

## Agents

| Agent | Role |
|-------|------|
| researcher | Gathers and synthesizes information from web, files, APIs |
| reviewer | Unbiased QA review of outputs against standards |
| qa | Generates and runs tests for code validation |
| documenter | Keeps documentation aligned with implementation changes |

Agent definitions live in `.claude/agents/`.

---

## Workflows

Self-contained WAT units in `workflows/[name]/`. Each is independently deployable to external orchestration platforms (Modal, Make, n8n). See `workflows/_README.md` for structure details.

---

## Project Files

Each project is a subfolder in `projects/`:
- `projects/[name]/profile.md` — Brand, voice, audience, products, package, strategy, performance
- `projects/[name]/deliverables.md` — Deliverable tracking, build status, customizations, per-deliverable performance
- `projects/[name]/outputs/` — Project-specific outputs (audits, strategies, briefs, reports)

Templates: `projects/_templates/profile.md`, `projects/_templates/deliverables.md`

---

## Reference Library

Everything in `reference/` is the source of truth for your methodology. Skills load only what they need — never load the whole folder at once.

| File / Folder | Contents | Loaded By |
|---------------|----------|-----------|
| `reference/course-knowledge/` | Your methodology files organized by topic | Skills that generate strategic output |
| `reference/sops/` | Step-by-step procedures for repeatable tasks | On-demand when implementing a specific task |
| `reference/html-templates/` | HTML formatting references for reports | `/audit`, `/content-plan`, `/strategy` |

**Rule:** For any strategy, copy, or campaign work — the `reference/course-knowledge/` files ARE your methodology. Load the relevant file(s) before generating output.

---

## Key Folders

| Folder | Purpose |
|--------|---------|
| `projects/` | Project data, profiles, deliverable tracking, outputs |
| `context/` | Business context, service packages, brand assets |
| `reference/` | Your methodology, SOPs, templates |
| `tools/` | Utility scripts and MCP servers |
| `plans/` | Cross-project brainstorming and design docs |
| `workflows/` | Deployable automated workflow units |
| `.claude/skills/` | Interactive skill definitions |
| `.claude/agents/` | Agent personality definitions |
