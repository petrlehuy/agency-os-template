/* ---- Icons (Lucide-style, stroke-based, clean) ---- */

// File / document icon
const ICON_PAGE = `<svg class="item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="16" y1="13" x2="8" y2="13"/>
  <line x1="16" y1="17" x2="8" y2="17"/>
  <line x1="10" y1="9" x2="8" y2="9"/>
</svg>`;

// Structured / pipeline file icon (list-checks — kanban-style)
const ICON_STRUCTURED = `<svg class="item-icon structured-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 6h11M10 12h11M10 18h11"/>
  <path d="m3 6 2 2 4-4"/>
  <path d="m3 18 2 2 4-4"/>
  <rect x="3" y="10" width="8" height="4" rx="1" fill="none"/>
</svg>`;

// HTML report icon (globe / web page)
const ICON_HTML = `<svg class="item-icon html-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
  <path d="M2 12h20"/>
</svg>`;

// Chevron (rotated by CSS for open/closed state)
const ICON_CHEVRON = `<svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m6 9 6 6 6-6"/>
</svg>`;

// Folder icon for generic sub-folders
const ICON_FOLDER = `<svg class="folder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
</svg>`;

// Colored project icons
// Add your client slugs and brand colors here, e.g.:
// 'example-client': '#F97316',
const PROJECT_COLORS = {};

// Section icons for top-level folders
const SECTION_ICONS = {
  plans: `<svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="5" width="6" height="6" rx="1"/>
    <path d="m3 17 2 2 4-4"/>
    <path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>
  </svg>`,
  projects: `<svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>
  </svg>`,
  'claude plans': `<svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
  </svg>`,
};

/* ============================================================
   SKILLS PIPELINE DATA
   ============================================================ */

const PIPELINE = [
  {
    id: 'onboarding',
    label: 'Onboarding',
    color: '#14B8A6',
    steps: [
      {
        name: 'Onboard', cmd: '/onboard', desc: 'Project files + team brief from Tally form',
        detail: 'Takes the client\'s Tally onboarding form data, researches their website, and generates three files: project profile (brand, voice, audience), flow tracking sheet, and an internal team brief. Sets up the project folder so every other skill has the context it needs.',
        whenToUse: 'A new client has filled the Tally onboarding form. You have their company name, form answers, and website URL. Run this before anything else — no other skill works without these project files.',
        practicalOutputs: ['Project folder for this client fully set up in the workspace', 'Brand profile with voice, audience, products, and positioning documented', 'Flow tracking sheet to monitor build progress throughout onboarding', 'Internal team brief ready to share with cooperators and designers'],
        outputs: 'projects/[client]/profile.md · flows.md · brief.md',
        pipelineNote: 'Step 1 of Onboarding — run first, before audit',
      },
      {
        name: 'Audit', cmd: '/audit', desc: 'Full email setup evaluation',
        detail: 'Evaluates current performance, identifies opportunities, and provides actionable recommendations. Works in two modes: onboarding audit (first-time evaluation) or recurring health check with period-over-period trends.',
        whenToUse: 'Onboarding: after /onboard, before /strategy — gives you the baseline picture before building anything. Monthly cycle: run at the start of each month for all DFY clients, 3–4 days before the strategic call.',
        practicalOutputs: ['Branded HTML audit report ready to share with AM for review', 'Clear diagnosis: what\'s configured correctly, what\'s missing, highest-priority gaps', 'Baseline metrics to compare against in future monthly audits', 'Strategic input for /strategy — which flows to prioritize and why'],
        outputs: 'projects/[client]/outputs/audit.html (branded HTML report)',
        pipelineNote: 'Step 2 of Onboarding · also Step 1 of Monthly Cycle',
      },
      {
        name: 'Strategy', cmd: '/strategy', desc: 'Service strategy + client-facing doc',
        detail: 'Generates two outputs for the client strategy presentation: a visual architecture diagram (one per phase) and a branded HTML document with written explanation per service area. Presented to the client for approval before building anything.',
        whenToUse: 'Audit is complete and you\'re ready to show the client the full service plan. Run after /audit. This is what you present on the strategy call — client must approve it before production starts.',
        practicalOutputs: ['Visual architecture diagrams (one per phase) ready to present', 'Branded HTML strategy document for the client presentation', 'Client-approved service roadmap — once signed off, production can start', '/brief can now be run for each item in the approved strategy'],
        outputs: 'FigJam diagrams · projects/[client]/outputs/strategy.html',
        pipelineNote: 'Step 3 of Onboarding — client approves before production starts',
      },
      { isHandoff: true, label: 'Client approves → begin production' },
    ],
  },
  {
    id: 'production',
    label: 'Production',
    color: '#316CF0',
    steps: [
      {
        name: 'Brief', cmd: '/brief', desc: 'Copywriter brief for flow or campaign',
        detail: 'Creates a scannable 1-page copywriter brief for a specific flow email or campaign. Tells the cooperator WHAT to write about and HOW to approach it — tone, angle, CTA intent, audience segment — without writing the copy itself. Outputs .md for the repo and .docx for sharing.',
        whenToUse: 'Strategy is approved and a new email or flow is entering production. Run once per email that goes to the cooperator. The outcome is a brief the cooperator can act on without any back-and-forth.',
        practicalOutputs: ['Complete one-page brief the cooperator can act on immediately — no clarification needed', 'DOCX file ready to drop into Freelo or Google Docs for handoff', 'Clear reference document for the QA review (/review) to check against'],
        outputs: 'projects/[client]/outputs/brief-[name].md + .docx',
        pipelineNote: 'Step 1 of Production — run after strategy is approved',
      },
      { isHandoff: true, label: 'Cooperator writes copy' },
      {
        name: 'Copy Editing', cmd: '/copy-editing', desc: 'Polish copy before QA',
        detail: 'Applies the Seven Sweeps Framework to systematically improve cooperator copy before it goes into QA. Focuses on clarity, tone alignment, CTA strength, and brand voice — without rewriting the entire email. Run this before /review to catch obvious issues early.',
        whenToUse: 'Cooperator has delivered draft copy and you want to tighten it before formal QA. Useful when copy is structurally sound but needs polish — saves QA cycles and reduces back-and-forth with the cooperator.',
        practicalOutputs: ['Polished draft with stronger clarity, CTA, and brand voice alignment', 'Fewer /review iterations — obvious issues caught before formal QA', 'Faster production cycle — less back-and-forth before implementation'],
        outputs: 'projects/[client]/outputs/copy-edit-[name].md',
        pipelineNote: 'Step 2 of Production — run after cooperator delivers copy',
      },
      {
        name: 'Review', cmd: '/review', desc: 'QA against brief + brand standards',
        detail: 'QA review of the cooperator\'s copy against the original brief, [YOUR_AGENCY] quality standards, and client-specific brand voice. Flags issues with tone, compliance, subject line, CTA, and Czech diacritics. Produces a structured pass/fail report with specific line-level feedback.',
        whenToUse: 'Copy is finalized (after /copy-editing if used) and ready for sign-off before going to design. This is the last Claude step — if it passes here, it goes straight to the designer.',
        practicalOutputs: ['Structured pass/fail QA report with specific line-level feedback', 'Confidence the copy meets [YOUR_AGENCY] standards before it reaches the designer', 'If revisions needed: clear instructions ready to send back to the cooperator'],
        outputs: 'Structured review report (inline in Claude Code session)',
        pipelineNote: 'Step 3 of Production — last Claude step before design handoff',
      },
      { isHandoff: true, label: 'Design → Client approval → Implementation' },
    ],
  },
  {
    id: 'monthly',
    label: 'Monthly Cycle',
    color: '#8B5CF6',
    steps: [
      {
        name: 'Audit', cmd: '/audit', desc: 'Performance health check',
        detail: 'Recurring version of the audit for active DFY clients. Evaluates performance against the previous audit period, highlights what improved, what regressed, and surfaces the top opportunities for the coming month. Used as the data foundation for the strategic call.',
        whenToUse: 'Start of each month for every active DFY client. Run 3–4 days before the strategic call so you have time to review the output. The result is the data backbone for the content plan and call prep.',
        practicalOutputs: ['Updated branded HTML report showing performance vs. the previous period', 'Period-over-period comparison: what improved, what regressed, where the opportunities are', 'Input that feeds directly into /content-plan and /call-prep automatically'],
        outputs: 'projects/[client]/outputs/audit.html (updated branded report)',
        pipelineNote: 'Step 1 of Monthly Cycle — run first, feeds into content plan',
      },
      {
        name: 'Content Plan', cmd: '/content-plan', desc: 'Campaign calendar for the month',
        detail: 'Generates monthly campaign ideas based on the latest audit findings, brand seasonality, and client product catalog. Produces a campaign calendar with individual campaign briefs. Feeds directly into /call-prep so the AM has everything ready for the strategic call.',
        whenToUse: 'After the monthly audit is done and you need the campaign calendar ready for the strategic call. Run it once per client per month. The output goes into /call-prep and then gets presented to the client.',
        practicalOutputs: ['A campaign calendar with ideas for the full month, segmented and sequenced', 'Individual campaign briefs with angles, hooks, and suggested segments', 'Ready input for /call-prep — the AM walks into the call with campaigns pre-selected'],
        outputs: 'projects/[client]/outputs/content-plan-[month].html',
        pipelineNote: 'Step 2 of Monthly Cycle — run after audit, before call prep',
      },
      {
        name: 'Call Prep', cmd: '/call-prep', desc: 'Strategic call agenda + AM notes',
        detail: 'Aggregates data from the latest audit, content plan, and flow status to generate two things: a client-facing call agenda (structured, professional) and internal AM notes with talking points, potential objections, and recommended decisions. Eliminates manual prep time.',
        whenToUse: 'Run 1–2 days before the strategic call, after both the audit and content plan are ready. The output is what the AM walks into the call with — no additional prep needed.',
        practicalOutputs: ['Client-facing call agenda structured and ready to run the meeting', 'Internal AM notes with talking points, anticipated objections, and recommended decisions', 'Zero manual prep — open the document and run the call'],
        outputs: 'projects/[client]/outputs/call-prep.md (agenda + AM notes)',
        pipelineNote: 'Step 3 of Monthly Cycle — run last, just before the call',
      },
      { isHandoff: true, label: 'Strategic call with client' },
    ],
  },
];

