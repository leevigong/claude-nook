import { createServer } from 'node:http';
import { scanProjects } from './scanner.mjs';
import { readGlobalConfig, readProjectConfig, aggregateAll, togglePlugin } from './reader.mjs';
import { generateHTML } from './ui.mjs';
import { exec } from 'node:child_process';
import { platform } from 'node:os';

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
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function html(res, content) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end(content);
}

function route(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return { pathname: url.pathname, method: req.method };
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
}

async function handleRequest(req, res) {
  const { pathname, method } = route(req);

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
    const config = readProjectConfig(projectPath);
    if (!config) {
      return json(res, { ok: false, error: 'Project not found' }, 404);
    }
    return json(res, { ok: true, data: config });
  }

  // API: Toggle plugin
  if (pathname === '/api/plugins/toggle' && method === 'POST') {
    const body = await readBody(req);
    const { pluginId, scope, projectPath, enabled } = JSON.parse(body);
    const result = togglePlugin({ pluginId, scope, projectPath, enabled });
    return json(res, result);
  }

  // API: Read hook file source
  if (pathname === '/api/hooks/source' && method === 'POST') {
    const body = await readBody(req);
    const { filePath } = JSON.parse(body);
    // Only allow reading from ~/.claude/hooks/
    const { readFileSync } = await import('node:fs');
    const { homedir } = await import('node:os');
    const home = homedir();
    if (!filePath.startsWith(home + '/.claude/hooks/')) {
      return json(res, { ok: false, error: 'Access denied' }, 403);
    }
    try {
      const source = readFileSync(filePath, 'utf8');
      return json(res, { ok: true, data: { source } });
    } catch {
      return json(res, { ok: false, error: 'File not found' }, 404);
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
    return html(res, generateHTML());
  }

  // 404
  json(res, { ok: false, error: 'Not found' }, 404);
}

function openBrowser(url) {
  const cmd =
    platform() === 'darwin'
      ? `open "${url}"`
      : platform() === 'win32'
        ? `start "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

export function startServer({ port = 3300, open = true } = {}) {
  const server = createServer(handleRequest);

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
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
  });

  return server;
}
