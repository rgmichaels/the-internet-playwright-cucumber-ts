import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { RedirectLinkPage } from '../pages/RedirectLinkPage';

Given('I open the Redirect Link page', async function (this: CustomWorld) {
  const po = new RedirectLinkPage(this.page);
  await this.page.goto(`${this.baseUrl}/redirector`);
  await po.assertLoaded();
});

Then('the Redirect Link page should load', async function (this: CustomWorld) {
  const po = new RedirectLinkPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Redirect Link page', async function (this: CustomWorld) {
  const po = new RedirectLinkPage(this.page);
  await po.exercise();
});
