# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a TypeScript BDD end-to-end test suite for [the-internet.herokuapp.com](https://the-internet.herokuapp.com), built with:

- Playwright for browser automation
- Cucumber for Gherkin features and step definitions
- TypeScript with `strict` mode
- Page objects under `src/pages`
- Custom Cucumber world, hooks, and environment helpers under `src/support`

The suite is organized around The Internet example pages. Each feature generally has:

- A Gherkin file in `features/`
- Matching step definitions in `src/steps/`
- A page object in `src/pages/`

## Common Commands

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install --with-deps
```

Run the full suite:

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

Run CI-style tests and report generation:

```bash
npm run test:ci
```

Generate the HTML report from existing Cucumber JSON:

```bash
npm run report
```

Run one feature:

```bash
npx cucumber-js --config cucumber.js features/01_ab_testing.feature
```

Run by tag:

```bash
npx cucumber-js --config cucumber.js --tags "@feature_typos"
```

## Environment

Copy `.env.example` to `.env` for local runs.

Important variables:

- `BASE_URL`: primary AUT URL, defaults to `https://the-internet.herokuapp.com`
- `HEADLESS`: defaults to `true`; set to `false`, `0`, or `no` for headed mode
- `HEADED`: set to `1` to force headed mode
- `BROWSER`: `chromium`, `firefox`, or `webkit`
- `SLOWMO`: slow-motion delay in milliseconds when headed
- `TRACE`: defaults to `1`; set to `0` to disable tracing
- `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`: defaults are `admin` / `admin`

## Code Conventions

- Keep TypeScript strict-friendly. Avoid `any` unless the surrounding framework API makes it awkward to do otherwise.
- Prefer Playwright locators and web-first assertions from `playwright/test`.
- Keep page behavior in page objects and Cucumber wording in step files.
- Use `CustomWorld` from `src/support/world.ts` for shared browser/page/baseUrl access.
- Reuse `BasePage` helpers for common page assertions such as `expectH3ToBe`, `expectH3ToContain`, and footer validation.
- Keep waits assertion-driven. Prefer `await expect(locator).toBeVisible()` or related assertions over arbitrary timeouts.
- Avoid broad refactors when adding or fixing one feature. Follow the existing feature/page/steps shape.

## Test Structure

Feature files live in `features/` and use tags such as:

- `@smoke`
- `@regression`
- `@feature`
- Per-page tags like `@feature_form_auth`
- Capability tags like `@auth_admin` and `@geo`

Hooks use tags to configure context behavior:

- `@auth_admin` enables HTTP credentials in the browser context
- `@geo` grants geolocation permission and sets coordinates

Step definitions should instantiate page objects inside each step:

```ts
const po = new SomePage(this.page);
```

Prefer page object methods named around observable behavior, for example:

- `assertLoaded()`
- `exercise()`
- `assertInvalidState()`

## Artifacts

Generated artifacts should not be treated as source:

- `reports/cucumber.json`
- `reports/junit.xml`
- `reports/html/`
- `test-results/`

On failed scenarios, hooks attach a screenshot and, when tracing is enabled, a Playwright trace ZIP.

## Before Finishing Changes

For code changes, run the narrowest meaningful verification first:

```bash
npx cucumber-js --config cucumber.js path/to/feature.feature
```

For broad changes, run:

```bash
npm test
```

For reporting changes, run:

```bash
npm run test:ci
```

If tests cannot be run because of network, browser install, or AUT availability issues, note that clearly in the handoff.
