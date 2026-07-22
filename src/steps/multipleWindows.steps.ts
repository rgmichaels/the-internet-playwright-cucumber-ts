import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { MultipleWindowsPage } from '../pages/MultipleWindowsPage';

Given('I open the Multiple Windows page', async function (this: CustomWorld) {
  const po = new MultipleWindowsPage(this.page);
  await this.page.goto(`${this.baseUrl}/windows`);
  await po.assertLoaded();
});

Then('the Multiple Windows page should load', async function (this: CustomWorld) {
  const po = new MultipleWindowsPage(this.page);
  await po.assertLoaded();
});

Then(
  'the popup should close without replacing the original Multiple Windows page',
  async function (this: CustomWorld) {
    const po = new MultipleWindowsPage(this.page);
    await po.assertPopupLifecycle();
  }
);
