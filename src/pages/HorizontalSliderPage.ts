import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class HorizontalSliderPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Horizontal Slider'); }

  async moveRight(times: number) {
    const slider = this.page.locator('input[type="range"]');
    await expect(slider).toBeVisible();
    await slider.focus();
    for (let i = 0; i < times; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
    await expect(this.page.locator('#range')).toBeVisible();
  }

  async exercise() {
    await this.moveRight(3);
  }
}
