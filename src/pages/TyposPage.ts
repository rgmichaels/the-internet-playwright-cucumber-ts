import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class TyposPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await this.expectH3ToBe('Typos');
  }

  async checkParagraphExists() {
    const p = this.page.locator('#content p').nth(1);
    await expect(p).toBeVisible();
  }

  async exercise() {
    await this.checkParagraphExists();
  }

  /**
   * The Typos page intentionally varies, so we assert stable snippets rather than exact paragraphs.
   */
  async assertContentIncludes(snippets: string[]) {
    const text = (await this.page.locator('#content').innerText()).trim();
    for (const snippet of snippets) {
      await expect(text).toContain(snippet);
    }
  }
}
