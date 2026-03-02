import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class InfiniteScrollPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Infinite Scroll'); }

  async scrollDownToLoadMore() {
    const paragraphs = this.page.locator('#content .jscroll-added');
    const before = await paragraphs.count();

    for (let attempt = 0; attempt < 6; attempt += 1) {
      await this.page.mouse.wheel(0, 2500);
      await this.page.waitForTimeout(400);
      const after = await paragraphs.count();
      if (after > before) {
        return;
      }
    }
  }

  async scrollAndExpectMore() {
    const paragraphs = this.page.locator('#content .jscroll-added');
    const before = await paragraphs.count();
    await this.scrollDownToLoadMore();
    const after = await paragraphs.count();
    expect(after).toBeGreaterThan(before);
  }

  async exercise() {
    await this.scrollAndExpectMore();
  }
}
