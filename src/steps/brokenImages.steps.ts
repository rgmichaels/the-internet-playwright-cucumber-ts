import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { BrokenImagesPage } from '../pages/BrokenImagesPage';

Given('I open the Broken Images page', async function (this: CustomWorld) {
  const po = new BrokenImagesPage(this.page);
  await this.page.goto(`${this.baseUrl}/broken_images`);
  await po.assertLoaded();
});

Then('the Broken Images page should load', async function (this: CustomWorld) {
  const po = new BrokenImagesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Broken Images page', async function (this: CustomWorld) {
  const po = new BrokenImagesPage(this.page);
  await po.exercise();
});
