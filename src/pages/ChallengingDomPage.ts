import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ChallengingDomPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Challenging DOM'); }

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
