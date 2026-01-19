import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const CONGRATS_MESSAGE = 'Congratulations! You must have the proper credentials.';

function getBaseURL(world: any): string {
  if (world?.baseURL && typeof world.baseURL === 'string') return world.baseURL;

  const envBase =
    process.env.BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    process.env.THE_INTERNET_BASE_URL;

  if (envBase) return envBase;

  const currentUrl: string | undefined = world?.page?.url?.();
  if (currentUrl && currentUrl.startsWith('http')) {
    return new URL(currentUrl).origin;
  }

  throw new Error(
    [
      'Unable to determine baseURL for Basic Auth navigation.',
      'Set one of: BASE_URL, PLAYWRIGHT_BASE_URL, THE_INTERNET_BASE_URL, or ensure world.baseURL is set in hooks.',
      'Example:',
      '  BASE_URL=https://the-internet.herokuapp.com npx cucumber-js --tags "@auth_admin"',
    ].join('\n')
  );
}

function buildUrl(world: any, path: string): string {
  const base = getBaseURL(world).replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function getCreds(): { user: string; pass: string } {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    throw new Error(
      [
        'Missing BASIC_AUTH_USER / BASIC_AUTH_PASS env vars.',
        'Example:',
        '  BASIC_AUTH_USER=admin BASIC_AUTH_PASS=admin BASE_URL=https://the-internet.herokuapp.com npx cucumber-js --tags "@auth_success"',
      ].join('\n')
    );
  }

  return { user, pass };
}

/**
 * Negative path (explicit wording)
 */
When('I navigate to the basic auth page without credentials', async function () {
  // NOTE: This does NOT create a new context. Use the "request" step below if you need isolation.
  this.lastResponse = await this.page.goto(buildUrl(this, '/basic_auth'));
});

Then('the request should be unauthorized', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(401);
});

Then('I should see a not authorized message', async function () {
  await expect(this.page.locator('body')).toContainText('Not authorized');
});

/**
 * Negative path (feature wording): force a clean context so auth can't leak
 */
When('I request the basic auth page', async function () {
  const baseURL = getBaseURL(this);

  const context = await this.browser.newContext({ baseURL }); // no httpCredentials
  this.page = await context.newPage();

  // absolute URL so no baseURL dependency
  this.lastResponse = await this.page.goto(buildUrl(this, '/basic_auth'));
});

Then('access should be denied', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(401);
});

Then('the page should indicate the user is not authorized', async function () {
  await expect(this.page.locator('body')).toContainText('Not authorized');
});

/**
 * Happy path: valid credentials
 */
When('I request the basic auth page with valid credentials', async function () {
  const { user, pass } = getCreds();
  const baseURL = getBaseURL(this);

  const context = await this.browser.newContext({
    baseURL,
    httpCredentials: { username: user, password: pass },
  });

  this.page = await context.newPage();
  this.lastResponse = await this.page.goto(buildUrl(this, '/basic_auth'));
});

Then('the request should be successful', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(200);
});

Then('I should see an authorized message', async function () {
  await expect(this.page.locator('body')).toContainText('Congratulations');
});

Then('the congratulations message should be displayed', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(200);
  await expect(this.page.locator('body')).toContainText(CONGRATS_MESSAGE);
});
