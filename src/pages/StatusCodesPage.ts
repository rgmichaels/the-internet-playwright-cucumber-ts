import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class StatusCodesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Status Codes'); }

  async openCode(code: string) {
    await this.page.getByRole('link', { name: code }).click();
    await expect(this.page.locator('p')).toContainText(code);
    await this.page.getByRole('link', { name: 'here' }).click(); // back to list
    await this.assertLoaded();
  }

  async exercise() {
    await this.openCode('200');
  }
}
