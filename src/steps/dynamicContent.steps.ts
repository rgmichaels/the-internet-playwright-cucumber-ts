import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DynamicContentPage } from '../pages/DynamicContentPage';

Given('I open the Dynamic Content page', async function (this: CustomWorld) {
  const po = new DynamicContentPage(this.page);
  await this.page.goto(`${this.baseUrl}/dynamic_content`);
  await po.assertLoaded();
});

Then('the Dynamic Content page should load', async function (this: CustomWorld) {
  const po = new DynamicContentPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Dynamic Content page', async function (this: CustomWorld) {
  const po = new DynamicContentPage(this.page);
  await po.exercise();
});
