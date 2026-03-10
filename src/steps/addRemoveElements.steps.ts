import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { AddRemoveElementsPage } from '../pages/AddRemoveElementsPage';

Given('I open the Add\\/Remove Elements page', async function (this: CustomWorld) {
  const po = new AddRemoveElementsPage(this.page);
  await this.page.goto(`${this.baseUrl}/add_remove_elements/`);
  await po.assertLoaded();
});

Then('the Add\\/Remove Elements page should load', async function (this: CustomWorld) {
  const po = new AddRemoveElementsPage(this.page);
  await po.assertLoaded();
});

Then('I Add and remove elements to verify correct behavior', async function (this: CustomWorld) {
  const po = new AddRemoveElementsPage(this.page);
  await po.exercise();
});

Then('Add\\/Remove Elements should keep delete button count in sync across multiple actions', async function (this: CustomWorld) {
  const po = new AddRemoveElementsPage(this.page);
  await po.exerciseMultipleCountSync();
});