const HANDOFF_ICON = `<svg class="handoff-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

let activeSkillCard = null;
let selectedClient = '';

function buildSkillsPanel() {
  const panel = $('skills-panel');
  panel.innerHTML = '';

  const header = document.createElement('div');
  header.id = 'skills-header';
  header.innerHTML = `
    <label class="client-label">Client context</label>
    <select id="client-select">
      <option value="">— no client selected —</option>
    </select>
  `;
  panel.appendChild(header);

  PIPELINE.forEach((phase, phaseIdx) => {
    const section = document.createElement('div');
    section.className = 'phase-section';

    const phaseHeader = document.createElement('div');
    phaseHeader.className = 'phase-header';
    phaseHeader.innerHTML = `<span class="phase-dot" style="background:${phase.color}"></span><span class="phase-label">${phase.label}</span>`;
    section.appendChild(phaseHeader);

    let stepNum = 0;
    phase.steps.forEach((step, i) => {
      const isLast = i === phase.steps.length - 1;

      if (step.isHandoff) {
        const row = document.createElement('div');
        row.className = 'handoff-row';
        row.innerHTML = `
          <div class="step-gutter">${!isLast ? '<div class="step-line" style="margin-top:0"></div>' : ''}</div>
          <div class="handoff-content">${HANDOFF_ICON}<span class="handoff-label">${step.label}</span></div>
        `;
        section.appendChild(row);
      } else {
        stepNum++;
        const row = document.createElement('div');
        row.className = 'step-row';

        const gutter = document.createElement('div');
        gutter.className = 'step-gutter';
        gutter.innerHTML = `<span class="step-num" style="background:${phase.color}">${stepNum}</span>${!isLast ? '<div class="step-line"></div>' : ''}`;

        const card = document.createElement('div');
        card.className = 'skill-card';
        card.dataset.cmd = step.cmd;
        card.dataset.phaseId = phase.id;
        card.innerHTML = `
          <div class="skill-card-top">
            <span class="skill-name">${step.name}</span>
            <code class="skill-cmd">${step.cmd}</code>
          </div>
          <div class="skill-desc">${step.desc}</div>
        `;
        card.addEventListener('click', () => showSkillDetail(step, card, phase.color, phase.id));

        row.appendChild(gutter);
        row.appendChild(card);
        section.appendChild(row);
      }
    });

    if (phaseIdx < PIPELINE.length - 1) {
      const spacer = document.createElement('div');
      spacer.className = 'phase-spacer';
      section.appendChild(spacer);
    }

    panel.appendChild(section);
  });

  panel.querySelector('#client-select').addEventListener('change', e => {
    selectedClient = e.target.value;
    panel.querySelectorAll('.skill-card').forEach(card => {
      const baseCmd = card.dataset.cmd;
      card.querySelector('.skill-cmd').textContent = selectedClient ? `${baseCmd} ${selectedClient}` : baseCmd;
    });
    if (activeSkillCard) activeSkillCard.click();
  });
}

function populateClientDropdown(tree) {
  const select = document.querySelector('#client-select');
  if (!select) return;
  const projectsNode = tree.find(n => n.label === 'Projects' || n.path === 'projects');
  if (!projectsNode) return;
  (projectsNode.children || []).filter(n => n.type === 'folder').forEach(proj => {
    const opt = document.createElement('option');
    opt.value = proj.name;
    opt.textContent = proj.name;
    select.appendChild(opt);
  });
}

function showSkillDetail(step, card, phaseColor, phaseId) {
  if (activeSkillCard) activeSkillCard.classList.remove('active');
  activeSkillCard = card;
  card.classList.add('active');

  if (isEditing) cancelEdit(true);

  const skillPath = `skill://${phaseId}/${step.cmd.replace('/', '')}`;

  // Already open — just switch to it
  if (tabs.find(t => t.path === skillPath)) {
    activeTabPath = skillPath;
    currentPath = null;
    document.querySelectorAll('.file.active').forEach(f => f.classList.remove('active'));
    renderTabs();
    renderSkillDetailView(step, phaseColor);
    return;
  }

  // Replace active tab, or push if no tabs
  const newTab = { type: 'skill', path: skillPath, name: step.name, step, phaseColor, phaseId };
  if (tabs.length > 0) {
    const activeIdx = tabs.findIndex(t => t.path === activeTabPath);
    if (activeIdx !== -1) {
      tabs[activeIdx] = newTab;
    } else {
      tabs.push(newTab);
    }
  } else {
    tabs.push(newTab);
  }

  activeTabPath = skillPath;
  currentPath = null;
  document.querySelectorAll('.file.active').forEach(f => f.classList.remove('active'));
  renderTabs();
  renderSkillDetailView(step, phaseColor);
}

