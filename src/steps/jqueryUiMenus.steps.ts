import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { JqueryUiMenusPage } from '../pages/JqueryUiMenusPage';

Given('I open the JQuery UI Menus page', async function (this: CustomWorld) {
  const po = new JqueryUiMenusPage(this.page);
  await this.page.goto(`${this.baseUrl}/jqueryui/menu`);
  await po.assertLoaded();
});

Then('the JQuery UI Menus page should load', async function (this: CustomWorld) {
  const po = new JqueryUiMenusPage(this.page);
  await po.assertLoaded();
});

Then(
  'downloading CSV from the JQuery UI Menus page returns the expected artifact',
  async function (this: CustomWorld) {
    const po = new JqueryUiMenusPage(this.page);
    await po.assertCsvDownloadContract();
  }
);
