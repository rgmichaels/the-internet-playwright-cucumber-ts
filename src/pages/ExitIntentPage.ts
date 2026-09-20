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

  private modalOverlay() {
    return this.page.locator('#ouibounce-modal');
  }

  private modalUnderlay() {
    return this.modalOverlay().locator('.underlay');
  }

  private modalTitle() {
    return this.page.getByRole('heading', { name: 'This is a modal window', level: 3 });
  }

  private modalClose() {
    // close "x" on this demo is a <p> element in footer
    return this.page.locator('.modal .modal-footer p');
  }

  private pageFooter() {
    return this.page.locator('#page-footer');
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
      await expect(this.modalOverlay()).toBeHidden({ timeout: 20_000 });
    }
  }

  private async openModal() {
    await this.closeModalIfPresent();

    await this.triggerExitIntent();

    await expect(this.modalOverlay()).toBeVisible({ timeout: 20_000 });
    await expect(this.modal()).toBeVisible({ timeout: 20_000 });
    await expect(this.modalTitle()).toBeVisible({ timeout: 20_000 });
  }

  async assertUnderlayDismissalRestoresPage() {
    await expect(this.pageFooter()).toBeVisible();
    await this.openModal();

    await expect(this.pageFooter()).toBeHidden();
    await this.modalUnderlay().click({ position: { x: 20, y: 20 } });

    await expect(this.modalOverlay()).toBeHidden({ timeout: 20_000 });
    await expect(this.pageFooter()).toBeVisible({ timeout: 20_000 });
    await expect(this.pageTitle()).toBeVisible();
    await expect(this.page).toHaveURL(/\/exit_intent$/);
  }

  async exercise() {
    await this.openModal();

    await this.modalClose().click();
    await expect(this.modalOverlay()).toBeHidden({ timeout: 20_000 });
  }
}
