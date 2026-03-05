import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Dropdown List'); }

  async selectOption(value: string) {
    const select = this.page.locator('#dropdown');
    await expect(select).toBeVisible();
    await select.selectOption(value);
    await expect(select).toHaveValue(value);
  }

  async exercise() {
    await this.selectOption('1');
  }

  async switchAcrossAllOptions() {
    const select = this.page.locator('#dropdown');
    await this.selectOption('1');
    await this.selectOption('2');
    await this.page.reload();
    await expect(select).toHaveValue('');
  }
}
