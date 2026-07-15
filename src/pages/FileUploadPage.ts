import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class FileUploadPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('File Uploader'); }

  async uploadFixture(fileName: string) {
    const filePath = path.resolve(process.cwd(), 'fixtures', fileName);
    await this.page.setInputFiles('#file-upload', filePath);
    await this.page.click('#file-submit');
    await expect(this.page.locator('#uploaded-files')).toContainText(fileName);
  }

  async uploadFixtureByDragAndDrop(fileName: string) {
    const filePath = path.resolve(process.cwd(), 'fixtures', fileName);
    const fileContents = await readFile(filePath);
    const dataTransfer = await this.page.evaluateHandle(
      ({ contents, name }) => {
        const binary = atob(contents);
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        const transfer = new DataTransfer();
        transfer.items.add(new File([bytes], name, { type: 'application/json' }));
        return transfer;
      },
      { contents: fileContents.toString('base64'), name: fileName }
    );

    try {
      const uploadResponsePromise = this.page.waitForResponse((response) => {
        const request = response.request();
        return request.method() === 'POST' && new URL(response.url()).pathname === '/upload';
      });

      await this.page.locator('#drag-drop-upload').dispatchEvent('drop', { dataTransfer });

      const uploadResponse = await uploadResponsePromise;
      expect(uploadResponse.ok()).toBe(true);

      const preview = this.page.locator('#drag-drop-upload .dz-preview').filter({ hasText: fileName });
      await expect(preview).toHaveClass(/dz-success/);
      await expect(preview.locator('[data-dz-name]')).toHaveText(fileName);
    } finally {
      await dataTransfer.dispose();
    }
  }

  async exercise() {
    await this.uploadFixture('hello.txt');
  }
}
