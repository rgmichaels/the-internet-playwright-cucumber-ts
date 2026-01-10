import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class SlowResourcesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Slow Resources'); }

  async exercise() {
    // Just ensure the spinner/resource-heavy page renders.
    await expect(this.page.locator('#content')).toBeVisible();
  }
}
