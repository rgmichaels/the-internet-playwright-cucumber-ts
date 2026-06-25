# claude.md

Project instructions for Claude when assisting in this repository.

## What This Repo Is

This repository is a Playwright + Cucumber + TypeScript BDD suite for `https://the-internet.herokuapp.com`. It exercises The Internet example pages through Gherkin features, Cucumber step definitions, and Playwright page objects.

Primary source layout:

- `features/*.feature`: Gherkin scenarios and tags
- `src/steps/*.ts`: Cucumber step definitions
- `src/pages/*.ts`: Playwright page objects
- `src/support/world.ts`: custom Cucumber world, browser/context/page setup
- `src/support/hooks.ts`: Cucumber hooks, tracing, screenshots, cleanup
- `src/support/env.ts`: environment parsing
- `cucumber.js`: Cucumber configuration
- `scripts/generate-report.js`: HTML report generation

## Working Style

- Read the nearby feature, step, and page object before editing.
- Keep edits scoped to the requested page or behavior.
- Preserve the existing BDD structure: feature wording in `features/`, step glue in `src/steps/`, browser details in `src/pages/`.
- Prefer meaningful Playwright assertions over fixed sleeps.
- Keep selectors resilient and readable. Prefer roles, labels, text, ids, and stable structure over brittle positional selectors.
- Do not rewrite generated artifacts under `reports/` or `test-results/` unless the task is specifically about artifacts.

## Commands

Install:

```bash
npm ci
npx playwright install --with-deps
```

Run all tests:

```bash
npm test
```

Run smoke tests:

```bash
npm run test:smoke
```

Run headed:

```bash
npm run test:headed
```

Run one feature:

```bash
npx cucumber-js --config cucumber.js features/21_form_auth.feature
```

Run by tag:

```bash
npx cucumber-js --config cucumber.js --tags "@smoke and not @auth_admin"
```

Generate reports:

```bash
npm run report
```

Run test plus report generation:

```bash
npm run test:ci
```

## Environment Notes

Local runs can use `.env`, copied from `.env.example`.

Important variables:

- `BASE_URL`: defaults to `https://the-internet.herokuapp.com`
- `HEADLESS`: defaults to `true`
- `HEADED=1`: forces headed mode
- `BROWSER`: `chromium`, `firefox`, or `webkit`
- `SLOWMO`: headed slow-motion delay
- `TRACE=0`: disables Playwright trace capture
- `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`: defaults to `admin` / `admin`

`CustomWorld` exposes `this.page`, `this.context`, `this.browser`, and `this.baseUrl` to step definitions.

## Implementation Patterns

When adding a new page or scenario:

1. Add or update the relevant `features/*.feature` file.
2. Add step definitions in `src/steps/*.ts`.
3. Add page behavior in `src/pages/*.ts`.
4. Reuse helpers from `BasePage` where applicable.
5. Add tags that match the existing convention, such as `@feature_name`, `@smoke`, or `@regression`.

When a scenario needs special browser context setup:

- Add `@auth_admin` for HTTP basic auth.
- Add `@geo` for geolocation permission and coordinates.
- Update hooks only if tag-driven setup is not already sufficient.

## Verification

After a narrow feature change, prefer:

```bash
npx cucumber-js --config cucumber.js features/<feature-file>.feature
```

After shared support, hook, world, config, or report changes, prefer:

```bash
npm test
```

Use `npm run test:ci` when report output is part of the change.

If a test failure appears related to the external demo site or network availability, capture the command, the failing scenario, and the observed error in the final response.
