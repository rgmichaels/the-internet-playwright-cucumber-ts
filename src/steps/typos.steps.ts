import { Given, Then } from '@cucumber/cucumber';
import type { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TyposPage } from '../pages/TyposPage';

Given('I open the Typos page', async function (this: CustomWorld) {
  const po = new TyposPage(this.page);
  await this.page.goto(`${this.baseUrl}/typos`);
  await po.assertLoaded();
});

Given('I am on the typos page', async function (this: CustomWorld) {
  // Alias for readability in scenarios
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

Then('I should see the following text:', async function (this: CustomWorld, table: DataTable) {
  const po = new TyposPage(this.page);
  const snippets = table.raw().map((row) => row[0]).filter(Boolean);
  await po.assertContentIncludes(snippets);
});
