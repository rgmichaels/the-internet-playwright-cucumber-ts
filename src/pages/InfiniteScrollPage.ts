import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class InfiniteScrollPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() {
    await this.expectH3ToBe('Infinite Scroll');

    const firstCompletedBlock = this.contentBlocks().first();
    await expect(
      firstCompletedBlock,
      'Infinite Scroll should render initial completed content'
    ).toBeVisible({ timeout: 20_000 });
    await expect(firstCompletedBlock).toContainText(/\S/);
  }

  private contentBlocks() {
    return this.page
      .locator('#content .jscroll-added')
      .filter({ hasNot: this.page.locator('.jscroll-loading') });
  }

  private async contentBlockTexts() {
    return (await this.contentBlocks().allInnerTexts()).map((text) =>
      text.replace(/\s+/g, ' ').trim()
    );
  }

  async scrollDownToLoadMore() {
    const paragraphs = this.contentBlocks();
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

  async assertContentIntegrityAfterAppend() {
    const before = await this.contentBlockTexts();
    expect(before.length, 'Infinite Scroll should start with rendered content').toBeGreaterThan(0);
    for (const text of before) {
      expect(text, 'Initial Infinite Scroll blocks should contain text').toMatch(/\S/);
    }

    await this.scrollDownToLoadMore();

    const after = await this.contentBlockTexts();
    expect(after.length).toBeGreaterThan(before.length);
    expect(after.slice(0, before.length)).toEqual(before);

    const appended = after.slice(before.length);
    for (const text of appended) {
      expect(text, 'Appended Infinite Scroll blocks should contain text').toMatch(/\S/);
    }
  }

  async scrollAndExpectMore() {
    await this.scrollDownToLoadMore();
  }

  async exercise() {
    await this.scrollAndExpectMore();
  }
}
