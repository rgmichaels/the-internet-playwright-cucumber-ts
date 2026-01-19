import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { InfiniteScrollPage } from '../pages/InfiniteScrollPage';

Given('I open the Infinite Scroll page', async function (this: CustomWorld) {
  const po = new InfiniteScrollPage(this.page);
  await this.page.goto(`${this.baseUrl}/infinite_scroll`);
  await po.assertLoaded();
});

Then('the Infinite Scroll page should load', async function (this: CustomWorld) {
  const po = new InfiniteScrollPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Infinite Scroll page', async function (this: CustomWorld) {
  const po = new InfiniteScrollPage(this.page);
  await po.exercise();
});
