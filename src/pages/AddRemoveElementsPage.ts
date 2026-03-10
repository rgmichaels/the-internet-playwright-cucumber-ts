import { Page, Locator } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class AddRemoveElementsPage extends BasePage {
  readonly addButton: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.getByRole('button', { name: 'Add Element' });
    this.deleteButtons = page.getByRole('button', { name: 'Delete' });
  }

  async assertLoaded() {
    await this.expectH3ToBe('Add/Remove Elements');
  }

  async addElement() {
    await expect(this.addButton).toBeVisible();
    await this.addButton.click();
  }

  async expectDeleteVisible(visible: boolean) {
    if (visible) {
      await expect(this.deleteButtons.first()).toBeVisible();
    } else {
      await expect(this.deleteButtons).toHaveCount(0);
    }
  }

  async deleteFirst() {
    await expect(this.deleteButtons.first()).toBeVisible();
    await this.deleteButtons.first().click();
  }

  async expectDeleteCount(expectedCount: number) {
    await expect(this.deleteButtons).toHaveCount(expectedCount);
  }

  async exercise() {
    await this.addElement();
    await this.expectDeleteVisible(true);
    await this.deleteFirst();
    await this.expectDeleteVisible(false);
  }

  async exerciseMultipleCountSync() {
    await this.expectDeleteCount(0);

    await this.addElement();
    await this.expectDeleteCount(1);

    await this.addElement();
    await this.expectDeleteCount(2);

    await this.deleteFirst();
    await this.expectDeleteCount(1);

    await this.deleteFirst();
    await this.expectDeleteCount(0);
  }
}
