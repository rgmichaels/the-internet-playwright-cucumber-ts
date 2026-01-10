import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class NotificationMessagesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToContain('Notification Message'); }

  async clickAndAssertMessage() {
    await this.page.getByRole('link', { name: 'Click here' }).click();
    const flash = this.page.locator('#flash');
    await expect(flash).toBeVisible();
    await expect(flash).toContainText('Action');
  }

  async exercise() {
    await this.clickAndAssertMessage();
  }
}
