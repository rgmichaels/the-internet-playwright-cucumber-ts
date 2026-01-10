import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ExitIntentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private pageTitle() {
    return this.page.getByRole('heading', { name: 'Exit Intent', level: 3 });
  }

  private modal() {
    return this.page.locator('.modal');
  }

  private modalTitle() {
    return this.page.getByRole('heading', { name: 'This is a modal window', level: 3 });
  }

  private modalClose() {
    // close "x" on this demo is a <p> element in footer
    return this.page.locator('.modal .modal-footer p');
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/exit_intent$/, { timeout: 20_000 });
    await expect(this.pageTitle()).toBeVisible({ timeout: 20_000 });
  }

  private async triggerExitIntent() {
    // Move into the page first, then move outside the top boundary to trigger.
    await this.page.mouse.move(200, 200);
    await this.page.mouse.move(200, 0);
    // Some browsers need a "leave" beyond the viewport
    await this.page.mouse.move(200, -50);
  }

  private async closeModalIfPresent() {
    if (await this.modal().isVisible().catch(() => false)) {
      await this.modalClose().click();
      await expect(this.modal()).toBeHidden({ timeout: 20_000 });
    }
  }

  async exercise() {
    // Ensure we start without an already-open modal
    await this.closeModalIfPresent();

    await this.triggerExitIntent();

    await expect(this.modal()).toBeVisible({ timeout: 20_000 });
    await expect(this.modalTitle()).toBeVisible({ timeout: 20_000 });

    await this.modalClose().click();
    await expect(this.modal()).toBeHidden({ timeout: 20_000 });
  }
}
