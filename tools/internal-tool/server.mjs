import express from 'express';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { createServer } from 'http';
import { readFile, writeFile, readdir, stat, unlink, mkdir } from 'fs/promises';
import { join, resolve, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = resolve(__dirname, '../..');
const PORT = 3001;

const SCAN_DIRS = [
  { path: 'projects', label: 'Projects' },
  { path: 'plans', label: 'Plans' },
  { path: '.claude/plans', label: 'Claude Plans' },
];

const EXCLUDED = new Set(['node_modules', '_templates', '.git', '.vercel', '__pycache__', 'archive']);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, 'public')));
// Serve workspace files (images, assets referenced by HTML outputs)
app.use('/ws', express.static(WORKSPACE));

// Safely resolve a relative path within the workspace (path traversal protection)
function safePath(rel) {
  if (!rel) throw new Error('path required');
  const full = resolve(join(WORKSPACE, rel));
  if (!full.startsWith(WORKSPACE + '/') && full !== WORKSPACE) {
    throw new Error('Path escapes workspace');
  }
  return full;
}

// Recursively build file tree
async function buildTree(absPath, relPath, label) {
  try {
    const info = await stat(absPath);
    const name = label || relPath.split('/').pop();

    if (info.isDirectory()) {
      if (EXCLUDED.has(name)) return null;
      const entries = (await readdir(absPath)).sort();
      const children = [];
      for (const entry of entries) {
        if (entry.startsWith('.') || entry.endsWith('.comments.json')) continue;
        const child = await buildTree(join(absPath, entry), `${relPath}/${entry}`);
        if (child) children.push(child);
      }
      // Sort: files first, then sub-folders
      children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'file' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      if (children.length === 0) return null;
      return { name, label: label || name, path: relPath, type: 'folder', children };
    } else {
      const ext = extname(absPath);
      if (ext !== '.md' && ext !== '.html') return null;
      const node = { name, path: relPath, type: ext === '.html' ? 'html' : 'file', mtime: info.mtimeMs };
      // Quick check: is this a structured file (has frontmatter with type + items)?
      if (ext === '.md') {
        try {
          const head = await readFile(absPath, 'utf8');
          if (head.startsWith('---\n') && /^type:/m.test(head) && /-\s*\{\s*title:/.test(head)) {
            node.structured = true;
          }
        } catch {}
      }
      return node;
    }
  } catch {
    return null;
  }
}

// GET /api/files — file tree
app.get('/api/files', async (_req, res) => {
  const tree = [];
  for (const dir of SCAN_DIRS) {
    const node = await buildTree(join(WORKSPACE, dir.path), dir.path, dir.label);
    if (node) tree.push(node);
  }
  res.json(tree);
});

// GET /api/file?path=... — read file content
app.get('/api/file', async (req, res) => {
  try {
    const full = safePath(req.query.path);
    const content = await readFile(full, 'utf8');
    res.json({ content });
  } catch (e) {
    const status = e.message.includes('escapes') ? 403 : 404;
    res.status(status).json({ error: e.message });
  }
});

// GET /api/serve?path=... — serve an HTML file inline (for opening in new tab)
app.get('/api/serve', async (req, res) => {
  try {
    const full = safePath(req.query.path);
    if (extname(full) !== '.html') return res.status(400).json({ error: 'only .html files' });
    // Inject <base> so relative assets (images, etc.) resolve via /ws/ static route
    const relDir = req.query.path.substring(0, req.query.path.lastIndexOf('/') + 1);
    let html = await readFile(full, 'utf8');
    html = html.replace(/(<head[^>]*>)/i, `$1\n  <base href="/ws/${relDir}">`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    const status = e.message.includes('escapes') ? 403 : 404;
    res.status(status).json({ error: e.message });
  }
});

// POST /api/file?path=... — write file content
app.post('/api/file', async (req, res) => {
  try {
    const full = safePath(req.query.path);
    await writeFile(full, req.body.content, 'utf8');
    res.json({ ok: true });
  } catch (e) {
    const status = e.message.includes('escapes') ? 403 : 500;
    res.status(status).json({ error: e.message });
  }
});

// POST /api/export/pdf — accepts { html, filename }, returns PDF download
app.post('/api/export/pdf', async (req, res) => {
  const { html, filename = 'export.pdf' } = req.body;
  if (!html) return res.status(400).json({ error: 'html required' });

  const id = randomBytes(8).toString('hex');
  const tmpHtml = join(tmpdir(), `mv-${id}.html`);
  const tmpPdf = join(tmpdir(), `mv-${id}.pdf`);

  const cleanup = async () => {
    try { await unlink(tmpHtml); } catch {}
    try { await unlink(tmpPdf); } catch {}
  };

  try {
    await writeFile(tmpHtml, html, 'utf8');

    await new Promise((resolve, reject) => {
      const proc = spawn('node', [join(__dirname, '../html-to-pdf.mjs'), tmpHtml, tmpPdf], {
        cwd: WORKSPACE,
      });
      let stderr = '';
      proc.stderr?.on('data', d => stderr += d);
      proc.on('close', code => code === 0 ? resolve() : reject(new Error(stderr || 'PDF generation failed')));
    });

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(tmpPdf, {}, cleanup);
  } catch (e) {
    await cleanup();
    res.status(500).json({ error: e.message });
  }
});

// GET /api/comments?path=... — read comments sidecar
app.get('/api/comments', async (req, res) => {
  try {
    const full = safePath(req.query.path);
    const commentsPath = full + '.comments.json';
    const data = await readFile(commentsPath, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.json([]);
  }
});

// POST /api/comments?path=... — add/resolve/delete comment
app.post('/api/comments', async (req, res) => {
  try {
    const full = safePath(req.query.path);
    const commentsPath = full + '.comments.json';

    let comments = [];
    try { comments = JSON.parse(await readFile(commentsPath, 'utf8')); } catch {}

    const { action } = req.body;
    if (action === 'add') {
      comments.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        section: req.body.section,
        text: req.body.text,
        comment: req.body.comment,
        resolved: false,
        created: new Date().toISOString(),
      });
    } else if (action === 'edit') {
      const c = comments.find(c => c.id === req.body.id);
      if (c) c.comment = req.body.comment;
    } else if (action === 'resolve') {
      const c = comments.find(c => c.id === req.body.id);
      if (c) c.resolved = true;
    } else if (action === 'resolve-thread') {
      // Resolve all comments sharing the same text+section
      comments.forEach(c => {
        if (c.text === req.body.text && c.section === req.body.section) c.resolved = true;
      });
    } else if (action === 'delete') {
      comments = comments.filter(c => c.id !== req.body.id);
    }

    await writeFile(commentsPath, JSON.stringify(comments, null, 2));
    res.json(comments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /open?path=... — open a file in the viewer (used from Claude Code output links)
app.get('/open', (req, res) => {
  const path = req.query.path;
  if (!path) return res.redirect('/');
  try { safePath(path); } catch { return res.redirect('/'); }
  broadcast({ type: 'open', path });
  res.redirect(`/?open=${encodeURIComponent(path)}`);
});

// GET /api/export/docx?path=... — returns DOCX download
app.get('/api/export/docx', async (req, res) => {
  try {
    const full = safePath(req.query.path);
    const docxPath = full.replace(/\.md$/, '.docx');

    await new Promise((resolve, reject) => {
      const proc = spawn('python3', [join(__dirname, '../md-to-docx.py'), full]);
      let stderr = '';
      proc.stderr?.on('data', d => stderr += d);
      proc.on('close', code => code === 0 ? resolve() : reject(new Error(stderr || 'DOCX generation failed. Is python-docx installed?')));
    });

    const filename = req.query.path.split('/').pop().replace('.md', '.docx');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.sendFile(docxPath, {}, async () => {
      try { await unlink(docxPath); } catch {}
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// HTTP + WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(data);
  });
}

// Watch for file changes in scanned directories
const watchPaths = SCAN_DIRS.map(d => join(WORKSPACE, d.path));
chokidar.watch(watchPaths, {
  ignoreInitial: true,
  ignored: /(node_modules|\.git|__pycache__)/,
}).on('all', (event, filePath) => {
  if (filePath.endsWith('.md')) {
    broadcast({ type: 'change', event, path: filePath });
  }
});

server.listen(PORT, () => {
  console.log(`\nAgency Internal Tool running at http://localhost:${PORT}`);
  console.log(`Workspace: ${WORKSPACE}\n`);
});
