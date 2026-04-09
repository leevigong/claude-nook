import { createServer } from 'node:http';
import { scanProjects } from './scanner.mjs';
import { readGlobalConfig, readProjectConfig, aggregateAll, togglePlugin, getKnownPluginIds } from './reader.mjs';
import { generateHTML } from './ui.mjs';
import { execFile } from 'node:child_process';
import { platform, homedir, tmpdir } from 'node:os';
import { resolve, join, sep, dirname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function pidFilePath(port) {
  return join(tmpdir(), `claude-nook-${port}.pid`);
}

export function listRunningInstances() {
  let entries;
  try {
    entries = readdirSync(tmpdir());
  } catch {
    return [];
  }
  const found = [];
  for (const name of entries) {
    const m = name.match(/^claude-nook-(\d+)\.pid$/);
    if (!m) continue;
    const port = parseInt(m[1], 10);
    const pid = readPidFile(port);
    if (pid) found.push({ port, pid });
  }
  return found;
}

export function readPidFile(port) {
  const f = pidFilePath(port);
  if (!existsSync(f)) return null;
  try {
    const pid = parseInt(readFileSync(f, 'utf8').trim(), 10);
    if (!pid) return null;
    // Check if process is alive
    try {
      process.kill(pid, 0);
      return pid;
    } catch {
      // Stale pidfile
      try { unlinkSync(f); } catch {}
      return null;
    }
  } catch {
    return null;
  }
}

const PKG_VERSION = (() => {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    return JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8')).version;
  } catch {
    return '0.0.0';
  }
})();

// CSRF token generated per server start
const CSRF_TOKEN = randomBytes(32).toString('hex');

// --- Auto-update: check npm registry for latest version ---
let latestVersion = null;

async function checkLatestVersion() {
  try {
    const { get } = await import('node:https');
    const body = await new Promise((resolve, reject) => {
      get('https://registry.npmjs.org/claude-nook/latest', { timeout: 5000 }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString()));
        res.on('error', reject);
      }).on('error', reject);
    });
    const data = JSON.parse(body);
    if (data.version) latestVersion = data.version;
  } catch {}
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) < (pb[i] || 0)) return -1;
    if ((pa[i] || 0) > (pb[i] || 0)) return 1;
  }
  return 0;
}

// Allowed origins (only localhost / 127.0.0.1)
function isAllowedOrigin(origin, port) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    return (
      (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]') &&
      String(u.port) === String(port)
    );
  } catch {
    return false;
  }
}

// Validate Host header to prevent DNS rebinding
function isAllowedHost(hostHeader, port) {
  if (!hostHeader) return false;
  const expected = [
    `localhost:${port}`,
    `127.0.0.1:${port}`,
    `[::1]:${port}`,
  ];
  return expected.includes(hostHeader);
}

