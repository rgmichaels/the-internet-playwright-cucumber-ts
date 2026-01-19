import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DynamicControlsPage } from '../pages/DynamicControlsPage';

Given('I open the Dynamic Controls page', async function (this: CustomWorld) {
  const po = new DynamicControlsPage(this.page);
  await this.page.goto(`${this.baseUrl}/dynamic_controls`);
  await po.assertLoaded();
});

Then('the Dynamic Controls page should load', async function (this: CustomWorld) {
  const po = new DynamicControlsPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Dynamic Controls page', async function (this: CustomWorld) {
  const po = new DynamicControlsPage(this.page);
  await po.exercise();
});
