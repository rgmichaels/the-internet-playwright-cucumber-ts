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

  private async flashWithBoundedRecovery() {
    const flash = this.flash();

    for (let recoveryAttempt = 0; recoveryAttempt < 2; recoveryAttempt += 1) {
      if (await flash.isVisible()) return flash;
      await this.page.getByRole('link', { name: 'Click here' }).click();
    }

    await expect(flash).toBeVisible();
    return flash;
  }

  async assertFlashMessageIsExpected() {
    const flash = await this.flashWithBoundedRecovery();

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
    await expect(flash).toBeVisible();
    await this.flashCloseButton().click();
    await expect(flash).toBeHidden();
  }

  async exercise() {
    await this.assertFlashMessageIsExpected();
  }
}
