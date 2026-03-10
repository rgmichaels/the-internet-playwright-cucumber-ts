import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class FileDownloadPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('File Downloader'); }

  async downloadFirst() {
    const first = this.page.locator('#content a').first();
    await expect(first).toBeVisible();
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      first.click()
    ]);
    const file = download.suggestedFilename();
    expect(file.length).toBeGreaterThan(0);
    // We don't need to save it for this demo suite.
    await download.cancel().catch(() => {});
  }

  async exercise() {
    await this.downloadFirst();
  }

  async assertFirstLinkTextMatchesDownloadedFilename() {
    const first = this.page.locator('#content a').first();
    await expect(first).toBeVisible();

    const linkText = ((await first.textContent()) ?? '').trim();
    expect(linkText.length).toBeGreaterThan(0);

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      first.click(),
    ]);

    const suggested = download.suggestedFilename().trim();
    expect(suggested.length).toBeGreaterThan(0);
    expect(suggested).toBe(linkText);

    await download.cancel().catch(() => {});
  }
}