async function parseJsonBody(req, limit = 1024 * 64) {
  return new Promise((done, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('Body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        done(JSON.parse(Buffer.concat(chunks).toString() || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Validate that a path is contained inside an allowed root (no traversal)
function isPathInside(child, parent) {
  const c = resolve(child);
  const p = resolve(parent);
  return c === p || c.startsWith(p + sep);
}

let cachedProjects = null;

function getProjects() {
  if (!cachedProjects) {
    cachedProjects = scanProjects();
  }
  return cachedProjects;
}

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(data));
}

function html(res, content) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end(content);
}

function route(req, serverPort) {
  const url = new URL(req.url, `http://127.0.0.1:${serverPort}`);
  return { pathname: url.pathname, method: req.method };
}

function makeHandler(serverPort) {
  return async function handleRequest(req, res) {
  const { pathname, method } = route(req, serverPort);

  // Host header check (DNS rebinding protection) — apply to all non-GET and API requests
  if (!isAllowedHost(req.headers.host, serverPort)) {
    return json(res, { ok: false, error: 'Forbidden host' }, 403);
  }

  // Strict Origin/Referer check for ALL API requests.
  // Browsers reliably send Origin on fetch/XHR and Referer on navigations;
  // requiring one blocks <img>/<script>/<link> cross-origin probes where
  // neither header points at us.
  if (pathname.startsWith('/api/')) {
    const origin = req.headers.origin || req.headers.referer;
    if (!isAllowedOrigin(origin, serverPort)) {
      return json(res, { ok: false, error: 'Forbidden origin' }, 403);
    }
  }

  // CSRF token check for state-changing requests
  if (method === 'POST' && pathname.startsWith('/api/')) {
    if (req.headers['x-csrf-token'] !== CSRF_TOKEN) {
      return json(res, { ok: false, error: 'Forbidden' }, 403);
    }
  }

  // API: CSRF token
  if (pathname === '/api/csrf' && method === 'GET') {
    return json(res, { ok: true, data: { token: CSRF_TOKEN } });
  }

  // API routes first
  // API: Full overview
  if (pathname === '/api/overview' && method === 'GET') {
    const projects = getProjects();
    const data = aggregateAll(projects);
    return json(res, { ok: true, data });
  }

  // API: Global config only
  if (pathname === '/api/global' && method === 'GET') {
    const data = readGlobalConfig();
    return json(res, { ok: true, data });
  }

  // API: Project list
  if (pathname === '/api/projects' && method === 'GET') {
    const projects = getProjects();
    const configs = projects.map((p) => {
      const config = readProjectConfig(p.path);
      return config
        ? {
            path: config.path,
            name: config.name,
            pluginCount: new Set([
              ...Object.keys(config.settings?.enabledPlugins ?? {}),
              ...Object.keys(config.settingsLocal?.enabledPlugins ?? {}),
            ]).size,
            agentCount: config.agents.length,
            skillCount: config.skills.length,
            commandCount: config.commands.length,
            hasLocalSettings: !!config.settingsLocal,
          }
        : { path: p.path, name: p.name };
    });
    return json(res, { ok: true, data: configs });
  }

  // API: Single project detail
  if (pathname.startsWith('/api/projects/') && method === 'GET') {
    const encodedPath = pathname.slice('/api/projects/'.length);
    const projectPath = decodeURIComponent(encodedPath);
    // Only allow projects discovered by the scanner
    const knownProjects = getProjects();
    if (!knownProjects.some((p) => p.path === projectPath)) {
      return json(res, { ok: false, error: 'Project not allowed' }, 403);
    }
    const config = readProjectConfig(projectPath);
    if (!config) {
      return json(res, { ok: false, error: 'Project not found' }, 404);
    }
    return json(res, { ok: true, data: config });
  }

  // API: Toggle plugin
  if (pathname === '/api/plugins/toggle' && method === 'POST') {
    let parsed;
    try {
      parsed = await parseJsonBody(req);
    } catch (e) {
      return json(res, { ok: false, error: e.message }, 400);
    }
    const { pluginId, scope, projectPath, enabled } = parsed;
    // Validate inputs
    if (typeof pluginId !== 'string' || !pluginId) {
      return json(res, { ok: false, error: 'Invalid pluginId' }, 400);
    }
    // Shape check: `<name>@<marketplace>`, no path/control chars.
    if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+$/.test(pluginId)) {
      return json(res, { ok: false, error: 'Invalid pluginId format' }, 400);
    }
    // Allowlist: only ids known to the local installation can be toggled.
    if (!getKnownPluginIds().has(pluginId)) {
      return json(res, { ok: false, error: 'Unknown plugin' }, 403);
    }
    if (!['user', 'project', 'local'].includes(scope)) {
      return json(res, { ok: false, error: 'Invalid scope' }, 400);
    }
    if (scope !== 'user') {
      const knownProjects = getProjects();
      if (!knownProjects.some((p) => p.path === projectPath)) {
        return json(res, { ok: false, error: 'Project not allowed' }, 403);
      }
    }
    const result = togglePlugin({ pluginId, scope, projectPath, enabled: !!enabled });
    return json(res, result);
  }

  // API: Read hook file source
  if (pathname === '/api/hooks/source' && method === 'POST') {
    let parsed;
    try {
      parsed = await parseJsonBody(req);
    } catch (e) {
      return json(res, { ok: false, error: e.message }, 400);
    }
    const { filePath } = parsed;
    if (typeof filePath !== 'string' || !filePath) {
      return json(res, { ok: false, error: 'Invalid filePath' }, 400);
    }
    const home = homedir();
    const hooksDir = join(home, '.claude', 'hooks');
    // Resolve and ensure path is inside ~/.claude/hooks
    if (!isPathInside(filePath, hooksDir)) {
      return json(res, { ok: false, error: 'Access denied' }, 403);
    }
    const { readFileSync } = await import('node:fs');
    try {
      const source = readFileSync(filePath, 'utf8');
      return json(res, { ok: true, data: { source } });
    } catch {
      return json(res, { ok: false, error: 'File not found' }, 404);
    }
  }

  // API: Version check
  if (pathname === '/api/version' && method === 'GET') {
    return json(res, { ok: true, data: { current: PKG_VERSION, latest: latestVersion, updateAvailable: latestVersion && compareVersions(PKG_VERSION, latestVersion) < 0 } });
  }

  // API: Self-update
  if (pathname === '/api/update' && method === 'POST') {
    if (!latestVersion || compareVersions(PKG_VERSION, latestVersion) >= 0) {
      return json(res, { ok: false, error: 'Already up to date' });
    }
    try {
      const { execFileSync } = await import('node:child_process');
      execFileSync('npm', ['install', '-g', 'claude-nook@latest'], { timeout: 30000, stdio: 'pipe' });
      // Respond before restarting
      json(res, { ok: true, data: { updated: latestVersion } });
      // Restart: spawn new process and exit current
      setTimeout(() => {
        const entry = fileURLToPath(new URL('../bin/claude-nook.mjs', import.meta.url));
        const args = ['--port', String(serverPort), '--no-open', '--__child'];
        const child = execFile(process.execPath, [entry, ...args], { detached: true, stdio: 'ignore' });
        child.unref();
        try { unlinkSync(pidFilePath(serverPort)); } catch {}
        process.exit(0);
      }, 500);
      return;
    } catch (e) {
      return json(res, { ok: false, error: `Update failed: ${e.message}` }, 500);
    }
  }

  // API: Rescan
  if (pathname === '/api/rescan' && method === 'POST') {
    cachedProjects = null;
    const projects = getProjects();
    return json(res, { ok: true, data: { count: projects.length } });
  }

  // Serve dashboard for all non-API GET requests (SPA fallback)
  if (method === 'GET') {
    return html(res, generateHTML(PKG_VERSION));
  }

  // 404
  json(res, { ok: false, error: 'Not found' }, 404);
  };
}

