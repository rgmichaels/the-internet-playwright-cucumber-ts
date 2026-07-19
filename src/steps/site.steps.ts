import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../support/world';
import { HomePage } from '../pages/HomePage';

// Home-page-centric steps live here.
// Page-specific load/exercise/direct-nav steps live in their own *.steps.ts files.

Given('I am on the home page', async function (this: CustomWorld) {
  const home = new HomePage(this.page);
  await home.goto(this.baseUrl);
});

Given(
  'the {string} example initially returns a transient server error',
  async function (this: CustomWorld, name: string) {
    const link = this.page.getByRole('link', { name, exact: true });
    const href = await link.getAttribute('href');

    expect(href, `Expected the ${name} example link to have an href`).toBeTruthy();
    const targetUrl = new URL(href!, this.baseUrl).toString();

    await this.page.route(targetUrl, async (route) => {
      this.exampleNavigationAttempts += 1;

      if (this.exampleNavigationAttempts === 1) {
        await route.fulfill({
          status: 503,
          contentType: 'text/html',
          body: '<h1>Application error</h1>',
        });
        return;
      }

      await route.fallback();
    });
  }
);

When('I open the {string} example', async function (this: CustomWorld, name: string) {
  const home = new HomePage(this.page);
  await home.openExample(name);
});

Then('the global footer should be valid', async function (this: CustomWorld) {
  const base = new HomePage(this.page);
  await base.assertGlobalFooterPoweredByElementalSelenium();
});

Then('the home page should have a populated title tag', async function (this: CustomWorld) {
  const home = new HomePage(this.page);
  await home.assertTitleTagHasText();
});

Then('the transient server error should be retried once', function (this: CustomWorld) {
  expect(this.exampleNavigationAttempts).toBe(2);
});
