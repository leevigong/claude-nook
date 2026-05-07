import { readFileSync, writeFileSync, readdirSync, existsSync, renameSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { homedir } from 'node:os';
import { randomBytes } from 'node:crypto';

const HOME = homedir();
const CLAUDE_DIR = join(HOME, '.claude');

// --- Helpers ---

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function listDir(dirPath) {
  try {
    return readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function parseAgentFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { body: content };

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Handle arrays like "tools: [tool1, tool2]"
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    }
    frontmatter[key] = value;
  }

  return {
    ...frontmatter,
    body: content.slice(match[0].length).trim(),
  };
}

// --- Global Config ---

export function readGlobalConfig() {
  const settings = readJSON(join(CLAUDE_DIR, 'settings.json'));
  const installedPlugins = readJSON(join(CLAUDE_DIR, 'plugins', 'installed_plugins.json'));
  const blocklist = readJSON(join(CLAUDE_DIR, 'plugins', 'blocklist.json'));
  const marketplaces = readJSON(join(CLAUDE_DIR, 'plugins', 'known_marketplaces.json'));

  // Read hook files
  const hooksDir = join(CLAUDE_DIR, 'hooks');
  const hookFiles = listDir(hooksDir)
    .filter((e) => e.isFile())
    .map((e) => ({
      filename: e.name,
      path: join(hooksDir, e.name),
    }));

  // Read plugin manifests from cache
  const manifests = {};
  const cacheDir = join(CLAUDE_DIR, 'plugins', 'cache');
  if (existsSync(cacheDir)) {
    for (const marketplace of listDir(cacheDir)) {
      if (!marketplace.isDirectory()) continue;
      const mktDir = join(cacheDir, marketplace.name);
      for (const plugin of listDir(mktDir)) {
        if (!plugin.isDirectory()) continue;
        const pluginDir = join(mktDir, plugin.name);
        // Find the latest version directory
        const versions = listDir(pluginDir).filter((e) => e.isDirectory());
        for (const ver of versions) {
          const manifestPath = join(pluginDir, ver.name, '.claude-plugin', 'plugin.json');
          const manifest = readJSON(manifestPath);
          if (manifest) {
            const id = `${plugin.name}@${marketplace.name}`;
            // Read skills
            const skillsDir = join(pluginDir, ver.name, 'skills');
            const skills = listDir(skillsDir)
              .filter((e) => e.isDirectory())
              .map((e) => e.name);
            manifest.skills = skills;
            manifests[id] = manifest;
          }
        }
      }
    }
  }

  // Collect global MCP servers from user settings
  const globalMcp = [];
  for (const [name, cfg] of Object.entries(settings?.mcpServers ?? {})) {
    globalMcp.push({ name, scope: 'global', ...cfg });
  }

  return {
    settings,
    plugins: {
      installed: installedPlugins,
      blocked: blocklist,
      marketplaces,
      manifests,
    },
    hooks: {
      config: settings?.hooks ?? {},
      files: hookFiles,
    },
    mcp: globalMcp,
  };
}

// --- Project Config ---

