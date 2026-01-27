import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class FloatingMenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await this.expectH3ToBe('Floating Menu');
  }

 async assertAtLeastOneParagraphPresent() {
  const paragraphs = this.page.locator('p');
  const count = await paragraphs.count();

  expect(
    count,
    'Expected at least one <p> element to be present on the Floating Menu page'
  ).toBeGreaterThan(0);
}

  async scrollAndVerifyMenuStays() {
    const menu = this.page.locator('#menu');

    await expect(menu, 'Expected the floating menu (#menu) to be visible').toBeVisible();

    await this.page.mouse.wheel(0, 2000);

    await expect(menu, 'Expected the floating menu (#menu) to remain visible after scrolling').toBeVisible();

    // Optional: ensure clicking Home doesn’t break visibility
    await menu.getByRole('link', { name: 'Home' }).click();
    await expect(this.page.locator('#menu'), 'Expected the floating menu (#menu) to be visible after clicking Home').toBeVisible();
  }

  async exercise() {
    await this.assertLoaded();
    await this.assertAtLeastOneParagraphPresent();
    await this.scrollAndVerifyMenuStays();
  }
}
