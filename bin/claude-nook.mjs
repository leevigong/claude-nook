#!/usr/bin/env node

import { startServer, readPidFile, listRunningInstances, openBrowser } from '../lib/server.mjs';
import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';
import updateNotifier from 'update-notifier';
import { readFileSync, openSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

// Check for updates once a day, print a box on next run when one is available.
updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 * 24 }).notify();

// ANSI colors (disabled if NO_COLOR env or not a TTY)
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code) => (s) => useColor ? `\x1b[${code}m${s}\x1b[0m` : s;
const green = c('32');
const red = c('31');
const yellow = c('33');
const cyan = c('36');
const dim = c('2');
const bold = c('1');

const args = process.argv.slice(2);

const HELP_TEXT = `
  claude-nook 🪺 - Visual dashboard for Claude Code settings

  Usage:
    claude-nook [command] [options]

  Commands:
    (none)            Start the dashboard server
    status            Check if the dashboard is running
    stop              Stop a running dashboard server

  Options:
    -p, --port <n>    Port to serve on (default: 7007)
    -d, --detach      Run in the background
    --no-open         Don't auto-open browser
    -h, --help        Show this help message
    -v, --version     Show version
`;

function printHelp() {
  console.log(HELP_TEXT);
}

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(`claude-nook v${pkg.version} 🪺`);
  process.exit(0);
}

// Parse --port / -p. Returns null if not specified.
function parsePort(args) {
  const idx = args.findIndex((a) => a === '--port' || a === '-p');
  if (idx === -1) return null;
  const val = parseInt(args[idx + 1], 10);
  if (Number.isNaN(val)) {
    console.error(`\n  ${red('✗')} --port requires a number\n`);
    process.exit(1);
  }
  if (val < 1 || val > 65535) {
    console.error(`\n  ${red('✗')} --port must be between 1 and 65535\n`);
    process.exit(1);
  }
  return val;
}

const KNOWN_FLAGS = new Set(['--port', '-p', '--no-open', '-d', '--detach', '--__child']);
const KNOWN_COMMANDS = new Set(['status', 'stop']);

// Detect unknown args (skip values that follow --port/-p)
const unknown = args.find((a, i) => {
  const prev = args[i - 1];
  if (prev === '--port' || prev === '-p') return false; // value of port flag
  if (a.startsWith('-')) return !KNOWN_FLAGS.has(a);
  return !KNOWN_COMMANDS.has(a);
});

if (unknown) {
  console.log(`\n  ${red('✗')} Unknown command or option: ${yellow(`"${unknown}"`)}`);
  printHelp();
  process.exit(1);
}

const command = args.find((a) => KNOWN_COMMANDS.has(a));
const explicitPort = parsePort(args);

