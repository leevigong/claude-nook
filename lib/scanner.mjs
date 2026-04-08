import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.Trash', 'Library', '.npm', '.nvm',
  '.cache', '.local', '.vscode', '.idea', 'dist', 'build',
  '__pycache__', '.next', '.vercel', 'coverage',
]);

const SKIP_PREFIXES = ['.claude/plugins/cache'];

/**
 * Scan for directories containing .claude/ configurations.
 * Returns array of { path, name } objects.
 */
export function scanProjects(options = {}) {
  const home = homedir();
  const defaultDepth = options.maxDepth ?? 4;
  // Per-root depth override. Downloads typically holds many flat items
  // (and is huge), so only walk it shallowly.
  const roots = options.roots ?? [
    { path: home, depth: defaultDepth },
    { path: join(home, 'Desktop'), depth: defaultDepth },
    { path: join(home, 'Documents'), depth: defaultDepth },
    { path: join(home, 'Downloads'), depth: 2 },
    { path: join(home, 'dev'), depth: defaultDepth },
    { path: join(home, 'projects'), depth: defaultDepth },
    { path: join(home, 'src'), depth: defaultDepth },
    { path: join(home, 'work'), depth: defaultDepth },
    { path: join(home, 'code'), depth: defaultDepth },
    { path: join(home, 'repos'), depth: defaultDepth },
  ];

  const found = new Map();

  for (const root of roots) {
    const rootPath = typeof root === 'string' ? root : root.path;
    const rootDepth = typeof root === 'string' ? defaultDepth : root.depth;
    if (!existsSync(rootPath)) continue;
    walk(rootPath, 0, rootDepth, found, home);
  }

  // Also include projects referenced by installed_plugins.json that the
  // directory walk didn't find (e.g. projects under ~/Downloads or other
  // unscanned locations). Without this, plugin Usage rows show projects that
  // don't appear in the sidebar and can't be toggled.
  mergeInstalledPluginProjects(found, home);

  // Also include every project Claude Code has session history for
  // (~/.claude/projects/<encoded>/*.jsonl). This catches projects in
  // locations the directory walk can't reach — either unscanned roots or
  // folders blocked by macOS TCC (e.g. ~/Documents).
  mergeClaudeSessionProjects(found, home);

  // Sort by project name
  return Array.from(found.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function mergeInstalledPluginProjects(found, home) {
  const file = join(home, '.claude', 'plugins', 'installed_plugins.json');
  if (!existsSync(file)) return;
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return;
  }
  const plugins = data?.plugins ?? {};
  for (const installs of Object.values(plugins)) {
    if (!Array.isArray(installs)) continue;
    for (const inst of installs) {
      const p = inst?.projectPath;
      if (!p || found.has(p)) continue;
      if (!existsSync(p)) continue;
      found.set(p, { path: p, name: basename(p) });
    }
  }
}

function mergeClaudeSessionProjects(found, home) {
  const projectsDir = join(home, '.claude', 'projects');
  if (!existsSync(projectsDir)) return;
  let entries;
  try {
    entries = readdirSync(projectsDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sessionDir = join(projectsDir, entry.name);
    const cwd = readCwdFromSessionDir(sessionDir);
    if (!cwd || found.has(cwd)) continue;
    if (cwd === home) continue; // home dir is not a project
    if (!existsSync(cwd)) continue;
    found.set(cwd, { path: cwd, name: basename(cwd) });
  }
}

// Read the first `cwd` value from any .jsonl session file in a project's
// session directory. Each session file is line-delimited JSON; only the
// first few lines need to be inspected. Returns null on failure.
function readCwdFromSessionDir(sessionDir) {
  let files;
  try {
    files = readdirSync(sessionDir).filter((f) => f.endsWith('.jsonl'));
  } catch {
    return null;
  }
  for (const file of files) {
    const cwd = readCwdFromJsonl(join(sessionDir, file));
    if (cwd) return cwd;
  }
  return null;
}

function readCwdFromJsonl(file) {
  let content;
  try {
    // Read up to 64KB — enough to cover the first several JSONL records
    // without loading large session files into memory.
    const fd = readFileSync(file, { encoding: 'utf8', flag: 'r' });
    content = fd.length > 65536 ? fd.slice(0, 65536) : fd;
  } catch {
    return null;
  }
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line || !line.includes('"cwd"')) continue;
    try {
      const obj = JSON.parse(line);
      if (typeof obj.cwd === 'string') return obj.cwd;
    } catch {
      // Last line in slice may be truncated; ignore
    }
  }
  return null;
}

function walk(dir, depth, maxDepth, found, home) {
  if (depth > maxDepth) return;

  // Skip plugin cache directories
  for (const prefix of SKIP_PREFIXES) {
    if (dir.includes(prefix)) return;
  }

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // Permission denied or other read error
  }

  const hasClaudeDir = entries.some(
    (e) => e.isDirectory() && e.name === '.claude'
  );
  const hasMcpJson = entries.some(
    (e) => e.isFile() && e.name === '.mcp.json'
  );

  if ((hasClaudeDir || hasMcpJson) && dir !== home && dir !== join(home, '.claude')) {
    let hasMeaningfulContent = hasMcpJson;
    if (hasClaudeDir) {
      const claudeDir = join(dir, '.claude');
      hasMeaningfulContent = hasMeaningfulContent ||
        existsSync(join(claudeDir, 'settings.json')) ||
        existsSync(join(claudeDir, 'settings.local.json')) ||
        existsSync(join(claudeDir, 'agents')) ||
        existsSync(join(claudeDir, 'plugins')) ||
        existsSync(join(claudeDir, 'skills'));
    }

    if (hasMeaningfulContent && !found.has(dir)) {
      found.set(dir, {
        path: dir,
        name: basename(dir),
      });
    }
  }

  // Continue walking subdirectories
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') && entry.name !== '.claude') continue;
    if (SKIP_DIRS.has(entry.name)) continue;

    walk(join(dir, entry.name), depth + 1, maxDepth, found, home);
  }
}
