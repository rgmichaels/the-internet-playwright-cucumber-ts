import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class TyposPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Typos'); }

  async checkParagraphExists() {
    const p = this.page.locator('#content p').nth(1);
    await expect(p).toBeVisible();
  }

  async exercise() {
    await this.checkParagraphExists();
  }
}
