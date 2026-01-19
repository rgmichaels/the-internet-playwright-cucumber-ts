import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { SortableDataTablesPage } from '../pages/SortableDataTablesPage';

Given('I open the Sortable Data Tables page', async function (this: CustomWorld) {
  const po = new SortableDataTablesPage(this.page);
  await this.page.goto(`${this.baseUrl}/tables`);
  await po.assertLoaded();
});

Then('the Sortable Data Tables page should load', async function (this: CustomWorld) {
  const po = new SortableDataTablesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Sortable Data Tables page', async function (this: CustomWorld) {
  const po = new SortableDataTablesPage(this.page);
  await po.exercise();
});
