import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';

Given('I open the Dynamic Loading page', async function (this: CustomWorld) {
  const po = new DynamicLoadingPage(this.page);
  await this.page.goto(`${this.baseUrl}/dynamic_loading`);
  await po.assertLoaded();
});

Then('the Dynamic Loading page should load', async function (this: CustomWorld) {
  const po = new DynamicLoadingPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Dynamic Loading page', async function (this: CustomWorld) {
  const po = new DynamicLoadingPage(this.page);
  await po.exercise();
});
