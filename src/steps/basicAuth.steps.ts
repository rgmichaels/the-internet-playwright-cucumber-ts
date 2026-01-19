import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/**
 * Basic Auth notes:
 * - The auth prompt is a browser-level dialog (not DOM), so you can't "click Cancel".
 * - To simulate Cancel / denial, simply navigate WITHOUT credentials and assert 401 + page text.
 * - To test success, use a request context with httpCredentials (or create a new context).
 */

When('I navigate to the basic auth page without credentials', async function () {
  const response = await this.page.goto('/basic_auth');
  this.lastResponse = response;
});

Then('the request should be unauthorized', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(401);
});

Then('I should see a not authorized message', async function () {
  await expect(this.page.locator('body')).toContainText('Not authorized');
});

/**
 * Optional: Positive-path step
 * Requires env vars:
 *   BASIC_AUTH_USER, BASIC_AUTH_PASS
 */
When('I navigate to the basic auth page with valid credentials', async function () {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    throw new Error(
      'Missing BASIC_AUTH_USER / BASIC_AUTH_PASS env vars. Set them to run the authorized scenario.'
    );
  }

  // Create a context that includes httpCredentials, then replace this.page
  const context = await this.browser.newContext({
    baseURL: this.baseURL,
    httpCredentials: { username: user, password: pass },
  });

  this.page = await context.newPage();

  const response = await this.page.goto('/basic_auth');
  this.lastResponse = response;
});

Then('the request should be successful', async function () {
  expect(this.lastResponse, 'Expected a response from page.goto').toBeTruthy();
  expect(this.lastResponse!.status()).toBe(200);
});

Then('I should see an authorized message', async function () {
  await expect(this.page.locator('body')).toContainText('Congratulations');
});
