#!/usr/bin/env node

const path = require('node:path');
const { spawnSync } = require('node:child_process');

function resultStatus(result, label) {
  if (result.error) {
    console.error(`[test:ci] Unable to start ${label}: ${result.error.message}`);
    return 1;
  }

  if (result.signal) {
    console.error(`[test:ci] ${label} terminated by ${result.signal}.`);
    return 1;
  }

  return result.status ?? 1;
}

const npmArgs = ['run', 'typecheck'];
const npmExecPath = process.env.npm_execpath;
const npmCommand = npmExecPath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmCommandArgs = npmExecPath ? [npmExecPath, ...npmArgs] : npmArgs;

const typecheckResult = spawnSync(npmCommand, npmCommandArgs, { stdio: 'inherit' });
const typecheckStatus = resultStatus(typecheckResult, 'TypeScript typecheck');

if (typecheckStatus !== 0) {
  process.exit(typecheckStatus);
}

const cucumberPackageDir = path.dirname(require.resolve('@cucumber/cucumber/package.json'));
const cucumberBin = path.join(cucumberPackageDir, 'bin', 'cucumber.js');
const cucumberResult = spawnSync(
  process.execPath,
  [cucumberBin, '--config', 'cucumber.js', ...process.argv.slice(2)],
  { stdio: 'inherit' }
);
const cucumberStatus = resultStatus(cucumberResult, 'Cucumber');

if (cucumberResult.error || cucumberResult.signal) {
  process.exit(cucumberStatus);
}

const reportScript = path.join(__dirname, 'generate-report.js');
const reportResult = spawnSync(process.execPath, [reportScript], { stdio: 'inherit' });
const reportStatus = resultStatus(reportResult, 'HTML report generation');

process.exit(cucumberStatus !== 0 ? cucumberStatus : reportStatus);
