import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class EntryAdPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private pageTitle() {
    // Avoid strict-mode conflict with modal's h3
    return this.page.getByRole('heading', { name: 'Entry Ad', level: 3 });
  }

  private modal() {
    return this.page.locator('.modal');
  }

  private modalTitle() {
    return this.page.getByRole('heading', { name: 'This is a modal window', level: 3 });
  }

  private closeModalButton() {
    // The close "X" is an <p> with class modal-close on this site
    return this.page.locator('.modal .modal-footer p');
  }

  private restartAdLink() {
    return this.page.locator('#restart-ad');
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/entry_ad$/, { timeout: 20_000 });
    await expect(this.pageTitle()).toBeVisible({ timeout: 20_000 });
  }

  private async closeModalIfPresent() {
    if (await this.modal().isVisible().catch(() => false)) {
      // If modal is visible, close it
      await expect(this.modalTitle()).toBeVisible({ timeout: 20_000 });
      await this.closeModalButton().click();
      await expect(this.modal()).toBeHidden({ timeout: 20_000 });
    }
  }

  async exercise() {
    // On first load, modal may appear (or may have been shown already in previous runs).
    await this.closeModalIfPresent();

    // Restart the ad and verify the modal reappears
    await expect(this.restartAdLink()).toBeVisible({ timeout: 20_000 });
    await this.restartAdLink().click();

    // Modal should appear again
    await expect(this.modal()).toBeVisible({ timeout: 20_000 });
    await expect(this.modalTitle()).toBeVisible({ timeout: 20_000 });

    // Close again to complete the exercise
    await this.closeModalButton().click();
    await expect(this.modal()).toBeHidden({ timeout: 20_000 });
  }
}
