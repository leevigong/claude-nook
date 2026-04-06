#!/usr/bin/env node

import { startServer } from '../lib/server.mjs';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  claude-nook - Visual dashboard for Claude Code settings

  Usage:
    claude-nook [options]

  Options:
    --port <number>   Port to serve on (default: 3300)
    --no-open         Don't auto-open browser
    -h, --help        Show this help message
    -v, --version     Show version
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const { join, dirname } = await import('node:path');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
  console.log(pkg.version);
  process.exit(0);
}

const portIdx = args.indexOf('--port');
const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 3300;
const noOpen = args.includes('--no-open');

startServer({ port, open: !noOpen });
