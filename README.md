# The Internet Test Suite (Playwright + Cucumber + TypeScript)

End-to-end BDD automation suite for [the-internet.herokuapp.com](https://the-internet.herokuapp.com), built with Playwright, Cucumber, and TypeScript.

This project currently includes:
- 44 feature files (`features/*.feature`)
- 45 step definition files (`src/steps/*.ts`)
- 46 page object/support files in `src/pages` (44 page-specific objects + shared `BasePage` and `HomePage`)
- CI workflows for push/PR and scheduled daily execution

## Project URLs

- Application Under Test (AUT): [https://the-internet.herokuapp.com](https://the-internet.herokuapp.com)
- GitHub Repository: [https://github.com/rgmichaels/the-internet-playwright-cucumber-ts](https://github.com/rgmichaels/the-internet-playwright-cucumber-ts)
- Jira Project (replace placeholder): [https://YOUR-COMPANY.atlassian.net/jira/software/projects/PROJECTKEY](https://YOUR-COMPANY.atlassian.net/jira/software/projects/PROJECTKEY)
- Jira Board (replace placeholder): [https://YOUR-COMPANY.atlassian.net/jira/software/projects/PROJECTKEY/boards/1](https://YOUR-COMPANY.atlassian.net/jira/software/projects/PROJECTKEY/boards/1)

## Tech Stack

- Node.js + npm
- TypeScript
- Cucumber (`@cucumber/cucumber`)
- Playwright
- `multiple-cucumber-html-reporter`

## Prerequisites

- Node.js 20+ recommended (CI uses Node 20)
- npm 10+
- Git

## Setup

1. Clone the repository:

```bash
git clone https://github.com/rgmichaels/the-internet-playwright-cucumber-ts.git
cd the-internet-playwright-cucumber-ts
```

2. Install dependencies:

```bash
npm ci
```

3. Install Playwright browsers:

```bash
npx playwright install --with-deps
```

4. Create your local environment file:

```bash
cp .env.example .env
```

Default `.env` values:

```dotenv
BASE_URL=https://the-internet.herokuapp.com
HEADLESS=true
BROWSER=chromium
```

## Running Tests

Run full suite:

```bash
npm test
```

Run smoke suite:

```bash
npm run test:smoke
```

Run headed mode:

```bash
npm run test:headed
```

Run CI command locally (test + report):

```bash
npm run test:ci
```

Run by feature tag:

```bash
npx cucumber-js --config cucumber.js --tags "@feature_typos"
```

Run with parallel workers:

```bash
npx cucumber-js --config cucumber.js --tags "@regression" --parallel 2
```

Run a single feature file:

```bash
npx cucumber-js --config cucumber.js features/01_ab_testing.feature
```

Run against a custom target URL:

```bash
BASE_URL=https://the-internet.herokuapp.com npx cucumber-js --config cucumber.js
```

Run auth scenarios with explicit credentials:

```bash
BASIC_AUTH_USER=admin BASIC_AUTH_PASS=admin npx cucumber-js --config cucumber.js --tags "@auth_admin"
```

## Reporting and Artifacts

Generate the HTML report:

```bash
npm run report
```

Output locations:
- Cucumber JSON: `reports/cucumber.json`
- JUnit XML: `reports/junit.xml`
- HTML report: `reports/html/index.html`
- Failure screenshots and traces: `test-results/`

Behavior on failures:
- A full-page screenshot is attached for failed scenarios.
- A Playwright trace ZIP is saved and attached for failed scenarios.
- Disable trace capture by setting `TRACE=0`.

## Configuration

Environment variables used by the test framework:

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_URL` | `https://the-internet.herokuapp.com` | Primary base URL for the AUT |
| `PLAYWRIGHT_BASE_URL` | (unset) | Alternate base URL fallback |
| `THE_INTERNET_BASE_URL` | (unset) | Alternate base URL fallback |
| `HEADLESS` | `true` | Runs browsers headless unless set to `false`, `0`, or `no` |
| `HEADED` | `0` | If set to `1`, forces headed mode |
| `BROWSER` | `chromium` | Browser engine: `chromium`, `firefox`, or `webkit` |
| `SLOWMO` | `0` | Slow-motion delay (ms) when headed mode is enabled |
| `TRACE` | `1` | Trace recording toggle (`0` disables tracing) |
| `BASIC_AUTH_USER` | `admin` | Username for auth-protected scenarios |
| `BASIC_AUTH_PASS` | `admin` | Password for auth-protected scenarios |

## Tags

Common tags:
- `@smoke`
- `@regression`
- `@feature`
- `@auth_admin`
- `@geo`
- Per-page feature tags like `@feature_ab_testing`, `@feature_dynamic_controls`, etc.

Example:

```bash
npx cucumber-js --config cucumber.js --tags "@smoke and not @auth_admin"
```

## CI Workflows

GitHub Actions workflows:
- `.github/workflows/ci.yml`: runs on push and pull requests
- `.github/workflows/daily-tests.yml`: scheduled daily run (gated to 2 AM America/New_York)

Both workflows:
- Install Node 20 and dependencies
- Install Playwright browsers
- Run `npm run test:ci`
- Upload `reports/` and `test-results/` artifacts

## Project Structure

```text
.
├── features/              # Cucumber feature files
├── src/
│   ├── pages/             # Page objects
│   ├── steps/             # Step definitions
│   └── support/           # Hooks, world, env helpers
├── scripts/
│   └── generate-report.js # HTML report generation
├── reports/               # JSON, JUnit, and HTML reports
├── test-results/          # Failure screenshots and traces
├── cucumber.js            # Cucumber configuration
└── .env.example           # Sample environment variables
```

## Troubleshooting

- Browser install issues:
  - Re-run `npx playwright install --with-deps`.
- Missing HTML report:
  - Ensure tests were run and `reports/cucumber.json` exists, then run `npm run report`.
- Auth test failures:
  - Confirm `BASIC_AUTH_USER` and `BASIC_AUTH_PASS`.
- Wrong target app:
  - Confirm `BASE_URL` in `.env` or command-line overrides.
