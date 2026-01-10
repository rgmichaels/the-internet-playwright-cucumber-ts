import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class BrokenImagesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Broken Images'); }

  async countBrokenImages() {
    const imgs = this.page.locator('#content img');
    const count = await imgs.count();
    await expect(imgs.first()).toBeVisible();
    let broken = 0;
    for (let i = 0; i < count; i++) {
      const isBroken = await imgs.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth === 0);
      if (isBroken) broken++;
    }
    // Page is intended to have at least one broken image.
    expect(broken).toBeGreaterThan(0);
  }

  async exercise() {
    await this.countBrokenImages();
  }
}
