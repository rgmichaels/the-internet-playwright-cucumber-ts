import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { InputsPage } from '../pages/InputsPage';

Given('I open the Inputs page', async function (this: CustomWorld) {
  const po = new InputsPage(this.page);
  await this.page.goto(`${this.baseUrl}/inputs`);
  await po.assertLoaded();
});

Then('the Inputs page should load', async function (this: CustomWorld) {
  const po = new InputsPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Inputs page', async function (this: CustomWorld) {
  const po = new InputsPage(this.page);
  await po.exercise();
});
