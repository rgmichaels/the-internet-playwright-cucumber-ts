import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class InfiniteScrollPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Infinite Scroll'); }

  async scrollAndExpectMore() {
    const paragraphs = this.page.locator('#content .jscroll-added');
    const before = await paragraphs.count();
    await this.page.mouse.wheel(0, 2500);
    await this.page.waitForTimeout(1000);
    const after = await paragraphs.count();
    expect(after).toBeGreaterThanOrEqual(before);
  }

  async exercise() {
    await this.scrollAndExpectMore();
  }
}
