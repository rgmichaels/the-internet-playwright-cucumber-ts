import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ChallengingDomPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private readonly description = this.page.locator('#content p');

  async assertLoaded() {
    await this.expectH3ToBe('Challenging DOM');

    // NEW: verify the paragraph text
    await expect(this.description).toHaveText(
      `The hardest part in automated web testing is finding the best locators (e.g., ones that well named, unique, and unlikely to change). It's more often than not that the application you're testing was not built with this concept in mind. This example demonstrates that with unique IDs, a table with no helpful locators, and a canvas element.`
    );
  }

  async clickAllButtons() {
    const buttons = this.page.locator('.large-2.columns a.button');
    await expect(buttons).toHaveCount(3);

    const firstLabel = await buttons.first().textContent();

    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await buttons.nth(2).click();

    // Buttons change IDs / labels; assert table still present
    await expect(this.page.locator('table')).toBeVisible();
    expect((firstLabel ?? '').length).toBeGreaterThan(0);
  }

  async exercise() {
    await this.clickAllButtons();
  }
}
