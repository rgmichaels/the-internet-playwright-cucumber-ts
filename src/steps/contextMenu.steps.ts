import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ContextMenuPage } from '../pages/ContextMenuPage';

Given('I open the Context Menu page', async function (this: CustomWorld) {
  const po = new ContextMenuPage(this.page);
  await this.page.goto(`${this.baseUrl}/context_menu`);
  await po.assertLoaded();
});

Then('the Context Menu page should load', async function (this: CustomWorld) {
  const po = new ContextMenuPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Context Menu page', async function (this: CustomWorld) {
  const po = new ContextMenuPage(this.page);
  await po.exercise();
});

Then('the page should display header and content', async function (this: CustomWorld) {
  const po = new ContextMenuPage(this.page);
  await po.assertLoaded();
});
