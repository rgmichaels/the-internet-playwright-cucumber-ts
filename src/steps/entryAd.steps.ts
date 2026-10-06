import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { EntryAdPage } from '../pages/EntryAdPage';

Given('I open the Entry Ad page', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await this.page.goto(`${this.baseUrl}/entry_ad`);
  await po.assertLoaded();
});

Given('I am on the entry ad page', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await this.page.goto(`${this.baseUrl}/entry_ad`);
  await po.assertLoaded();
});

Then('the Entry Ad page should load', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await po.assertLoaded();
});

Then('an Entry Ad modal window should appear', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await po.assertModalAppears();
});

Then('the page title should be populated', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await po.assertTitleTagHasText();
});

Then('I exercise the Entry Ad page', async function (this: CustomWorld) {
  const po = new EntryAdPage(this.page);
  await po.exercise();
});
