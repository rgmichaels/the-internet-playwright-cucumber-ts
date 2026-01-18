import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ABTestingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    const h3 = this.page.locator('#content h3');
    await expect(h3).toBeVisible({ timeout: 20_000 });

    const text = (await h3.textContent())?.trim();
    const allowed = ['A/B Test Control', 'A/B Test Variation 1'];

    expect(allowed, `Unexpected A/B test variant header: "${text}"`).toContain(text);
  }

  async exercise() {
    await expect(this.page.locator('#content')).toBeVisible();
  }

  async assertFooterElementalSelenium(expectedFooterText = 'Powered by Elemental Selenium') {
    const footer = this.page.locator('#page-footer');
    await expect(footer).toContainText(expectedFooterText, { timeout: 20_000 });

    const link = footer.locator('a', { hasText: 'Elemental Selenium' });
    await expect(link).toBeVisible({ timeout: 20_000 });

    const href = await link.getAttribute('href');
    expect(href, 'Footer link should have an href').toBeTruthy();
    expect(href!).toMatch(/^https?:\/\/(www\.)?elementalselenium\.com\/?/i);
  }

  async assertDescriptionTextPresent() {
    const content = this.page.locator('#content');

    await expect(content).toContainText(
      'Also known as split testing. This is a way in which businesses are able to simultaneously test and learn different versions of a page',
      { timeout: 20_000 }
    );
  }
}
