import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ShadowDomPage } from '../pages/ShadowDomPage';

Given('I open the Shadow DOM page', async function (this: CustomWorld) {
  const po = new ShadowDomPage(this.page);
  await this.page.goto(`${this.baseUrl}/shadowdom`);
  await po.assertLoaded();
});

Then('the Shadow DOM page should load', async function (this: CustomWorld) {
  const po = new ShadowDomPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Shadow DOM page', async function (this: CustomWorld) {
  const po = new ShadowDomPage(this.page);
  await po.exercise();
});
