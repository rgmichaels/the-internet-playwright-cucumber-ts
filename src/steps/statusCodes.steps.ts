import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { StatusCodesPage } from '../pages/StatusCodesPage';
import { expect } from '@playwright/test';

Given('I open the Status Codes page', async function (this: CustomWorld) {
  const po = new StatusCodesPage(this.page);
  await this.page.goto(`${this.baseUrl}/status_codes`);
  await po.assertLoaded();
});

Then('the Status Codes page should load', async function () {
  this.statusCodesPage = new StatusCodesPage(this.page);
  await this.statusCodesPage.assertLoaded();
});

Then('I exercise the Status Codes page', async function (this: CustomWorld) {
  const po = new StatusCodesPage(this.page);
  await po.exercise();
});

Then(
  'each status code link should show the correct explanation',
  async function () {
    await this.statusCodesPage.exercise();
  }
);

Then(
  'the Status Codes page should show a paragraph of text',
  async function () {
    const expectedText =
      'HTTP status codes are a standard set of numbers used to communicate from a web server to your browser to indicate the outcome of the request being made';

    // Locate the paragraph containing the explanation
    const paragraph = this.page.locator('p').filter({
      hasText: 'HTTP status codes are a standard set of numbers',
    });

    await expect(paragraph).toBeVisible();
    await expect(paragraph).toContainText(expectedText);
  }
);