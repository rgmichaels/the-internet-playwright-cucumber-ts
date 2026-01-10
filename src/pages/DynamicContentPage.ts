import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicContentPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Dynamic Content'); }

  async refreshAndExpectChange() {
    const firstRow = this.page.locator('#content .row').first();
    await expect(firstRow).toBeVisible();
    const before = await firstRow.textContent();
    await this.page.getByRole('link', { name: 'click here' }).click();
    await expect(firstRow).toBeVisible();
    const after = await firstRow.textContent();
    // It's "dynamic" but can occasionally match; accept either changed text or different image src.
    const beforeImg = await this.page.locator('#content .row img').first().getAttribute('src');
    const afterImg = await this.page.locator('#content .row img').first().getAttribute('src');
    expect((before ?? '') !== (after ?? '') || (beforeImg ?? '') !== (afterImg ?? '')).toBeTruthy();
  }

  async exercise() {
    await this.refreshAndExpectChange();
  }
}
