import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';
import path from 'node:path';

export class FileUploadPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('File Uploader'); }

  async uploadFixture(fileName: string) {
    const filePath = path.resolve(process.cwd(), 'fixtures', fileName);
    await this.page.setInputFiles('#file-upload', filePath);
    await this.page.click('#file-submit');
    await expect(this.page.locator('#uploaded-files')).toContainText(fileName);
  }

  async exercise() {
    await this.uploadFixture('hello.txt');
  }
}
