import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HorizontalSliderPage } from '../pages/HorizontalSliderPage';

Given('I open the Horizontal Slider page', async function (this: CustomWorld) {
  const po = new HorizontalSliderPage(this.page);
  await this.page.goto(`${this.baseUrl}/horizontal_slider`);
  await po.assertLoaded();
});

Then('the Horizontal Slider page should load', async function (this: CustomWorld) {
  const po = new HorizontalSliderPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Horizontal Slider page', async function (this: CustomWorld) {
  const po = new HorizontalSliderPage(this.page);
  await po.exercise();
});