function renderSkillDetailView(step, phaseColor) {
  const fullCmd = selectedClient ? `${step.cmd} ${selectedClient}` : step.cmd;

  emptyState.classList.add('hidden');
  toolbar.classList.add('hidden');
  viewer.classList.remove('hidden');
  viewer.classList.remove('html-mode');
  viewer.classList.add('skill-mode');
  viewer.contentEditable = 'false';
  viewer.classList.remove('editing');
  viewer.innerHTML = `
    <div class="skill-detail">
      <div class="skill-detail-header">
        <h1 class="skill-detail-name">${step.name}</h1>
        <code class="skill-detail-cmd" style="border-color:${phaseColor}">${fullCmd}</code>
      </div>

      <p class="skill-detail-about">${step.detail}</p>

      ${step.whenToUse ? `<div class="skill-when-block">
        <span class="skill-when-label">When to use</span>
        <p class="skill-when-text">${step.whenToUse}</p>
      </div>` : ''}

      ${step.practicalOutputs ? `<div class="skill-outcomes">
        <span class="skill-outcomes-label">After running this skill you'll have</span>
        <ul class="skill-outcomes-list">
          ${step.practicalOutputs.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>` : ''}

      <div class="skill-detail-meta">
        <div class="skill-meta-row">
          <span class="skill-meta-label">Pipeline</span>
          <span class="skill-meta-value">${step.pipelineNote}</span>
        </div>
        <div class="skill-meta-row">
          <span class="skill-meta-label">Outputs</span>
          <span class="skill-meta-value">${step.outputs.replace('[client]', selectedClient || '[client]')}</span>
        </div>
      </div>

      <div class="skill-detail-run">
        <span class="skill-run-label">Run in Claude Code</span>
        <div class="skill-run-block">
          <code id="skill-run-cmd">${fullCmd}</code>
          <button class="skill-copy-btn" onclick="copyRunCmd('${fullCmd}')">Copy</button>
        </div>
      </div>
    </div>
  `;
}

function switchToSkillTab(tab) {
  const card = document.querySelector(`.skill-card[data-cmd="${tab.step.cmd}"][data-phase-id="${tab.phaseId}"]`);
  if (card) {
    if (activeSkillCard) activeSkillCard.classList.remove('active');
    activeSkillCard = card;
    card.classList.add('active');
  }
  activeTabPath = tab.path;
  currentPath = null;
  document.querySelectorAll('.file.active').forEach(f => f.classList.remove('active'));
  renderTabs();
  renderSkillDetailView(tab.step, tab.phaseColor);
}

function copyRunCmd(cmd) {
  navigator.clipboard.writeText(cmd).then(() => {
    showToast(`Copied: ${cmd}`);
  }).catch(() => showToast(cmd));
}

/* ---- "New" badge — mtime vs last visit ---- */
const lastVisitMs = Number(localStorage.getItem('rv_lastVisit') || 0);
localStorage.setItem('rv_lastVisit', Date.now());

function isNewFile(node) {
  return node.mtime && node.mtime > lastVisitMs;
}

/* ---- State ---- */
let currentPath = null;     // Active markdown file path (null for html/skill tabs)
let currentContent = null;
let isEditing = false;
let tabs = [];              // [{ type, path, name, content?, step?, phaseColor?, phaseId? }]
let activeTabPath = null;   // Currently active tab path (file, html, or skill)
let allFiles = [];          // Flat list of all files for quick nav
let quickNavVisible = false;
let tabsRestored = false;   // Prevent saving during restoration

/* ---- Persistence ---- */
function savePersistence() {
  if (!tabsRestored) return; // Don't save mid-restoration
  const serializable = tabs.map(t => {
    if (t.type === 'skill') {
      return { type: 'skill', path: t.path, name: t.name, phaseId: t.phaseId, phaseColor: t.phaseColor, stepCmd: t.step.cmd };
    }
    return { type: t.type, path: t.path, name: t.name };
  });
  try {
    localStorage.setItem('rv_tabs', JSON.stringify(serializable));
    localStorage.setItem('rv_activeTab', activeTabPath || '');
  } catch {}
}

async function restorePersistence() {
  try {
    const raw = localStorage.getItem('rv_tabs');
    const savedActive = localStorage.getItem('rv_activeTab');
    if (!raw) { tabsRestored = true; return; }
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) { tabsRestored = true; return; }

    for (const t of saved) {
      if (t.type === 'skill') {
        // Find matching step from PIPELINE
        let foundStep = null, foundPhaseColor = null;
        for (const phase of PIPELINE) {
          const step = phase.steps.find(s => !s.isHandoff && s.cmd === t.stepCmd && phase.id === t.phaseId);
          if (step) { foundStep = step; foundPhaseColor = phase.color; break; }
        }
        if (foundStep) {
          tabs.push({ type: 'skill', path: t.path, name: t.name, step: foundStep, phaseColor: foundPhaseColor, phaseId: t.phaseId });
        }
      } else if (t.type === 'html') {
        tabs.push({ type: 'html', path: t.path, name: t.name });
      } else {
        try {
          const res = await fetch(`/api/file?path=${encodeURIComponent(t.path)}`);
          if (res.ok) {
            const { content } = await res.json();
            tabs.push({ type: 'file', path: t.path, name: t.name, content });
          }
        } catch {}
      }
    }

    tabsRestored = true;

    if (tabs.length === 0) return;

    // Re-activate the previously active tab
    const targetPath = savedActive && tabs.find(t => t.path === savedActive) ? savedActive : tabs[tabs.length - 1].path;
    activeTabPath = targetPath;

    const activeTab = tabs.find(t => t.path === targetPath);
    renderTabs();
    if (activeTab) {
      if (activeTab.type === 'skill') {
        switchToSkillTab(activeTab);
      } else if (activeTab.type === 'html') {
        showHtmlView(activeTab.path);
        showToolbar(activeTab.path);
      } else {
        currentPath = activeTab.path;
        currentContent = activeTab.content;
        showView(activeTab.content);
        showToolbar(activeTab.path);
        // Highlight in sidebar
        const el = fileTree.querySelector(`[data-path="${CSS.escape(activeTab.path)}"]`);
        if (el) el.classList.add('active');
      }
    }
  } catch {
    tabsRestored = true;
  }
}

/* ---- Selectors ---- */
const $ = id => document.getElementById(id);
const fileTree = $('file-tree');
const viewer = $('viewer');
const toolbar = $('toolbar');
const emptyState = $('empty-state');
const filePathLabel = $('file-path-label');

/* ============================================================
   FILE TREE
   ============================================================ */

async function loadTree() {
  try {
    const res = await fetch('/api/files');
    const tree = await res.json();
    fileTree.innerHTML = '';
    if (tree.length === 0) {
      fileTree.innerHTML = '<div class="loading">No files found.</div>';
      return;
    }
    tree.forEach(node => fileTree.appendChild(renderNode(node, 0)));
    populateClientDropdown(tree);
    // Build flat file list for quick nav (sorted by mtime, newest first)
    allFiles = [];
    flattenTree(tree);
    allFiles.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));

    // Restore tabs from previous session (only on first load)
    if (!tabsRestored) {
      await restorePersistence();
    }

    // Re-mark active file in sidebar
    if (currentPath) {
      const el = fileTree.querySelector(`[data-path="${CSS.escape(currentPath)}"]`);
      if (el) el.classList.add('active');
    }
  } catch (e) {
    fileTree.innerHTML = `<div class="loading error">Failed to load files.</div>`;
    tabsRestored = true;
  }
}

function flattenTree(nodes) {
  for (const node of nodes) {
    if (node.type === 'folder') {
      flattenTree(node.children || []);
    } else {
      allFiles.push(node);
    }
  }
}

function renderNode(node, depth) {
  if (node.type === 'folder') {
    const details = document.createElement('details');
    details.open = depth === 0 && (node.label === 'Projects' || node.path === 'projects');

    const summary = document.createElement('summary');
    summary.className = 'folder';
    summary.dataset.depth = depth;

    const label = node.label || node.name;

    if (depth === 0) {
      const sectionIcon = SECTION_ICONS[label.toLowerCase()] || '';
      summary.innerHTML = `${ICON_CHEVRON}${sectionIcon}<span class="folder-label">${label}</span>`;
    } else if (depth === 1) {
      summary.innerHTML = `${ICON_CHEVRON}${ICON_FOLDER}<span class="folder-label">${label}</span>`;
    } else {
      summary.innerHTML = `${ICON_CHEVRON}${ICON_FOLDER}<span class="folder-label folder-sub">${label}</span>`;
    }

    details.appendChild(summary);
    (node.children || []).forEach(child => details.appendChild(renderNode(child, depth + 1)));
    return details;
  } else if (node.type === 'html') {
    const div = document.createElement('div');
    div.className = 'file file-html';
    div.dataset.path = node.path;
    div.dataset.depth = depth;
    const displayName = node.name.replace(/\.html$/, '');
    const newBadge = isNewFile(node) ? '<span class="badge-new">new</span>' : '';
    div.innerHTML = `${ICON_HTML}<span class="file-label">${displayName}</span>${newBadge}`;
    div.title = node.name;
    div.addEventListener('click', e => openHtml(node.path, div, e.metaKey || e.ctrlKey));
    return div;
  } else {
    const div = document.createElement('div');
    div.className = 'file' + (node.structured ? ' file-structured' : '');
    div.dataset.path = node.path;
    div.dataset.depth = depth;
    const displayName = node.name.replace(/\.md$/, '');
    const newBadge = isNewFile(node) ? '<span class="badge-new">new</span>' : '';
    const icon = node.structured ? ICON_STRUCTURED : ICON_PAGE;
    div.innerHTML = `${icon}<span class="file-label">${displayName}</span>${newBadge}`;
    div.title = node.name;
    div.addEventListener('click', e => openFile(node.path, div, e.metaKey || e.ctrlKey));
    return div;
  }
}

/* ============================================================
   FILE OPEN / VIEW
   ============================================================ */

function tabName(path, ext) {
  const parts = path.split('/');
  const filename = parts[parts.length - 1].replace(ext, '');
  return parts.length >= 2 ? `${parts[parts.length - 2]} / ${filename}` : filename;
}

async function openFile(path, el, forceNew = false) {
  if (isEditing) cancelEdit(true);
  hideQuickNav();

  document.querySelectorAll('.file.active').forEach(f => f.classList.remove('active'));
  if (el) {
    el.classList.add('active');
    el.querySelector('.badge-new')?.remove();
  }

  // Already open — just switch to it
  const existing = tabs.find(t => t.path === path);
  if (existing) {
    currentPath = path;
    activeTabPath = path;
    currentContent = existing.content;
    renderTabs();
    showView(currentContent);
    showToolbar(path);
    return;
  }

  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error('File not found');
    const { content } = await res.json();

    currentContent = content;

    // Replace active tab unless Cmd+click or no tabs open
    // Important: capture activeTabPath BEFORE updating it
    if (!forceNew && tabs.length > 0) {
      const activeIdx = tabs.findIndex(t => t.path === activeTabPath);
      if (activeIdx !== -1) {
        tabs[activeIdx] = { type: 'file', path, name: tabName(path, /\.md$/), content };
      } else {
        tabs.push({ type: 'file', path, name: tabName(path, /\.md$/), content });
      }
    } else {
      tabs.push({ type: 'file', path, name: tabName(path, /\.md$/), content });
    }

    currentPath = path;
    activeTabPath = path;
    renderTabs();

    showView(content);
    showToolbar(path);
  } catch (e) {
    showToast('Failed to load file', 'error');
  }
}

