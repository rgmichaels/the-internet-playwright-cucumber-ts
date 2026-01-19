import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ExitIntentPage } from '../pages/ExitIntentPage';

Given('I open the Exit Intent page', async function (this: CustomWorld) {
  const po = new ExitIntentPage(this.page);
  await this.page.goto(`${this.baseUrl}/exit_intent`);
  await po.assertLoaded();
});

Then('the Exit Intent page should load', async function (this: CustomWorld) {
  const po = new ExitIntentPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Exit Intent page', async function (this: CustomWorld) {
  const po = new ExitIntentPage(this.page);
  await po.exercise();
});
