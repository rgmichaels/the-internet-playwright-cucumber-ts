import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class JqueryUiMenusPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('JQuery UI Menus'); }

  async openDownloadsMenu() {
    const enabled = this.page.locator('#ui-id-3'); // Enabled
    await expect(enabled).toBeVisible();
    await enabled.hover();
    const downloads = this.page.locator('#ui-id-4'); // Downloads
    await expect(downloads).toBeVisible();
    await downloads.hover();
    const pdf = this.page.locator('#ui-id-5'); // PDF
    await expect(pdf).toBeVisible();
  }

  async exercise() {
    await this.openDownloadsMenu();
  }
}
