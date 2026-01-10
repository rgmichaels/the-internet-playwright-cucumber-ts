import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class HoversPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Hovers'); }

  async hoverFirstAndVerify() {
    const figure = this.page.locator('.figure').first();
    await expect(figure).toBeVisible();
    await figure.hover();
    await expect(figure.locator('.figcaption')).toBeVisible();
    await expect(figure.locator('.figcaption h5')).toContainText('name: user1');
  }

  async exercise() {
    await this.hoverFirstAndVerify();
  }
}
