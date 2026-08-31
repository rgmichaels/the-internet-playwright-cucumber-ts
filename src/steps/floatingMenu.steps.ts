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
  'at least 3 Lorem Ipsum paragraphs should be visible on the Floating Menu page',
  async function (this: CustomWorld) {
    const po = new FloatingMenuPage(this.page);
    await po.assertAtLeastLoremIpsumParagraphsVisible(3);
  }
);

Then(
  'the Floating Menu should remain in the viewport while the content scrolls',
  async function (this: CustomWorld) {
    const po = new FloatingMenuPage(this.page);
    await po.assertMenuRemainsInViewportWhileScrolling();
  }
);
