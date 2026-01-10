import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class LargeDeepDomPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Large & Deep DOM'); }

  async assertTableHasRows() {
    const rows = this.page.locator('#large-table tr');
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(5);
  }

  async exercise() {
    await this.assertTableHasRows();
  }
}
