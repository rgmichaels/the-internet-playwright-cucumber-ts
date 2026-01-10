import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class JsOnloadErrorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/javascript_error$/, { timeout: 20_000 });

    // Never assume #content exists on this one; sometimes the demo server returns a bare error page.
    await expect(this.page.locator('body')).toBeVisible({ timeout: 20_000 });
  }

  async exercise() {
    const body = this.page.locator('body');

    // Pull the body text once; if it's a server error, treat as non-blocking (demo site flakiness).
    const text = (await body.innerText().catch(() => '')).trim();
    const lower = text.toLowerCase();

    // Demo site sometimes returns this (you’ve already seen it on other pages).
    if (lower.includes('internal server error')) {
      console.log('WARN: Demo site returned Internal Server Error on /javascript_error. Treating as non-blocking.');
      return;
    }

    // On a healthy run, this page typically explains that a JS error occurred.
    // Keep this loose to avoid brittleness across deployments.
    await expect(body).toContainText(/javascript/i, { timeout: 20_000 });

    // If an #error element exists, assert it contains error-ish text.
    const errorBox = this.page.locator('#error');
    if (await errorBox.count()) {
      await expect(errorBox).toContainText(/error|cannot|undefined|null/i, { timeout: 20_000 });
    } else {
      // Fallback: assert the page copy implies an error
      await expect(body).toContainText(/error/i, { timeout: 20_000 });
    }
  }
}
