import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type DownloadableLink = {
  fileName: string;
  locator: Locator;
};

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

  private async findDownloadableLink(): Promise<DownloadableLink> {
    const links = this.page.locator('#content a');
    const count = await links.count();
    expect(count, 'Secure File Downloader should list at least one file').toBeGreaterThan(0);

    const rejected: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const locator = links.nth(index);
      const fileName = ((await locator.textContent()) ?? '').trim();
      const href = await locator.getAttribute('href');

      if (!fileName || !href) {
        continue;
      }

      const response = await this.page.context().request.head(new URL(href, this.page.url()).toString(), {
        failOnStatusCode: false,
      });
      const contentDisposition = response.headers()['content-disposition'] ?? '';
      const isDownload = response.ok() && /\battachment\b/i.test(contentDisposition);

      if (isDownload) {
        await response.dispose();
        await expect(locator).toBeVisible({ timeout: 20_000 });
        return { fileName, locator };
      }

      rejected.push(`${fileName} (${response.status()})`);
      await response.dispose();
    }

    throw new Error(`No downloadable secure file link was available. Rejected: ${rejected.join(', ')}`);
  }

  async exercise() {
    const { fileName, locator } = await this.findDownloadableLink();

    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 20_000 }),
      locator.click(),
    ]);

    const suggested = download.suggestedFilename().trim();
    expect(suggested.length).toBeGreaterThan(0);
    expect(suggested).toBe(fileName);

    await download.cancel().catch(() => {});
  }
}
