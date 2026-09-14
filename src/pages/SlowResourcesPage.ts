import { Page, Route } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class SlowResourcesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Slow Resources'); }

  async assertUsableDuringAndAfterExternalRequest() {
    const slowRequestPattern = '**/slow_external';
    let pendingRoute: Route | undefined;
    let externalRequestReleased = false;

    const holdSlowRequest = (route: Route) => {
      pendingRoute = route;
    };

    await this.page.route(slowRequestPattern, holdSlowRequest);
    const slowResponsePromise = this.page.waitForResponse((response) => {
      const request = response.request();
      return request.method() === 'GET' && new URL(response.url()).pathname === '/slow_external';
    });
    const reloadPromise = this.page.reload({ waitUntil: 'load', timeout: 20_000 });

    try {
      await expect
        .poll(() => pendingRoute?.request().url() ?? '', { timeout: 20_000 })
        .toMatch(/\/slow_external$/);

      if (!pendingRoute) {
        throw new Error('Expected the Slow Resources external request to be intercepted');
      }

      expect(pendingRoute.request().method()).toBe('GET');
      await this.assertMeaningfulContent();

      await pendingRoute.fulfill({ status: 200, contentType: 'text/plain', body: 'completed' });
      externalRequestReleased = true;

      const [navigationResponse, slowResponse] = await Promise.all([
        reloadPromise,
        slowResponsePromise
      ]);

      expect(navigationResponse, 'Expected the Slow Resources reload to return a response').not.toBeNull();
      expect(navigationResponse!.status()).toBe(200);
      expect(slowResponse.status()).toBe(200);
      expect(await this.page.evaluate(() => document.readyState)).toBe('complete');

      const url = new URL(this.page.url());
      expect(url.pathname).toBe('/slow');
      expect(url.search).toBe('');
      expect(url.hash).toBe('');
      await this.assertMeaningfulContent();
    } finally {
      if (pendingRoute && !externalRequestReleased) {
        await pendingRoute.fulfill({ status: 200, contentType: 'text/plain', body: 'completed' });
      }
      await Promise.allSettled([reloadPromise, slowResponsePromise]);
      await this.page.unroute(slowRequestPattern, holdSlowRequest);
    }
  }

  private async assertMeaningfulContent() {
    await this.assertLoaded();

    const explanation = this.page.locator('.example p');
    await expect(explanation).toBeVisible();
    await expect(explanation).toHaveText(
      'At times it can take a while for third-party site resources to load (e.g., tracking code javascript, social networking widgets, etc.). This example has a rogue GET request that takes 30 seconds to complete.'
    );
  }
}
