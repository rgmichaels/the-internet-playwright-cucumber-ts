import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { SlowResourcesPage } from '../pages/SlowResourcesPage';

Given('I open the Slow Resources page', async function (this: CustomWorld) {
  const po = new SlowResourcesPage(this.page);
  await this.page.goto(`${this.baseUrl}/slow`);
  await po.assertLoaded();
});

Then('the Slow Resources page should load', async function (this: CustomWorld) {
  const po = new SlowResourcesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Slow Resources page', async function (this: CustomWorld) {
  const po = new SlowResourcesPage(this.page);
  await po.exercise();
});
