import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class HoversPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Hovers'); }

  async hoverFirstAndVerify() {
    const figure = this.page.locator('.figure').first();
    await expect(figure).toBeVisible();
    await figure.hover();
    await expect(figure.locator('.figcaption')).toBeVisible();
    await expect(figure.locator('.figcaption h5')).toContainText('name: user1');
  }

  async exercise() {
    await this.hoverFirstAndVerify();
  }

  async verifyAllHoverCards() {
    const figures = this.page.locator('.figure');
    await expect(figures).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      const figure = figures.nth(index);
      const userNumber = index + 1;
      const caption = figure.locator('.figcaption');
      const userHeading = caption.locator('h5');
      const profileLink = caption.getByRole('link', { name: 'View profile' });

      await expect(caption).toBeHidden();
      await figure.hover();
      await expect(caption).toBeVisible();
      await expect(userHeading).toContainText(`name: user${userNumber}`);
      await expect(profileLink).toHaveAttribute('href', `/users/${userNumber}`);
    }
  }
}
