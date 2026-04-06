import { readdirSync, statSync, existsSync } from 'node:fs';
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
  const maxDepth = options.maxDepth ?? 4;
  const roots = options.roots ?? [
    home,
    join(home, 'Desktop'),
    join(home, 'Documents'),
    join(home, 'dev'),
    join(home, 'projects'),
    join(home, 'src'),
    join(home, 'work'),
    join(home, 'code'),
    join(home, 'repos'),
  ];

  const found = new Map();

  for (const root of roots) {
    if (!existsSync(root)) continue;
    walk(root, 0, maxDepth, found, home);
  }

  // Sort by project name
  return Array.from(found.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
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

  if ((hasClaudeDir || hasMcpJson) && dir !== home) {
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
