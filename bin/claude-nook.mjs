#!/usr/bin/env node

import { startServer } from '../lib/server.mjs';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

// Check for updates once a day, print a box on next run when one is available.
updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 * 24 }).notify();

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  claude-nook - Visual dashboard for Claude Code settings

  Usage:
    claude-nook [options]

  Options:
    --port <number>   Port to serve on (default: 7007)
    --no-open         Don't auto-open browser
    -h, --help        Show this help message
    -v, --version     Show version
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

const portIdx = args.indexOf('--port');
const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 7007;
const noOpen = args.includes('--no-open');

startServer({ port, open: !noOpen });
