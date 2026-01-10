import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class EntryAdPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/entry_ad$/, { timeout: 20_000 });

    // Use .first() because the modal also contains an h3 sometimes.
    await expect(this.page.locator('#content h3').first()).toHaveText('Entry Ad', { timeout: 20_000 });

    // Restart link is part of the page content and should always exist.
    await expect(this.restartAdLink()).toBeVisible({ timeout: 20_000 });
  }

  private modal() {
    // The modal element exists even when hidden; visibility is controlled via CSS/JS.
    return this.page.locator('.modal');
  }

  private modalTitle() {
    // Inside the modal
    return this.page.locator('.modal-title');
  }

  private modalClose() {
    // "Close" text is usually in a <p> in the modal footer
    return this.page.locator('.modal-footer p');
  }

  private restartAdLink() {
    return this.page.locator('#restart-ad');
  }

  private async waitForModalVisible(timeoutMs = 5_000): Promise<boolean> {
    return this.modal()
      .waitFor({ state: 'visible', timeout: timeoutMs })
      .then(() => true)
      .catch(() => false);
  }

  private async forceFreshVisitAndReload() {
    // Entry Ad behavior is often gated by localStorage flags.
    await this.page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // ignore
      }
    });

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.assertLoaded();
  }

  private async ensureModalShowsDeterministically() {
    // 1) Sometimes it shows immediately on first load.
    if (await this.waitForModalVisible(3_000)) return;

    // 2) Try the intended user behavior: restart the ad.
    await this.restartAdLink().click();
    if (await this.waitForModalVisible(5_000)) return;

    // 3) If it still doesn't show, we are likely in a "modal already seen" state.
    // Clear storage + reload to simulate a clean visit.
    await this.forceFreshVisitAndReload();
    if (await this.waitForModalVisible(8_000)) return;

    // 4) Last resort: fail with a helpful diagnostic.
    const modalHtml = await this.modal().evaluate((el) => el.outerHTML).catch(() => '(could not read modal HTML)');
    throw new Error(
      [
        'Entry Ad modal never became visible, even after Restart Ad and clearing storage.',
        'This page is known to be stateful/flaky depending on localStorage and timing.',
        'Modal HTML (for debugging):',
        modalHtml,
      ].join('\n')
    );
  }

  async exercise() {
    await this.ensureModalShowsDeterministically();

    // Assert modal content (don’t overfit exact wording)
    await expect(this.modalTitle()).toContainText('This is a modal window', { timeout: 20_000 });

    // Close it and assert hidden
    await this.modalClose().click();
    await expect(this.modal()).toBeHidden({ timeout: 20_000 });

    // Exercise the restart behavior again (this is the “point” of the page)
    await this.restartAdLink().click();
    await expect(this.modal()).toBeVisible({ timeout: 20_000 });

    await this.modalClose().click();
    await expect(this.modal()).toBeHidden({ timeout: 20_000 });
  }
}
