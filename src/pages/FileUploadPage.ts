import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Page, Request, Response } from 'playwright';
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

  async uploadFixtureWithMultipartPayloadIntegrity(fileName: string) {
    const filePath = path.resolve(process.cwd(), 'fixtures', fileName);
    const expectedPayload = await readFile(filePath);

    await this.page.setInputFiles('#file-upload', filePath);

    const selectedFile = await this.page.locator('#file-upload').evaluate(async (element) => {
      if (!(element instanceof HTMLInputElement)) {
        throw new Error('File upload control is not an input element');
      }

      const file = element.files?.[0];
      if (!file) {
        throw new Error('File upload control does not contain a selected file');
      }

      return {
        bytes: Array.from(new Uint8Array(await file.arrayBuffer())),
        fileName: file.name,
        mediaType: file.type,
        size: file.size,
      };
    });

    expect(selectedFile.fileName).toBe(fileName);
    expect(selectedFile.mediaType).toBe('application/json');
    expect(selectedFile.size).toBe(expectedPayload.byteLength);
    expect(Buffer.from(selectedFile.bytes).equals(expectedPayload)).toBe(true);

    const isUploadRequest = (request: Request) =>
      request.method() === 'POST' && new URL(request.url()).pathname === '/upload';

    const [uploadRequest, uploadResponse] = await Promise.all([
      this.page.waitForRequest(isUploadRequest),
      this.page.waitForResponse((response) => isUploadRequest(response.request())),
      this.page.click('#file-submit'),
    ]);

    expect(uploadResponse.ok()).toBe(true);
    expect(uploadRequest.headers()['content-type'] ?? '').toMatch(
      /^multipart\/form-data\s*;.*\bboundary=/i
    );

    await expect(this.page.locator('#uploaded-files')).toContainText(fileName);

    const persistedFileUrl = new URL(
      `/download/${encodeURIComponent(fileName)}`,
      uploadResponse.url()
    ).toString();
    const persistedFileResponse = await this.page.context().request.get(persistedFileUrl, {
      failOnStatusCode: false,
    });

    try {
      expect(persistedFileResponse.ok(), 'Persisted upload should be downloadable').toBe(true);
      expect(persistedFileResponse.headers()['content-disposition'] ?? '').toMatch(/\battachment\b/i);

      const persistedPayload = await persistedFileResponse.body();
      expect(
        persistedPayload.byteLength,
        'Persisted upload should preserve the selected fixture length'
      ).toBe(expectedPayload.byteLength);
      expect(
        persistedPayload.equals(expectedPayload),
        'Persisted upload should preserve every selected fixture byte'
      ).toBe(true);
    } finally {
      await persistedFileResponse.dispose();
    }
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
