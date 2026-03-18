# The Internet — Full Link Coverage (Playwright + Cucumber + TypeScript)

This repo is a complete, runnable BDD suite exercising **every link** on:
- https://the-internet.herokuapp.com/

## What you get

- 44 Cucumber feature files covering every page on `https://the-internet.herokuapp.com/`
- 44 page-specific page objects, plus shared `BasePage` and `HomePage` helpers
- 45 step definition files wired through shared Cucumber `hooks` and `world` support
- Scenarios that cover page loads, assertions, and page-specific interactions
- Tags for common test slices like `@smoke`, `@regression`, `@feature`, plus per-page tags like `@feature_ab_testing`

## Prereqs
- Node.js 18+ (Node 20 recommended)

## Install
```bash
npm install
npx playwright install --with-deps
```

## Run full suite
```bash
npm test
npm run report
```

HTML report:
- `reports/html/index.html`

## Run smoke suite
```bash
npm run test:smoke
```

## Run headed
```bash
npm run test:headed
```

## Notes
- Auth pages (Basic Auth, Digest Auth, Secure File Download) use `admin/admin`.
- Geolocation test grants permission and sets a sample location (NYC-ish).
- On failure, a screenshot is saved in `test-results/` and attached to the Cucumber report.

- On failure, a Playwright trace (`*-trace.zip`) is saved in `test-results/` and attached to the Cucumber report. Disable with `TRACE=0`.

## Run with credentials
```bash
BASE_URL=https://the-internet.herokuapp.com \
BASIC_AUTH_USER=admin \
BASIC_AUTH_PASS=admin \
npx cucumber-js
```

## Run by tag
```bash
npx cucumber-js --tags "@feature_typos"
npx cucumber-js --tags "@feature_typos" --parallel 2
```
