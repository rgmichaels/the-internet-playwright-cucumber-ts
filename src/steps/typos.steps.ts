import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TyposPage } from '../pages/TyposPage';

Given('I open the Typos page', async function (this: CustomWorld) {
  const po = new TyposPage(this.page);
  await this.page.goto(`${this.baseUrl}/typos`);
  await po.assertLoaded();
});

Then('the Typos page should load', async function (this: CustomWorld) {
  const po = new TyposPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Typos page', async function (this: CustomWorld) {
  const po = new TyposPage(this.page);
  await po.exercise();
});