export function openBrowser(url) {
  const p = platform();
  if (p === 'darwin') {
    execFile('open', [url], () => {});
  } else if (p === 'win32') {
    // `start` is a cmd.exe builtin, not a standalone executable.
    // The empty "" is the window title argument required by start.
    execFile('cmd.exe', ['/c', 'start', '""', url], () => {});
  } else {
    execFile('xdg-open', [url], () => {});
  }
}

export function startServer({ port = 7007, open = true } = {}) {
  const server = createServer(makeHandler(port));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const existing = readPidFile(port);
      console.error(`\n  ✗ Port ${port} is already in use.`);
      if (existing) {
        console.error(`    claude-nook seems to be running already (pid ${existing}).`);
        console.error(`    → Open http://localhost:${port}`);
        console.error(`    → Or stop it with: claude-nook stop\n`);
      } else {
        console.error(`    → Try a different port: claude-nook -p ${port + 1}\n`);
      }
      process.exit(1);
    }
    throw err;
  });

  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}`;
    try {
      writeFileSync(pidFilePath(port), String(process.pid));
    } catch {}
    console.log(`
  ┌─────────────────────────────────────┐
  │                                     │
  │   claude-nook is running!           │
  │                                     │
  │   Dashboard: ${url.padEnd(23)}│
  │                                     │
  └─────────────────────────────────────┘
`);
    if (open) openBrowser(url);
    // Background version check
    checkLatestVersion();
  });

  const cleanup = () => {
    try { unlinkSync(pidFilePath(port)); } catch {}
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', () => {
    try { unlinkSync(pidFilePath(port)); } catch {}
  });

  return server;
}
