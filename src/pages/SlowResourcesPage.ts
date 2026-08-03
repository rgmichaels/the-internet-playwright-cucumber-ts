import { Page, Route } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class SlowResourcesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Slow Resources'); }

  async assertUsableWhileExternalRequestPending() {
    const slowRequestPattern = '**/slow_external';
    let pendingRoute: Route | undefined;

    const holdSlowRequest = (route: Route) => {
      pendingRoute = route;
    };

    await this.page.route(slowRequestPattern, holdSlowRequest);

    try {
      await this.page.reload({ waitUntil: 'domcontentloaded' });

      await expect
        .poll(() => pendingRoute?.request().url() ?? '', { timeout: 20_000 })
        .toMatch(/\/slow_external$/);

      expect(pendingRoute?.request().method()).toBe('GET');
      await this.assertLoaded();

      const explanation = this.page.locator('.example p');
      await expect(explanation).toBeVisible();
      await expect(explanation).toContainText('rogue GET request that takes 30 seconds to complete');
    } finally {
      if (pendingRoute) {
        await pendingRoute.fulfill({ status: 200, contentType: 'text/plain', body: '' });
      }
      await this.page.unroute(slowRequestPattern, holdSlowRequest);
    }
  }
}
