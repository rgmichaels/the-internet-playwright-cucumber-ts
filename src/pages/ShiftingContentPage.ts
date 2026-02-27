import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ShiftingContentPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Shifting Content'); }

  async openMenuExample() {
    await this.page.getByRole('link', { name: 'Example 1: Menu Element' }).click();
    await expect(this.page.locator('h3')).toContainText('Shifting Content');
    await expect(this.page.locator('#content')).toContainText('Menu');
  }

  async exercise() {
    await this.openMenuExample();
  }

  async openImageExample() {
    await this.page.getByRole('link', { name: 'Example 2: An image' }).click();
    await expect(this.page).toHaveURL(/\/shifting_content\/image$/);
  }

  async assertImageExampleContent() {
    await expect(this.page.locator('#content')).toContainText(
      /This example demonstrates an image shifting a few pixels in either direction on each page load\./
    );
    await expect(this.page.locator('#content img')).toBeVisible();
  }
}
