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

  /**
   * Global footer contract: attribution text and valid Elemental Selenium link.
   * Keep this centralized so every page can reuse it.
   */
  async assertGlobalFooterPoweredByElementalSelenium(
    expectedText = 'Powered by Elemental Selenium'
  ) {
    const footer = this.page.locator('#page-footer');

    await expect(footer).toContainText(expectedText, { timeout: 15_000 });

    const link = footer.locator('a', { hasText: 'Elemental Selenium' });
    await expect(link).toBeVisible({ timeout: 15_000 });

    const href = await link.getAttribute('href');
    expect(href, 'Elemental Selenium footer link should have an href').toBeTruthy();
    expect(href!).toMatch(/^https?:\/\/(www\.)?elementalselenium\.com\/?/i);
  }
}
