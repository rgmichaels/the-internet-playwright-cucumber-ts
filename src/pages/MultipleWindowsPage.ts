import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class MultipleWindowsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Opening a new window'); }

  async assertPopupLifecycle() {
    const context = this.page.context();
    const link = this.page.getByRole('link', { name: 'Click Here' });

    expect(context.pages()).toHaveLength(1);
    expect(context.pages()[0]).toBe(this.page);
    await expect(link).toBeVisible();

    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      link.click()
    ]);

    try {
      await newPage.waitForLoadState('domcontentloaded');

      expect(context.pages()).toHaveLength(2);
      expect(await newPage.opener()).toBe(this.page);
      await expect(newPage).toHaveURL(/\/windows\/new$/);
      await expect(newPage.getByRole('heading', { name: 'New Window', level: 3 })).toBeVisible();
    } finally {
      await newPage.close();
    }

    expect(newPage.isClosed()).toBe(true);
    await expect.poll(() => context.pages().length).toBe(1);
    expect(context.pages()[0]).toBe(this.page);

    await this.page.bringToFront();
    expect(this.page.isClosed()).toBe(false);
    await expect(this.page).toHaveURL(/\/windows$/);
    await this.assertLoaded();
    await expect(link).toBeVisible();
  }
}
