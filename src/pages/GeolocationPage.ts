import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class GeolocationPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Geolocation'); }

  async clickWhereAmI() {
    await this.page.click('button', { timeout: 10000 });
    await expect(this.page.locator('#lat-value')).not.toHaveText('');
    await expect(this.page.locator('#long-value')).not.toHaveText('');
  }

  async exercise() {
    await this.clickWhereAmI();
  }
}
