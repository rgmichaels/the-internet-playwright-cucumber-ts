import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class SecureFileDownloadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/download_secure$/, { timeout: 20_000 });

    // This page is basically a file listing
    const content = this.page.locator('#content');
    await expect(content).toBeVisible({ timeout: 20_000 });
    await expect(content).toContainText('Secure File Downloader', { timeout: 20_000 });

    // There should be at least 1 file link
    const links = this.page.locator('#content a');
    await expect
      .poll(async () => await links.count(), { timeout: 20_000 })
      .toBeGreaterThan(0);
  }

  async exercise() {
    const firstLink = this.page.locator('#content a').first();
    await expect(firstLink).toBeVisible({ timeout: 20_000 });

    const fileName = ((await firstLink.textContent()) ?? '').trim();
    expect(fileName.length).toBeGreaterThan(0);

    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 20_000 }),
      firstLink.click(),
    ]);

    const suggested = download.suggestedFilename();
    expect(suggested.length).toBeGreaterThan(0);

    console.log(`DEBUG: secure download link="${fileName}" suggestedFilename="${suggested}"`);
  }
}
