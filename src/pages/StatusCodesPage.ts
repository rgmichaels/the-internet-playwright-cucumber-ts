import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class StatusCodesPage extends BasePage {
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.content = this.page.locator('#content');
  }

  async assertLoaded() {
    await this.expectH3ToBe('Status Codes');
  }

  async openCode(code: string) {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (candidate) =>
          candidate.request().isNavigationRequest() &&
          candidate.url().endsWith(`/status_codes/${code}`)
      ),
      this.page.getByRole('link', { name: code }).click(),
    ]);

    expect(response.status()).toBe(Number(code));

    await expect(this.content).toContainText(`This page returned a ${code} status code`);

    await this.page.getByRole('link', { name: 'here' }).click();
    await this.assertLoaded();
  }

  async exercise() {
    const codes = ['200', '301', '404', '500'];
    for (const code of codes) {
      await this.openCode(code);
    }
  }
}
