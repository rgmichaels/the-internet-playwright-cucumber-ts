import { Page } from 'playwright';
import { expect } from 'playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Scope to #content to avoid surprises from other headings and give a slightly longer timeout.
   */
  async expectH3ToBe(expected: string) {
    const h3 = this.page.locator('#content h3');
    await expect(h3).toHaveText(expected, { timeout: 15_000 });
  }

  async expectH3ToContain(expected: string) {
    const h3 = this.page.locator('#content h3');
    await expect(h3).toContainText(expected, { timeout: 15_000 });
  }
}
