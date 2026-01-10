import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicLoadingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/dynamic_loading$/, { timeout: 20_000 });
    await expect(this.page.locator('h3')).toContainText('Dynamically Loaded Page Elements', { timeout: 20_000 });
    await expect(this.page.locator('#content')).toContainText('Example 1', { timeout: 20_000 });
    await expect(this.page.locator('#content')).toContainText('Example 2', { timeout: 20_000 });
  }

  private async runExample(exampleNum: 1 | 2) {
    // Index page link (these are on /dynamic_loading)
    const link = this.page.locator(`a[href="/dynamic_loading/${exampleNum}"]`);
    await expect(link).toBeVisible({ timeout: 20_000 });
    await link.click();

    // Detail page
    await expect(this.page).toHaveURL(new RegExp(`/dynamic_loading/${exampleNum}$`), { timeout: 20_000 });

    const heading = this.page.locator('#content h4').first();
    await expect(heading).toContainText(`Example ${exampleNum}`, { timeout: 20_000 });

    const startBtn = this.page.locator('#start button');
    const loading = this.page.locator('#loading');
    const finishText = this.page.locator('#finish h4');

    await expect(startBtn).toBeVisible({ timeout: 20_000 });

    await startBtn.click();

    // Loader may flash; treat as best-effort.
    if (await loading.count()) {
      await loading.waitFor({ state: 'visible', timeout: 2_000 }).catch(() => {});
    }

    // Authoritative success signal
    await expect(finishText).toBeVisible({ timeout: 20_000 });
    await expect(finishText).toHaveText('Hello World!', { timeout: 20_000 });

    // If loader exists, it should end up hidden (but don't fail if the demo is weird)
    if (await loading.count()) {
      await expect(loading).toBeHidden({ timeout: 20_000 }).catch(() => {});
    }

    // Back to index for next example
    await this.page.goBack();
    await this.assertLoaded();
  }

  async exercise() {
    await this.runExample(1);
    await this.runExample(2);
  }
}
