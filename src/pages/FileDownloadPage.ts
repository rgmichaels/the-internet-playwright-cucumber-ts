import { createHash } from 'node:crypto';
import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type DownloadableLink = {
  fileName: string;
  locator: Locator;
  url: string;
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

      const url = new URL(href, this.page.url()).toString();
      const response = await this.page.context().request.head(url, {
        failOnStatusCode: false,
      });
      const contentDisposition = response.headers()['content-disposition'] ?? '';
      const contentLength = response.headers()['content-length'];
      const isKnownEmpty = contentLength !== undefined && Number(contentLength) === 0;
      const isDownload =
        response.ok() && /\battachment\b/i.test(contentDisposition) && !isKnownEmpty;

      if (isDownload) {
        await response.dispose();
        await expect(locator).toBeVisible();
        return { fileName, locator, url };
      }

      rejected.push(`${fileName} (${response.status()}, ${contentLength ?? 'unknown'} bytes)`);
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

  async assertDownloadedPayloadMatchesServerResponse() {
    const { fileName, locator, url } = await this.findDownloadableLink();
    const expectedResponse = await this.page.context().request.get(url, {
      failOnStatusCode: false,
    });

    try {
      expect(expectedResponse.ok(), `Expected GET ${url} to succeed`).toBe(true);
      expect(expectedResponse.headers()['content-disposition'] ?? '').toMatch(/\battachment\b/i);

      const expectedPayload = await expectedResponse.body();
      expect(expectedPayload.length, 'Download response should not be empty').toBeGreaterThan(0);

      const [download] = await Promise.all([
        this.page.waitForEvent('download', { timeout: 20_000 }),
        locator.click(),
      ]);

      const stream = await download.createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const downloadedPayload = Buffer.concat(chunks);
      const failure = await download.failure();

      expect(failure, 'Browser download should complete successfully').toBeNull();
      expect(download.suggestedFilename().trim()).toBe(fileName);
      expect(downloadedPayload.length, 'Browser download should not be empty').toBeGreaterThan(0);
      expect(downloadedPayload.length).toBe(expectedPayload.length);

      const sha256 = (payload: Buffer) => createHash('sha256').update(payload).digest('hex');
      expect(sha256(downloadedPayload)).toBe(sha256(expectedPayload));
    } finally {
      await expectedResponse.dispose();
    }
  }
}
