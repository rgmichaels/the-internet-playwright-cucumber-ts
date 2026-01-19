import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DisappearingElementsPage } from '../pages/DisappearingElementsPage';

Given('I open the Disappearing Elements page', async function (this: CustomWorld) {
  const po = new DisappearingElementsPage(this.page);
  await this.page.goto(`${this.baseUrl}/disappearing_elements`);
  await po.assertLoaded();
});

Then('the Disappearing Elements page should load', async function (this: CustomWorld) {
  const po = new DisappearingElementsPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Disappearing Elements page', async function (this: CustomWorld) {
  const po = new DisappearingElementsPage(this.page);
  await po.exercise();
});
