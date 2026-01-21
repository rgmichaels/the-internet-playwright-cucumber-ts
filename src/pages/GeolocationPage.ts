import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class GeolocationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators (keeps selectors in one place)
  private readonly whereAmIButton = this.page.getByRole('button', { name: 'Where am I?' });
  private readonly description = this.page.locator('#content p');
  private readonly latValue = this.page.locator('#lat-value');
  private readonly longValue = this.page.locator('#long-value');

  async assertLoaded() {
    await this.expectH3ToBe('Geolocation');

    // New: assert the instructional paragraph text
    await expect(this.description).toHaveText(
      'Click the button to get your current latitude and longitude'
    );
  }

  async clickWhereAmI() {
    await this.whereAmIButton.click({ timeout: 10000 });

    await expect(this.latValue).not.toHaveText('');
    await expect(this.longValue).not.toHaveText('');
  }

  async exercise() {
    await this.clickWhereAmI();
  }
}
