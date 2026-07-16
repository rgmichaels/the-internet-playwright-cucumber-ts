import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(baseUrl: string) {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('h1')).toHaveText('Welcome to the-internet');
  }

  async openExample(name: string) {
    const link = this.page.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();
    await link.click();
  }

  async assertTitleTagHasText() {
    const titleText = await this.page.locator('head > title').textContent();

    expect(titleText, 'Expected the home page source to include a <title> tag').not.toBeNull();
    expect(titleText!.trim(), 'Expected the home page <title> tag to contain text').not.toBe('');
  }
}
