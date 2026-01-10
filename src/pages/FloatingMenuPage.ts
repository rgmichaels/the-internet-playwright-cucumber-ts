import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class FloatingMenuPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Floating Menu'); }

  async scrollAndVerifyMenuStays() {
    const menu = this.page.locator('#menu');
    await expect(menu).toBeVisible();
    await this.page.mouse.wheel(0, 2000);
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Home' }).click();
    await expect(this.page.locator('#menu')).toBeVisible();
  }

  async exercise() {
    await this.scrollAndVerifyMenuStays();
  }
}
