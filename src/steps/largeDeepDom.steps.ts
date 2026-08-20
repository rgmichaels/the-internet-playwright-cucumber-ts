import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { LargeDeepDomPage } from '../pages/LargeDeepDomPage';

Given('I open the Large & Deep DOM page', async function (this: CustomWorld) {
  const po = new LargeDeepDomPage(this.page);
  await this.page.goto(`${this.baseUrl}/large`);
  await po.assertLoaded();
});

Then('the Large & Deep DOM page should load', async function (this: CustomWorld) {
  const po = new LargeDeepDomPage(this.page);
  await po.assertLoaded();
});

Then(
  'the Large & Deep DOM page should expose all nested tiers and grid coordinates',
  async function (this: CustomWorld) {
    const po = new LargeDeepDomPage(this.page);
    await po.assertCompleteDataTopology();
  }
);
