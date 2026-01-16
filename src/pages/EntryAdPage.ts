import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class EntryAdPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/entry_ad$/, { timeout: 20_000 });

    // Use first() because modal content can also contain headings.
    await expect(this.page.locator('#content h3').first()).toHaveText('Entry Ad', { timeout: 20_000 });

    await expect(this.restartAdLink()).toBeVisible({ timeout: 20_000 });
  }

  private modal() {
    return this.page.locator('.modal'); // exists even when hidden
  }

  private modalTitle() {
    return this.page.locator('.modal-title');
  }

  private modalClose() {
    return this.page.locator('.modal-footer p');
  }

  private restartAdLink() {
    return this.page.locator('#restart-ad'); // "To re-enable it, click here."
  }

  private async waitForModalVisible(timeoutMs: number): Promise<boolean> {
    return this.modal()
      .waitFor({ state: 'visible', timeout: timeoutMs })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * "Hard refresh" equivalent for automation:
   * - clears cookies (context-wide)
   * - clears local/session storage
   * - clears Cache Storage (service worker caches)
   * - reloads the page
   */
  private async hardRefresh() {
    await this.page.context().clearCookies();

    await this.page.evaluate(async () => {
      try {
        localStorage.clear();
      } catch {
        // ignore
      }
      try {
        sessionStorage.clear();
      } catch {
        // ignore
      }

      // Clear Cache Storage if present (not always available depending on browser/context)
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        // ignore
      }
    });

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.assertLoaded();
  }

  /**
   * Required behavior:
   * If the modal isn't showing naturally, click "re-enable", then hard refresh.
   * After this, the modal should appear. If it does not, fail with a clear error.
   */
  private async ensureModalVisible(): Promise<void> {
    // 1) Natural appearance first (fast path)
    if (await this.waitForModalVisible(3_000)) return;

    // 2) Re-enable link, then hard refresh (your requested behavior)
    await this.restartAdLink().click();

    await this.hardRefresh();

    // 3) After hard refresh, modal should appear
    if (await this.waitForModalVisible(10_000)) return;

    // 4) One extra nudge: re-enable again, then a normal reload (sometimes needed)
    await this.restartAdLink().click();
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.assertLoaded();

    if (await this.waitForModalVisible(10_000)) return;

    throw new Error(
      '[EntryAdPage] Expected the modal to become visible after clicking re-enable and performing a hard refresh, but it remained hidden.'
    );
  }

  async exercise() {
    await this.ensureModalVisible();

    // Modal is visible here — fully exercise it.
    await expect(this.modalTitle()).toContainText('This is a modal window', { timeout: 20_000 });

    await this.modalClose().click();
    await expect(this.modal()).toBeHidden({ timeout: 20_000 });

    // Exercise restart behavior explicitly
    await this.restartAdLink().click();

    // Your “hard refresh” rule is only for the *missing modal* case,
    // but we still wait robustly here because the modal can take a moment to reappear.
    const visibleAgain = await this.waitForModalVisible(10_000);
    if (!visibleAgain) {
      // Apply the same deterministic behavior again if needed
      await this.restartAdLink().click();
      await this.hardRefresh();
      await expect(this.modal()).toBeVisible({ timeout: 20_000 });
    } else {
      await expect(this.modal()).toBeVisible({ timeout: 20_000 });
    }

    await this.modalClose().click();
    await expect(this.modal()).toBeHidden({ timeout: 20_000 });
  }
}
