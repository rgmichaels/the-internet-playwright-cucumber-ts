import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DropdownPage } from '../pages/DropdownPage';

Given('I open the Dropdown page', async function (this: CustomWorld) {
  const po = new DropdownPage(this.page);
  await this.page.goto(`${this.baseUrl}/dropdown`);
  await po.assertLoaded();
});

Then('the Dropdown page should load', async function (this: CustomWorld) {
  const po = new DropdownPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Dropdown page', async function (this: CustomWorld) {
  const po = new DropdownPage(this.page);
  await po.exercise();
});
