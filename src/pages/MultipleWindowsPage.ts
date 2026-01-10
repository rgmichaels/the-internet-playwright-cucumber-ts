import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class MultipleWindowsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Opening a new window'); }

  async openNewWindowAndVerify() {
    const link = this.page.getByRole('link', { name: 'Click Here' });
    await expect(link).toBeVisible();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    await expect(newPage.locator('h3')).toHaveText('New Window');
    await newPage.close();
  }

  async exercise() {
    await this.openNewWindowAndVerify();
  }
}
