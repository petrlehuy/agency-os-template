# Workflows

Self-contained, deployable WAT (Workflows, Agents, Tools) units. Each subfolder is an independent workflow that can be deployed to Modal, Make, n8n, or any external orchestration platform.

## Structure Per Workflow

```
workflows/[workflow-name]/
├── CLAUDE.md              # WAT agent instructions — how the agent should behave
├── workflows/             # Markdown SOPs — objectives, inputs, steps, outputs, edge cases
├── tools/                 # Python scripts — deterministic execution
├── .tmp/                  # Disposable intermediate files (regenerated as needed)
├── .env                   # Workflow-specific credentials (NEVER store secrets elsewhere)
└── credentials.json       # OAuth tokens (if needed)
```

## How It Works

- **CLAUDE.md** defines the agent layer — how to reason, coordinate, and recover from errors
- **workflows/** contains the actual SOPs that tell the agent what to do step by step
- **tools/** contains Python scripts for deterministic execution (API calls, data transforms, file ops)
- **.tmp/** holds temporary processing files — everything here is disposable

## Deployment

Deploy **just the workflow folder** to your target platform. The global [YOUR_AGENCY] OS workspace is the agent context — it stays local. Only workflow folders get deployed.

## Adding a New Workflow

1. Create `workflows/[name]/`
2. Add the standard `CLAUDE.md` (WAT framework agent instructions)
3. Write SOPs in `workflows/[name]/workflows/`
4. Build tools in `workflows/[name]/tools/`
5. Add `.env.example` documenting required credentials