async function openHtml(path, el, forceNew = false) {
  if (isEditing) cancelEdit(true);
  hideQuickNav();

  document.querySelectorAll('.file.active').forEach(f => f.classList.remove('active'));
  if (el) {
    el.classList.add('active');
    el.querySelector('.badge-new')?.remove();
  }

  // Already open — just switch to it
  const existing = tabs.find(t => t.path === path);
  if (existing) {
    currentPath = null;
    activeTabPath = path;
    renderTabs();
    showHtmlView(path);
    showToolbar(path);
    return;
  }

  currentPath = null;

  // Replace active tab unless Cmd+click or no tabs open
  // Important: capture activeTabPath BEFORE updating it
  if (!forceNew && tabs.length > 0) {
    const activeIdx = tabs.findIndex(t => t.path === activeTabPath);
    if (activeIdx !== -1) {
      tabs[activeIdx] = { type: 'html', path, name: tabName(path, /\.html$/) };
    } else {
      tabs.push({ type: 'html', path, name: tabName(path, /\.html$/) });
    }
  } else {
    tabs.push({ type: 'html', path, name: tabName(path, /\.html$/) });
  }

  activeTabPath = path;
  renderTabs();
  showHtmlView(path);
  showToolbar(path);
}

/* ============================================================
   TABS
   ============================================================ */

const ICON_TAB_FILE = `<svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const ICON_TAB_HTML = `<svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
const ICON_TAB_SKILL = `<svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;

function renderTabs() {
  const bar = $('tab-bar');
  if (!bar) return;

  bar.innerHTML = tabs.map(tab => {
    const active = tab.path === activeTabPath ? 'active' : '';
    const icon = tab.type === 'skill' ? ICON_TAB_SKILL : tab.type === 'html' ? ICON_TAB_HTML : ICON_TAB_FILE;
    return `<div class="tab ${active}" data-path="${tab.path}" data-type="${tab.type || 'file'}">
      ${icon}
      <span class="tab-name">${tab.name}</span>
      <span class="tab-close" data-close="${tab.path}">×</span>
    </div>`;
  }).join('') + `<button id="tab-add" title="Quick open (search files)">+</button>`;

  bar.querySelectorAll('.tab').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.tab-close')) return;
      const path = el.dataset.path;
      if (path === activeTabPath) return;

      const tab = tabs.find(t => t.path === path);
      if (!tab) return;

      if (tab.type === 'skill') {
        switchToSkillTab(tab);
      } else if (tab.type === 'html') {
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(path)}"]`);
        openHtml(path, sidebarEl);
      } else {
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(path)}"]`);
        openFile(path, sidebarEl);
      }
    });
  });

  bar.querySelectorAll('.tab-close').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      closeTab(el.dataset.close);
    });
  });

  const addBtn = bar.querySelector('#tab-add');
  if (addBtn) {
    addBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (quickNavVisible) {
        hideQuickNav();
      } else {
        showQuickNav();
      }
    });
  }

  // Scroll the active tab into view
  requestAnimationFrame(() => {
    const activeEl = bar.querySelector('.tab.active');
    if (activeEl) activeEl.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  });

  savePersistence();
}

function closeTab(path) {
  const idx = tabs.findIndex(t => t.path === path);
  if (idx === -1) return;
  tabs.splice(idx, 1);

  if (activeTabPath === path) {
    if (tabs.length > 0) {
      const next = tabs[Math.min(idx, tabs.length - 1)];
      if (next.type === 'skill') {
        switchToSkillTab(next);
      } else if (next.type === 'html') {
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(next.path)}"]`);
        openHtml(next.path, sidebarEl);
      } else {
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(next.path)}"]`);
        openFile(next.path, sidebarEl);
      }
    } else {
      activeTabPath = null;
      currentPath = null;
      currentContent = null;
      if (activeSkillCard) { activeSkillCard.classList.remove('active'); activeSkillCard = null; }
      document.querySelectorAll('.file.active').forEach(f => f.classList.remove('active'));
      emptyState.classList.remove('hidden');
      viewer.classList.add('hidden');
      toolbar.classList.add('hidden');
      renderTabs();
    }
  } else {
    renderTabs();
  }
}

/* ============================================================
   STRUCTURED CONTENT — Frontmatter, Collapsible Sections, Status
   ============================================================ */

const STATUS_CYCLE = ['draft', 'to-review', 'to-be-fixed', 'ready'];
const STATUS_COLORS = {
  'draft':       { bg: '#F3F5F7', color: '#8893A8' },
  'to-review':   { bg: '#FFF3E0', color: '#E65100' },
  'to-be-fixed': { bg: '#FEE2E2', color: '#DC2626' },
  'ready':       { bg: '#DCFCE7', color: '#16A34A' },
};
const STATUS_LABELS = {
  'draft': 'Draft',
  'to-review': 'To Review',
  'to-be-fixed': 'To Fix',
  'ready': 'Ready',
};

let currentFrontmatter = null;

const ICON_COPY = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`;
const ICON_SECTION_CHEVRON = `<svg class="section-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { raw: null, data: null, body: content };

  const raw = match[1];
  const body = match[2];
  const data = {};

  const typeMatch = raw.match(/^type:\s*(.+)$/m);
  const projectMatch = raw.match(/^project:\s*(.+)$/m);
  if (typeMatch) data.type = typeMatch[1].trim();
  if (projectMatch) data.project = projectMatch[1].trim();

  const itemMatches = [...raw.matchAll(/-\s*\{\s*title:\s*["']([^"']+)["']\s*,\s*status:\s*(\w[\w-]*)\s*\}/g)];
  if (itemMatches.length > 0) {
    data.items = itemMatches.map(m => ({ title: m[1], status: m[2] }));
  }

  return { raw, data, body };
}

function isStructuredFile(data) {
  return data && data.type && Array.isArray(data.items) && data.items.length > 0;
}

function renderStatusBar(items) {
  const counts = {};
  items.forEach(item => {
    const s = item.status || 'unknown';
    counts[s] = (counts[s] || 0) + 1;
  });

  const total = items.length;
  const ARROW = `<svg class="kanban-arrow" width="12" height="10" viewBox="0 0 12 10"><path d="M1 5h8M7 2l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const stages = STATUS_CYCLE.map((status, i) => {
    const count = counts[status] || 0;
    const c = STATUS_COLORS[status] || STATUS_COLORS.draft;
    const active = count > 0;
    const arrow = i < STATUS_CYCLE.length - 1 ? ARROW : '';
    return `<div class="kanban-stage ${active ? 'active' : 'empty'}">
      <span class="kanban-pill" style="${active ? `background:${c.bg};color:${c.color};border-color:${c.color}` : ''}">${active ? count : ''}<span class="kanban-stage-name">${STATUS_LABELS[status] || status}</span></span>
    </div>${arrow}`;
  }).join('');

  return `<div class="structured-status-bar">
    <span class="status-bar-total">${total} items</span>
    <div class="kanban-pipeline">${stages}</div>
  </div>`;
}

function wrapSectionsCollapsible(html, items) {
  const parts = html.split(/(?=<h2[\s>])/);
  let result = '';
  let sectionIndex = 0;

  for (const part of parts) {
    if (/^<h2[\s>]/.test(part)) {
      const h2Match = part.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
      const title = h2Match ? h2Match[1] : '';
      const restContent = part.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '');

      const item = items[sectionIndex];
      const status = item?.status || '';
      const c = STATUS_COLORS[status] || STATUS_COLORS.draft;

      const statusChip = status
        ? `<span class="section-status-chip" data-index="${sectionIndex}" data-status="${status}" style="background:${c.bg};color:${c.color}">${STATUS_LABELS[status] || status}</span>`
        : '';

      const copyBtn = `<button class="section-copy-btn" data-index="${sectionIndex}" title="Copy section">${ICON_COPY}</button>`;
      const editBtn = `<button class="section-edit-btn" data-index="${sectionIndex}" title="Edit section">${ICON_EDIT}</button>`;

      result += `<details class="content-section" data-index="${sectionIndex}">
        <summary class="section-summary">
          ${ICON_SECTION_CHEVRON}
          <span class="section-title">${title}</span>
          <span class="section-actions">${statusChip}${editBtn}${copyBtn}</span>
        </summary>
        <div class="section-body">${restContent}</div>
      </details>`;

      sectionIndex++;
    } else {
      result += part;
    }
  }

  return result;
}

function nextStatus(current) {
  const idx = STATUS_CYCLE.indexOf(current);
  if (idx === -1 || idx === STATUS_CYCLE.length - 1) return STATUS_CYCLE[0];
  return STATUS_CYCLE[idx + 1];
}

function updateFrontmatterStatus(raw, itemIndex, newStatus) {
  let count = 0;
  return raw.replace(/-\s*\{\s*title:\s*["']([^"']+)["']\s*,\s*status:\s*(\w[\w-]*)\s*\}/g, (match) => {
    if (count === itemIndex) {
      count++;
      return match.replace(/status:\s*\w[\w-]*/, `status: ${newStatus}`);
    }
    count++;
    return match;
  });
}

function closeStatusDropdown() {
  const existing = document.querySelector('.status-dropdown');
  if (existing) existing.remove();
}

async function applyStatusChange(chip, index, newStatus) {
  currentFrontmatter.data.items[index].status = newStatus;
  currentFrontmatter.raw = updateFrontmatterStatus(currentFrontmatter.raw, index, newStatus);

  const c = STATUS_COLORS[newStatus] || STATUS_COLORS.draft;
  chip.dataset.status = newStatus;
  chip.textContent = STATUS_LABELS[newStatus] || newStatus;
  chip.style.background = c.bg;
  chip.style.color = c.color;

  const statusBar = viewer.querySelector('.structured-status-bar');
  if (statusBar) statusBar.outerHTML = renderStatusBar(currentFrontmatter.data.items);

  const newContent = `---\n${currentFrontmatter.raw}\n---\n${currentFrontmatter.body}`;
  currentContent = newContent;
  const tab = tabs.find(t => t.path === currentPath);
  if (tab) tab.content = newContent;

  try {
    await fetch(`/api/file?path=${encodeURIComponent(currentPath)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent }),
    });
    showToast(`Status → ${STATUS_LABELS[newStatus] || newStatus}`);
  } catch {
    showToast('Failed to save status', 'error');
  }
}

