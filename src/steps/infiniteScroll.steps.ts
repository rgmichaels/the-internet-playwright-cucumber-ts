import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { InfiniteScrollPage } from '../pages/InfiniteScrollPage';
import { expect } from '@playwright/test';

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

When('I scroll down on the Infinite Scroll page', async function (this: CustomWorld) {
  (this as any).infiniteScrollCountBefore = await this.page.locator('#content .jscroll-added').count();

  const po = new InfiniteScrollPage(this.page);
  await po.scrollDownToLoadMore();
});

Then(
  'the Infinite Scroll page should append more content blocks',
  async function (this: CustomWorld) {
    const after = await this.page.locator('#content .jscroll-added').count();
    expect(after).toBeGreaterThan((this as any).infiniteScrollCountBefore ?? -1);
  }
);
