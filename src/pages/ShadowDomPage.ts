import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ShadowDomPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToContain('Simple template'); }

  async readShadowText() {
    const host = this.page.locator('my-paragraph');
    await expect(host).toBeVisible();
    const text = await host.evaluate((el: any) => el.shadowRoot?.textContent ?? '');
    expect(text.length).toBeGreaterThan(0);
  }

  async exercise() {
    await this.readShadowText();
  }
}
