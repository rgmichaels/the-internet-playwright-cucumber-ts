import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DigestAuthPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await expect(this.page.locator('#content')).toContainText('Congratulations');
  }

  async exercise() {
    // Auth page "exercise" is the content assertion above
    await this.assertLoaded();
  }
}
