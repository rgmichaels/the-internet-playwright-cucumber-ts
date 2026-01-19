import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { EntryAdPage } from '../pages/EntryAdPage';

Given('I open the Entry Ad page', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await this.page.goto(`${this.baseUrl}/entry_ad`);
  await po.assertLoaded();
});

Then('the Entry Ad page should load', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Entry Ad page', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await po.exercise();
});