function attachStructuredHandlers() {
  if (!currentFrontmatter) return;

  // Close dropdown on outside click
  document.addEventListener('click', closeStatusDropdown);

  // Status chip click → open dropdown picker
  viewer.querySelectorAll('.section-status-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      closeStatusDropdown();

      const currentStatus = chip.dataset.status;
      const rect = chip.getBoundingClientRect();

      const dropdown = document.createElement('div');
      dropdown.className = 'status-dropdown';
      dropdown.style.top = `${rect.bottom + 4}px`;
      dropdown.style.left = `${rect.left}px`;

      STATUS_CYCLE.forEach(status => {
        const c = STATUS_COLORS[status] || STATUS_COLORS.draft;
        const option = document.createElement('button');
        option.className = 'status-dropdown-option' + (status === currentStatus ? ' active' : '');
        option.innerHTML = `<span class="status-dropdown-dot" style="background:${c.color}"></span>${STATUS_LABELS[status] || status}`;
        option.addEventListener('click', (ev) => {
          ev.stopPropagation();
          closeStatusDropdown();
          if (status !== currentStatus) {
            applyStatusChange(chip, parseInt(chip.dataset.index), status);
          }
        });
        dropdown.appendChild(option);
      });

      document.body.appendChild(dropdown);
    });
  });

  // Copy button → copy section text
  viewer.querySelectorAll('.section-copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const index = parseInt(btn.dataset.index);
      const section = viewer.querySelector(`.content-section[data-index="${index}"]`);
      const body = section?.querySelector('.section-body');
      if (!body) return;

      try {
        await navigator.clipboard.writeText(body.textContent.trim());
        showToast('Copied to clipboard');
      } catch {
        showToast('Copy failed', 'error');
      }
    });
  });

  // Edit button → inline contentEditable mode
  viewer.querySelectorAll('.section-edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const index = parseInt(btn.dataset.index);
      const section = viewer.querySelector(`.content-section[data-index="${index}"]`);
      const body = section?.querySelector('.section-body');
      if (!body || body.classList.contains('editing')) return;

      // Make sure section is open
      section.open = true;

      const rawSections = getRawSections(currentFrontmatter.body);
      const rawMd = rawSections[index] || '';
      const h2Match = rawMd.match(/^## .+$/m);
      const h2Line = h2Match ? h2Match[0] : '';

      body.classList.add('editing');
      const originalHtml = body.innerHTML;

      // Make the content editable in-place
      body.contentEditable = 'true';
      body.focus();

      // Add save/cancel bar below the editable area
      const actions = document.createElement('div');
      actions.className = 'section-edit-actions';
      actions.innerHTML = `
        <button class="section-edit-save">Save</button>
        <button class="section-edit-cancel">Cancel</button>
      `;
      body.after(actions);

      const exitEdit = () => {
        body.contentEditable = 'false';
        body.classList.remove('editing');
        actions.remove();
      };

      actions.querySelector('.section-edit-cancel').addEventListener('click', () => {
        body.innerHTML = originalHtml;
        exitEdit();
      });

      actions.querySelector('.section-edit-save').addEventListener('click', async () => {
        // Convert edited HTML back to markdown
        // Strip trailing --- (the <hr> separator is part of section HTML but reconstructBody adds its own)
        const bodyMd = htmlToMarkdown(body).trim().replace(/\n---\s*$/, '').trim();
        const newMd = h2Line + '\n\n' + bodyMd;

        if (newMd.trim() === rawMd.trim()) {
          body.innerHTML = originalHtml;
          exitEdit();
          return;
        }

        // Reconstruct full body with edited section
        const sections = getRawSections(currentFrontmatter.body);
        sections[index] = newMd;
        const newBody = reconstructBody(currentFrontmatter.body, sections);

        currentFrontmatter.body = newBody;
        const newContent = `---\n${currentFrontmatter.raw}\n---\n${newBody}`;
        currentContent = newContent;
        const tab = tabs.find(t => t.path === currentPath);
        if (tab) tab.content = newContent;

        try {
          await fetch(`/api/file?path=${encodeURIComponent(currentPath)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent }),
          });

          // Re-render the section with new content (skip the h2 since it's in the summary)
          const renderedHtml = marked.parse(bodyMd);
          body.innerHTML = renderedHtml;
          exitEdit();

          if (typeof applyCommentHighlights === 'function') {
            applyCommentHighlights();
          }

          showToast('Section saved');
        } catch {
          showToast('Failed to save', 'error');
        }
      });
    });
  });
}

// Split markdown body into sections by ## headers
function getRawSections(body) {
  const sections = [];
  const regex = /^## .+$/gm;
  const matches = [];
  let m;
  while ((m = regex.exec(body)) !== null) {
    matches.push(m.index);
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i];
    const end = i + 1 < matches.length ? matches[i + 1] : body.length;
    let section = body.substring(start, end);
    // Trim trailing --- separator and whitespace
    section = section.replace(/\n---\s*$/, '').trim();
    sections.push(section);
  }
  return sections;
}

// Reconstruct the full body from edited sections
function reconstructBody(originalBody, sections) {
  // Get the preamble (everything before the first ## header)
  const firstH2 = originalBody.search(/^## .+$/m);
  const preamble = firstH2 > 0 ? originalBody.substring(0, firstH2) : '';

  // Get the postamble (everything after the last section — platform notes etc.)
  const regex = /^## .+$/gm;
  const matches = [];
  let m;
  while ((m = regex.exec(originalBody)) !== null) {
    matches.push(m.index);
  }
  const lastSectionStart = matches[matches.length - 1];
  // Find where the last section's content ends (look for trailing non-section content)
  const lastSectionBody = originalBody.substring(lastSectionStart);
  const nextH2InLast = lastSectionBody.substring(1).search(/^## .+$/m);
  const lastSectionEnd = nextH2InLast === -1 ? originalBody.length : lastSectionStart + 1 + nextH2InLast;

  // Check if there's trailing content after all ## sections (like platform setup notes)
  // Those use ## too, so they're captured as sections. Just rejoin all sections.
  return preamble + sections.join('\n\n---\n\n') + '\n';
}

// Convert contentEditable HTML back to markdown
function htmlToMarkdown(el) {
  let md = '';
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Skip whitespace-only text nodes between block elements
      if (!node.textContent.trim()) continue;
      md += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'p') {
        md += htmlToMarkdown(node).trim() + '\n\n';
      } else if (tag === 'strong' || tag === 'b') {
        md += '**' + htmlToMarkdown(node) + '**';
      } else if (tag === 'em' || tag === 'i') {
        md += '*' + htmlToMarkdown(node) + '*';
      } else if (tag === 'a') {
        const href = node.getAttribute('href') || '';
        md += '[' + htmlToMarkdown(node) + '](' + href + ')';
      } else if (tag === 'br') {
        md += '\n';
      } else if (tag === 'hr') {
        md += '\n---\n\n';
      } else if (tag === 'h3') {
        md += '### ' + htmlToMarkdown(node).trim() + '\n\n';
      } else if (tag === 'h4') {
        md += '#### ' + htmlToMarkdown(node).trim() + '\n\n';
      } else if (tag === 'ul') {
        for (const li of node.children) {
          md += '- ' + htmlToMarkdown(li).trim() + '\n';
        }
        md += '\n';
      } else if (tag === 'ol') {
        let i = 1;
        for (const li of node.children) {
          md += i + '. ' + htmlToMarkdown(li).trim() + '\n';
          i++;
        }
        md += '\n';
      } else if (tag === 'blockquote') {
        const lines = htmlToMarkdown(node).trim().split('\n');
        md += lines.map(l => '> ' + l).join('\n') + '\n\n';
      } else if (tag === 'mark' && node.classList.contains('changed-highlight')) {
        md += '==' + htmlToMarkdown(node) + '==';
      } else if (tag === 'mark') {
        // Comment highlights — just pass through text
        md += htmlToMarkdown(node);
      } else if (tag === 'div') {
        // Chrome wraps lines in divs when editing contentEditable
        md += htmlToMarkdown(node).trim() + '\n\n';
      } else {
        md += htmlToMarkdown(node);
      }
    }
  }
  // Normalize multiple blank lines to max 2 newlines
  return md.replace(/\n{3,}/g, '\n\n');
}

/* ============================================================
   INLINE COMMENTING SYSTEM
   ============================================================ */

const ICON_COMMENT = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

let currentComments = [];

async function loadComments() {
  if (!currentPath) return;
  try {
    const res = await fetch(`/api/comments?path=${encodeURIComponent(currentPath)}`);
    currentComments = await res.json();
  } catch { currentComments = []; }
  applyCommentHighlights();
}

function applyCommentHighlights() {
  // Remove existing highlights
  viewer.querySelectorAll('mark.inline-comment').forEach(mark => {
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });

  // Group active comments by text+section to create one highlight per thread
  const active = currentComments.filter(c => !c.resolved);
  const threads = new Map();
  active.forEach(c => {
    const key = `${c.section}|||${c.text}`;
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key).push(c);
  });

  threads.forEach((comments, key) => {
    const [sectionIdx] = key.split('|||');
    const section = viewer.querySelector(`.content-section[data-index="${sectionIdx}"]`);
    if (!section) return;
    const body = section.querySelector('.section-body');
    if (!body) return;
    highlightCommentThread(body, comments);
  });

  updateCommentBadges();
}

function highlightCommentThread(container, comments) {
  const text = comments[0].text;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const idx = node.textContent.indexOf(text);
    if (idx !== -1) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + text.length);
      const mark = document.createElement('mark');
      mark.className = 'inline-comment';
      mark.dataset.threadKey = `${comments[0].section}|||${text}`;
      try {
        range.surroundContents(mark);
        mark.addEventListener('click', (e) => {
          e.stopPropagation();
          showCommentPopover(mark, comments);
        });
      } catch {}
      return;
    }
  }
}

function updateCommentBadges() {
  viewer.querySelectorAll('.comment-badge').forEach(b => b.remove());
  const active = currentComments.filter(c => !c.resolved);
  const countBySection = {};
  active.forEach(c => { countBySection[c.section] = (countBySection[c.section] || 0) + 1; });

  Object.entries(countBySection).forEach(([sectionIdx, count]) => {
    const section = viewer.querySelector(`.content-section[data-index="${sectionIdx}"]`);
    if (!section) return;
    const actions = section.querySelector('.section-actions');
    if (!actions) return;
    const badge = document.createElement('span');
    badge.className = 'comment-badge';
    badge.innerHTML = `${ICON_COMMENT} ${count}`;
    actions.insertBefore(badge, actions.firstChild);
  });
}

function closeCommentUI() {
  document.querySelectorAll('.comment-add-btn, .comment-popover').forEach(el => el.remove());
}

function handleTextSelection(e) {
  if (e.target.closest('.comment-popover') || e.target.closest('.comment-add-btn') || e.target.closest('.inline-comment')) return;

  setTimeout(() => {
    closeCommentUI();

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (text.length < 2) return;

    const range = selection.getRangeAt(0);
    let ancestor = range.commonAncestorContainer;
    if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentElement;
    const sectionBody = ancestor.closest('.section-body');
    if (!sectionBody) return;

    const section = sectionBody.closest('.content-section');
    if (!section) return;

    const sectionIndex = parseInt(section.dataset.index);
    const rect = range.getBoundingClientRect();

    const btn = document.createElement('button');
    btn.className = 'comment-add-btn';
    btn.innerHTML = `${ICON_COMMENT} Comment`;
    btn.style.top = `${rect.bottom + window.scrollY + 6}px`;
    btn.style.left = `${rect.left + window.scrollX}px`;
    document.body.appendChild(btn);

    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      btn.remove();
      showCommentInput(rect, sectionIndex, text);
    });
  }, 10);
}

function showCommentInput(rect, sectionIndex, selectedText) {
  closeCommentUI();
  const popover = document.createElement('div');
  popover.className = 'comment-popover';
  popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;
  popover.innerHTML = `
    <div class="comment-quote">"${selectedText.length > 80 ? selectedText.substring(0, 80) + '…' : selectedText}"</div>
    <textarea class="comment-textarea" placeholder="Add a comment..." rows="2"></textarea>
    <div class="comment-form-actions">
      <button class="comment-cancel-btn">Cancel</button>
      <button class="comment-save-btn">Comment</button>
    </div>
  `;
  document.body.appendChild(popover);

  const textarea = popover.querySelector('.comment-textarea');
  textarea.focus();

  popover.querySelector('.comment-cancel-btn').addEventListener('click', () => {
    closeCommentUI();
    window.getSelection().removeAllRanges();
  });

  const saveComment = async () => {
    const comment = textarea.value.trim();
    if (!comment) return;
    try {
      const res = await fetch(`/api/comments?path=${encodeURIComponent(currentPath)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', section: sectionIndex, text: selectedText, comment }),
      });
      currentComments = await res.json();
      closeCommentUI();
      window.getSelection().removeAllRanges();
      applyCommentHighlights();
      showToast('Comment added');
    } catch {
      showToast('Failed to save comment', 'error');
    }
  };

  popover.querySelector('.comment-save-btn').addEventListener('click', saveComment);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveComment(); }
  });
}

