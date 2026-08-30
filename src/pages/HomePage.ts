import { Page, Response } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';
import { gotoOnce, isRetryableNavigationError } from '../support/navigation';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(baseUrl: string) {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.assertLoaded();
  }

  async assertLoaded() {
    await expect(this.page.locator('h1')).toHaveText('Welcome to the-internet');
  }

  async openExample(name: string) {
    const link = this.page.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href, `Expected the ${name} example link to have an href`).toBeTruthy();
    const targetUrl = new URL(href!, this.page.url()).toString();

    let response: Response | null;

    try {
      [response] = await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        link.click({ noWaitAfter: true }),
      ]);
    } catch (error) {
      const navigationError = this.asError(error);

      if (!isRetryableNavigationError(navigationError)) {
        throw navigationError;
      }

      try {
        response = await gotoOnce(this.page, targetUrl, { waitUntil: 'domcontentloaded' });
      } catch (retryError) {
        throw new Error(
          `Example "${name}" navigation failed twice. First attempt: ${navigationError.message}. ` +
            `Second attempt: ${this.asError(retryError).message}`
        );
      }
    }

    if (!this.isServerError(response)) return;

    const retryResponse = await this.page.reload({ waitUntil: 'domcontentloaded' });
    if (this.isServerError(retryResponse)) {
      throw new Error(
        `Example "${name}" returned HTTP ${response.status()} and retry returned HTTP ${retryResponse!.status()}`
      );
    }
  }

  private isServerError(response: Response | null): response is Response {
    const status = response?.status();
    return status !== undefined && status >= 500 && status < 600;
  }

  private asError(error: unknown) {
    return error instanceof Error ? error : new Error(String(error));
  }

  async assertTitleTagHasText() {
    const titleText = await this.page.locator('head > title').textContent();

    expect(titleText, 'Expected the home page source to include a <title> tag').not.toBeNull();
    expect(titleText!.trim(), 'Expected the home page <title> tag to contain text').not.toBe('');
  }
}
