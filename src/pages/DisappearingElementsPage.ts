import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DisappearingElementsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Disappearing Elements'); }

  async exercise() {
    // Menu items can appear/disappear on refresh; assert menu exists and has at least 4 items.
    const items = this.page.locator('ul li a');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(4);
  }
}
