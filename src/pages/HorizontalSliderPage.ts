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

  async moveToMaximum() {
    const slider = this.page.locator('input[type="range"]');
    const value = this.page.locator('#range');
    await expect(slider).toBeVisible();
    await slider.focus();

    for (let i = 0; i < 20; i++) {
      const current = ((await value.textContent()) ?? '').trim();
      if (current === '5') {
        return;
      }
      await this.page.keyboard.press('ArrowRight');
    }

    await expect(value).toHaveText('5');
  }

  async assertDisplayedValue(expected: string) {
    await expect(this.page.locator('#range')).toHaveText(expected);
  }
}
