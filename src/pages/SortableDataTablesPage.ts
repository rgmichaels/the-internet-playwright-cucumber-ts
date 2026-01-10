import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class SortableDataTablesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Data Tables'); }

  async sortLastNameAndVerify() {
    const header = this.page.locator('#table1 th').first();
    await expect(header).toBeVisible();
    await header.click();
    const firstCell = this.page.locator('#table1 tbody tr td').first();
    await expect(firstCell).toBeVisible();
  }

  async exercise() {
    await this.sortLastNameAndVerify();
  }
}
