import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const CONGRATS_MESSAGE = 'Congratulations! You must have the proper credentials.';

function getBaseURL(world: any): string {
  // 1) Preferred: world.baseURL (if your hooks/world sets it)
  if (world?.baseURL && typeof world.baseURL === 'string') return world.baseURL;

  // 2) Common env var patterns
  const envBase =
    process.env.BASE_URL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    process.env.THE_INTERNET_BASE_URL;

  if (envBase) return envBase;

  // 3) Fallback: derive from the current page URL (works if you've already visited the site in Before)
  const currentUrl: string | undefined = world?.page?.url?.();
  if (currentUrl && currentUrl.startsWith('http')) {
    return new URL(currentUrl).origin;
  }

  throw new Error(
    [
      'Unable to determine baseURL for Basic Auth navigation.',
      'Set one of: BASE_URL, PLAYWRIGHT_BASE_URL, THE_INTERNET_BASE_URL, or ensure world.baseURL is set in hooks.',
      'Example:',
      '  BASE_URL=https://the-internet.herokuapp.com BASIC_AUTH_USER=admin BASIC_AUTH_PASS=admin npx cucumber-js --tags "@auth_success"',
    ].join('\n')
  );
}

function getCreds(): { user: string; pass: string } {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    throw new Error(
      [
        'Missing BASIC_AUTH_USER / BASIC_AUTH_PASS env vars.',
        'Example:',
        '  BASIC_AUTH_USER=admin BASIC_AUTH_PASS=admin npx cucumber-js --tags "@auth_success"',
      ].join('\n')
    );
  }

  return { user, pass };
}

/**
 * Basic Auth notes:
 * - The auth prompt is a browser-level dialog (not DOM), so you can't "click Cancel".
 * - To simulate Cancel / denial, navigate WITHOUT credentials and assert 401 + page text.
 * - To test success, create a NEW browser context with httpCredentials.
 */

When('I navigate to the basic auth page without credentials', async function () {
  // Works as long as your existing page was created with baseURL OR you pass an absolute URL in hooks
  this.lastResponse = await this.page.goto('/basic_auth');
});

Then('the request should be unauthorized', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(401);
});

Then('I should see a not authorized message', async function () {
  await expect(this.page.locator('body')).toContainText('Not authorized');
});

/**
 * Happy path: valid credentials
 * (We keep ONE step phrase for this to avoid duplicate implementations.)
 */
When('I request the basic auth page with valid credentials', async function () {
  const { user, pass } = getCreds();
  const baseURL = getBaseURL(this);

  const context = await this.browser.newContext({
    baseURL,
    httpCredentials: { username: user, password: pass },
  });

  // Replace the page on the world for the remainder of this scenario
  this.page = await context.newPage();
  this.lastResponse = await this.page.goto('/basic_auth');
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
