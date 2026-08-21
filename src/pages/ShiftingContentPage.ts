import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

const menuItemNames = ['Home', 'About', 'Contact Us', 'Portfolio', 'Gallery'] as const;

type MenuItemName = (typeof menuItemNames)[number];

type MenuItemPosition = {
  name: MenuItemName;
  x: number;
  y: number;
};

export class ShiftingContentPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Shifting Content'); }

  async openMenuExample() {
    await this.page.getByRole('link', { name: 'Example 1: Menu Element' }).click();
    await expect(this.page).toHaveURL(/\/shifting_content\/menu$/);
    await expect(this.page.locator('h3')).toContainText('Shifting Content');
    await expect(this.page.locator('#content')).toContainText('Menu');
  }

  private async captureMenuItemPositions(): Promise<MenuItemPosition[]> {
    const positions: MenuItemPosition[] = [];

    for (const name of menuItemNames) {
      const item = this.page.getByRole('link', { name, exact: true });
      await expect(item).toBeVisible();

      const box = await item.boundingBox();
      if (!box) {
        throw new Error(`Could not measure the visible ${name} menu item`);
      }

      positions.push({ name, x: box.x, y: box.y });
    }

    return positions;
  }

  async assertDeterministicMenuShift(pixelShift: number) {
    const before = await this.captureMenuItemPositions();
    const shiftLink = this.page.locator(
      `a[href="/shifting_content/menu?pixel_shift=${pixelShift}"]`
    );

    await expect(shiftLink).toBeVisible();
    await shiftLink.click();
    await expect(this.page).toHaveURL(
      new RegExp(`/shifting_content/menu\\?pixel_shift=${pixelShift}$`)
    );

    const after = await this.captureMenuItemPositions();

    for (const original of before) {
      const shifted = after.find((position) => position.name === original.name);
      if (!shifted) {
        throw new Error(`Missing ${original.name} menu position after applying the shift`);
      }

      const expectedX = original.name === 'Gallery' ? original.x - pixelShift : original.x;
      expect(shifted.x, `${original.name} horizontal position`).toBeCloseTo(expectedX, 5);
      expect(shifted.y, `${original.name} vertical position`).toBeCloseTo(original.y, 5);
    }
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
