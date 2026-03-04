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

  async clickAndGetMessageText() {
    await this.page.getByRole('link', { name: 'Click here' }).click();
    const flash = this.page.locator('#flash');
    await expect(flash).toBeVisible();

    const raw = await flash.innerText();
    return raw
      .replace('×', '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  async assertAllExpectedOutcomeVariants(maxTries: number) {
    const expectedMessages = new Set([
      'Action successful',
      'Action unsuccesful, please try again',
      'Action unsuccessful, please try again',
      'Action un-successful, please try again',
    ]);

    const foundMessages = new Set<string>();

    for (let attempt = 1; attempt <= maxTries; attempt++) {
      const message = await this.clickAndGetMessageText();
      foundMessages.add(message);
      if (expectedMessages.has(message) && foundMessages.has('Action successful')) {
        const foundFailureVariant =
          foundMessages.has('Action unsuccesful, please try again') ||
          foundMessages.has('Action unsuccessful, please try again') ||
          foundMessages.has('Action un-successful, please try again');

        if (foundFailureVariant) {
          return;
        }
      }
    }

    throw new Error(
      `Did not observe both success and failure notification variants within ${maxTries} tries. ` +
      `Observed: ${[...foundMessages].join(' | ')}`
    );
  }

  async exercise() {
    await this.clickAndAssertMessage();
  }
}
