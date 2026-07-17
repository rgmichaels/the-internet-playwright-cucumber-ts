import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class RedirectLinkPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Redirection'); }

  async followRedirectAndValidate() {
    const redirectResponsePromise = this.page.waitForResponse(
      (response) =>
        response.request().isNavigationRequest() &&
        new URL(response.url()).pathname === '/redirect'
    );

    await this.page.getByRole('link', { name: 'here' }).click();
    const redirectResponse = await redirectResponsePromise;

    expect(redirectResponse.status()).toBe(302);

    const location = redirectResponse.headers()['location'];
    expect(location, 'Redirect response should include a Location header').toBeTruthy();
    const target = new URL(location!, redirectResponse.url());
    expect(target.origin).toBe(new URL(redirectResponse.url()).origin);
    expect(target.pathname).toBe('/status_codes');

    await expect(this.page).toHaveURL(/\/status_codes$/);
    await expect(this.page.locator('h3')).toHaveText('Status Codes');
  }

  async exercise() {
    await this.followRedirectAndValidate();
  }
}
