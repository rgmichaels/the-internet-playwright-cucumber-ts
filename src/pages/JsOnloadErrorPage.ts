import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class JsOnloadErrorPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await this.expectH3ToContain("JavaScript onload event error");
  }

  async exercise() {
    // Minimal per-page exercise: confirm main content area is visible.
    await expect(this.page.locator('#content')).toBeVisible();
  }
}
