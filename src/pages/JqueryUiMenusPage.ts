import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class JqueryUiMenusPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/jqueryui\/menu$/, { timeout: 20_000 });

    // Actual heading on the site is "JQueryUI - Menu"
    const h3 = this.page.locator('#content h3');
    await expect(h3).toBeVisible({ timeout: 20_000 });
    await expect(h3).toHaveText('JQueryUI - Menu', { timeout: 20_000 });

    // Also confirm the menu container exists
    await expect(this.page.locator('#menu')).toBeVisible({ timeout: 20_000 });
  }

  async exercise() {
  // Root menu should be visible
  const menu = this.page.locator('#menu');
  await expect(menu).toBeVisible({ timeout: 20_000 });

  // Top-level items: "Enabled" is typically visible; "Disabled" may be present too.
  // Use text-based locators inside the menu to avoid id assumptions.
  const enabled = menu.getByRole('menuitem', { name: /^Enabled$/ });
  await expect(enabled).toBeVisible({ timeout: 20_000 });
  await enabled.hover();

  // Now submenu items become visible
  const downloads = menu.getByRole('menuitem', { name: /^Downloads$/ });
  await expect(downloads).toBeVisible({ timeout: 20_000 });
  await downloads.hover();

  const csv = menu.getByRole('menuitem', { name: /^CSV$/ });
  await expect(csv).toBeVisible({ timeout: 20_000 });

  // Click "CSV"
  await csv.click({ force: true });

  // This demo doesn't reliably navigate/download. Assert the UI is still alive.
  await expect(menu).toBeVisible({ timeout: 20_000 });
}

}
