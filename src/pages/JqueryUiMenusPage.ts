import { Download, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class JqueryUiMenusPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/jqueryui\/menu$/, { timeout: 20_000 });

    // Actual heading on the site is "JQueryUI - Menu"
    const h3 = this.page.locator('#content h3');
    await expect(h3).toBeVisible({ timeout: 20_000 });
    await expect(h3).toHaveText('JQueryUI - Menu', { timeout: 20_000 });

    // Also confirm the menu container exists
    await expect(this.page.locator('#menu')).toBeVisible({ timeout: 20_000 });
  }

  private async downloadFromMenu(format: 'CSV' | 'PDF' | 'Excel'): Promise<Download> {
    const menu = this.page.locator('#menu');
    await expect(menu).toBeVisible({ timeout: 20_000 });

    const enabled = menu.getByRole('menuitem', { name: /^Enabled$/ });
    await expect(enabled).toBeVisible({ timeout: 20_000 });
    await enabled.hover();

    const downloads = menu.getByRole('menuitem', { name: /^Downloads$/ });
    await expect(downloads).toBeVisible({ timeout: 20_000 });
    await downloads.hover();

    const artifact = menu.getByRole('menuitem', { name: new RegExp(`^${format}$`) });
    await expect(artifact).toBeVisible({ timeout: 20_000 });

    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 20_000 }),
      artifact.click(),
    ]);

    return download;
  }

  private async readDownload(download: Download): Promise<Buffer> {
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  async assertCsvDownloadContract() {
    const download = await this.downloadFromMenu('CSV');
    const downloadedPayload = await this.readDownload(download);

    const failure = await download.failure();
    const payload = downloadedPayload.toString('utf8');
    const rows = payload.trim().split(/\r?\n/);

    expect(failure, 'CSV download should complete successfully').toBeNull();
    expect(download.suggestedFilename()).toBe('menu.csv');
    expect(rows[0]).toBe('number of items,subtotal,tax,total');
    expect(rows).toContain('4,4.00,0.13,4.52');
  }

  async assertPdfDownloadContract() {
    const download = await this.downloadFromMenu('PDF');
    const payload = await this.readDownload(download);
    const failure = await download.failure();

    expect(failure, 'PDF download should complete successfully').toBeNull();
    expect(download.suggestedFilename()).toBe('menu.pdf');
    expect(payload.length, 'PDF download should not be empty').toBeGreaterThan(0);
    expect(payload.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    expect(payload.toString('latin1').trimEnd().endsWith('%%EOF')).toBe(true);
  }

  async assertExcelDownloadContract() {
    const download = await this.downloadFromMenu('Excel');
    const payload = await this.readDownload(download);
    const failure = await download.failure();

    expect(failure, 'Excel download should complete successfully').toBeNull();
    expect(download.suggestedFilename()).toBe('menu.xls');
    expect(payload.length, 'Excel download should contain a complete CFB header').toBeGreaterThanOrEqual(512);
    expect(payload.subarray(0, 8)).toEqual(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    expect(payload.readUInt16LE(28), 'Excel CFB byte order should be little-endian').toBe(0xfffe);

    const majorVersion = payload.readUInt16LE(26);
    const sectorShift = payload.readUInt16LE(30);
    const expectedSectorShift = majorVersion === 3 ? 9 : majorVersion === 4 ? 12 : undefined;

    expect(expectedSectorShift, 'Excel CFB major version should be 3 or 4').toBeDefined();
    expect(sectorShift, 'Excel CFB sector size should match its major version').toBe(expectedSectorShift);
    expect(payload.length % 2 ** sectorShift, 'Excel CFB payload should end on a sector boundary').toBe(0);
  }
}
