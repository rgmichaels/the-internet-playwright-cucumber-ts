import { Given, Then, When } from '@cucumber/cucumber';
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

Then(
  'removing and restoring the dynamic checkbox should complete once per action',
  async function (this: CustomWorld) {
    const po = new DynamicControlsPage(this.page);
    await po.removeAndAddCheckbox();
  }
);

When(
  'I enable the dynamic input and enter {string}',
  async function (this: CustomWorld, value: string) {
    const po = new DynamicControlsPage(this.page);
    await po.enableInputAndEnter(value);
  }
);

Then(
  'disabling the dynamic input should preserve {string}',
  async function (this: CustomWorld, value: string) {
    const po = new DynamicControlsPage(this.page);
    await po.disableInputAndAssertValue(value);
  }
);
