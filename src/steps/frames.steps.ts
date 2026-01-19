import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { FramesPage } from '../pages/FramesPage';

Given('I open the Frames page', async function (this: CustomWorld) {
  const po = new FramesPage(this.page);
  await this.page.goto(`${this.baseUrl}/frames`);
  await po.assertLoaded();
});

Then('the Frames page should load', async function (this: CustomWorld) {
  const po = new FramesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Frames page', async function (this: CustomWorld) {
  const po = new FramesPage(this.page);
  await po.exercise();
});
