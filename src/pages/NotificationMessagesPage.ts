import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class NotificationMessagesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToContain('Notification Message'); }

  private flash() {
    return this.page.locator('#flash');
  }

  private flashCloseButton() {
    return this.page.locator('#flash a.close');
  }

  async clickAndAssertMessage() {
    await this.page.getByRole('link', { name: 'Click here' }).click();
    const flash = this.flash();
    await expect(flash).toBeVisible();
    await expect(flash).toContainText('Action');
  }

  async assertFlashMessageIsExpected() {
    await this.page.getByRole('link', { name: 'Click here' }).click();
    const flash = this.flash();
    await expect(flash).toBeVisible();

    const text = ((await flash.textContent()) ?? '').replace('×', '').trim();
    const expectedMessages = [
      'Action successful',
      'Action unsuccesful, please try again',
      'Action unsuccessful, please try again',
    ];

    expect(expectedMessages.some((message) => text.includes(message))).toBeTruthy();
  }

  async dismissFlashMessage() {
    const flash = this.flash();
    if (!(await flash.isVisible())) {
      await this.page.getByRole('link', { name: 'Click here' }).click();
      await expect(flash).toBeVisible();
    }

    await this.flashCloseButton().click();
    await expect(flash).toBeHidden();
  }

  async exercise() {
    await this.clickAndAssertMessage();
  }
}
