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
    // Click the status code link from the list
    await this.page.getByRole('link', { name: code }).click();

    // Validate the destination page explains the correct status code
    await expect(this.content).toContainText(`This page returned a ${code} status code`);

    // Go back to the list (the app uses a "here" link in the paragraph)
    await this.page.getByRole('link', { name: 'here' }).click();

    // Confirm we're back on the Status Codes list page
    await this.assertLoaded();
  }

  async exercise() {
    // Exercise EACH status code link
    const codes = ['200', '301', '404', '500'];
    for (const code of codes) {
      await this.openCode(code);
    }
  }
}
