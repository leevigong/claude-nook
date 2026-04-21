// Persistence for the user's per-machine list of projects that should be
// filtered out of the claude-nook sidebar. This is a claude-nook-local
// concern — we intentionally store it outside ~/.claude/ so we never touch
// Claude Code's own data directory.

import { readFileSync, existsSync, mkdirSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { homedir } from 'node:os';
import { randomBytes } from 'node:crypto';

const STORE_DIR = join(homedir(), '.claude-nook');
const STORE_FILE = join(STORE_DIR, 'hidden-projects.json');

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// Atomic write: write to a sibling tmp file then rename.
function writeJSONAtomic(filePath, data) {
  const tmp = join(
    dirname(filePath),
    `.${basename(filePath)}.${randomBytes(6).toString('hex')}.tmp`
  );
  const payload = JSON.stringify(data, null, 2) + '\n';
  try {
    writeFileSync(tmp, payload, 'utf8');
    renameSync(tmp, filePath);
  } catch (err) {
    try { unlinkSync(tmp); } catch {}
    throw err;
  }
}

function ensureStoreDir() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

/** Returns a Set of absolute project paths the user has hidden. */
export function readHiddenSet() {
  const data = readJSON(STORE_FILE);
  const list = Array.isArray(data?.hidden) ? data.hidden : [];
  return new Set(list.filter((p) => typeof p === 'string' && p.length));
}

/** Returns the hidden list as a sorted array. */
export function readHiddenList() {
  return Array.from(readHiddenSet()).sort((a, b) => a.localeCompare(b));
}

export function hideProject(projectPath) {
  if (typeof projectPath !== 'string' || !projectPath) {
    throw new Error('Invalid projectPath');
  }
  const set = readHiddenSet();
  if (set.has(projectPath)) return { ok: true, alreadyHidden: true };
  set.add(projectPath);
  ensureStoreDir();
  writeJSONAtomic(STORE_FILE, { version: 1, hidden: Array.from(set).sort() });
  return { ok: true };
}

export function unhideProject(projectPath) {
  if (typeof projectPath !== 'string' || !projectPath) {
    throw new Error('Invalid projectPath');
  }
  const set = readHiddenSet();
  if (!set.has(projectPath)) return { ok: true, notHidden: true };
  set.delete(projectPath);
  ensureStoreDir();
  writeJSONAtomic(STORE_FILE, { version: 1, hidden: Array.from(set).sort() });
  return { ok: true };
}
