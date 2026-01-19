import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { NestedFramesPage } from '../pages/NestedFramesPage';

Given('I open the Nested Frames page', async function (this: CustomWorld) {
  const po = new NestedFramesPage(this.page);
  await this.page.goto(`${this.baseUrl}/nested_frames`);
  await po.assertLoaded();
});

Then('the Nested Frames page should load', async function (this: CustomWorld) {
  const po = new NestedFramesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Nested Frames page', async function (this: CustomWorld) {
  const po = new NestedFramesPage(this.page);
  await po.exercise();
});