function showCommentPopover(mark, comments) {
  closeCommentUI();
  const rect = mark.getBoundingClientRect();
  const popover = document.createElement('div');
  popover.className = 'comment-popover';
  popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  // Build thread HTML
  const threadHTML = comments.map(c => `
    <div class="comment-thread-item" data-id="${c.id}">
      <div class="comment-item-header">
        <span class="comment-view-meta">${new Date(c.created).toLocaleDateString()}</span>
        <div class="comment-item-actions">
          <button class="comment-action-btn comment-edit-btn" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button class="comment-action-btn comment-delete-btn" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      <div class="comment-view-text">${c.comment}</div>
    </div>
  `).join('');

  popover.innerHTML = `
    <div class="comment-thread">${threadHTML}</div>
    <div class="comment-reply-box">
      <textarea class="comment-textarea comment-reply-input" placeholder="Reply..." rows="1"></textarea>
    </div>
    <div class="comment-popover-footer">
      <button class="comment-resolve-btn">Resolve</button>
    </div>
  `;
  document.body.appendChild(popover);

  // Wire up edit buttons
  popover.querySelectorAll('.comment-thread-item').forEach(item => {
    const id = item.dataset.id;
    const c = comments.find(c => c.id === id);

    item.querySelector('.comment-edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const textEl = item.querySelector('.comment-view-text');
      const current = c.comment;
      textEl.innerHTML = `
        <textarea class="comment-textarea comment-edit-textarea" rows="2">${current}</textarea>
        <div class="comment-form-actions" style="margin-top:6px">
          <button class="comment-cancel-btn comment-edit-cancel">Cancel</button>
          <button class="comment-save-btn comment-edit-save">Save</button>
        </div>
      `;
      const ta = textEl.querySelector('.comment-edit-textarea');
      ta.focus();
      ta.selectionStart = ta.value.length;

      textEl.querySelector('.comment-edit-cancel').addEventListener('click', (ev) => {
        ev.stopPropagation();
        textEl.textContent = current;
      });

      const saveEdit = async () => {
        const newText = ta.value.trim();
        if (!newText || newText === current) { textEl.textContent = current; return; }
        try {
          const res = await fetch(`/api/comments?path=${encodeURIComponent(currentPath)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'edit', id, comment: newText }),
          });
          currentComments = await res.json();
          c.comment = newText;
          textEl.textContent = newText;
          showToast('Comment updated');
        } catch { showToast('Failed to update', 'error'); }
      };

      textEl.querySelector('.comment-edit-save').addEventListener('click', (ev) => { ev.stopPropagation(); saveEdit(); });
      ta.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); saveEdit(); }
      });
    });

    item.querySelector('.comment-delete-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        const res = await fetch(`/api/comments?path=${encodeURIComponent(currentPath)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id }),
        });
        currentComments = await res.json();
        // If no more comments in thread, close and remove highlight
        const remaining = currentComments.filter(c => !c.resolved && c.text === comments[0].text && c.section === comments[0].section);
        if (remaining.length === 0) {
          closeCommentUI();
          applyCommentHighlights();
          showToast('Comment deleted');
        } else {
          item.remove();
          // Update the comments array reference
          comments.splice(comments.indexOf(c), 1);
          showToast('Comment deleted');
        }
      } catch { showToast('Failed to delete', 'error'); }
    });
  });

  // Reply input
  const replyInput = popover.querySelector('.comment-reply-input');
  replyInput.addEventListener('input', () => {
    replyInput.style.height = 'auto';
    replyInput.style.height = replyInput.scrollHeight + 'px';
  });

  const submitReply = async () => {
    const text = replyInput.value.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/comments?path=${encodeURIComponent(currentPath)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', section: comments[0].section, text: comments[0].text, comment: text }),
      });
      currentComments = await res.json();
      closeCommentUI();
      applyCommentHighlights();
      // Re-open the thread popover
      const newMark = viewer.querySelector(`mark[data-thread-key="${comments[0].section}|||${comments[0].text}"]`);
      if (newMark) {
        const thread = currentComments.filter(c => !c.resolved && c.text === comments[0].text && c.section === comments[0].section);
        showCommentPopover(newMark, thread);
      }
      showToast('Reply added');
    } catch { showToast('Failed to reply', 'error'); }
  };

  replyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(); }
  });

  // Resolve — resolves entire thread
  popover.querySelector('.comment-resolve-btn').addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/comments?path=${encodeURIComponent(currentPath)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve-thread', text: comments[0].text, section: comments[0].section }),
      });
      currentComments = await res.json();
      closeCommentUI();
      applyCommentHighlights();
      showToast('Thread resolved');
    } catch {
      showToast('Failed to resolve', 'error');
    }
  });
}

