import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class InfiniteScrollPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Infinite Scroll'); }

  async scrollDownToLoadMore() {
    const paragraphs = this.page.locator('#content .jscroll-added');
    const before = await paragraphs.count();

    await expect
      .poll(
        async () => {
          await this.page.mouse.wheel(0, 2500);
          return paragraphs.count();
        },
        {
          message: 'Infinite Scroll should append content after scrolling',
          timeout: 20_000,
        }
      )
      .toBeGreaterThan(before);
  }

  async scrollAndExpectMore() {
    await this.scrollDownToLoadMore();
  }

  async exercise() {
    await this.scrollAndExpectMore();
  }
}
