import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Checkboxes'); }

  async toggleFirst() {
    const first = this.page.locator('#checkboxes input').first();
    await expect(first).toBeVisible();
    await first.click();
  }

  async expectAtLeastOneChecked() {
    const inputs = this.page.locator('#checkboxes input');
    const count = await inputs.count();
    let any = false;
    for (let i = 0; i < count; i++) {
      if (await inputs.nth(i).isChecked()) any = true;
    }
    expect(any).toBeTruthy();
  }

  async exercise() {
    await this.toggleFirst();
    await this.expectAtLeastOneChecked();
  }
}
