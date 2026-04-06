export function generateHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>claude-nook</title>
  <style>
    :root {
      --bg: #f8f9fb;
      --bg-card: #ffffff;
      --bg-sidebar: #ffffff;
      --bg-hover: #f0f1f4;
      --bg-active: #e8e9ed;
      --border: #e2e4e9;
      --text: #1a1d27;
      --text-muted: #5c6072;
      --text-dim: #8b8fa3;
      --accent: #7c3aed;
      --accent-soft: rgba(124, 58, 237, 0.1);
      --green: #16a34a;
      --green-soft: rgba(22, 163, 74, 0.1);
      --red: #dc2626;
      --red-soft: rgba(220, 38, 38, 0.1);
      --blue: #2563eb;
      --blue-soft: rgba(37, 99, 235, 0.1);
      --orange: #d97706;
      --orange-soft: rgba(217, 119, 6, 0.1);
      --radius: 10px;
      --radius-sm: 6px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }

    /* Layout */
    .app {
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: 56px 1fr;
      height: 100vh;
    }

    /* Header */
    .header {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-sidebar);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .logo span { color: var(--accent); }
    .version {
      font-size: 11px;
      color: var(--text-dim);
      background: var(--bg-hover);
      padding: 2px 8px;
      border-radius: 99px;
    }
    .btn {
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn:hover {
      background: var(--bg-hover);
      color: var(--text);
    }

    /* Sidebar */
    .sidebar {
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      padding: 16px 0;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .sidebar::-webkit-scrollbar { display: none; }
    .sidebar-section {
      padding: 0 12px;
      margin-bottom: 8px;
    }
    .sidebar-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-dim);
      padding: 8px 12px 4px;
    }
    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 13px;
      transition: all 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar-item:hover { background: var(--bg-hover); color: var(--text); }
    .sidebar-group-header:hover { background: var(--bg-hover); }
    .sidebar-item.active { background: var(--accent-soft); color: var(--accent); }
    .sidebar-item .icon { font-size: 15px; flex-shrink: 0; display: inline-flex; align-items: center; }
    .sidebar-item .badge {
      margin-left: auto;
      font-size: 11px;
      background: var(--bg-hover);
      padding: 1px 7px;
      border-radius: 99px;
      color: var(--text-dim);
      flex-shrink: 0;
    }
    .sidebar-divider {
      height: 1px;
      background: var(--border);
      margin: 8px 12px;
    }

    /* Main Content */
    .main {
      padding: 24px;
      overflow-y: auto;
    }
    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: -0.3px;
    }

    /* Cards Grid */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 14px;
      margin-bottom: 28px;
    }
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .card-label {
      font-size: 12px;
      color: var(--text-dim);
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -1px;
    }
    .card-value.purple { color: var(--accent); }
    .card-value.green { color: var(--green); }
    .card-value.blue { color: var(--blue); }
    .card-value.orange { color: var(--orange); }
    .card-value.red { color: var(--red); }

    /* Table */
    .table-wrap {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .table-title {
      font-size: 14px;
      font-weight: 600;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      text-align: left;
      padding: 10px 18px;
      color: var(--text-dim);
      font-weight: 500;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 10px 18px;
      border-bottom: 1px solid var(--border);
      color: var(--text-muted);
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--bg-hover); }

    /* Tags */
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 500;
    }
    .tag-green { background: var(--green-soft); color: var(--green); }
    .tag-red { background: var(--red-soft); color: var(--red); }
    .tag-blue { background: var(--blue-soft); color: var(--blue); }
    .tag-orange { background: var(--orange-soft); color: var(--orange); }
    .tag-purple { background: var(--accent-soft); color: var(--accent); }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 2px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 18px;
      font-size: 13px;
      color: var(--text-dim);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
    }
    .tab:hover { color: var(--text); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

    /* JSON Tree */
    .json-tree {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px;
      font-family: "SF Mono", "Cascadia Code", "Fira Code", monospace;
      font-size: 12px;
      line-height: 1.7;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .json-key { color: var(--accent); }
    .json-string { color: var(--green); }
    .json-number { color: var(--orange); }
    .json-bool { color: var(--blue); }
    .json-null { color: var(--text-dim); }

    /* Agent Cards */
    .agent-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }
    .agent-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .agent-card h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .agent-card p {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    .agent-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* Permission list */
    .perm-list {
      list-style: none;
      padding: 0;
    }
    .perm-list li {
      padding: 6px 12px;
      font-size: 12px;
      font-family: "SF Mono", monospace;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
    }
    .perm-list li:last-child { border-bottom: none; }

    /* Tooltip */
    .tooltip {
      position: relative;
      cursor: help;
    }
    .tooltip::after {
      content: attr(data-tip);
      position: absolute;
      left: 50%;
      bottom: calc(100% + 8px);
      transform: translateX(-50%);
      background: var(--bg-card);
      color: var(--text);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      white-space: pre-line;
      width: max-content;
      max-width: 280px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .tooltip:hover::after { opacity: 1; }
    .tooltip-right::after {
      left: calc(100% + 8px);
      bottom: auto;
      top: 50%;
      transform: translateY(-50%);
    }
    .sidebar-label .tip-icon {
      font-size: 12px;
      color: var(--text-dim);
      margin-left: 4px;
      cursor: help;
    }

    /* Toggle Switch */
    .toggle-switch {
      display: inline-flex;
      align-items: center;
      position: relative;
      width: 44px;
      height: 24px;
      cursor: pointer;
      vertical-align: middle;
    }
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }
    .toggle-track {
      display: block;
      width: 44px;
      height: 24px;
      background: #d1d5db;
      border-radius: 99px;
      transition: all 0.25s ease;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }
    .toggle-switch input:checked + .toggle-track {
      background: var(--green);
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.05), 0 0 8px rgba(22, 163, 74, 0.3);
    }
    .toggle-track::after {
      content: '';
      display: block;
      width: 18px;
      height: 18px;
      background: white;
      border-radius: 50%;
      margin: 3px;
      transition: transform 0.25s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .toggle-switch input:checked + .toggle-track::after {
      transform: translateX(20px);
    }
    .toggle-switch:hover .toggle-track {
      filter: brightness(0.95);
    }
    .toggle-switch:active .toggle-track::after {
      width: 22px;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 18px;
      font-size: 13px;
      color: var(--text-muted);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      z-index: 200;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* Scope Diagram */
    .scope-diagram {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      margin-bottom: 28px;
    }
    .scope-diagram h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--text);
    }
    .scope-rings {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
    }
    .scope-ring {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      position: relative;
    }
    .scope-ring-user {
      background: rgba(124, 58, 237, 0.05);
      border: 2px solid rgba(124, 58, 237, 0.25);
      padding: 24px 36px;
    }
    .scope-ring-project {
      background: rgba(37, 99, 235, 0.05);
      border: 2px solid rgba(37, 99, 235, 0.25);
      padding: 24px 36px;
    }
    .scope-ring-local {
      background: rgba(217, 119, 6, 0.05);
      border: 2px solid rgba(217, 119, 6, 0.25);
      padding: 20px 32px;
      min-width: 180px;
    }
    .scope-ring-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .scope-ring-label.purple { color: var(--accent); }
    .scope-ring-label.blue { color: var(--blue); }
    .scope-ring-label.orange { color: var(--orange); }
    .scope-ring-path {
      font-size: 11px;
      font-family: "SF Mono", monospace;
      color: var(--text-dim);
      margin-bottom: 4px;
    }
    .scope-ring-desc {
      font-size: 12px;
      color: var(--text-muted);
      text-align: center;
      max-width: 220px;
    }
    .scope-legend {
      display: flex;
      gap: 24px;
      justify-content: center;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .scope-legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .scope-legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }
    .scope-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;
      padding: 10px 18px;
      background: var(--bg-hover);
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
    }
    .scope-arrow .arrow-label { color: var(--text-dim); font-size: 12px; }
    .scope-arrow .arrow-item { font-weight: 600; }
    .scope-arrow .arrow-sep { color: var(--text-dim); }

    /* Empty state */
    .empty {
      text-align: center;
      padding: 40px;
      color: var(--text-dim);
      font-size: 14px;
    }

    /* Loading */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--text-dim);
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 10px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-left">
        <div class="logo"><span>claude</span>-nook</div>
        <span class="version">v0.1.0</span>
      </div>
      <button class="btn" id="rescan-btn">Rescan</button>
    </header>

    <nav class="sidebar" id="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-item active" data-view="overview">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></span> Overview
        </div>
      </div>
      <div class="sidebar-label tooltip tooltip-right" data-tip="All scopes at a glance">All</div>
      <div class="sidebar-section">
        <div class="sidebar-item" data-view="all-plugins">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6m0 12v2M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/></svg></span> Plugins
        </div>
        <div class="sidebar-item" data-view="all-hooks">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></span> Hooks
        </div>
        <div class="sidebar-item" data-view="all-mcp">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/></svg></span> MCP Servers
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-label">Global</div>
      <div class="sidebar-section">
        <div class="sidebar-item" data-view="global">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span> ~/.claude
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <div id="project-list"></div>
    </nav>

    <main class="main" id="content">
      <div class="loading"><div class="spinner"></div> Loading...</div>
    </main>
  </div>
  <div class="toast" id="toast"></div>

  <script>
    let appData = null;
    let currentView = 'overview';

    // --- Fetch Data ---
    async function fetchOverview() {
      const res = await fetch('/api/overview');
      const json = await res.json();
      if (json.ok) appData = json.data;
      return appData;
    }

    // --- Sidebar ---
    function renderSidebar() {
      const list = document.getElementById('project-list');
      if (!appData) return;

      // Group projects by parent directory
      const home = appData.projects[0]?.path.split('/').slice(0, 3).join('/') || '';
      const groups = {};
      for (const p of appData.projects) {
        const parts = p.path.replace(home + '/', '').split('/');
        const parent = parts.length > 1 ? parts[0] : '';
        if (!groups[parent]) groups[parent] = [];
        groups[parent].push(p);
      }

      let html = '<div class="sidebar-label">Projects</div>';
      for (const [group, projects] of Object.entries(groups)) {
        if (group) {
          const groupId = 'grp-' + group.replace(/[^a-zA-Z0-9]/g, '_');
          html += \`<div class="sidebar-section"><div class="sidebar-group-header" data-group="\${groupId}" style="display:flex;align-items:center;gap:8px;color:var(--text-dim);font-size:12px;font-weight:600;padding:8px 12px;cursor:pointer;user-select:none;border-radius:var(--radius-sm)">
            <span class="group-arrow" style="font-size:10px;transition:transform 0.15s">&#9660;</span>
            <span style="font-size:14px">&#128193;</span> \${esc(group)}
          </div>
          <div class="sidebar-group-items" id="\${groupId}">\`;
          for (const p of projects) {
            const count = Object.keys(p.settings?.enabledPlugins ?? {}).length +
              Object.keys(p.settingsLocal?.enabledPlugins ?? {}).length;
            html += \`<div class="sidebar-item" data-view="project" data-path="\${encodeURIComponent(p.path)}" style="padding-left:28px">
              <span style="color:var(--text-dim);font-size:11px;margin-right:2px">&#9492;</span>
              <span style="overflow:hidden;text-overflow:ellipsis">\${esc(p.name)}</span>
              \${count ? \`<span class="badge">\${count}</span>\` : ''}
            </div>\`;
          }
          html += '</div></div>';
        } else {
          html += '<div class="sidebar-section">';
          for (const p of projects) {
            const count = Object.keys(p.settings?.enabledPlugins ?? {}).length +
              Object.keys(p.settingsLocal?.enabledPlugins ?? {}).length;
            html += \`<div class="sidebar-item" data-view="project" data-path="\${encodeURIComponent(p.path)}">
              <span class="icon">&#128193;</span>
              <span style="overflow:hidden;text-overflow:ellipsis">\${esc(p.name)}</span>
              \${count ? \`<span class="badge">\${count}</span>\` : ''}
            </div>\`;
          }
          html += '</div>';
        }
      }
      list.innerHTML = html;
    }

    // --- Views ---
    function renderOverview() {
      const s = appData.summary;
      return \`
        <div class="page-title">Overview</div>

        <div class="scope-diagram">
          <h3>Settings Scope (설정 범위)</h3>
          <div class="scope-rings">
            <div class="scope-ring scope-ring-user">
              <div class="scope-ring-label purple">User (전역)</div>
              <div class="scope-ring-path">~/.claude/settings.json</div>
              <div class="scope-ring-desc" style="margin-bottom:16px">이 컴퓨터의 모든 프로젝트에 적용</div>

              <div class="scope-ring scope-ring-project">
                <div class="scope-ring-label blue">Project (프로젝트)</div>
                <div class="scope-ring-path">.claude/settings.json</div>
                <div class="scope-ring-desc" style="margin-bottom:16px">git으로 팀과 공유되는 설정</div>

                <div class="scope-ring scope-ring-local">
                  <div class="scope-ring-label orange">Local (로컬)</div>
                  <div class="scope-ring-path">.claude/settings.local.json</div>
                  <div class="scope-ring-desc">내 컴퓨터에서만, git에 포함 안 됨</div>
                </div>
              </div>
            </div>
          </div>
          <div class="scope-arrow">
            <span class="arrow-label">우선순위</span>
            <span class="arrow-item" style="color:var(--orange)">Local</span>
            <span class="arrow-sep">&gt;</span>
            <span class="arrow-item" style="color:var(--blue)">Project</span>
            <span class="arrow-sep">&gt;</span>
            <span class="arrow-item" style="color:var(--accent)">User</span>
          </div>
        </div>

      \`;
    }

    function renderGlobal() {
      const tabs = ['plugins', 'hooks', 'mcp', 'raw'];
      const activeTab = window._globalTab || 'plugins';

      let html = \`<div class="page-title">Global</div>
        <div style="font-size:12px;color:var(--text-dim);margin:-14px 0 18px;font-family:monospace">~/.claude/</div>
        <div class="tabs">\${tabs.map(t =>
          \`<div class="tab \${t === activeTab ? 'active' : ''}" data-global-tab="\${t}" \${t === 'raw' ? 'style="margin-left:auto;font-size:12px;color:var(--text-dim)"' : ''}>\${t === 'raw' ? 'View raw' : t === 'mcp' ? 'MCP Servers' : t.charAt(0).toUpperCase() + t.slice(1)}</div>\`
        ).join('')}</div>\`;

      switch (activeTab) {
        case 'plugins': html += renderGlobalPlugins(); break;
        case 'hooks': html += renderGlobalHooks(); break;
        case 'mcp': html += renderGlobalMcp(); break;
        case 'raw': {
          const settings = appData.global.settings;
          const settingsLocal = appData.global.settingsLocal;
          if (settings) {
            html += '<div class="table-wrap"><div class="table-title">settings.json</div>';
            html += \`<div class="json-tree">\${jsonToHTML(settings)}</div></div>\`;
          }
          if (settingsLocal) {
            html += '<div class="table-wrap" style="margin-top:14px"><div class="table-title">settings.local.json</div>';
            html += \`<div class="json-tree">\${jsonToHTML(settingsLocal)}</div></div>\`;
          }
          if (!settings && !settingsLocal) {
            html += '<div class="empty">No settings files</div>';
          }
          break;
        }
      }
      return html;
    }

    function renderPluginView(title, filterScope, showTitle = true) {
      const plugins = appData.global.plugins;
      const blocked = plugins.blocked?.plugins ?? [];
      const installed = plugins.installed?.plugins ?? {};
      const selectedPlugin = window._selectedPlugin || null;

      // Build plugin summary: group all installs by plugin id
      const pluginMap = {};
      for (const [id, installs] of Object.entries(installed)) {
        const filtered = filterScope ? installs.filter(i => i.scope === filterScope) : installs;
        if (!filtered.length) continue;
        pluginMap[id] = {
          id,
          manifest: plugins.manifests?.[id] || null,
          installs: filtered,
          isBlocked: blocked.some(b => b.plugin === id),
        };
      }

      let html = showTitle ? \`<div class="page-title">\${esc(title)}</div>\` : '';

      // Plugin cards grid
      const pluginIds = Object.keys(pluginMap);
      html += \`<div class="agent-cards" style="margin-bottom:20px">
        \${pluginIds.map(id => {
          const p = pluginMap[id];
          const desc = p.manifest?.description || '';
          const isSelected = selectedPlugin === id;
          const installCount = p.installs.length;
          return \`<div class="agent-card plugin-card\${isSelected ? ' selected' : ''}" data-plugin-id="\${esc(id)}" style="cursor:pointer;\${isSelected ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <h3>\${esc(id.split('@')[0])}</h3>
              \${p.isBlocked ? '<span class="tag tag-red">blocked</span>' : ''}
            </div>
            <p style="font-size:11px;color:var(--text-dim);margin-bottom:4px">\${esc(id.split('@')[1] || '')}</p>
            <p>\${esc(desc.length > 80 ? desc.slice(0, 80) + '...' : desc) || '<span style="color:var(--text-dim)">No description</span>'}</p>
            <div class="agent-meta">
              <span class="tag tag-blue">\${installCount} install\${installCount > 1 ? 's' : ''}</span>
              \${p.manifest?.version ? \`<span class="tag tag-green">v\${esc(p.manifest.version)}</span>\` : ''}
              \${p.manifest?.skills?.length ? \`<span class="tag tag-orange">\${p.manifest.skills.length} skills</span>\` : ''}
            </div>
          </div>\`;
        }).join('')}
      </div>\`;

      // Detail panel for selected plugin
      if (selectedPlugin && pluginMap[selectedPlugin]) {
        const p = pluginMap[selectedPlugin];
        html += \`<div class="table-wrap" style="border-color:var(--accent)">
          <div class="table-title" style="display:flex;justify-content:space-between;align-items:center">
            <span>Usage</span>
          </div>
          <table>
            <tr><th>Scope</th><th>Project</th><th>Version</th><th>Status</th></tr>
            \${p.installs.map(inst => {
              const projectName = inst.projectPath ? inst.projectPath.split('/').pop() : 'All projects';
              const isEnabled = getPluginEnabled(selectedPlugin, inst.scope, inst.projectPath);
              const scopeColor = inst.scope === 'user' ? 'purple' : inst.scope === 'project' ? 'blue' : 'orange';
              return \`<tr>
                <td><span class="tag tag-\${scopeColor}">\${esc(inst.scope)}</span></td>
                <td>\${esc(projectName)}</td>
                <td style="font-family:monospace;font-size:12px">\${esc(inst.version || '-')}</td>
                <td>
                  <label class="toggle-switch toggle-plugin-btn"
                    data-plugin="\${esc(selectedPlugin)}"
                    data-scope="\${esc(inst.scope)}"
                    data-project="\${esc(inst.projectPath || '')}"
                    data-enabled="\${isEnabled ? 'true' : 'false'}">
                    <input type="checkbox" \${isEnabled ? 'checked' : ''}>
                    <span class="toggle-track"></span>
                  </label>
                </td>
              </tr>\`;
            }).join('')}
          </table>
        </div>\`;

        // Show skills for selected plugin
        const selSkills = pluginMap[selectedPlugin]?.manifest?.skills ?? [];
        if (selSkills.length) {
          html += \`<div class="table-wrap" style="border-color:var(--accent)">
            <div class="table-title">Skills (\${selSkills.length})</div>
            <div style="padding:14px 18px;display:flex;flex-wrap:wrap;gap:8px">
              \${selSkills.map(s => \`<span class="tag tag-orange">\${esc(s)}</span>\`).join('')}
            </div>
          </div>\`;
        }
      }

      return html;
    }

    function renderGlobalPlugins() { return renderPluginView('Global Plugins', 'user', false); }
    function renderAllPlugins() { return renderPluginView('All Plugins', null); }

    function getPluginEnabled(pluginId, scope, projectPath) {
      if (scope === 'user') {
        return appData.global.settings?.enabledPlugins?.[pluginId] === true;
      }
      const project = appData.projects.find(p => p.path === projectPath);
      if (!project) return false;
      if (scope === 'local') {
        return project.settingsLocal?.enabledPlugins?.[pluginId] === true;
      }
      return project.settings?.enabledPlugins?.[pluginId] === true;
    }

    function renderGlobalHooks() {
      const hooks = appData.global.hooks;
      const events = Object.entries(hooks.config);

      let html = '';

      // Group by command
      const commandMap = {};
      for (const [event, matchers] of events) {
        for (const matcher of matchers) {
          for (const hook of (matcher.hooks || [])) {
            const cmd = hook.command || 'unknown';
            if (!commandMap[cmd]) commandMap[cmd] = [];
            commandMap[cmd].push(event);
          }
        }
      }

      const commandEntries = Object.entries(commandMap);
      const selectedHook = window._selectedHook || null;

      if (commandEntries.length) {
        html += \`<div class="agent-cards" style="margin-bottom:20px">
          \${commandEntries.map(([cmd, evts]) => {
            const scriptName = cmd.split('/').pop() || cmd;
            const isSelected = selectedHook === cmd;
            return \`<div class="agent-card hook-card" data-hook-cmd="\${esc(cmd)}" style="cursor:pointer;\${isSelected ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
              <h3 style="font-size:13px;font-family:monospace">\${esc(scriptName)}</h3>
              <p style="font-size:11px;color:var(--text-dim);font-family:monospace;margin-bottom:10px">\${esc(cmd)}</p>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                \${evts.map(e => \`<span class="tag tag-purple">\${esc(e)}</span>\`).join('')}
              </div>
              <div style="margin-top:10px;font-size:12px;color:var(--text-muted)">\${evts.length} event\${evts.length > 1 ? 's' : ''}</div>
            </div>\`;
          }).join('')}
        </div>\`;
      }

      // Detail panel for selected hook
      if (selectedHook) {
        const hookEvents = {};
        for (const [event, matchers] of events) {
          for (const matcher of matchers) {
            for (const hook of (matcher.hooks || [])) {
              if (hook.command === selectedHook) {
                hookEvents[event] = { matcher: matcher.matcher || '(all)', ...hook };
              }
            }
          }
        }

        html += \`<div class="table-wrap" style="border-color:var(--accent)">
          <div class="table-title" style="display:flex;justify-content:space-between;align-items:center">
            <span>Configuration</span>
            <button class="btn hook-raw-btn" data-cmd="\${esc(selectedHook)}" style="padding:3px 10px;font-size:11px">Raw</button>
          </div>
          <table>
            <tr><th>Event</th><th>Matcher</th><th>Type</th><th>Command</th></tr>
            \${Object.entries(hookEvents).map(([evt, cfg]) => \`<tr>
              <td><span class="tag tag-purple">\${esc(evt)}</span></td>
              <td style="font-family:monospace;font-size:12px">\${esc(cfg.matcher)}</td>
              <td><span class="tag tag-blue">\${esc(cfg.type || '-')}</span></td>
              <td style="font-family:monospace;font-size:12px">\${esc(cfg.command || '-')}</td>
            </tr>\`).join('')}
          </table>
        </div>
        <div class="hook-raw-panel" style="display:none">
          <div class="table-wrap" style="border-color:var(--accent)">
            <div class="table-title" style="display:flex;justify-content:space-between;align-items:center">
              <span>settings.json</span>
              <button class="btn hook-raw-btn" data-cmd="\${esc(selectedHook)}" style="padding:3px 10px;font-size:11px">Table</button>
            </div>
            <div class="json-tree">\${jsonToHTML(hookEvents)}</div>
          </div>
        </div>\`;
      }

      if (hooks.files.length) {
        html += \`<div class="table-wrap">
          <div class="table-title">Hook Files (\${hooks.files.length})</div>
          <table>
            <tr><th>Filename</th><th>Path</th></tr>
            \${hooks.files.map(f => \`<tr>
              <td>\${esc(f.filename)}</td>
              <td style="font-family:monospace;font-size:12px;color:var(--text-dim)">\${esc(f.path)}</td>
            </tr>\`).join('')}
          </table>
        </div>\`;
      }

      return html;
    }

    function renderMcpView(title, globalOnly, showTitle = true) {
      const allServers = [];
      for (const s of (appData.global.mcp || [])) {
        allServers.push({ ...s, project: '(global)' });
      }
      if (!globalOnly) {
        for (const p of appData.projects) {
          for (const s of (p.mcp || [])) {
            allServers.push({ ...s, project: p.name });
          }
        }
      }

      const selectedMcp = window._selectedMcp || null;

      let html = showTitle ? \`<div class="page-title">\${esc(title)}</div>\` : '';

      if (!allServers.length) {
        return html + '<div class="empty">No MCP servers configured</div>';
      }

      html += \`<div class="agent-cards" style="margin-bottom:20px">
        \${allServers.map((s, i) => {
          const key = s.name + '|' + s.scope + '|' + s.project;
          const isSelected = selectedMcp === key;
          const scopeColor = s.scope === 'global' || s.scope === 'global-local' ? 'purple'
            : s.scope === 'project' ? 'blue'
            : s.scope === '.mcp.json' ? 'green'
            : 'orange';
          return \`<div class="agent-card mcp-card" data-mcp-key="\${esc(key)}" style="cursor:pointer;\${isSelected ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
            <h3>\${esc(s.name)}</h3>
            <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">\${esc(s.project)}</p>
            <div class="agent-meta">
              <span class="tag tag-\${scopeColor}">\${esc(s.scope)}</span>
            </div>
          </div>\`;
        }).join('')}
      </div>\`;

      if (selectedMcp) {
        const s = allServers.find(s => (s.name + '|' + s.scope + '|' + s.project) === selectedMcp);
        if (s) {
          html += \`<div class="table-wrap" style="border-color:var(--accent)">
            <div class="table-title">\${esc(s.name)} — Details</div>
            <table>
              <tr><th>Property</th><th>Value</th></tr>
              \${s.command ? \`<tr><td>Command</td><td style="font-family:monospace;font-size:12px">\${esc(s.command)}</td></tr>\` : ''}
              \${s.args?.length ? \`<tr><td>Args</td><td style="font-family:monospace;font-size:12px">\${esc(JSON.stringify(s.args))}</td></tr>\` : ''}
              \${s.url ? \`<tr><td>URL</td><td style="font-family:monospace;font-size:12px">\${esc(s.url)}</td></tr>\` : ''}
              <tr><td>Scope</td><td>\${esc(s.scope)}</td></tr>
              <tr><td>Project</td><td>\${esc(s.project)}</td></tr>
            </table>
          </div>\`;

          const envVars = s.env ? Object.entries(s.env) : [];
          if (envVars.length) {
            html += \`<div class="table-wrap" style="border-color:var(--accent)">
              <div class="table-title">Environment Variables (\${envVars.length})</div>
              <table>
                <tr><th>Key</th><th>Value</th></tr>
                \${envVars.map(([k, v]) => \`<tr>
                  <td style="font-family:monospace;font-size:12px">\${esc(k)}</td>
                  <td style="font-family:monospace;font-size:12px">\${esc(typeof v === 'string' && v.length > 20 ? v.slice(0, 20) + '...' : String(v))}</td>
                </tr>\`).join('')}
              </table>
            </div>\`;
          }
        }
      }

      return html;
    }

    function renderAllHooks() {
      let html = '<div class="page-title">All Hooks</div>';

      // Global hooks
      const globalEvents = Object.entries(appData.global.hooks.config);
      const allItems = [];
      for (const [event, matchers] of globalEvents) {
        for (const matcher of matchers) {
          for (const hook of (matcher.hooks || [])) {
            allItems.push({ event, matcher: matcher.matcher || '*', command: hook.command || '-', type: hook.type || '-', scope: 'global', project: '(global)' });
          }
        }
      }
      // Project hooks
      for (const p of appData.projects) {
        for (const h of (p.hooks || [])) {
          allItems.push({ ...h, project: p.name });
        }
      }

      if (!allItems.length) {
        return html + '<div class="empty">No hooks configured</div>';
      }

      html += \`<div class="table-wrap">
        <div class="table-title">Hooks (\${allItems.length})</div>
        <table>
          <tr><th>Event</th><th>Command</th><th>Scope</th><th>Project</th></tr>
          \${allItems.map(h => {
            const scopeColor = h.scope === 'global' ? 'purple' : h.scope === 'project' ? 'blue' : 'orange';
            const scriptName = (h.command || '-').split('/').pop();
            return \`<tr>
              <td><span class="tag tag-purple">\${esc(h.event)}</span></td>
              <td style="font-family:monospace;font-size:12px" title="\${esc(h.command)}">\${esc(scriptName)}</td>
              <td><span class="tag tag-\${scopeColor}">\${esc(h.scope)}</span></td>
              <td>\${esc(h.project)}</td>
            </tr>\`;
          }).join('')}
        </table>
      </div>\`;

      return html;
    }

    function renderGlobalMcp() { return renderMcpView('Global MCP Servers', true, false); }
    function renderAllMcp() { return renderMcpView('All MCP Servers', false); }

    function renderProject(projectPath) {
      const project = appData.projects.find(p => p.path === projectPath);
      if (!project) return '<div class="empty">Project not found</div>';

      const tabs = ['plugins', 'hooks', 'mcp', 'permissions', 'agents', 'skills', 'commands', 'raw'];
      const activeTab = window._projectTab || 'plugins';

      let html = \`<div class="page-title">\${esc(project.name)}</div>
        <div style="font-size:12px;color:var(--text-dim);margin:-14px 0 18px;font-family:monospace">\${esc(project.path)}</div>
        <div class="tabs">\${tabs.map(t =>
          \`<div class="tab \${t === activeTab ? 'active' : ''}" data-tab="\${t}" \${t === 'raw' ? 'style="margin-left:auto;font-size:12px;color:var(--text-dim)"' : ''}>\${t === 'raw' ? 'View raw' : t.charAt(0).toUpperCase() + t.slice(1)}</div>\`
        ).join('')}</div>\`;

      switch (activeTab) {
        case 'raw': {
          if (project.settings) {
            html += '<div class="table-wrap"><div class="table-title">settings.json (project)</div>';
            html += \`<div class="json-tree">\${jsonToHTML(project.settings)}</div></div>\`;
          }
          if (project.settingsLocal) {
            html += '<div class="table-wrap" style="margin-top:14px"><div class="table-title">settings.local.json (local)</div>';
            html += \`<div class="json-tree">\${jsonToHTML(project.settingsLocal)}</div></div>\`;
          }
          if (!project.settings && !project.settingsLocal) {
            html += '<div class="empty">No settings files</div>';
          }
          break;
        }
        case 'permissions': {
          const perms = project.settingsLocal?.permissions?.allow ?? [];
          if (perms.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">Allowed Permissions (\${perms.length})</div>
              <ul class="perm-list">
                \${perms.map(p => \`<li>\${esc(p)}</li>\`).join('')}
              </ul>
            </div>\`;
          } else {
            html += '<div class="empty">No permission overrides</div>';
          }
          break;
        }
        case 'agents': {
          if (project.agents.length) {
            html += \`<div class="agent-cards">
              \${project.agents.map(a => \`<div class="agent-card">
                <h3>\${esc(a.name)}</h3>
                <p>\${esc(a.description || 'No description')}</p>
                <div class="agent-meta">
                  \${a.model ? \`<span class="tag tag-purple">\${esc(a.model)}</span>\` : ''}
                  \${Array.isArray(a.tools) ? a.tools.map(t => \`<span class="tag tag-blue">\${esc(t)}</span>\`).join('') : ''}
                </div>
              </div>\`).join('')}
            </div>\`;
          } else {
            html += '<div class="empty">No agents defined</div>';
          }
          break;
        }
        case 'skills': {
          if (project.skills.length) {
            const packages = project.skills.filter(s => s.isPackage);
            const singles = project.skills.filter(s => !s.isPackage);

            const selectedPkg = window._selectedSkillPkg || null;

            if (packages.length) {
              html += \`<div class="agent-cards" style="margin-bottom:20px">
                \${packages.map(s => {
                  const isSelected = selectedPkg === s.name;
                  return \`<div class="agent-card skill-pkg-card" data-pkg="\${esc(s.name)}" style="cursor:pointer;\${isSelected ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
                  <div style="display:flex;justify-content:space-between;align-items:start">
                    <h3>\${esc(s.name)}</h3>
                    <span class="tag tag-purple">package</span>
                  </div>
                  <p style="font-size:12px;color:var(--text-muted);margin-top:6px">\${s.subSkills} sub-skills</p>
                </div>\`;
                }).join('')}
              </div>\`;

              if (selectedPkg) {
                const pkg = packages.find(s => s.name === selectedPkg);
                if (pkg && pkg.subSkillNames?.length) {
                  html += \`<div class="table-wrap" style="border-color:var(--accent);margin-bottom:20px">
                    <div class="table-title">\${esc(pkg.name)} — Sub-skills (\${pkg.subSkillNames.length})</div>
                    <div style="padding:14px 18px;display:flex;flex-wrap:wrap;gap:8px">
                      \${pkg.subSkillNames.map(n => \`<span class="tag tag-blue">\${esc(n)}</span>\`).join('')}
                    </div>
                  </div>\`;
                }
              }
            }

            if (singles.length) {
              html += \`<div class="table-wrap">
                <div class="table-title">Skills (\${singles.length})</div>
                <table>
                  <tr><th>Name</th><th>Type</th></tr>
                  \${singles.map(s => \`<tr>
                    <td>\${esc(s.name)}</td>
                    <td><span class="tag tag-blue">\${esc(s.type)}</span></td>
                  </tr>\`).join('')}
                </table>
              </div>\`;
            }
          } else {
            html += '<div class="empty">No skills defined</div>';
          }
          break;
        }
        case 'plugins': {
          // Collect all plugin IDs from enabledPlugins (these use full id like "name@marketplace")
          const enabledProject = project.settings?.enabledPlugins ?? {};
          const enabledLocal = project.settingsLocal?.enabledPlugins ?? {};
          const allEnabledIds = [...new Set([...Object.keys(enabledProject), ...Object.keys(enabledLocal)])];

          // Also find plugins installed for this project from global installed_plugins.json
          const globalInstalled = appData.global.plugins.installed?.plugins ?? {};
          const projectInstalls = {};
          for (const [id, installs] of Object.entries(globalInstalled)) {
            for (const inst of installs) {
              if (inst.projectPath === project.path) {
                projectInstalls[id] = inst;
              }
            }
          }

          // Merge all unique plugin IDs (full "name@marketplace" format only)
          const allIds = [...new Set([...allEnabledIds, ...Object.keys(projectInstalls)])];

          if (allIds.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">Plugins (\${allIds.length})</div>
              <table>
                <tr><th>Plugin</th><th>Scope</th><th>Version</th><th>Status</th></tr>
                \${allIds.map(id => {
                  const inst = projectInstalls[id];
                  const isEnabledProject = enabledProject[id] === true;
                  const isEnabledLocal = enabledLocal[id] === true;
                  const enabled = isEnabledProject || isEnabledLocal;
                  const scope = isEnabledLocal ? 'local' : isEnabledProject ? 'project' : (inst?.scope || '-');
                  const scopeColor = scope === 'local' ? 'orange' : scope === 'project' ? 'blue' : 'purple';
                  const manifest = appData.global.plugins.manifests?.[id];
                  const version = inst?.version || manifest?.version || '-';
                  return \`<tr>
                    <td>
                      <div>\${esc(id.split('@')[0])}</div>
                      <div style="font-size:11px;color:var(--text-dim)">\${esc(id.split('@')[1] || '')}</div>
                    </td>
                    <td><span class="tag tag-\${scopeColor}">\${esc(scope)}</span></td>
                    <td style="font-family:monospace;font-size:12px">\${esc(version)}</td>
                    <td><span class="tag tag-\${enabled ? 'green' : 'red'}">\${enabled ? 'ON' : 'OFF'}</span></td>
                  </tr>\`;
                }).join('')}
              </table>
            </div>\`;
          } else {
            html += '<div class="empty">No plugins</div>';
          }
          break;
        }
        case 'hooks': {
          const hooks = project.hooks || [];
          if (hooks.length) {
            // Group by command
            const cmdMap = {};
            for (const h of hooks) {
              const cmd = h.command || 'unknown';
              if (!cmdMap[cmd]) cmdMap[cmd] = [];
              cmdMap[cmd].push(h);
            }
            const selectedProjHook = window._selectedProjHook || null;

            html += \`<div class="agent-cards" style="margin-bottom:20px">
              \${Object.entries(cmdMap).map(([cmd, items]) => {
                const scriptName = cmd.split('/').pop() || cmd;
                const isSelected = selectedProjHook === cmd;
                return \`<div class="agent-card proj-hook-card" data-hook-cmd="\${esc(cmd)}" style="cursor:pointer;\${isSelected ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
                  <h3 style="font-size:13px;font-family:monospace">\${esc(scriptName)}</h3>
                  <p style="font-size:11px;color:var(--text-dim);font-family:monospace;margin-bottom:10px">\${esc(cmd)}</p>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">
                    \${items.map(h => {
                      const scopeColor = h.scope === 'local' ? 'orange' : 'blue';
                      return \`<span class="tag tag-purple">\${esc(h.event)}</span><span class="tag tag-\${scopeColor}">\${esc(h.scope)}</span>\`;
                    }).join('')}
                  </div>
                </div>\`;
              }).join('')}
            </div>\`;

            if (selectedProjHook && cmdMap[selectedProjHook]) {
              html += \`<div class="table-wrap" style="border-color:var(--accent)">
                <div class="table-title">Configuration</div>
                <table>
                  <tr><th>Event</th><th>Matcher</th><th>Type</th><th>Scope</th><th>Command</th></tr>
                  \${cmdMap[selectedProjHook].map(h => {
                    const scopeColor = h.scope === 'local' ? 'orange' : 'blue';
                    return \`<tr>
                      <td><span class="tag tag-purple">\${esc(h.event)}</span></td>
                      <td style="font-family:monospace;font-size:12px">\${esc(h.matcher)}</td>
                      <td><span class="tag tag-blue">\${esc(h.type || '-')}</span></td>
                      <td><span class="tag tag-\${scopeColor}">\${esc(h.scope)}</span></td>
                      <td style="font-family:monospace;font-size:12px">\${esc(h.command || '-')}</td>
                    </tr>\`;
                  }).join('')}
                </table>
              </div>\`;
            }
          } else {
            html += '<div class="empty">No hooks configured</div>';
          }
          break;
        }
        case 'mcp': {
          const mcpServers = project.mcp || [];
          if (mcpServers.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">MCP Servers (\${mcpServers.length})</div>
              <table>
                <tr><th>Name</th><th>Command / URL</th><th>Scope</th></tr>
                \${mcpServers.map(s => {
                  const cmdOrUrl = s.command || s.url || '-';
                  const scopeColor = s.scope === 'project' ? 'blue' : s.scope === '.mcp.json' ? 'green' : 'orange';
                  return \`<tr>
                    <td>\${esc(s.name)}</td>
                    <td style="font-family:monospace;font-size:12px">\${esc(cmdOrUrl)}\${s.args?.length ? ' ' + esc(s.args.join(' ')) : ''}</td>
                    <td><span class="tag tag-\${scopeColor}">\${esc(s.scope)}</span></td>
                  </tr>\`;
                }).join('')}
              </table>
            </div>\`;

            // Show env vars for all servers that have them
            const serversWithEnv = mcpServers.filter(s => s.env && Object.keys(s.env).length);
            if (serversWithEnv.length) {
              html += \`<div class="table-wrap">
                <div class="table-title">Environment Variables</div>
                <table>
                  <tr><th>Server</th><th>Key</th><th>Value</th></tr>
                  \${serversWithEnv.flatMap(s =>
                    Object.entries(s.env).map(([k, v]) => \`<tr>
                      <td>\${esc(s.name)}</td>
                      <td style="font-family:monospace;font-size:12px">\${esc(k)}</td>
                      <td style="font-family:monospace;font-size:12px">\${esc(typeof v === 'string' && v.length > 30 ? v.slice(0, 30) + '...' : String(v))}</td>
                    </tr>\`)
                  ).join('')}
                </table>
              </div>\`;
            }
          } else {
            html += '<div class="empty">No MCP servers configured</div>';
          }
          break;
        }
        case 'commands': {
          if (project.commands.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">Commands (\${project.commands.length})</div>
              <table>
                <tr><th>Name</th><th>File</th></tr>
                \${project.commands.map(c => \`<tr>
                  <td>\${esc(c.name)}</td>
                  <td style="font-family:monospace;font-size:12px">\${esc(c.filename)}</td>
                </tr>\`).join('')}
              </table>
            </div>\`;
          } else {
            html += '<div class="empty">No commands defined</div>';
          }
          break;
        }
      }

      return html;
    }

    // --- Helpers ---
    function renderPluginTable(title, pluginsObj) {
      if (!pluginsObj) return '';
      const entries = Object.entries(pluginsObj);
      if (!entries.length) return '';

      const rows = entries.flatMap(([id, installs]) =>
        installs.map(inst => ({ id, ...inst }))
      );

      return \`<div class="table-wrap">
        <div class="table-title">\${esc(title)} (\${rows.length})</div>
        <table>
          <tr><th>Plugin</th><th>Scope</th><th>Project</th><th>Version</th><th>Installed</th></tr>
          \${rows.map(r => {
            const scopeColor = r.scope === 'user' ? 'purple' : r.scope === 'project' ? 'blue' : 'orange';
            const scopeTip = r.scope === 'user'
              ? 'Applies to all projects on this machine (~/.claude/settings.json)'
              : r.scope === 'project'
                ? 'Shared with team via git (.claude/settings.json)'
                : 'Only on your machine, git-ignored (.claude/settings.local.json)';
            const projectName = r.projectPath ? r.projectPath.split('/').pop() : (r.scope === 'user' ? 'All projects' : '-');
            return \`<tr>
              <td>\${esc(r.id)}</td>
              <td><span class="tag tag-\${scopeColor}">\${esc(r.scope)}</span></td>
              <td>\${esc(projectName)}</td>
              <td style="font-family:monospace;font-size:12px">\${esc(r.version || '-')}</td>
              <td>\${r.installedAt ? new Date(r.installedAt).toLocaleDateString() : '-'}</td>
            </tr>\`;
          }).join('')}
        </table>
      </div>\`;
    }

    function jsonToHTML(obj, indent = 0) {
      if (obj === null) return '<span class="json-null">null</span>';
      if (typeof obj === 'boolean') return \`<span class="json-bool">\${obj}</span>\`;
      if (typeof obj === 'number') return \`<span class="json-number">\${obj}</span>\`;
      if (typeof obj === 'string') return \`<span class="json-string">"\${esc(obj)}"</span>\`;

      const pad = '  '.repeat(indent);
      const padInner = '  '.repeat(indent + 1);

      if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        const items = obj.map(v => padInner + jsonToHTML(v, indent + 1)).join(',\\n');
        return \`[\\n\${items}\\n\${pad}]\`;
      }

      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const items = keys.map(k =>
        \`\${padInner}<span class="json-key">"\${esc(k)}"</span>: \${jsonToHTML(obj[k], indent + 1)}\`
      ).join(',\\n');
      return \`{\\n\${items}\\n\${pad}}\`;
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 3000);
    }

    function esc(str) {
      if (typeof str !== 'string') return String(str ?? '');
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // --- Routing (History API) ---
    // Routes:
    //   /overview
    //   /global/settings
    //   /global/plugins
    //   /global/hooks
    //   /project/<encodedPath>
    //   /project/<encodedPath>/<tab>

    function buildPath(view, params = {}) {
      if (view === 'project' && params.path) {
        const encoded = encodeURIComponent(params.path);
        return params.tab && params.tab !== 'settings'
          ? \`/project/\${encoded}/\${params.tab}\`
          : \`/project/\${encoded}\`;
      }
      if (view === 'global') {
        const tab = params.tab || 'plugins';
        return tab === 'plugins' ? '/global' : \`/global/\${tab}\`;
      }
      const map = {
        'overview': '/overview',
        'all-plugins': '/all/plugins',
        'all-hooks': '/all/hooks',
        'all-mcp': '/all/mcp',
      };
      return map[view] || '/overview';
    }

    function parsePath() {
      const path = location.pathname === '/' ? '/overview' : location.pathname;
      const parts = path.slice(1).split('/'); // remove leading "/"

      if (parts[0] === 'global') {
        return { view: 'global', tab: parts[1] || 'plugins' };
      }
      if (parts[0] === 'all') {
        return { view: \`all-\${parts[1] || 'plugins'}\` };
      }
      if (parts[0] === 'project' && parts[1]) {
        return {
          view: 'project',
          path: decodeURIComponent(parts[1]),
          tab: parts[2] || 'plugins',
        };
      }
      return { view: parts[0] || 'overview' };
    }

    function navigate(view, params = {}) {
      currentView = view;
      window._projectPath = params.path || null;
      window._projectTab = params.tab || 'plugins';
      window._globalTab = params.tab || 'plugins';

      const newPath = buildPath(view, params);
      if (location.pathname !== newPath) {
        history.pushState(null, '', newPath);
      }

      // Update active sidebar item
      document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.toggle('active',
          el.dataset.view === view &&
          (!params.path || el.dataset.path === encodeURIComponent(params.path))
        );
      });

      const content = document.getElementById('content');
      switch (view) {
        case 'overview': content.innerHTML = renderOverview(); break;
        case 'global': content.innerHTML = renderGlobal(); break;
        case 'all-plugins': content.innerHTML = renderAllPlugins(); break;
        case 'all-hooks': content.innerHTML = renderAllHooks(); break;
        case 'all-mcp': content.innerHTML = renderAllMcp(); break;
        case 'project': content.innerHTML = renderProject(params.path); break;
        default: content.innerHTML = renderOverview();
      }
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const { view, path, tab } = parsePath();
      navigate(view, { path, tab });
    });

    // --- Events ---
    document.getElementById('sidebar').addEventListener('click', (e) => {
      // Group folder toggle
      const groupHeader = e.target.closest('.sidebar-group-header');
      if (groupHeader) {
        const groupId = groupHeader.dataset.group;
        const items = document.getElementById(groupId);
        const arrow = groupHeader.querySelector('.group-arrow');
        if (items) {
          const collapsed = items.style.display === 'none';
          items.style.display = collapsed ? '' : 'none';
          arrow.style.transform = collapsed ? '' : 'rotate(-90deg)';
        }
        return;
      }

      const item = e.target.closest('.sidebar-item');
      if (!item) return;

      const view = item.dataset.view;
      if (view === 'project') {
        navigate('project', { path: decodeURIComponent(item.dataset.path) });
      } else {
        navigate(view);
      }
    });

    document.getElementById('content').addEventListener('click', async (e) => {
      // Tab clicks
      const tab = e.target.closest('.tab');
      if (tab) {
        const tabName = tab.dataset.tab || tab.dataset.globalTab;
        if (tab.dataset.globalTab) {
          navigate('global', { tab: tab.dataset.globalTab });
          return;
        }
        if (window._projectPath) {
          navigate('project', { path: window._projectPath, tab: tabName });
          return;
        }
      }

      // Hook raw toggle
      const rawBtn = e.target.closest('.hook-raw-btn');
      if (rawBtn) {
        const panel = document.querySelector('.hook-raw-panel');
        const table = panel?.previousElementSibling;
        if (panel && table) {
          const showRaw = panel.style.display === 'none';
          panel.style.display = showRaw ? 'block' : 'none';
          table.style.display = showRaw ? 'none' : 'block';
        }
        return;
      }

      // Hook card clicks
      const hookCard = e.target.closest('.hook-card');
      if (hookCard) {
        const cmd = hookCard.dataset.hookCmd;
        window._selectedHook = window._selectedHook === cmd ? null : cmd;
        navigate('global-hooks');
        return;
      }

      // MCP card clicks
      const mcpCard = e.target.closest('.mcp-card');
      if (mcpCard) {
        const key = mcpCard.dataset.mcpKey;
        window._selectedMcp = window._selectedMcp === key ? null : key;
        navigate(currentView);
        return;
      }

      // Skill package card clicks
      const skillPkgCard = e.target.closest('.skill-pkg-card');
      if (skillPkgCard) {
        const pkg = skillPkgCard.dataset.pkg;
        window._selectedSkillPkg = window._selectedSkillPkg === pkg ? null : pkg;
        navigate('project', { path: window._projectPath, tab: 'skills' });
        return;
      }

      // Project hook card clicks
      const projHookCard = e.target.closest('.proj-hook-card');
      if (projHookCard) {
        const cmd = projHookCard.dataset.hookCmd;
        window._selectedProjHook = window._selectedProjHook === cmd ? null : cmd;
        navigate('project', { path: window._projectPath, tab: 'hooks' });
        return;
      }

      // Plugin card clicks
      const pluginCard = e.target.closest('.plugin-card');
      if (pluginCard) {
        const id = pluginCard.dataset.pluginId;
        window._selectedPlugin = window._selectedPlugin === id ? null : id;
        navigate(currentView);
        return;
      }

      // Toggle plugin switch
      const toggleSwitch = e.target.closest('.toggle-plugin-btn');
      if (toggleSwitch) {
        e.preventDefault();
        const pluginId = toggleSwitch.dataset.plugin;
        const scope = toggleSwitch.dataset.scope;
        const projectPath = toggleSwitch.dataset.project;
        const currentlyEnabled = toggleSwitch.dataset.enabled === 'true';

        toggleSwitch.style.opacity = '0.5';
        toggleSwitch.style.pointerEvents = 'none';

        await fetch('/api/plugins/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pluginId, scope, projectPath,
            enabled: !currentlyEnabled,
          }),
        });

        await fetchOverview();
        navigate(currentView);
        showToast(\`\${!currentlyEnabled ? '활성화' : '비활성화'}됨 — 다음 Claude Code 세션부터 적용돼요\`);
        return;
      }
    });

    document.getElementById('rescan-btn').addEventListener('click', async () => {
      const btn = document.getElementById('rescan-btn');
      btn.textContent = 'Scanning...';
      btn.disabled = true;
      await fetch('/api/rescan', { method: 'POST' });
      await fetchOverview();
      renderSidebar();
      navigate(currentView, { path: window._projectPath, tab: window._projectTab });
      btn.textContent = 'Rescan';
      btn.disabled = false;
    });

    // --- Init ---
    (async () => {
      await fetchOverview();
      renderSidebar();
      const { view, path, tab } = parsePath();
      navigate(view, { path, tab });
    })();
  </script>
</body>
</html>`;
}
