import { Given, Then, When } from '@cucumber/cucumber';
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

When(
  'I move the Horizontal Slider to the maximum value',
  async function (this: CustomWorld) {
    const po = new HorizontalSliderPage(this.page);
    await po.moveToMaximum();
  }
);

Then(
  'the Horizontal Slider displayed value should be {string}',
  async function (this: CustomWorld, expectedValue: string) {
    const po = new HorizontalSliderPage(this.page);
    await po.assertDisplayedValue(expectedValue);
  }
);
