import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class RedirectLinkPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Redirection'); }

  async followRedirectAndValidate() {
    await this.page.getByRole('link', { name: 'here' }).click();
    // lands on status codes landing
    await expect(this.page.locator('h3')).toHaveText('Status Codes');
  }

  async exercise() {
    await this.followRedirectAndValidate();
  }
}
