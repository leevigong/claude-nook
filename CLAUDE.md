# claude-nook

Visual web dashboard for managing Claude Code settings (plugins, hooks, MCP servers, agents, skills) across all local projects. Pure Node.js, zero runtime deps except `update-notifier`.

Default port: **7007**.

## Layout

- `bin/claude-nook.mjs` — CLI entry, starts the HTTP server
- `lib/server.mjs` — HTTP server, routes, CSRF/Origin/Host security checks
- `lib/scanner.mjs` — discovers projects on disk + from Claude metadata
- `lib/reader.mjs` — reads global + per-project Claude config (settings, plugins, hooks, MCP, agents, skills)
- `lib/ui.mjs` — single-file frontend (HTML + inline JS) served by the server

## Project discovery (`lib/scanner.mjs`)

A folder is shown in the sidebar if **any** of these match:

1. **Disk walk** — `walk()` recurses (depth ≤ 4) under fixed roots: `~`, `~/Desktop`, `~/Documents`, `~/dev`, `~/projects`, `~/src`, `~/work`, `~/code`, `~/repos`. A folder qualifies if it contains `.mcp.json` or `.claude/` with meaningful content (`settings.json`, `settings.local.json`, `agents/`, `plugins/`, `skills/`).
2. **`mergeInstalledPluginProjects()`** — reads `~/.claude/plugins/installed_plugins.json` and adds every `projectPath` recorded there. Catches projects in unscanned roots (e.g. `~/Downloads`) where the user has installed a plugin.
3. **`mergeClaudeSessionProjects()`** — reads `~/.claude/projects/<encoded>/*.jsonl` and extracts the `cwd` field from the first record that has one. Catches every project Claude Code has session history for, including ones in macOS-TCC-blocked locations like `~/Documents`.

All three sources are filtered through `existsSync` so deleted/moved folders drop out. The home dir itself is excluded.

### Limits of discovery

- If a project folder is **moved**, the session history still records the old `cwd` and `installed_plugins.json` still records the old `projectPath`. The new location won't appear until either (a) Claude Code is run from the new location (writes a fresh `cwd`), or (b) a plugin is installed in the new location.
- macOS TCC blocks Node from reading `~/Documents` by default. The disk walk silently fails there; only the session-history merge can recover those projects. To make the disk walk work, grant Terminal/iTerm "Documents" access in System Settings → Privacy & Security → Files and Folders.

## Plugin Usage table

The "Usage" table on each plugin's detail view (`lib/ui.mjs` ~line 826) iterates `appData.global.plugins.installed[id]` (i.e. `installed_plugins.json`). Before the discovery merges above existed, a project could appear in Usage but be missing from the sidebar — making its toggle unreachable because `/api/projects/:path` gates on the scanner result. The merges close that gap.

## Server security (`lib/server.mjs`)

- Host header allowlist (DNS rebinding protection)
- Origin/Referer required on every `/api/*` request
- CSRF token required on POST
- `/api/projects/:path` only accepts paths returned by `getProjects()` (no traversal)

## Caching

`getProjects()` caches the scanner result in `cachedProjects`. The "다시 스캔" button hits `/api/rescan` which clears the cache. Restarting the server also clears it.

## Running locally

```bash
node bin/claude-nook.mjs            # foreground
# or
nohup node bin/claude-nook.mjs > /tmp/claude-nook.log 2>&1 &
```

Always restart the server after code changes — there's no hot reload.
