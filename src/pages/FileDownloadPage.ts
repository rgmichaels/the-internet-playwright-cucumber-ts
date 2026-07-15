import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type DownloadableLink = {
  fileName: string;
  locator: Locator;
};

export class FileDownloadPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('File Downloader'); }

  private async findDownloadableLink(): Promise<DownloadableLink> {
    const links = this.page.locator('#content a');
    const count = await links.count();
    expect(count, 'File Downloader should list at least one file').toBeGreaterThan(0);

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
        await expect(locator).toBeVisible();
        return { fileName, locator };
      }

      rejected.push(`${fileName} (${response.status()})`);
      await response.dispose();
    }

    throw new Error(`No downloadable file link was available. Rejected: ${rejected.join(', ')}`);
  }

  async downloadAvailableFile() {
    const { locator } = await this.findDownloadableLink();
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      locator.click()
    ]);
    const file = download.suggestedFilename();
    expect(file.length).toBeGreaterThan(0);
    // We don't need to save it for this demo suite.
    await download.cancel().catch(() => {});
  }

  async exercise() {
    await this.downloadAvailableFile();
  }

  async assertDownloadableLinkTextMatchesDownloadedFilename() {
    const { fileName, locator } = await this.findDownloadableLink();

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      locator.click(),
    ]);

    const suggested = download.suggestedFilename().trim();
    expect(suggested.length).toBeGreaterThan(0);
    expect(suggested).toBe(fileName);

    await download.cancel().catch(() => {});
  }
}