export function readProjectConfig(projectPath) {
  const claudeDir = join(projectPath, '.claude');
  const hasMcpJson = existsSync(join(projectPath, '.mcp.json'));
  if (!existsSync(claudeDir) && !hasMcpJson) return null;

  const settings = readJSON(join(claudeDir, 'settings.json'));
  const settingsLocal = readJSON(join(claudeDir, 'settings.local.json'));

  // Read agents
  const agentsDir = join(claudeDir, 'agents');
  const agents = listDir(agentsDir)
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => {
      const content = readFileSync(join(agentsDir, e.name), 'utf8');
      const parsed = parseAgentFrontmatter(content);
      return {
        filename: e.name,
        name: parsed.name || e.name.replace('.md', ''),
        description: parsed.description || '',
        model: parsed.model || '',
        tools: parsed.tools || [],
      };
    });

  // Read skills
  const skillsDir = join(claudeDir, 'skills');
  const skills = listDir(skillsDir)
    .filter((e) => e.isDirectory() || e.name.endsWith('.md'))
    .map((e) => {
      let subSkillNames = [];
      if (e.isDirectory()) {
        subSkillNames = listDir(join(skillsDir, e.name))
          .filter((s) => s.isDirectory() || s.name.endsWith('.md'))
          .map((s) => s.name.replace('.md', ''));
      }
      return {
        name: e.name.replace('.md', ''),
        path: join(skillsDir, e.name),
        type: e.isDirectory() ? 'directory' : 'file',
        subSkills: subSkillNames.length,
        subSkillNames,
        isPackage: subSkillNames.length > 3,
      };
    });

  // Read local plugins
  const pluginsDir = join(claudeDir, 'plugins');
  const localPlugins = listDir(pluginsDir)
    .filter((e) => e.isDirectory())
    .map((e) => {
      const manifest = readJSON(
        join(pluginsDir, e.name, '.claude-plugin', 'plugin.json')
      );
      return {
        name: e.name,
        path: join(pluginsDir, e.name),
        manifest,
      };
    });

  // Read commands
  const commandsDir = join(claudeDir, 'commands');
  const commands = listDir(commandsDir)
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => ({
      name: e.name.replace('.md', ''),
      filename: e.name,
    }));

  // Collect project hooks from settings + settingsLocal
  // Hooks can be either:
  //   Array format: [{ event, matchers: [...], script }]
  //   Object format (same as global): { EventName: [{ matcher, hooks: [...] }] }
  const projectHooks = [];
  function collectHooks(hooksData, scope) {
    if (!hooksData) return;
    if (Array.isArray(hooksData)) {
      // Array format: [{ event, matchers, script }]
      for (const entry of hooksData) {
        const matcherStr = (entry.matchers || []).map(m => Object.values(m).join(',')).join('; ') || '*';
        projectHooks.push({
          event: entry.event || '-',
          matcher: matcherStr,
          command: entry.script || entry.command || '-',
          type: entry.type || 'command',
          scope,
        });
      }
    } else {
      // Object format: { EventName: [{ matcher, hooks: [{type, command}] }] }
      for (const [event, matchers] of Object.entries(hooksData)) {
        if (!Array.isArray(matchers)) continue;
        for (const matcher of matchers) {
          for (const hook of (matcher.hooks || [])) {
            projectHooks.push({ event, matcher: matcher.matcher || '*', scope, ...hook });
          }
        }
      }
    }
  }
  collectHooks(settings?.hooks, 'project');
  collectHooks(settingsLocal?.hooks, 'local');

  // Collect MCP servers from settings + settingsLocal + .mcp.json
  const projectMcp = [];
  for (const [name, cfg] of Object.entries(settings?.mcpServers ?? {})) {
    projectMcp.push({ name, scope: 'project', ...cfg });
  }
  for (const [name, cfg] of Object.entries(settingsLocal?.mcpServers ?? {})) {
    projectMcp.push({ name, scope: 'local', ...cfg });
  }
  const mcpJson = readJSON(join(projectPath, '.mcp.json'));
  if (mcpJson?.mcpServers) {
    for (const [name, cfg] of Object.entries(mcpJson.mcpServers)) {
      projectMcp.push({ name, scope: '.mcp.json', ...cfg });
    }
  }
  // Mark duplicates: same name in 2+ source files. Each entry knows its sibling list.
  const byName = {};
  for (const s of projectMcp) {
    (byName[s.name] = byName[s.name] || []).push(s);
  }
  for (const list of Object.values(byName)) {
    if (list.length > 1) {
      const sources = list.map(e => e.scope === '.mcp.json' ? '.mcp.json' : (e.scope === 'project' ? 'settings.json' : 'settings.local.json'));
      for (const e of list) e.duplicateSources = sources;
    }
  }

  return {
    path: projectPath,
    name: basename(projectPath),
    settings,
    settingsLocal,
    agents,
    skills,
    plugins: localPlugins,
    commands,
    hooks: projectHooks,
    mcp: projectMcp,
  };
}

