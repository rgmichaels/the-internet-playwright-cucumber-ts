import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Page, Request, Response, Route } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type UploadedFilePart = {
  fileName: string;
  mediaType: string;
};

export class FileUploadPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('File Uploader'); }

  async uploadFixture(fileName: string) {
    const filePath = path.resolve(process.cwd(), 'fixtures', fileName);
    await this.page.setInputFiles('#file-upload', filePath);
    await this.page.click('#file-submit');
    await expect(this.page.locator('#uploaded-files')).toContainText(fileName);
  }

  private extractUploadedFilePart(request: Request): UploadedFilePart {
    const contentType = request.headers()['content-type'] ?? '';
    const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
    const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2]?.trim();

    expect(contentType).toMatch(/^multipart\/form-data\s*;/i);
    expect(boundary, 'Upload request should declare a multipart boundary').toBeTruthy();

    if (!boundary) {
      throw new Error('Upload request did not declare a multipart boundary');
    }

    const requestBody = request.postDataBuffer();
    expect(requestBody, 'Upload request should include a multipart body').not.toBeNull();

    if (!requestBody) {
      throw new Error('Upload request did not include a multipart body');
    }

    const boundaryMarker = Buffer.from(`--${boundary}`);
    const headerTerminator = Buffer.from('\r\n\r\n');
    const nextBoundaryMarker = Buffer.from(`\r\n--${boundary}`);
    let boundaryIndex = requestBody.indexOf(boundaryMarker);

    while (boundaryIndex !== -1) {
      const afterBoundary = boundaryIndex + boundaryMarker.length;
      const suffix = requestBody.subarray(afterBoundary, afterBoundary + 2).toString('ascii');

      if (suffix === '--') {
        break;
      }

      const headerStart = afterBoundary + 2;
      const headerEnd = requestBody.indexOf(headerTerminator, headerStart);
      if (headerEnd === -1) {
        break;
      }

      const headers = requestBody.subarray(headerStart, headerEnd).toString('utf8');
      const disposition = headers.match(/^content-disposition:\s*form-data;([^\r\n]+)$/im)?.[1];
      const fieldName = disposition?.match(/(?:^|;)\s*name="([^"]*)"/i)?.[1];

      const payloadStart = headerEnd + headerTerminator.length;
      const payloadEnd = requestBody.indexOf(nextBoundaryMarker, payloadStart);
      if (payloadEnd === -1) {
        break;
      }

      if (fieldName === 'file') {
        const fileName = disposition?.match(/(?:^|;)\s*filename="([^"]*)"/i)?.[1];
        if (!fileName) {
          throw new Error('Upload file part did not declare a filename');
        }

        return {
          fileName,
          mediaType: headers.match(/^content-type:\s*([^\r\n]+)$/im)?.[1]?.trim() ?? '',
        };
      }

      boundaryIndex = requestBody.indexOf(boundaryMarker, payloadEnd + 2);
    }

    throw new Error('Upload request did not include the expected file form-data part');
  }

  async uploadFixtureWithPayloadIntegrity(fileName: string) {
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

    let uploadedFile: UploadedFilePart | undefined;
    let captureError: Error | undefined;
    const captureUpload = async (route: Route) => {
      if (isUploadRequest(route.request())) {
        try {
          uploadedFile = this.extractUploadedFilePart(route.request());
        } catch (error) {
          captureError = error instanceof Error ? error : new Error(String(error));
        }
      }

      await route.continue();
    };

    await this.page.route('**/upload', captureUpload);

    let uploadResponse: Response;
    try {
      const [, response] = await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        this.page.waitForResponse((response) => isUploadRequest(response.request())),
        this.page.click('#file-submit'),
      ]);
      uploadResponse = response;
    } finally {
      await this.page.unroute('**/upload', captureUpload);
    }

    expect(uploadResponse.ok()).toBe(true);

    if (captureError) {
      throw captureError;
    }
    if (!uploadedFile) {
      throw new Error('Upload request was not captured at the browser network boundary');
    }

    expect(uploadedFile.fileName).toBe(fileName);
    expect(uploadedFile.mediaType).toBe(selectedFile.mediaType);

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
