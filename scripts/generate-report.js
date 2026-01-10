/* eslint-disable */
const path = require('path');
const fs = require('fs');
const report = require('multiple-cucumber-html-reporter');

const reportsDir = path.resolve(process.cwd(), 'reports');
const jsonPath = path.join(reportsDir, 'cucumber.json');

if (!fs.existsSync(jsonPath)) {
  console.error(`Missing ${jsonPath}. Run tests first.`);
  process.exit(1);
}

report.generate({
  jsonDir: reportsDir,
  reportPath: path.join(reportsDir, 'html'),
  reportName: 'The Internet - Full Coverage',
  pageTitle: 'Cucumber Report',
  displayDuration: true,
  metadata: {
    browser: { name: process.env.BROWSER || 'chromium' },
    device: 'CI / Local',
    platform: { name: process.platform }
  }
});
console.log('HTML report generated at reports/html/index.html');
