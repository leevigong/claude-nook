import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';
import { readHiddenSet } from './hidden.mjs';

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.Trash', 'Library', '.npm', '.nvm',
  '.cache', '.local', '.vscode', '.idea', 'dist', 'build',
  '__pycache__', '.next', '.vercel', 'coverage',
]);

const SKIP_PREFIXES = ['.claude/plugins/cache'];

// Discovery source identifiers — attached to each project so the UI can
// explain *why* a folder shows up in the sidebar.
export const SOURCE_DISK = 'disk-walk';
export const SOURCE_INSTALLED_PLUGINS = 'installed-plugins';
export const SOURCE_SESSION_HISTORY = 'session-history';

function addSource(map, path, name, source) {
  const existing = map.get(path);
  if (existing) {
    if (!existing.sources.includes(source)) existing.sources.push(source);
    return existing;
  }
  const entry = { path, name, sources: [source] };
  map.set(path, entry);
  return entry;
}

/**
 * Scan for directories containing .claude/ configurations.
 * Returns array of { path, name, sources } objects. `sources` is an array of
 * SOURCE_* identifiers indicating which discovery mechanisms contributed
 * the project.
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

  // Apply the user's hidden-projects list. By default the sidebar excludes
  // hidden projects; pass includeHidden:true to mark them with `hidden:true`
  // instead of filtering them out (used by the "Show hidden" toggle and by
  // server-side endpoints that need to validate against all known paths).
  const hiddenSet = readHiddenSet();
  const all = Array.from(found.values()).map((p) => ({
    ...p,
    hidden: hiddenSet.has(p.path),
  }));
  const filtered = options.includeHidden ? all : all.filter((p) => !p.hidden);

  // Sort by project name
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
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
      if (!p) continue;
      if (!existsSync(p)) continue;
      addSource(found, p, basename(p), SOURCE_INSTALLED_PLUGINS);
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
    if (!cwd) continue;
    if (cwd === home) continue; // home dir is not a project
    if (!existsSync(cwd)) continue;
    addSource(found, cwd, basename(cwd), SOURCE_SESSION_HISTORY);
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

    if (hasMeaningfulContent) {
      addSource(found, dir, basename(dir), SOURCE_DISK);
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
