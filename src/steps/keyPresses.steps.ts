import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { KeyPressesPage } from '../pages/KeyPressesPage';

Given('I open the Key Presses page', async function (this: CustomWorld) {
  const po = new KeyPressesPage(this.page);
  await this.page.goto(`${this.baseUrl}/key_presses`);
  await po.assertLoaded();
});

Then('the Key Presses page should load', async function (this: CustomWorld) {
  const po = new KeyPressesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Key Presses page', async function (this: CustomWorld) {
  const po = new KeyPressesPage(this.page);
  await po.exercise();
});