if (command === 'status') {
  // If --port given, check just that port. Otherwise list all running instances.
  const instances = explicitPort
    ? (readPidFile(explicitPort) ? [{ port: explicitPort, pid: readPidFile(explicitPort) }] : [])
    : listRunningInstances();

  if (instances.length === 0) {
    const where = explicitPort ? ` on port ${explicitPort}` : '';
    console.log(`\n  ${dim('○')} claude-nook is not running${where}`);
    console.log(`    ${dim('Start it with:')} ${cyan('claude-nook')}\n`);
    process.exit(1);
  }

  console.log('');
  for (const { port, pid } of instances) {
    console.log(`  ${green('●')} ${bold('claude-nook is running')}`);
    console.log(`    ${dim('pid:')} ${pid}`);
    console.log(`    ${dim('url:')} ${cyan(`http://localhost:${port}`)}\n`);
  }
  process.exit(0);
}

if (command === 'stop') {
  await runStop();
}

async function runStop() {
  const instances = explicitPort
    ? (readPidFile(explicitPort) ? [{ port: explicitPort, pid: readPidFile(explicitPort) }] : [])
    : listRunningInstances();

  if (instances.length === 0) {
    const where = explicitPort ? ` on port ${explicitPort}` : '';
    console.log(`\n  ${dim('○')} Nothing to stop${where}\n`);
    process.exit(1);
  }

  let targets = instances;

  // If multiple instances and no explicit port, ask which to stop
  if (instances.length > 1 && !explicitPort) {
    console.log(`\n  ${bold('Multiple claude-nook instances are running:')}\n`);
    instances.forEach(({ port, pid }, i) => {
      console.log(`    ${cyan(`${i + 1})`)} port ${port} ${dim(`(pid ${pid})`)}`);
    });
    console.log(`    ${cyan('a)')} all`);
    console.log(`    ${cyan('q)')} quit\n`);

    const answer = await prompt(`  Which one to stop? `);
    const trimmed = (answer || '').trim().toLowerCase();

    if (trimmed === 'q' || trimmed === '') {
      console.log('');
      process.exit(0);
    }
    if (trimmed === 'a') {
      targets = instances;
    } else {
      const idx = parseInt(trimmed, 10);
      if (!idx || idx < 1 || idx > instances.length) {
        console.log(`\n  ${red('✗')} Invalid choice\n`);
        process.exit(1);
      }
      targets = [instances[idx - 1]];
    }
  }

  console.log('');
  let failed = 0;
  for (const { port, pid } of targets) {
    try {
      process.kill(pid, 'SIGTERM');
      // Wait up to ~1.5s for graceful shutdown, then SIGKILL
      const start = Date.now();
      while (Date.now() - start < 1500) {
        await new Promise((r) => setTimeout(r, 100));
        try { process.kill(pid, 0); } catch { break; } // process gone
      }
      try {
        process.kill(pid, 0);
        // Still alive — force kill
        process.kill(pid, 'SIGKILL');
        console.log(`  ${yellow('!')} Force-killed claude-nook on port ${port} ${dim(`(pid ${pid})`)}`);
      } catch {
        console.log(`  ${green('✓')} Stopped claude-nook on port ${port} ${dim(`(pid ${pid})`)}`);
      }
    } catch (e) {
      console.error(`  ${red('✗')} Failed to stop pid ${pid}: ${e.message}`);
      failed++;
    }
  }
  console.log('');
  process.exit(failed ? 1 : 0);
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const noOpen = args.includes('--no-open');
const detach = args.includes('-d') || args.includes('--detach');
const finalPort = explicitPort ?? 7007;

if (detach && !args.includes('--__child')) {
  // Pre-check: port already in use by another claude-nook?
  const existingPid = readPidFile(finalPort);
  if (existingPid) {
    console.error(`\n  ${red('✗')} Port ${finalPort} is already in use by claude-nook ${dim(`(pid ${existingPid})`)}`);
    console.error(`    ${dim('→ Open')} ${cyan(`http://localhost:${finalPort}`)}`);
    console.error(`    ${dim('→ Or stop it with:')} ${cyan('claude-nook stop')}\n`);
    process.exit(1);
  }

  // Spawn a detached child running this same script without -d.
  // Capture child stderr to a log file so we can surface real failure reasons.
  const logPath = join(tmpdir(), `claude-nook-${finalPort}.log`);
  const errFd = openSync(logPath, 'w');
  const childArgs = args.filter((a) => a !== '-d' && a !== '--detach');
  if (!childArgs.includes('--no-open')) childArgs.push('--no-open');
  childArgs.push('--__child');
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), ...childArgs], {
    detached: true,
    stdio: ['ignore', 'ignore', errFd],
  });
  child.unref();
  // Wait briefly to confirm the server actually started (pid file appears)
  const start = Date.now();
  await new Promise((r) => setTimeout(r, 300));
  while (Date.now() - start < 2000 && !readPidFile(finalPort)) {
    await new Promise((r) => setTimeout(r, 100));
  }
  const pid = readPidFile(finalPort);
  if (pid) {
    console.log(`\n  ${green('●')} ${bold('claude-nook started in background')}`);
    console.log(`    ${dim('pid:')} ${pid}`);
    console.log(`    ${dim('url:')} ${cyan(`http://localhost:${finalPort}`)}`);
    console.log(`    ${dim('Stop it with:')} ${cyan('claude-nook stop')}\n`);
    if (!noOpen) openBrowser(`http://localhost:${finalPort}`);
    process.exit(0);
  } else {
    console.error(`\n  ${red('✗')} Failed to start claude-nook in background`);
    try {
      const log = readFileSync(logPath, 'utf8').trim();
      if (log) console.error(`\n${log}`);
    } catch {}
    console.error('');
    process.exit(1);
  }
}

startServer({ port: finalPort, open: !noOpen });
if (!args.includes('--__child')) {
  console.log(`  ${dim('Press Ctrl+C to stop, or run with -d to detach.')}\n`);
}