/* ============================================================
   SHOW VIEW — markdown + structured content rendering
   ============================================================ */

function showView(content) {
  emptyState.classList.add('hidden');
  if (activeSkillCard) { activeSkillCard.classList.remove('active'); activeSkillCard = null; }
  viewer.classList.remove('skill-mode');
  viewer.classList.remove('html-mode');
  viewer.contentEditable = 'false';
  viewer.classList.remove('editing');

  // Parse frontmatter and detect structured files
  const parsed = parseFrontmatter(content);
  const structured = isStructuredFile(parsed.data);

  if (structured) {
    currentFrontmatter = parsed;
    const html = marked.parse(parsed.body);
    viewer.innerHTML = renderStatusBar(parsed.data.items) + wrapSectionsCollapsible(html, parsed.data.items);
    viewer.classList.add('structured-view');
  } else {
    currentFrontmatter = null;
    viewer.innerHTML = marked.parse(content);
    viewer.classList.remove('structured-view');
  }

  viewer.classList.remove('hidden');
  viewer.scrollTop = 0;
  isEditing = false;

  // Link interception: external → new browser tab, internal → open in viewer
  viewer.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    if (/^https?:\/\//.test(href)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else {
      a.addEventListener('click', e => {
        e.preventDefault();
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(href)}"]`);
        if (href.endsWith('.html')) {
          openHtml(href, sidebarEl, true);
        } else {
          openFile(href, sidebarEl, true);
        }
      });
    }
  });

  if (structured) {
    attachStructuredHandlers();
    loadComments();
  }

  if (structured) {
    $('btn-edit').classList.add('hidden');
  } else {
    $('btn-edit').classList.remove('hidden');
  }
  $('btn-save').classList.add('hidden');
  $('btn-cancel').classList.add('hidden');
  $('btn-pdf').classList.remove('hidden');
  $('btn-docx').classList.remove('hidden');
  $('btn-newtab')?.classList.add('hidden');
}

function showHtmlView(path) {
  emptyState.classList.add('hidden');
  if (activeSkillCard) { activeSkillCard.classList.remove('active'); activeSkillCard = null; }
  viewer.classList.remove('skill-mode');
  viewer.classList.add('html-mode');
  viewer.contentEditable = 'false';
  viewer.classList.remove('editing');
  viewer.innerHTML = `<iframe class="html-preview" src="/api/serve?path=${encodeURIComponent(path)}"></iframe>`;
  viewer.classList.remove('hidden');
  isEditing = false;

  $('btn-edit').classList.add('hidden');
  $('btn-save').classList.add('hidden');
  $('btn-cancel').classList.add('hidden');
  $('btn-pdf').classList.remove('hidden');
  $('btn-docx').classList.add('hidden');
  const btnNewTab = $('btn-newtab');
  if (btnNewTab) {
    btnNewTab.classList.remove('hidden');
    btnNewTab.onclick = () => window.open(`/api/serve?path=${encodeURIComponent(path)}`, '_blank');
  }
}

function showToolbar(path) {
  toolbar.classList.remove('hidden');
  const parts = path.split('/');
  filePathLabel.textContent = parts.slice(-2).join(' / ').replace(/\.(md|html)$/, '');
}

/* ============================================================
   QUICK NAV — file search / picker
   ============================================================ */

function showQuickNav() {
  const qn = $('quick-nav');
  if (!qn) return;
  qn.classList.remove('hidden');
  quickNavVisible = true;
  const input = $('quick-nav-input');
  input.value = '';
  renderQuickNavList('');
  input.focus();
}

function hideQuickNav() {
  $('quick-nav')?.classList.add('hidden');
  quickNavVisible = false;
}

function renderQuickNavList(query) {
  const list = $('quick-nav-list');
  if (!list) return;

  const q = query.toLowerCase().trim();
  const filtered = q
    ? allFiles.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q)
      )
    : allFiles;

  const items = filtered.slice(0, 60);
  if (items.length === 0) {
    list.innerHTML = '<div class="qn-empty">No files found</div>';
    return;
  }

  list.innerHTML = items.map(f => {
    const icon = f.type === 'html' ? ICON_TAB_HTML : ICON_TAB_FILE;
    const displayName = f.name.replace(/\.(md|html)$/, '');
    const parts = f.path.split('/');
    const displayPath = parts.slice(0, -1).join('/');
    return `<div class="qn-item" data-path="${f.path}" data-type="${f.type}">
      ${icon}
      <span class="qn-item-name">${displayName}</span>
      <span class="qn-item-path">${displayPath}</span>
    </div>`;
  }).join('');

  list.querySelectorAll('.qn-item').forEach(el => {
    el.addEventListener('click', () => {
      const path = el.dataset.path;
      const type = el.dataset.type;
      hideQuickNav();
      if (type === 'html') {
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(path)}"]`);
        openHtml(path, sidebarEl);
      } else {
        const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(path)}"]`);
        openFile(path, sidebarEl);
      }
    });
  });
}

/* ============================================================
   EDIT / SAVE — contenteditable (Notion-style)
   ============================================================ */

