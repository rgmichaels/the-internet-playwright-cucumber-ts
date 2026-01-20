import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { RedirectLinkPage } from '../pages/RedirectLinkPage';
import { expect } from '@playwright/test';

Given('I open the Redirect Link page', async function (this: CustomWorld) {
  const po = new RedirectLinkPage(this.page);
  await this.page.goto(`${this.baseUrl}/redirector`);
  await po.assertLoaded();
});

Then('the Redirect Link page should load', async function (this: CustomWorld) {
  const po = new RedirectLinkPage(this.page);
  await po.assertLoaded();
});

Then('I make sure the page redirects properly', async function (this: CustomWorld) {
  const po = new RedirectLinkPage(this.page);
  await po.exercise();
});

Then(
  'the redirect explanation text should be displayed',
  async function () {
    const expectedText =
      'This is separate from directly returning a redirection status code, ' +
      'in that some browsers cannot handle a raw redirect status code without ' +
      'a destination page as part of the HTTP response.';

    await expect(this.page.locator('#content')).toContainText(expectedText);
  }
);