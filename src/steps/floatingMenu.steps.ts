import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { FloatingMenuPage } from '../pages/FloatingMenuPage';

Given('I open the Floating Menu page', async function (this: CustomWorld) {
  const po = new FloatingMenuPage(this.page);

  await this.page.goto(`${this.baseUrl}/floating_menu`);
  await po.assertLoaded();
});

Then('the Floating Menu page should load', async function (this: CustomWorld) {
  const po = new FloatingMenuPage(this.page);
  await po.assertLoaded();
});

Then(
  'at least one Paragraph of text should be present on the page',
  async function (this: CustomWorld) {
    const po = new FloatingMenuPage(this.page);
    await po.assertAtLeastOneParagraphPresent();
  }
);

Then('I exercise the Floating Menu page', async function (this: CustomWorld) {
  const po = new FloatingMenuPage(this.page);
  await po.exercise();
});
