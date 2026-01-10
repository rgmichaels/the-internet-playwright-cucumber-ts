import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(baseUrl: string) {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('h1')).toHaveText('Welcome to the-internet');
  }

  async openExample(name: string) {
    const link = this.page.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();
    await link.click();
  }
}
