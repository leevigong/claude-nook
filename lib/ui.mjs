export function generateHTML(version = '0.0.0') {
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
      --gray: #6b7280;
      --gray-soft: rgba(107, 114, 128, 0.1);
      --teal: #0d9488;
      --teal-soft: rgba(13, 148, 136, 0.1);
      --pink: #db2777;
      --pink-soft: rgba(219, 39, 119, 0.1);
      --yellow: #ca8a04;
      --yellow-soft: rgba(202, 138, 4, 0.1);
      --slate: #475569;
      --slate-soft: rgba(71, 85, 105, 0.1);
      --cyan: #0891b2;
      --cyan-soft: rgba(8, 145, 178, 0.1);
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
    .tag-gray { background: var(--gray-soft); color: var(--gray); }
    .tag-teal { background: var(--teal-soft); color: var(--teal); }
    .tag-yellow { background: var(--yellow-soft); color: var(--yellow); }
    .tag-pink { background: var(--pink-soft); color: var(--pink); }

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
      pointer-events: auto;
    }
    .toast.sticky {
      padding-right: 36px;
      white-space: pre-wrap;
      max-width: 560px;
    }
    .toast-close {
      position: absolute;
      top: 6px;
      right: 8px;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 16px;
      cursor: pointer;
      line-height: 1;
      padding: 2px 6px;
    }
    .toast-close:hover { color: var(--text); }
    @keyframes toast-pulse {
      0% { transform: translateY(0) scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      50% { transform: translateY(0) scale(1.04); box-shadow: 0 6px 20px rgba(239,68,68,0.35); }
      100% { transform: translateY(0) scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    }
    .toast.pulse { animation: toast-pulse 0.45s ease; }

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
    @keyframes badge-glow {
      0%,100% { box-shadow:0 0 12px rgba(124,58,237,0.4); }
      50% { box-shadow:0 0 20px rgba(168,85,247,0.6); }
    }
    #update-badge:hover {
      transform: scale(1.05);
      box-shadow: 0 0 24px rgba(168,85,247,0.7) !important;
    }
    .hook-event-ref summary::-webkit-details-marker { display: none; }
    .hook-event-ref[open] .hook-ref-chevron { transform: rotate(90deg); }
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="header-left">
        <div class="logo">claude-<span>nook</span></div>
        <span class="version">v${version}</span>
        <span id="update-badge" style="display:none;margin-left:10px;padding:5px 14px;font-size:12px;font-weight:700;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border-radius:14px;cursor:pointer;box-shadow:0 0 12px rgba(124,58,237,0.4);animation:badge-glow 2s ease-in-out infinite;transition:transform 0.15s,box-shadow 0.15s" title="클릭하여 업데이트"></span>
      </div>
      <button class="btn" id="rescan-btn">다시 스캔</button>
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
          <span class="icon plugin-icon-slot"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg></span> Plugins
        </div>
        <div class="sidebar-item" data-view="all-hooks">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="m2 22 3-3"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m18 3-4 4h6l-4 4"/></svg></span> Hooks
        </div>
        <div class="sidebar-item" data-view="all-mcp">
          <span class="icon mcp-icon-slot"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"/><rect x="14" y="2" width="8" height="8" rx="1"/></svg></span> MCP Servers
        </div>
        <div class="sidebar-item" data-view="all-permissions">
          <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> Permissions
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-label">Global</div>
      <div class="sidebar-section">
        <div class="sidebar-item" data-view="global" style="display:flex;align-items:center;gap:8px;color:var(--text-dim);font-size:12px;font-weight:600;padding:8px 12px">
          <span style="font-size:14px">&#127760;</span> User
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
    let csrfToken = '';

    async function fetchCsrfToken() {
      try {
        const res = await fetch('/api/csrf');
        const json = await res.json();
        if (json.ok) csrfToken = json.data.token;
      } catch {}
    }

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
          html += \`<div class="sidebar-section"><div class="sidebar-group-header" style="display:flex;align-items:center;gap:8px;color:var(--text-dim);font-size:12px;font-weight:600;padding:8px 12px;user-select:none;border-radius:var(--radius-sm)">
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
            html += \`<div class="sidebar-item" data-view="project" data-path="\${encodeURIComponent(p.path)}" style="display:flex;align-items:center;gap:8px;color:var(--text-dim);font-size:12px;font-weight:600;padding:8px 12px">
              <span style="font-size:14px">&#128193;</span>
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
      const tabs = ['plugins', 'hooks', 'permissions', 'mcp', 'raw'];
      const activeTab = window._globalTab || 'plugins';

      let html = \`<div class="page-title">User</div>
        <div style="font-size:12px;color:var(--text-dim);margin:-14px 0 18px;font-family:monospace">~/.claude/</div>
        <div class="tabs">\${tabs.map(t =>
          \`<div class="tab \${t === activeTab ? 'active' : ''}" data-global-tab="\${t}" \${t === 'raw' ? 'style="margin-left:auto;font-size:12px;color:var(--text-dim)"' : ''}>\${t === 'raw' ? 'View raw' : t === 'mcp' ? 'MCP Servers' : t.charAt(0).toUpperCase() + t.slice(1)}</div>\`
        ).join('')}</div>\`;

      switch (activeTab) {
        case 'plugins': html += renderGlobalPlugins(); break;
        case 'hooks': html += renderGlobalHooks(); break;
        case 'permissions': html += renderPermissions([
          { scope: 'user', settings: appData.global.settings },
        ]); break;
        case 'mcp': html += renderGlobalMcp(); break;
        case 'raw': {
          const settings = appData.global.settings;
          if (settings) {
            html += '<div class="table-wrap"><div class="table-title">settings.json</div>';
            html += \`<div class="json-tree">\${jsonToHTML(settings)}</div></div>\`;
          } else {
            html += '<div class="empty">No settings file</div>';
          }
          break;
        }
      }
      return html;
    }

    function renderPluginView(title, filterScope, showTitle = true, showToggle = true) {
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
      if (pluginIds.length === 0) {
        html += '<div class="empty">No plugins configured</div>';
        return html;
      }
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
              <span class="tag tag-green">\${installCount} install\${installCount > 1 ? 's' : ''}</span>
              \${p.manifest?.version ? \`<span class="tag tag-gray">v\${esc(p.manifest.version)}</span>\` : ''}
              \${p.manifest?.skills?.length ? \`<span class="tag tag-pink">\${p.manifest.skills.length} skills</span>\` : ''}
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
            <colgroup><col style="width:110px"><col><col style="width:140px"><col style="width:100px"></colgroup>
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
                  \${showToggle ? \`<label class="toggle-switch toggle-plugin-btn"
                    data-plugin="\${esc(selectedPlugin)}"
                    data-scope="\${esc(inst.scope)}"
                    data-project="\${esc(inst.projectPath || '')}"
                    data-enabled="\${isEnabled ? 'true' : 'false'}">
                    <input type="checkbox" \${isEnabled ? 'checked' : ''}>
                    <span class="toggle-track"></span>
                  </label>\` : \`<span class="tag tag-\${isEnabled ? 'green' : 'red'}">\${isEnabled ? 'ON' : 'OFF'}</span>\`}
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
              \${selSkills.map(s => \`<span class="tag tag-pink">\${esc(s)}</span>\`).join('')}
            </div>
          </div>\`;
        }
      }

      return html;
    }

    function renderGlobalPlugins() { return renderPluginView('Global Plugins', 'user', false, false); }
    function renderAllPlugins() { return renderPluginView('All Plugins', null, true, true); }

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

      // Flatten hooks: one row per (event, matcher, hook) tuple
      const items = [];
      for (const [event, matchers] of events) {
        for (const matcher of matchers) {
          for (const hook of (matcher.hooks || [])) {
            items.push({
              event,
              matcher: matcher.matcher || '',
              type: hook.type || '-',
              command: hook.command || '-',
            });
          }
        }
      }

      if (items.length) {
        html += \`<div class="table-wrap">
          <div class="table-title">Hooks (\${items.length})</div>
          <table>
            <tr><th style="width:130px">Event</th><th style="width:120px">Matcher</th><th style="width:90px">Type</th><th>Command</th></tr>
            \${items.map(h => \`<tr>
              <td><span class="tag tag-teal" title="\${esc(HOOK_EVENT_DESCRIPTIONS[h.event] || '')}">\${esc(h.event)}</span></td>
              <td style="font-family:monospace;font-size:12px;color:var(--text-muted)">\${h.matcher ? esc(h.matcher) : '<span style="color:var(--text-dim)">—</span>'}</td>
              <td><span class="tag tag-gray">\${esc(h.type)}</span></td>
              <td style="font-family:monospace;font-size:12px;word-break:break-all;white-space:pre-wrap;line-height:1.5">\${esc(h.command)}</td>
            </tr>\`).join('')}
          </table>
        </div>\`;
      }

      if (!items.length && !hooks.files.length) {
        html += '<div class="empty">No hooks configured</div>';
      }

      if (hooks.files.length) {
        html += \`<div class="table-wrap" style="margin-top:14px">
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

    // Known-prefix credential patterns. Prefix-based to keep false positives low —
    // we'd rather miss an exotic format than light up every random hex string.
    const SECRET_PATTERNS = [
      { name: 'OpenAI API key',          regex: /sk-proj-[A-Za-z0-9_-]{20,}/ },
      { name: 'Anthropic API key',       regex: /sk-ant-api\\d{2}-[A-Za-z0-9_-]{20,}/ },
      { name: 'OpenAI API key (legacy)', regex: /\\bsk-[A-Za-z0-9]{40,}\\b/ },
      { name: 'GitHub token',            regex: /\\bgh[pousr]_[A-Za-z0-9]{30,}\\b/ },
      { name: 'AWS access key ID',       regex: /\\bAKIA[0-9A-Z]{16}\\b/ },
      { name: 'Google API key',          regex: /\\bAIza[0-9A-Za-z_-]{35}\\b/ },
      { name: 'Slack token',             regex: /\\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
      { name: 'Stripe secret key',       regex: /\\bsk_(?:live|test)_[A-Za-z0-9]{24,}/ },
      { name: 'SendGrid API key',        regex: /\\bSG\\.[A-Za-z0-9_-]{22}\\.[A-Za-z0-9_-]{43}\\b/ },
    ];

    // Walk every permission rule in the given sources and flag any that contain
    // a known credential prefix. Returns [{ kind, match, rule, scope, project, policy }, ...].
    function scanForSecrets(sources) {
      const findings = [];
      for (const src of (sources || [])) {
        const perms = src.settings && src.settings.permissions;
        if (!perms) continue;
        for (const policy of ['allow', 'deny', 'ask']) {
          const rules = perms[policy];
          if (!Array.isArray(rules)) continue;
          for (const rule of rules) {
            if (typeof rule !== 'string') continue;
            for (const pat of SECRET_PATTERNS) {
              const m = rule.match(pat.regex);
              if (m) {
                findings.push({
                  kind: pat.name,
                  match: m[0],
                  rule,
                  scope: src.scope,
                  project: src.project || '',
                  policy,
                });
                break;
              }
            }
          }
        }
      }
      return findings;
    }

    // Mask a credential for display: keep enough context to identify provider/key
    // without re-amplifying the leak in log exports or screen shares.
    function maskSecret(s) {
      if (!s) return '';
      if (s.length <= 16) return s.slice(0, 4) + '…';
      return s.slice(0, 12) + '…' + s.slice(-4);
    }

    // Shared Permissions renderer.
    //   sources: [{ scope: 'user'|'project'|'local', settings, project? }, ...]
    //   opts.includeProject — show the "Project" column (true for All Permissions view)
    // Rules are grouped by policy (deny/ask/allow) and rendered in evaluation order.
    function renderPermissions(sources, opts = {}) {
      const includeProject = !!opts.includeProject;

      const buckets = { deny: [], ask: [], allow: [] };
      for (const src of (sources || [])) {
        const perms = src.settings && src.settings.permissions;
        if (!perms) continue;
        for (const policy of ['deny', 'ask', 'allow']) {
          const rules = perms[policy];
          if (!Array.isArray(rules)) continue;
          for (const rule of rules) {
            if (typeof rule !== 'string') continue;
            buckets[policy].push({ rule, scope: src.scope, project: src.project || '' });
          }
        }
      }

      const grand = buckets.deny.length + buckets.ask.length + buckets.allow.length;
      if (grand === 0) {
        return '<div class="empty">No permissions configured</div>';
      }

      const scopeColor = {
        'user': 'purple',
        'project': 'blue',
        'local': 'orange',
      };
      const scopeTag = (scope) =>
        \`<span class="tag tag-\${scopeColor[scope] || 'gray'}">\${esc(scope)}</span>\`;

      const policyMeta = {
        deny:  { label: 'Deny',  hint: '차단 — deny→ask→allow 순서로 평가됨' },
        ask:   { label: 'Ask',   hint: '사용자에게 확인' },
        allow: { label: 'Allow', hint: '자동 승인' },
      };

      const colHead = includeProject
        ? '<tr><th>Rule</th><th style="width:110px">Scope</th><th style="width:140px">Project</th></tr>'
        : '<tr><th>Rule</th><th style="width:110px">Scope</th></tr>';

      // Scan up-front so sectionHTML can flag the compromised rows inline.
      const secrets = scanForSecrets(sources);

      // Map: rule (original) -> masked display version (secret substring replaced
      // with sk-proj-y7QL…OL0A style). Rules not in the map are rendered as-is.
      const maskedDisplayByRule = new Map();
      for (const f of secrets) {
        const prev = maskedDisplayByRule.get(f.rule) || f.rule;
        maskedDisplayByRule.set(f.rule, prev.split(f.match).join(maskSecret(f.match)));
      }

      // Truncate for display. Keep full text in the title attribute, unless the rule
      // is flagged — then title uses the masked version too, so hovering doesn't re-leak.
      const truncateForDisplay = (s) => (s.length > 100 ? s.slice(0, 80) + '…' : s);

      const sectionHTML = (policy) => {
        const items = buckets[policy];
        if (!items.length) return '';
        const { label, hint } = policyMeta[policy];
        return \`<div class="table-wrap perm-section" data-policy="\${policy}" style="margin-bottom:16px">
          <div class="table-title" style="display:flex;align-items:baseline;gap:10px">
            <span>\${esc(label)} (\${items.length})</span>
            <span style="font-size:11px;font-weight:500;color:var(--text-dim)">\${esc(hint)}</span>
          </div>
          <table>
            \${colHead}
            \${items.map(r => {
              const isDanger = maskedDisplayByRule.has(r.rule);
              const safeFull = isDanger ? maskedDisplayByRule.get(r.rule) : r.rule;
              const display = truncateForDisplay(safeFull);
              // Background tint applied to every cell; left accent bar only on the first
              // cell to avoid a "framed box" look from per-cell inset box-shadows.
              const cellBg       = isDanger ? 'background:rgba(220,38,38,0.07);' : '';
              const firstCellAcc = isDanger ? 'box-shadow:inset 3px 0 0 #dc2626;' : '';
              const ruleColor    = isDanger ? 'color:#dc2626;font-weight:600;' : '';
              const projColor    = isDanger ? 'color:#dc2626;' : 'color:var(--text-muted);';
              return \`<tr class="perm-row\${isDanger ? ' perm-row-danger' : ''}" data-rule="\${esc(r.rule.toLowerCase())}" data-project="\${esc((r.project || '').toLowerCase())}">
                <td style="\${cellBg}\${firstCellAcc}font-family:monospace;font-size:12px;word-break:break-all;\${ruleColor}" title="\${esc(safeFull)}">\${esc(display)}</td>
                <td style="\${cellBg}">\${isDanger ? \`<span class="tag tag-red">\${esc(r.scope)}</span>\` : scopeTag(r.scope)}</td>
                \${includeProject ? \`<td style="\${cellBg}font-size:12px;\${projColor}">\${esc(r.project || '')}</td>\` : ''}
              </tr>\`;
            }).join('')}
          </table>
        </div>\`;
      };

      let html = '';

      // Secret leak warning banner — tinted header + red row cells make it read as alert.
      if (secrets.length > 0) {
        html += \`<div class="secret-banner" style="border:1px solid #dc2626;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:18px;overflow:hidden;box-shadow:0 0 0 3px rgba(220,38,38,0.08)">
          <div style="padding:14px 18px;display:flex;align-items:center;gap:12px;background:rgba(220,38,38,0.1);border-bottom:1px solid rgba(220,38,38,0.3)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style="font-weight:700;font-size:14px;color:#dc2626;letter-spacing:-0.01em">API 키/토큰 감지됨</span>
            <span style="font-size:11px;color:#fff;font-weight:700;background:#dc2626;padding:2px 9px;border-radius:10px;min-width:18px;text-align:center">\${secrets.length}</span>
            <span style="margin-left:auto;font-size:12px;color:#991b1b;font-weight:500">즉시 rotate 후 settings 파일에서 해당 규칙 삭제 필요</span>
          </div>
          <table style="margin:0;border:none">
            <tr><th style="width:140px">Type</th><th>Rule</th><th style="width:110px">Scope</th><th style="width:140px">Project</th></tr>
            \${secrets.map(f => {
              const maskedRule = (maskedDisplayByRule.get(f.rule) || f.rule);
              const shortRule = maskedRule.length > 140 ? maskedRule.slice(0, 120) + '…' : maskedRule;
              return \`<tr>
                <td style="background:rgba(220,38,38,0.05);box-shadow:inset 3px 0 0 #dc2626;font-size:12px;color:#dc2626;font-weight:600">\${esc(f.kind)}</td>
                <td style="background:rgba(220,38,38,0.05);font-family:monospace;font-size:11px;color:#dc2626;font-weight:600;word-break:break-all" title="\${esc(maskedRule)}">\${esc(shortRule)}</td>
                <td style="background:rgba(220,38,38,0.05)"><span class="tag tag-red" style="font-weight:600">\${esc(f.scope)}</span></td>
                <td style="background:rgba(220,38,38,0.05);font-size:12px;color:#dc2626;font-weight:500">\${esc(f.project || '—')}</td>
              </tr>\`;
            }).join('')}
          </table>
        </div>\`;
      }

      html += sectionHTML('deny');
      html += sectionHTML('ask');
      html += sectionHTML('allow');
      return html;
    }

    function renderMcpView(title, globalOnly, showTitle = true) {
      const allServers = [];
      for (const s of (appData.global.mcp || [])) {
        allServers.push({ ...s, project: 'All projects' });
      }
      if (!globalOnly) {
        for (const p of appData.projects) {
          for (const s of (p.mcp || [])) {
            allServers.push({ ...s, project: p.name });
          }
        }
      }

      const selectedMcp = window._selectedMcp || null;

      // Group servers by name (like plugins)
      const serverMap = {};
      for (const s of allServers) {
        if (!serverMap[s.name]) serverMap[s.name] = [];
        const scopeLabel = s.scope === 'global' ? 'user'
          : s.scope === '.mcp.json' ? 'project'
          : s.scope || 'local';
        serverMap[s.name].push({ ...s, scopeLabel });
      }

      let html = showTitle ? \`<div class="page-title">\${esc(title)}</div>\` : '';

      if (!allServers.length) {
        return html + '<div class="empty">No MCP servers configured</div>';
      }

      const serverNames = Object.keys(serverMap);
      html += \`<div class="agent-cards" style="margin-bottom:20px">
        \${serverNames.map(name => {
          const instances = serverMap[name];
          const isSelected = selectedMcp === name;
          const installCount = instances.length;
          const cmdOrUrl = instances[0].command || instances[0].url || '';
          return \`<div class="agent-card mcp-card\${isSelected ? ' selected' : ''}" data-mcp-key="\${esc(name)}" style="cursor:pointer;\${isSelected ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <h3>\${esc(name)}</h3>
            </div>
            <p style="font-family:monospace;font-size:11px;color:var(--text-dim);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(cmdOrUrl.length > 60 ? cmdOrUrl.slice(0, 60) + '...' : cmdOrUrl) || '<span style="color:var(--text-dim)">No command</span>'}</p>
            <div class="agent-meta">
              <span class="tag tag-green">\${installCount} project\${installCount > 1 ? 's' : ''}</span>
            </div>
          </div>\`;
        }).join('')}
      </div>\`;

      if (selectedMcp && serverMap[selectedMcp]) {
        const instances = serverMap[selectedMcp];

        html += \`<div class="table-wrap" style="border-color:var(--accent)">
          <div class="table-title">Usage</div>
          <table>
            <tr><th>Scope</th><th>Project</th><th>Type</th><th>Command / URL</th></tr>
            \${instances.map(s => {
              const scopeColor = s.scopeLabel === 'user' ? 'purple' : s.scopeLabel === 'project' ? 'blue' : 'orange';
              const connType = s.command ? 'stdio' : s.url ? 'sse' : '-';
              const connValue = s.command || s.url || '-';
              return \`<tr>
                <td><span class="tag tag-\${scopeColor}">\${esc(s.scopeLabel)}</span></td>
                <td>\${esc(s.project)}</td>
                <td><span class="tag tag-green">\${esc(connType)}</span></td>
                <td style="font-family:monospace;font-size:12px">\${esc(connValue)}</td>
              </tr>\`;
            }).join('')}
          </table>
        </div>\`;

      }

      return html;
    }

    const HOOK_EVENT_CATEGORIES = [
      {
        name: 'Session lifecycle',
        events: {
          SessionStart: '세션이 시작/재개될 때 — 환경 변수나 컨텍스트 로드용',
          SessionEnd: '세션이 종료될 때',
          InstructionsLoaded: 'CLAUDE.md 또는 .claude/rules/*.md가 로드될 때',
          ConfigChange: '세션 중 설정 파일이 변경됐을 때 (변경 차단 가능)',
          CwdChanged: '작업 디렉터리가 변경될 때',
          FileChanged: 'matcher에 지정한 파일이 디스크에서 변경될 때',
        },
      },
      {
        name: 'Prompt & response',
        events: {
          UserPromptSubmit: '사용자가 프롬프트 제출 직후, Claude가 처리하기 전',
          Stop: 'Claude 응답이 끝났을 때 (stop 차단 가능)',
          StopFailure: 'API 에러로 턴이 종료됐을 때',
          Notification: '권한 요청/idle 등 알림을 보낼 때',
        },
      },
      {
        name: 'Tool execution',
        events: {
          PreToolUse: 'tool 파라미터 생성 후 실행 직전 (allow/deny/ask/defer)',
          PostToolUse: 'tool 실행이 성공적으로 끝난 직후',
          PostToolUseFailure: 'tool 실행이 실패했을 때',
          PermissionRequest: '권한 다이얼로그가 뜰 때 (사용자 대신 응답 가능)',
          PermissionDenied: 'auto 모드 분류기가 tool 호출을 거부했을 때',
        },
      },
      {
        name: 'Subagents & tasks',
        events: {
          SubagentStart: '서브에이전트가 스폰될 때 (컨텍스트 주입 가능)',
          SubagentStop: '서브에이전트가 응답을 끝냈을 때',
          TeammateIdle: '팀 에이전트가 idle 상태가 되려 할 때',
          TaskCreated: 'TaskCreate tool로 task가 만들어질 때',
          TaskCompleted: 'task가 완료 표시될 때',
        },
      },
      {
        name: 'Context & worktree',
        events: {
          PreCompact: '컨텍스트 압축이 시작되기 전',
          PostCompact: '컨텍스트 압축이 끝난 후',
          WorktreeCreate: 'worktree가 생성될 때 (기본 git 동작 대체 가능)',
          WorktreeRemove: 'worktree가 제거될 때',
        },
      },
      {
        name: 'MCP elicitation',
        events: {
          Elicitation: 'MCP 서버가 tool 호출 중 사용자 입력을 요청할 때',
          ElicitationResult: '사용자가 elicitation에 응답한 직후',
        },
      },
    ];
    const HOOK_EVENT_DESCRIPTIONS = Object.fromEntries(
      HOOK_EVENT_CATEGORIES.flatMap(c => Object.entries(c.events))
    );

    function renderAllHooks() {
      let html = '<div class="page-title">All Hooks</div>';

      // Global hooks
      const globalEvents = Object.entries(appData.global.hooks.config);
      const allItems = [];
      for (const [event, matchers] of globalEvents) {
        for (const matcher of matchers) {
          for (const hook of (matcher.hooks || [])) {
            allItems.push({ event, matcher: matcher.matcher || '', command: hook.command || '-', type: hook.type || '-', scope: 'user', project: 'ALL' });
          }
        }
      }
      // Project hooks
      for (const p of appData.projects) {
        for (const h of (p.hooks || [])) {
          allItems.push({ ...h, matcher: h.matcher && h.matcher !== '*' ? h.matcher : '', project: p.name });
        }
      }

      if (!allItems.length) {
        return html + '<div class="empty">No hooks configured</div>';
      }

      const filtered = allItems;

      // Count how many configured hooks each event has
      const usageCount = {};
      for (const it of allItems) usageCount[it.event] = (usageCount[it.event] || 0) + 1;
      const usedTotal = Object.keys(usageCount).filter(k => HOOK_EVENT_DESCRIPTIONS[k]).length;
      const totalEvents = Object.keys(HOOK_EVENT_DESCRIPTIONS).length;

      const refOpen = window._hookEventRefOpen;
      html += \`<details class="hook-event-ref" \${refOpen ? 'open' : ''} style="margin-bottom:16px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg)">
        <summary style="cursor:pointer;padding:12px 16px;font-size:13px;font-weight:600;color:var(--text);user-select:none;display:flex;align-items:center;gap:10px;list-style:none">
          <span class="hook-ref-chevron" style="display:inline-block;transition:transform 0.15s;font-size:10px;color:var(--text-muted)">▶</span>
          <span>Event types</span>
          <span style="font-size:11px;font-weight:500;color:var(--text-muted)">\${usedTotal} used · \${totalEvents} total</span>
          <a href="https://code.claude.com/docs/en/hooks" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="margin-left:auto;font-size:11px;font-weight:500;color:var(--accent,#7c3aed);text-decoration:none">공식문서 ↗</a>
        </summary>
        <div style="padding:4px 16px 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:14px">
          \${HOOK_EVENT_CATEGORIES.map(cat => \`
            <div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;background:var(--bg-subtle,transparent)">
              <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-dim);margin-bottom:8px">\${esc(cat.name)}</div>
              \${Object.entries(cat.events).map(([ev, desc]) => {
                const count = usageCount[ev] || 0;
                const used = count > 0;
                const rowOpacity = used ? '1' : '0.55';
                const badge = used
                  ? \`<span class="tag tag-teal" style="flex-shrink:0">\${esc(ev)}</span>\`
                  : \`<span class="tag tag-gray" style="flex-shrink:0">\${esc(ev)}</span>\`;
                return \`<div style="display:flex;gap:8px;align-items:baseline;padding:5px 0;font-size:12px;opacity:\${rowOpacity}">
                  \${badge}
                  <span style="color:var(--text-muted);line-height:1.45">\${esc(desc)}</span>
                </div>\`;
              }).join('')}
            </div>\`).join('')}
        </div>
      </details>\`;

      html += \`<div class="table-wrap">
        <div class="table-title">Hooks (\${filtered.length})</div>
        <table>
          <tr><th style="width:130px">Event</th><th style="width:120px">Matcher</th><th>Command</th><th style="width:80px">Scope</th><th style="width:140px">Project</th></tr>
          \${filtered.map((h) => {
            const scopeColor = h.scope === 'user' ? 'purple' : h.scope === 'project' ? 'blue' : 'orange';
            const cmd = h.command || '-';
            return \`<tr>
              <td><span class="tag tag-teal" title="\${esc(HOOK_EVENT_DESCRIPTIONS[h.event] || '')}">\${esc(h.event)}</span></td>
              <td style="font-family:monospace;font-size:12px;color:var(--text-muted)">\${h.matcher ? esc(h.matcher) : '<span style="color:var(--text-dim)">—</span>'}</td>
              <td style="font-family:monospace;font-size:12px;word-break:break-all;white-space:pre-wrap;line-height:1.5">\${esc(cmd)}</td>
              <td><span class="tag tag-\${scopeColor}">\${esc(h.scope)}</span></td>
              <td>\${esc(h.project)}</td>
            </tr>\`;
          }).join('')}
        </table>
      </div>\`;

      return html;
    }

    function renderGlobalMcp() { return renderMcpView('Global MCP Servers', true, false); }

    function renderAllMcp() {
      return renderMcpView('All MCP Servers', false);
    }

    function renderAllPermissions() {
      const sources = [
        { scope: 'user', settings: appData.global.settings },
      ];
      for (const p of appData.projects) {
        sources.push({ scope: 'project', settings: p.settings,      project: p.name });
        sources.push({ scope: 'local',   settings: p.settingsLocal, project: p.name });
      }
      const body = renderPermissions(sources, { includeProject: true });
      return \`<div class="page-title">All Permissions</div>\${body}\`;
    }

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
          html += renderPermissions([
            { scope: 'project', settings: project.settings },
            { scope: 'local',   settings: project.settingsLocal },
          ]);
          break;
        }
        case 'agents': {
          if (project.agents.length) {
            html += \`<div class="agent-cards">
              \${project.agents.map(a => \`<div class="agent-card">
                <h3>\${esc(a.name)}</h3>
                <p>\${esc(a.description || 'No description')}</p>
                <div class="agent-meta">
                  \${a.model ? \`<span class="tag tag-gray">\${esc(a.model)}</span>\` : ''}
                  \${Array.isArray(a.tools) ? a.tools.map(t => \`<span class="tag tag-gray">\${esc(t)}</span>\`).join('') : ''}
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
                    <span class="tag tag-gray">package</span>
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
                      \${pkg.subSkillNames.map(n => \`<span class="tag tag-gray">\${esc(n)}</span>\`).join('')}
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
                    <td><span class="tag tag-gray">\${esc(s.type)}</span></td>
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
          const enabledUser = appData.global.settings?.enabledPlugins ?? {};
          const enabledProject = project.settings?.enabledPlugins ?? {};
          const enabledLocal = project.settingsLocal?.enabledPlugins ?? {};
          const allEnabledIds = [...new Set([...Object.keys(enabledUser), ...Object.keys(enabledProject), ...Object.keys(enabledLocal)])];

          // Also find plugins installed for this project from global installed_plugins.json
          const globalInstalled = appData.global.plugins.installed?.plugins ?? {};
          const projectInstalls = {};
          const userInstalls = {};
          for (const [id, installs] of Object.entries(globalInstalled)) {
            for (const inst of installs) {
              if (inst.projectPath === project.path) {
                projectInstalls[id] = inst;
              }
              if (inst.scope === 'user') {
                userInstalls[id] = inst;
              }
            }
          }

          // Merge all unique plugin IDs (full "name@marketplace" format only)
          const allIds = [...new Set([...allEnabledIds, ...Object.keys(projectInstalls), ...Object.keys(userInstalls)])];

          if (allIds.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">Plugins (\${allIds.length})</div>
              <table>
                <tr><th>Plugin</th><th>Scope</th><th>Version</th><th>Status</th></tr>
                \${allIds.map(id => {
                  const inst = projectInstalls[id] || userInstalls[id];
                  const isEnabledUser = enabledUser[id] === true;
                  const isEnabledProject = enabledProject[id] === true;
                  const isEnabledLocal = enabledLocal[id] === true;
                  const enabled = isEnabledUser || isEnabledProject || isEnabledLocal;
                  const scope = isEnabledLocal ? 'local' : isEnabledProject ? 'project' : isEnabledUser ? 'user' : (inst?.scope || '-');
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
          // Include global (user) hooks + project hooks
          const globalHookItems = [];
          for (const [event, matchers] of Object.entries(appData.global.hooks.config || {})) {
            for (const matcher of matchers) {
              for (const hook of (matcher.hooks || [])) {
                globalHookItems.push({ event, matcher: matcher.matcher || '', command: hook.command || '-', type: hook.type || '-', scope: 'user' });
              }
            }
          }
          const hooks = [...globalHookItems, ...(project.hooks || [])];
          if (hooks.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">Hooks (\${hooks.length})</div>
              <table>
                <tr><th style="width:130px">Event</th><th style="width:120px">Matcher</th><th>Command</th><th style="width:80px">Scope</th></tr>
                \${hooks.map(h => {
                  const scopeColor = h.scope === 'user' ? 'purple' : h.scope === 'local' ? 'orange' : 'blue';
                  return \`<tr>
                    <td><span class="tag tag-teal" title="\${esc(HOOK_EVENT_DESCRIPTIONS[h.event] || '')}">\${esc(h.event)}</span></td>
                    <td style="font-family:monospace;font-size:12px;color:var(--text-muted)">\${h.matcher ? esc(h.matcher) : '<span style="color:var(--text-dim)">—</span>'}</td>
                    <td style="font-family:monospace;font-size:12px;word-break:break-all;white-space:pre-wrap;line-height:1.5">\${esc(h.command || '-')}</td>
                    <td><span class="tag tag-\${scopeColor}">\${esc(h.scope)}</span></td>
                  </tr>\`;
                }).join('')}
              </table>
            </div>\`;
          } else {
            html += '<div class="empty">No hooks configured</div>';
          }
          break;
        }
        case 'mcp': {
          // Include global (user) MCP servers + project MCP servers
          const globalMcpServers = (appData.global.mcp || []).map(s => {
            const scopeLabel = s.scope === 'global' ? 'user' : s.scope || 'user';
            return { ...s, scope: scopeLabel };
          });
          const mcpServers = [...globalMcpServers, ...(project.mcp || [])];
          if (mcpServers.length) {
            html += \`<div class="table-wrap">
              <div class="table-title">MCP Servers (\${mcpServers.length})</div>
              <table>
                <tr><th>Name</th><th>Command / URL</th><th>Scope</th></tr>
                \${mcpServers.map(s => {
                  const cmdOrUrl = s.command || s.url || '-';
                  const scopeLabel = s.scope === '.mcp.json' ? 'project' : s.scope || 'local';
                  const scopeColor = scopeLabel === 'project' ? 'blue' : scopeLabel === 'local' ? 'orange' : 'purple';
                  return \`<tr>
                    <td>\${esc(s.name)}</td>
                    <td style="font-family:monospace;font-size:12px">\${esc(cmdOrUrl)}\${s.args?.length ? ' ' + esc(s.args.join(' ')) : ''}</td>
                    <td><span class="tag tag-\${scopeColor}">\${esc(scopeLabel)}</span></td>
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

    function showToast(msg, opts = {}) {
      const t = document.getElementById('toast');
      const alreadyShown = t.classList.contains('show');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      if (alreadyShown) {
        t.classList.remove('pulse');
        void t.offsetWidth;
        t.classList.add('pulse');
      }
      if (opts.sticky) {
        t.classList.add('sticky');
        const btn = document.createElement('button');
        btn.className = 'toast-close';
        btn.textContent = '×';
        btn.setAttribute('aria-label', '닫기');
        btn.onclick = () => {
          t.classList.remove('show');
          t.classList.remove('sticky');
        };
        t.appendChild(btn);
      } else {
        t.classList.remove('sticky');
        t._timer = setTimeout(() => t.classList.remove('show'), 3000);
      }
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
        'all-permissions': '/all/permissions',
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
        case 'all-permissions': content.innerHTML = renderAllPermissions(); break;
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

        let result;
        try {
          const res = await fetch('/api/plugins/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({
              pluginId, scope, projectPath,
              enabled: !currentlyEnabled,
            }),
          });
          result = await res.json();
        } catch (err) {
          result = { ok: false, error: err.message };
        }

        if (!result || !result.ok) {
          toggleSwitch.style.opacity = '';
          toggleSwitch.style.pointerEvents = '';
          const rawErr = result?.error || '알 수 없는 오류';
          let friendly = '토글 실패: ' + rawErr;
          if (/EPERM|EACCES|operation not permitted|permission denied/i.test(rawErr)) {
            const m = rawErr.match(new RegExp('/Users/[^/]+/([^/]+)/'));
            const folder = m ? m[1] : '';
            const isProtected = /Downloads|Documents|Desktop/i.test(folder);
            friendly =
              '권한이 없어서 파일을 수정할 수 없어요' +
              (isProtected ? \` (macOS가 ~/\${folder} 접근을 차단함)\` : '') +
              '.\\n해결법: 시스템 설정 → 개인정보 보호 및 보안 → 파일 및 폴더 에서 터미널(또는 iTerm)에' +
              (isProtected ? \` "\${folder}" \` : ' 해당 폴더 ') +
              '접근 권한을 허용한 뒤 claude-nook 서버를 재시작하세요.';
          }
          showToast(friendly, { sticky: /권한이 없어서/.test(friendly) });
          return;
        }

        const intended = !currentlyEnabled;
        await fetchOverview();
        navigate(currentView);
        const actual = getPluginEnabled(pluginId, scope, projectPath);
        if (actual === intended) {
          showToast(\`\${intended ? '활성화' : '비활성화'}됨 — 다음 Claude Code 세션부터 적용돼요\`);
        } else {
          // 서버는 ok로 응답했지만 재조회 결과가 의도와 달라요 — 보통 디스크 권한(TCC) 때문에
          // 쓰기가 무시되거나 읽기가 막혔을 때 발생합니다.
          showToast(
            \`상태가 저장되지 않은 것 같아요. 시스템 설정 → 개인정보 보호 및 보안 → 파일 및 폴더에서\` +
            \` 터미널(또는 iTerm)에 해당 폴더 접근 권한을 허용한 뒤 서버를 재시작해 주세요.\`
          );
        }
        return;
      }
    });

    document.getElementById('content').addEventListener('toggle', (e) => {
      if (e.target.classList && e.target.classList.contains('hook-event-ref')) {
        window._hookEventRefOpen = e.target.open;
      }
    }, true);

    document.getElementById('rescan-btn').addEventListener('click', async () => {
      const btn = document.getElementById('rescan-btn');
      btn.textContent = '스캔 중...';
      btn.disabled = true;
      await fetch('/api/rescan', { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } });
      await fetchOverview();
      renderSidebar();
      navigate(currentView, { path: window._projectPath, tab: window._projectTab });
      btn.textContent = '다시 스캔';
      btn.disabled = false;
    });

    // --- Update badge ---
    async function checkForUpdate() {
      try {
        const res = await fetch('/api/version');
        const { data } = await res.json();
        if (data?.updateAvailable) {
          const badge = document.getElementById('update-badge');
          badge.textContent = \`v\${data.latest} 지금 업데이트\`;
          badge.style.display = 'inline-block';
          badge.dataset.version = data.latest;
        }
      } catch {}
    }

    document.getElementById('update-badge').addEventListener('click', async () => {
      const badge = document.getElementById('update-badge');
      const prev = badge.textContent;
      badge.textContent = '업데이트 중...';
      badge.style.animation = 'none';
      badge.style.opacity = '0.7';
      badge.style.cursor = 'wait';
      try {
        const res = await fetch('/api/update', { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } });
        const result = await res.json();
        if (result.ok) {
          badge.textContent = '재시작 중...';
          // Wait for new server to come up, then reload
          const poll = setInterval(async () => {
            try {
              const r = await fetch('/api/version');
              if (r.ok) {
                clearInterval(poll);
                location.reload();
              }
            } catch {}
          }, 1000);
        } else {
          badge.textContent = prev;
          badge.style.opacity = '1';
          badge.style.cursor = 'pointer';
          showToast(result.error || '업데이트 실패');
        }
      } catch {
        badge.textContent = prev;
        badge.style.opacity = '1';
        badge.style.cursor = 'pointer';
        showToast('업데이트 실패');
      }
    });

    // --- Init ---
    (async () => {
      await fetchCsrfToken();
      await fetchOverview();
      renderSidebar();
      const { view, path, tab } = parsePath();
      navigate(view, { path, tab });
      // Non-blocking version check
      checkForUpdate();
    })();
  </script>
</body>
</html>`;
}
