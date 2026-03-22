# Agency OS

A ready-to-use workspace for running a marketing agency with Claude Code. Built on the WAT framework (Workflows, Agents, Tools).

## What This Is

This repo IS your AI agent. It contains:
- **Skills** — interactive workflows triggered by `/slash-command` or natural language
- **Agents** — AI personalities with specific roles (researcher, reviewer, QA, documenter)
- **Reference** — your methodology, SOPs, templates
- **Projects** — client data, profiles, deliverables
- **Tools** — utility scripts and MCP integrations

Claude Code reads the `CLAUDE.md` file at the root and understands how your entire agency works. Every session, it knows your clients, your process, and your standards.

## Quick Start

### 1. Use This Template
Click **"Use this template"** on GitHub (or clone it directly).

### 2. Install Claude Code
If you don't have it yet: [claude.ai/claude-code](https://claude.ai/claude-code)

### 3. Set Up Credentials
```bash
cp .env.example .env           # Add your API keys
cp .mcp.example.json .mcp.json # Add your MCP server tokens
```

### 4. Run the Setup Wizard
```bash
cd agency-os
claude
```

Then type `/setup`. Claude will walk you through 7 phases — asking about your agency, platform, brand, and business model — then automatically configure every file in the workspace.

The wizard fills in 88+ placeholders across 30+ files. It takes about 10 minutes and you'll have a fully working workspace.

### 5. Add Your First Project
```bash
cp -r projects/_templates projects/my-first-client
```
Fill in `profile.md` and `deliverables.md` with your client's data.

### 6. Add Your Methodology (Over Time)
Put your knowledge base in `reference/`:
- `reference/course-knowledge/` — your methodology by topic (powers `/brief`, `/review`, `/email-sequence`)
- `reference/sops/` — step-by-step procedures for your platform
- `reference/html-templates/` — report formatting (3 templates included)

Claude gets smarter as you add more reference material. The `/setup` wizard creates a `SETUP-CHECKLIST.md` tracking what's left to fill in.

## Folder Structure

```
agency-os/
├── CLAUDE.md                 # The brain — agency instructions for Claude
├── .claude/
│   ├── skills/               # 20+ interactive workflows
│   ├── agents/               # AI personality definitions
│   └── commands/             # (reserved)
├── projects/
│   ├── _templates/           # Profile + deliverables templates
│   ├── _example/             # Sample project to learn the structure
│   └── [your-clients]/       # One folder per client
├── reference/                # Your methodology + knowledge base
│   ├── course-knowledge/     # Methodology by topic
│   ├── sops/                 # Step-by-step procedures
│   └── html-templates/       # Report formatting
├── context/                  # Business context, packages, brand assets
├── tools/                    # Utility scripts + MCP servers
├── workflows/                # Deployable automated workflows
└── plans/                    # Strategic brainstorm docs
```

## Skills Included

| Skill | Purpose |
|-------|---------|
| `/onboard` | Client onboarding from form data |
| `/audit` | Marketing performance audit (HTML output) |
| `/strategy` | Service strategy document |
| `/brief` | Creative brief for a deliverable |
| `/content-plan` | Monthly content ideas + campaign calendar |
| `/review` | QA review with PASS/FAIL scorecard |
| `/email-sequence` | Multi-step campaign sequence with full copy |
| `/creative-matrix` | Paid ads creative pipeline |
| `/brand-identity` | Extract brand identity from website |
| `/deploy` | Deploy HTML outputs to hosting |
| `/export-pdf` | Convert HTML to PDF |
| ...and 15+ more | See CLAUDE.md for full list |

## Collaboration (For Teams)

If multiple people work on this repo:

```
git pull          # Before starting — download teammates' changes
[do your work]    # Claude Code handles files
git push          # When done — upload your changes
```

**The one rule:** Always pull before starting. Always push when done.

Claude Code handles commits automatically. Just say "commit and push" when you're done.

## Requirements

- [Claude Code](https://claude.ai/claude-code) (Pro or Max plan recommended)
- Git + GitHub account
- Node.js (for MCP servers and tools)

## License

MIT — use it, modify it, make it yours.
