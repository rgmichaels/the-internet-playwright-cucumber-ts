import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HoversPage } from '../pages/HoversPage';

Given('I open the Hovers page', async function (this: CustomWorld) {
  const po = new HoversPage(this.page);
  await this.page.goto(`${this.baseUrl}/hovers`);
  await po.assertLoaded();
});

Then('the Hovers page should load', async function (this: CustomWorld) {
  const po = new HoversPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Hovers page', async function (this: CustomWorld) {
  const po = new HoversPage(this.page);
  await po.exercise();
});

Then('each hover avatar should reveal the correct user profile link', async function (this: CustomWorld) {
  const po = new HoversPage(this.page);
  await po.verifyAllHoverCards();
});
