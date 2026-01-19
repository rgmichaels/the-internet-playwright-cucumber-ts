import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ChallengingDomPage } from '../pages/ChallengingDomPage';

Given('I open the Challenging DOM page', async function (this: CustomWorld) {
  const po = new ChallengingDomPage(this.page);
  await this.page.goto(`${this.baseUrl}/challenging_dom`);
  await po.assertLoaded();
});

Then('the Challenging DOM page should load', async function (this: CustomWorld) {
  const po = new ChallengingDomPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Challenging DOM page', async function (this: CustomWorld) {
  const po = new ChallengingDomPage(this.page);
  await po.exercise();
});