function startEdit() {
  if (!currentPath) return;
  isEditing = true;

  // Revert structured view to plain markdown for editing
  if (currentFrontmatter) {
    viewer.classList.remove('structured-view');
    viewer.innerHTML = marked.parse(currentFrontmatter.body);
  }

  viewer.contentEditable = 'true';
  viewer.classList.add('editing');
  viewer.focus();

  const sel = window.getSelection();
  if (sel && viewer.firstChild) {
    const range = document.createRange();
    range.setStart(viewer.firstChild, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  $('btn-edit').classList.add('hidden');
  $('btn-save').classList.remove('hidden');
  $('btn-cancel').classList.remove('hidden');
  $('btn-pdf').classList.add('hidden');
  $('btn-docx').classList.add('hidden');
}

async function saveFile() {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
  let content = td.turndown(viewer.innerHTML);

  // Prepend frontmatter if file had it
  if (currentFrontmatter) {
    content = `---\n${currentFrontmatter.raw}\n---\n\n${content}`;
  }

  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(currentPath)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Save failed');

    currentContent = content;
    const tab = tabs.find(t => t.path === currentPath);
    if (tab) tab.content = content;

    showView(content);
    showToast('Saved ✓');
  } catch (e) {
    showToast('Failed to save', 'error');
  }
}

function cancelEdit(silent = false) {
  isEditing = false;
  viewer.contentEditable = 'false';
  viewer.classList.remove('editing');

  if (!silent) {
    // Re-render with structured view if applicable
    const parsed = parseFrontmatter(currentContent);
    if (isStructuredFile(parsed.data)) {
      currentFrontmatter = parsed;
      const html = marked.parse(parsed.body);
      viewer.innerHTML = renderStatusBar(parsed.data.items) + wrapSectionsCollapsible(html, parsed.data.items);
      viewer.classList.add('structured-view');
      attachStructuredHandlers();
    } else {
      viewer.innerHTML = marked.parse(currentContent);
      viewer.classList.remove('structured-view');
    }
  }

  $('btn-edit').classList.remove('hidden');
  $('btn-save').classList.add('hidden');
  $('btn-cancel').classList.add('hidden');
  $('btn-pdf').classList.remove('hidden');
  $('btn-docx').classList.remove('hidden');
}

/* ============================================================
   EXPORTS
   ============================================================ */

function buildPdfHtml(content) {
  const parsed = parseFrontmatter(content);
  const body = marked.parse(parsed.body);
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 40px; line-height: 1.7; color: #111; }
  h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 0.5em; }
  h2 { font-size: 1.4em; margin-top: 2em; margin-bottom: 0.4em; }
  h3 { font-size: 1.1em; margin-top: 1.5em; }
  p { margin: 0.75em 0; }
  code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: .88em; font-family: monospace; }
  pre { background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 1em 0; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: .92em; }
  th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
  th { background: #f9f9f9; font-weight: 600; }
  ul, ol { padding-left: 1.5em; margin: 0.5em 0; }
  li { margin: 0.25em 0; }
  blockquote { border-left: 4px solid #ddd; margin: 1em 0; padding: 0 16px; color: #555; }
  a { color: #2563eb; }
  hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }
</style></head><body>${body}</body></html>`;
}

async function exportPdf() {
  if (!activeTabPath) return;
  const activeTab = tabs.find(t => t.path === activeTabPath);
  if (!activeTab || activeTab.type === 'skill') return;

  const btn = $('btn-pdf');
  btn.disabled = true;
  btn.textContent = '…';
  showToast('Generating PDF…');

  try {
    let html, filename;

    if (activeTab.type === 'html') {
      const res = await fetch(`/api/file?path=${encodeURIComponent(activeTabPath)}`);
      if (!res.ok) throw new Error('Failed to read file');
      const { content } = await res.json();
      html = content;
      filename = activeTabPath.split('/').pop().replace(/\.html$/, '.pdf');
    } else {
      html = buildPdfHtml(currentContent);
      filename = currentPath.split('/').pop().replace(/\.md$/, '.pdf');
    }

    const res = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, filename }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'PDF failed');
    }

    const blob = await res.blob();
    downloadBlob(blob, filename);
    showToast('PDF downloaded ✓');
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '↓ PDF';
  }
}

async function exportDocx() {
  if (!currentPath) return;
  const btn = $('btn-docx');
  btn.disabled = true;
  btn.textContent = '…';
  showToast('Generating DOCX…');

  try {
    const res = await fetch(`/api/export/docx?path=${encodeURIComponent(currentPath)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'DOCX failed');
    }
    const blob = await res.blob();
    const filename = currentPath.split('/').pop().replace(/\.md$/, '.docx');
    downloadBlob(blob, filename);
    showToast('DOCX downloaded ✓');
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '↓ DOCX';
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ============================================================
   TOAST
   ============================================================ */

let toastTimer = null;
function showToast(msg, type = 'success') {
  const toast = $('toast');
  toast.textContent = msg;
  toast.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 3000);
}

/* ============================================================
   WEBSOCKET — live reload when Claude writes files
   ============================================================ */

function openFromMessage(path) {
  const sidebarEl = fileTree.querySelector(`[data-path="${CSS.escape(path)}"]`);
  if (path.endsWith('.html')) {
    openHtml(path, sidebarEl, true);
  } else {
    openFile(path, sidebarEl, true);
  }
}

function connectWS() {
  const ws = new WebSocket(`ws://${location.host}`);
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'change') loadTree();
    if (msg.type === 'open' && msg.path) openFromMessage(msg.path);
  };
  ws.onclose = () => setTimeout(connectWS, 3000);
}

/* ============================================================
   SIDEBAR RESIZE
   ============================================================ */

function initSidebarResize() {
  const handle = $('sidebar-resize');
  const sidebarEl = document.getElementById('sidebar');
  if (!handle || !sidebarEl) return;

  // Restore saved width
  const saved = localStorage.getItem('rv_sidebarW');
  if (saved) {
    const w = parseInt(saved, 10);
    if (w >= 180 && w <= 520) {
      sidebarEl.style.width = w + 'px';
      document.documentElement.style.setProperty('--sidebar-w', w + 'px');
    }
  }

  let isResizing = false;
  let startX = 0;
  let startW = 0;

  handle.addEventListener('mousedown', e => {
    isResizing = true;
    startX = e.clientX;
    startW = sidebarEl.getBoundingClientRect().width;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isResizing) return;
    const newW = Math.min(Math.max(startW + (e.clientX - startX), 180), 520);
    sidebarEl.style.width = newW + 'px';
    document.documentElement.style.setProperty('--sidebar-w', newW + 'px');
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    localStorage.setItem('rv_sidebarW', Math.round(sidebarEl.getBoundingClientRect().width));
  });
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

/* ---- Sidebar tab switching ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    $('file-tree').classList.toggle('hidden', tab !== 'files');
    $('skills-panel').classList.toggle('hidden', tab !== 'skills');
  });
});

async function refreshContent() {
  const activeTab = tabs.find(t => t.path === activeTabPath);
  if (!activeTab || activeTab.type === 'skill') return;

  if (activeTab.type === 'html') {
    // Reload the iframe src to pick up changes
    const iframe = viewer.querySelector('iframe.html-preview');
    if (iframe) {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    }
    showToast('Refreshed ✓');
    return;
  }

  // Markdown file — re-fetch from disk
  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(activeTab.path)}`);
    if (!res.ok) throw new Error('Fetch failed');
    const { content } = await res.json();
    currentContent = content;
    activeTab.content = content;
    showView(content);
    showToast('Refreshed ✓');
  } catch (e) {
    showToast('Refresh failed', 'error');
  }
}

$('btn-edit').addEventListener('click', startEdit);
$('btn-save').addEventListener('click', saveFile);
$('btn-cancel').addEventListener('click', () => cancelEdit());
$('btn-refresh').addEventListener('click', refreshContent);
$('btn-pdf').addEventListener('click', exportPdf);
$('btn-docx').addEventListener('click', exportDocx);

// Inline commenting — selection handler
viewer.addEventListener('mouseup', (e) => {
  if (!viewer.classList.contains('structured-view')) return;
  handleTextSelection(e);
});
// Close comment UI on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.comment-popover') && !e.target.closest('.comment-add-btn') && !e.target.closest('.inline-comment')) {
    closeCommentUI();
  }
});

// Quick nav input
$('quick-nav-input')?.addEventListener('input', e => renderQuickNavList(e.target.value));

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's' && isEditing) {
    e.preventDefault();
    saveFile();
  }
  if (e.key === 'Escape') {
    if (quickNavVisible) hideQuickNav();
  }
});

// Click outside to close quick nav
document.addEventListener('click', e => {
  if (quickNavVisible && !e.target.closest('#quick-nav') && !e.target.closest('#tab-add')) {
    hideQuickNav();
  }
});

/* ============================================================
   INIT
   ============================================================ */

marked.setOptions({ breaks: true });

// Custom extension: ==text== → highlighted "changed" mark
marked.use({
  extensions: [{
    name: 'changedHighlight',
    level: 'inline',
    start(src) { const m = src.match(/==/); return m ? m.index : -1; },
    tokenizer(src) {
      const match = src.match(/^==([^=]+)==/);
      if (match) return { type: 'changedHighlight', raw: match[0], text: match[1] };
    },
    renderer(token) {
      return `<mark class="changed-highlight">${token.text}</mark>`;
    },
  }],
});
loadTree().then(() => {
  // Handle ?open=path from /open redirect
  const openParam = new URLSearchParams(location.search).get('open');
  if (openParam) {
    history.replaceState(null, '', location.pathname);
    openFromMessage(openParam);
  }
});
buildSkillsPanel();
connectWS();
initSidebarResize();
renderTabs(); // Show + button even when no tabs are open
