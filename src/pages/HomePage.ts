import { Page, Response } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(baseUrl: string) {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('h1')).toHaveText('Welcome to the-internet');
  }

  async openExample(name: string) {
    const link = this.page.getByRole('link', { name, exact: true });
    await expect(link).toBeVisible();

    const [response] = await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);

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

  async assertTitleTagHasText() {
    const titleText = await this.page.locator('head > title').textContent();

    expect(titleText, 'Expected the home page source to include a <title> tag').not.toBeNull();
    expect(titleText!.trim(), 'Expected the home page <title> tag to contain text').not.toBe('');
  }
}
