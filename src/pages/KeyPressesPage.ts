import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class KeyPressesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Key Presses'); }

  async pressKey(key: string) {
    const input = this.page.locator('#target');
    await expect(input).toBeVisible();
    await input.click();
    await this.page.keyboard.press(key);
    await expect(this.page.locator('#result')).toContainText(key);
  }

  async exercise() {
    await this.pressKey('A');
  }
}
