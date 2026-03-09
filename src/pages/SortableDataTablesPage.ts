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

  private async getTable1LastNames(): Promise<string[]> {
    const cells = this.page.locator('#table1 tbody tr td:nth-child(1)');
    await expect(cells.first()).toBeVisible();
    const values = await cells.allTextContents();
    return values.map((value) => value.trim());
  }

  private isAscending(values: string[]): boolean {
    return values.every((value, i) => i === 0 || values[i - 1].localeCompare(value) <= 0);
  }

  private isDescending(values: string[]): boolean {
    return values.every((value, i) => i === 0 || values[i - 1].localeCompare(value) >= 0);
  }

  async sortTable1LastNameAscendingThenDescending() {
    const lastNameHeader = this.page.locator('#table1 th').filter({ hasText: 'Last Name' });
    await expect(lastNameHeader).toBeVisible();

    // Table sort state can vary across runs; normalize to ascending first.
    await lastNameHeader.click();
    const ascending = await this.getTable1LastNames();
    if (!this.isAscending(ascending)) {
      expect(this.isDescending(ascending)).toBeTruthy();
      await lastNameHeader.click();
    }

    const normalizedAscending = await this.getTable1LastNames();
    expect(this.isAscending(normalizedAscending)).toBeTruthy();

    await lastNameHeader.click();
    const descending = await this.getTable1LastNames();
    expect(this.isDescending(descending)).toBeTruthy();
  }
}
