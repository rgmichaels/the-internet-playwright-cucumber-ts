import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ShiftingContentPage } from '../pages/ShiftingContentPage';

Given('I open the Shifting Content page', async function (this: CustomWorld) {
  const po = new ShiftingContentPage(this.page);
  await this.page.goto(`${this.baseUrl}/shifting_content`);
  await po.assertLoaded();
});

Then('the Shifting Content page should load', async function (this: CustomWorld) {
  const po = new ShiftingContentPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Shifting Content page', async function (this: CustomWorld) {
  const po = new ShiftingContentPage(this.page);
  await po.exercise();
});

When('I open the Shifting Content image example', async function (this: CustomWorld) {
  const po = new ShiftingContentPage(this.page);
  await po.openImageExample();
});

Then(
  'the Shifting Content image example should show the image and description',
  async function (this: CustomWorld) {
    const po = new ShiftingContentPage(this.page);
    await po.assertImageExampleContent();
  }
);