// --- Aggregate ---

// `projects` is the scanner output: each entry has at least {path, name}
// and may also carry `sources` (discovery reasons) and `hidden` (boolean).
// Both extras are merged into the returned project configs so the UI can
// explain detection reasons and support the "Show hidden" toggle.
export function aggregateAll(projects) {
  const global = readGlobalConfig();
  const projectConfigs = projects
    .map((p) => {
      const config = readProjectConfig(p.path);
      if (!config) return null;
      return { ...config, sources: p.sources ?? [], hidden: !!p.hidden };
    })
    .filter(Boolean);

  // Compute summary stats
  const installedPlugins = global.plugins.installed?.plugins ?? {};
  const totalPluginInstalls = Object.values(installedPlugins).reduce(
    (sum, installs) => sum + installs.length,
    0
  );

  const summary = {
    totalProjects: projectConfigs.length,
    totalPlugins: Object.keys(installedPlugins).length,
    totalPluginInstalls,
    blockedPlugins: global.plugins.blocked?.plugins?.length ?? 0,
    marketplaces: Object.keys(global.plugins.marketplaces ?? {}).length,
    hookEvents: Object.keys(global.hooks.config).length,
    hookFiles: global.hooks.files.length,
    totalAgents: projectConfigs.reduce((sum, p) => sum + p.agents.length, 0),
    totalSkills: projectConfigs.reduce((sum, p) => sum + p.skills.length, 0),
    totalCommands: projectConfigs.reduce((sum, p) => sum + p.commands.length, 0),
    totalMcpServers: global.mcp.length + projectConfigs.reduce((sum, p) => sum + p.mcp.length, 0),
    totalProjectHookEvents: projectConfigs.reduce((sum, p) => sum + p.hooks.length, 0),
  };

  return {
    summary,
    global,
    projects: projectConfigs,
  };
}

// --- Known plugin id allowlist ---
// A plugin id is `<pluginName>@<marketplaceName>`. We collect ids from both
// the installed_plugins.json registry and the on-disk plugin cache so the
// toggle endpoint can reject arbitrary keys before they hit settings.json.
export function getKnownPluginIds() {
  const ids = new Set();

  const installed = readJSON(join(CLAUDE_DIR, 'plugins', 'installed_plugins.json'));
  for (const id of Object.keys(installed?.plugins ?? {})) ids.add(id);

  const cacheDir = join(CLAUDE_DIR, 'plugins', 'cache');
  if (existsSync(cacheDir)) {
    for (const marketplace of listDir(cacheDir)) {
      if (!marketplace.isDirectory()) continue;
      for (const plugin of listDir(join(cacheDir, marketplace.name))) {
        if (!plugin.isDirectory()) continue;
        ids.add(`${plugin.name}@${marketplace.name}`);
      }
    }
  }

  return ids;
}

// --- Toggle Plugin ---

// Atomic write: write to a sibling tmp file then rename. Prevents corruption
// of user settings.json if the process crashes mid-write.
function writeJSONAtomic(filePath, data) {
  const tmp = join(dirname(filePath), `.${basename(filePath)}.${randomBytes(6).toString('hex')}.tmp`);
  const payload = JSON.stringify(data, null, 2) + '\n';
  try {
    writeFileSync(tmp, payload, 'utf8');
    renameSync(tmp, filePath);
  } catch (err) {
    try { unlinkSync(tmp); } catch {}
    throw err;
  }
}

function settingsPathFor(scope, projectPath) {
  if (scope === 'user') return join(CLAUDE_DIR, 'settings.json');
  if (scope === 'project') return join(projectPath, '.claude', 'settings.json');
  if (scope === 'local') return join(projectPath, '.claude', 'settings.local.json');
  return null;
}

