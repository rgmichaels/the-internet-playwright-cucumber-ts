import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { CheckboxesPage } from '../pages/CheckboxesPage';

Given('I open the Checkboxes page', async function (this: CustomWorld) {
  const po = new CheckboxesPage(this.page);
  await this.page.goto(`${this.baseUrl}/checkboxes`);
  await po.assertLoaded();
});

Then('the Checkboxes page should load', async function (this: CustomWorld) {
  const po = new CheckboxesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Checkboxes page', async function (this: CustomWorld) {
  const po = new CheckboxesPage(this.page);
  await po.exercise();
});
