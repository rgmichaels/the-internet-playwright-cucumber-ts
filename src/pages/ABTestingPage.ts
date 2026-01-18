import { Page, Locator } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ABTestingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await this.expectH3ToContain('A/B Test');
  }

  async exercise() {
    // Minimal per-page exercise: confirm main content area is visible.
    await expect(this.page.locator('#content')).toBeVisible();
  }

  private footer(): Locator {
    return this.page.locator('#page-footer');
  }

  private elementalSeleniumLink(): Locator {
    return this.page.locator('#page-footer a', {
      hasText: 'Elemental Selenium',
    });
  }

  async assertFooterElementalSelenium() {
    // Assert footer text
    await expect(this.footer()).toContainText(
      'Powered by Elemental Selenium',
      { timeout: 20_000 }
    );

    // Assert link exists and is visible
    const link = this.elementalSeleniumLink();
    await expect(link).toBeVisible({ timeout: 20_000 });

    // Assert link is valid
    const href = await link.getAttribute('href');
    expect(href, 'Footer link should have an href').toBeTruthy();
    expect(href!).toMatch(/^https?:\/\/(www\.)?elementalselenium\.com\/?/i);
  }
}

