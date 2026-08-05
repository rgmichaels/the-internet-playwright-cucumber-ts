import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type Coordinates = {
  latitude: number;
  longitude: number;
};

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

  async requestLocation() {
    await this.whereAmIButton.click({ timeout: 10_000 });
  }

  async assertCoordinates({ latitude, longitude }: Coordinates) {
    await expect(this.latValue).toHaveText(String(latitude), { timeout: 20_000 });
    await expect(this.longValue).toHaveText(String(longitude), { timeout: 20_000 });
  }
}