export function togglePlugin({ pluginId, scope, projectPath, enabled }) {
  try {
    const filePath = settingsPathFor(scope, projectPath);
    if (!filePath) return { ok: false, error: 'Invalid scope' };
    const settings = readJSON(filePath) || {};
    if (!settings.enabledPlugins) settings.enabledPlugins = {};
    if (enabled) {
      settings.enabledPlugins[pluginId] = true;
    } else {
      delete settings.enabledPlugins[pluginId];
    }
    writeJSONAtomic(filePath, settings);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// --- Scope move helpers ---
// Strategy: write target first, then source. If target write fails, source unchanged.
// If target succeeds and source fails, the entry is duplicated (recoverable manually).

function ensureParentDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function isValidScope(s) {
  return s === 'user' || s === 'project' || s === 'local';
}

export function movePermission({ from, to, projectPath, policy, rule }) {
  try {
    if (!isValidScope(from) || !isValidScope(to) || from === to) {
      return { ok: false, error: 'Invalid scope' };
    }
    if (!['deny', 'ask', 'allow'].includes(policy)) {
      return { ok: false, error: 'Invalid policy' };
    }
    if (typeof rule !== 'string' || !rule) {
      return { ok: false, error: 'Invalid rule' };
    }
    const fromPath = settingsPathFor(from, projectPath);
    const toPath = settingsPathFor(to, projectPath);
    if (!fromPath || !toPath) return { ok: false, error: 'Invalid scope' };

    const src = readJSON(fromPath) || {};
    const idx = Array.isArray(src.permissions?.[policy]) ? src.permissions[policy].indexOf(rule) : -1;
    if (idx < 0) return { ok: false, error: 'Rule not found in source' };

    const dst = readJSON(toPath) || {};
    dst.permissions = dst.permissions || {};
    dst.permissions[policy] = Array.isArray(dst.permissions[policy]) ? dst.permissions[policy] : [];
    if (!dst.permissions[policy].includes(rule)) {
      dst.permissions[policy].push(rule);
    }
    ensureParentDir(toPath);
    writeJSONAtomic(toPath, dst);

    src.permissions[policy].splice(idx, 1);
    if (src.permissions[policy].length === 0) delete src.permissions[policy];
    if (src.permissions && Object.keys(src.permissions).length === 0) delete src.permissions;
    writeJSONAtomic(fromPath, src);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// sourceFile === '.mcp.json' reads/writes <projectPath>/.mcp.json instead of
// the scope's settings.json. Used for project-shared MCP entries.
export function moveMcpServer({ from, to, projectPath, name, sourceFile }) {
  try {
    if (!isValidScope(from) || !isValidScope(to) || from === to) {
      return { ok: false, error: 'Invalid scope' };
    }
    if (typeof name !== 'string' || !name) {
      return { ok: false, error: 'Invalid name' };
    }
    if (sourceFile === '.mcp.json' && from !== 'project') {
      return { ok: false, error: '.mcp.json is project-scope only' };
    }
    const fromPath = sourceFile === '.mcp.json'
      ? join(projectPath, '.mcp.json')
      : settingsPathFor(from, projectPath);
    const toPath = settingsPathFor(to, projectPath);
    if (!fromPath || !toPath) return { ok: false, error: 'Invalid scope' };

    const src = readJSON(fromPath) || {};
    const cfg = src.mcpServers?.[name];
    if (!cfg) {
      return { ok: false, error: 'Server not found in source' };
    }

    const dst = readJSON(toPath) || {};
    dst.mcpServers = dst.mcpServers || {};
    dst.mcpServers[name] = cfg;
    ensureParentDir(toPath);
    writeJSONAtomic(toPath, dst);

    delete src.mcpServers[name];
    if (Object.keys(src.mcpServers).length === 0) delete src.mcpServers;
    writeJSONAtomic(fromPath, src);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Delete an MCP server entry from its source file.
export function deleteMcpServer({ fromScope, projectPath, name, sourceFile }) {
  try {
    if (!isValidScope(fromScope)) return { ok: false, error: 'Invalid scope' };
    if (typeof name !== 'string' || !name) return { ok: false, error: 'Invalid name' };
    const fromPath = sourceFile === '.mcp.json'
      ? join(projectPath, '.mcp.json')
      : settingsPathFor(fromScope, projectPath);
    if (!fromPath) return { ok: false, error: 'Invalid scope' };
    const src = readJSON(fromPath) || {};
    if (!src.mcpServers?.[name]) {
      return { ok: false, error: 'Server not found in source' };
    }
    delete src.mcpServers[name];
    if (Object.keys(src.mcpServers).length === 0) delete src.mcpServers;
    writeJSONAtomic(fromPath, src);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function moveHook({ from, to, projectPath, event, matcher, command, type }) {
  try {
    if (!isValidScope(from) || !isValidScope(to) || from === to) {
      return { ok: false, error: 'Invalid scope' };
    }
    if (typeof event !== 'string' || !event) {
      return { ok: false, error: 'Invalid event' };
    }
    if (typeof command !== 'string' || !command) {
      return { ok: false, error: 'Invalid command' };
    }
    // Normalize: treat null/empty/'*' as equivalent wildcard for matcher matching.
    const normMatcher = (m) => (m == null || m === '' || m === '*') ? '*' : String(m);
    const wantMatcher = normMatcher(matcher);
    const fromPath = settingsPathFor(from, projectPath);
    const toPath = settingsPathFor(to, projectPath);
    if (!fromPath || !toPath) return { ok: false, error: 'Invalid scope' };

    const src = readJSON(fromPath) || {};
    const eventArr = src.hooks?.[event];
    if (!Array.isArray(eventArr)) {
      return { ok: false, error: 'Hook event not found in source' };
    }
    let foundEntry = null, foundHookIdx = -1, foundEntryIdx = -1;
    for (let i = 0; i < eventArr.length; i++) {
      const entry = eventArr[i];
      if (normMatcher(entry.matcher) !== wantMatcher) continue;
      const idx = (entry.hooks || []).findIndex(h => {
        if (type && h.type !== type) return false;
        return (h.command || h.prompt || '') === command;
      });
      if (idx >= 0) {
        foundEntry = entry;
        foundEntryIdx = i;
        foundHookIdx = idx;
        break;
      }
    }
    if (!foundEntry) return { ok: false, error: 'Hook not found in source' };
    const hookItem = foundEntry.hooks[foundHookIdx];

    const dst = readJSON(toPath) || {};
    dst.hooks = dst.hooks || {};
    dst.hooks[event] = Array.isArray(dst.hooks[event]) ? dst.hooks[event] : [];
    let dstEntry = dst.hooks[event].find(e => normMatcher(e.matcher) === wantMatcher);
    if (!dstEntry) {
      // Preserve the source entry's matcher form ('' or '*' or actual pattern)
      dstEntry = { matcher: foundEntry.matcher == null ? '' : foundEntry.matcher, hooks: [] };
      dst.hooks[event].push(dstEntry);
    }
    dstEntry.hooks = Array.isArray(dstEntry.hooks) ? dstEntry.hooks : [];
    dstEntry.hooks.push(hookItem);
    ensureParentDir(toPath);
    writeJSONAtomic(toPath, dst);

    foundEntry.hooks.splice(foundHookIdx, 1);
    if (foundEntry.hooks.length === 0) eventArr.splice(foundEntryIdx, 1);
    if (eventArr.length === 0) delete src.hooks[event];
    if (src.hooks && Object.keys(src.hooks).length === 0) delete src.hooks;
    writeJSONAtomic(fromPath, src);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
