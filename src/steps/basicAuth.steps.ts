import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { BasicAuthPage } from '../pages/BasicAuthPage';
import { expect } from '@playwright/test';
import type { BrowserContextOptions } from 'playwright';

const CONGRATS_MESSAGE = 'Congratulations! You must have the proper credentials.';

// Standard page steps used by the generic per-page feature templates
Given('I open the Basic Auth page', async function () {
  const baseURL = getBaseURL(this);
  const url = `${baseURL.replace(/\/+$/, '')}/basic_auth`;
  this.lastResponse = await this.page.goto(url);
});

Then('the Basic Auth page should load', async function (this: CustomWorld) {
  const po = new BasicAuthPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Basic Auth page', async function (this: CustomWorld) {
  const po = new BasicAuthPage(this.page);
  await po.exercise();
});


function getBaseURL(world: any): string {
  // Prefer world-scoped base URL (set via cucumber worldParameters or hooks).
  if (world?.baseUrl && typeof world.baseUrl === 'string') return world.baseUrl;
  if (world?.baseURL && typeof world.baseURL === 'string') return world.baseURL; // back-compat alias

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
      'Set one of: BASE_URL, PLAYWRIGHT_BASE_URL, THE_INTERNET_BASE_URL, or ensure world.baseUrl is set (worldParameters/hook).',
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
  const user = process.env.BASIC_AUTH_USER || 'admin';
  const pass = process.env.BASIC_AUTH_PASS || 'admin';
  return { user, pass };
}

async function replaceContext(
  world: CustomWorld,
  httpCredentials?: { username: string; password: string }
) {
  await world.context.close().catch(() => {});

  const contextOptions: BrowserContextOptions = {
    baseURL: world.baseUrl,
    viewport: { width: 1280, height: 720 },
    acceptDownloads: true,
  };

  if (httpCredentials) {
    contextOptions.httpCredentials = httpCredentials;
  }

  world.context = await world.browser.newContext(contextOptions);

  if ((process.env.TRACE ?? '1') !== '0') {
    await world.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  world.page = await world.context.newPage();
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
When('I request the basic auth page', async function (this: CustomWorld) {
  await replaceContext(this);
  const po = new BasicAuthPage(this.page);
  this.lastResponse = await po.open(getBaseURL(this));
});

Then('access should be denied', async function (this: CustomWorld) {
  const po = new BasicAuthPage(this.page);
  po.assertUnauthorizedResponse(this.lastResponse);
});

Then('the page should indicate the user is not authorized', async function () {
  await expect(this.page.locator('body')).toContainText('Not authorized');
});

/**
 * Negative path: invalid credentials must not inherit the feature-level valid credentials.
 */
When('I request the basic auth page with invalid credentials', async function (this: CustomWorld) {
  const { user, pass } = getCreds();
  await replaceContext(this, {
    username: user,
    password: `${pass}__invalid__`,
  });

  const po = new BasicAuthPage(this.page);
  this.lastResponse = await po.open(getBaseURL(this));
});

Then('the basic auth request should be unauthorized', function (this: CustomWorld) {
  const po = new BasicAuthPage(this.page);
  po.assertUnauthorizedResponse(this.lastResponse);
});

Then('the response should include a Basic authentication challenge', function (this: CustomWorld) {
  const po = new BasicAuthPage(this.page);
  po.assertBasicAuthenticationChallenge(this.lastResponse);
});

Then('protected basic auth content should not be displayed', async function (this: CustomWorld) {
  const po = new BasicAuthPage(this.page);
  await po.assertProtectedContentNotDisplayed();
});

/**
 * Happy path: valid credentials
 */
When('I request the basic auth page with valid credentials', async function (this: CustomWorld) {
  const { user, pass } = getCreds();
  await replaceContext(this, {
    username: user,
    password: pass,
  });
  const po = new BasicAuthPage(this.page);
  this.lastResponse = await po.open(getBaseURL(this));
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
