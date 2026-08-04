import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicContentPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Dynamic Content'); }

  async refreshAndExpectChange() {
    const firstRow = this.page.locator('#content .row').first();
    const firstRowImage = this.page.locator('#content .row img').first();

    await expect(firstRow).toBeVisible();
    await expect(firstRowImage).toBeVisible();

    const beforeText = await firstRow.textContent();
    const beforeImageSrc = await firstRowImage.getAttribute('src');

    await this.page.getByRole('link', { name: 'click here' }).click();
    await expect(firstRow).toBeVisible();

    await expect
      .poll(
        async () => {
          const afterText = await firstRow.textContent();
          const afterImageSrc = await firstRowImage.getAttribute('src');
          return afterText !== beforeText || afterImageSrc !== beforeImageSrc;
        },
        {
          message: 'Expected the refreshed first row text or image to change',
          timeout: 20_000,
        }
      )
      .toBe(true);
  }

  async exercise() {
    await this.refreshAndExpectChange();
  }
}
