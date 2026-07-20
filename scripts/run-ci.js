#!/usr/bin/env node

const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const npmArgs = ['run', 'test:ci:inner'];
const npmExecPath = process.env.npm_execpath;
const npmCommand = npmExecPath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmCommandArgs = npmExecPath ? [npmExecPath, ...npmArgs] : npmArgs;

let command = npmCommand;
let args = npmCommandArgs;

if (process.platform === 'darwin') {
  const caffeinatePath = '/usr/bin/caffeinate';

  if (fs.existsSync(caffeinatePath)) {
    console.log('[test:ci] Preventing macOS system sleep until the suite finishes.');
    command = caffeinatePath;
    args = ['-i', '-s', npmCommand, ...npmCommandArgs];
  } else {
    console.warn('[test:ci] macOS caffeinate is unavailable; continuing without sleep prevention.');
  }
}

const result = spawnSync(command, args, { stdio: 'inherit' });

if (result.error) {
  console.error(`[test:ci] Unable to start the suite: ${result.error.message}`);
  process.exit(1);
}

if (result.signal) {
  console.error(`[test:ci] Suite terminated by ${result.signal}.`);
  process.exit(1);
}

process.exit(result.status ?? 1);
