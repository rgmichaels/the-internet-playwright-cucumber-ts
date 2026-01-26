import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class InputsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

async assertLoaded() {
  await this.expectH3ToBe('Inputs');

  // Case-insensitive match: "Number" on the page should satisfy "number"
  const content = this.page.locator('#content');
  await expect(content).toContainText(/number/i);
}


  async typeNumber(n: number) {
    const input = this.page.locator('input[type="number"]');
    await expect(input).toBeVisible();
    await input.fill(String(n));
    await expect(input).toHaveValue(String(n));
  }

  async exercise() {
    await this.typeNumber(123);
  }
}
