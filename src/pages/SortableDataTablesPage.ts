import { Locator, Page } from 'playwright';
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

  private async ensureTable1LastNameOrder(
    lastNameHeader: Locator,
    target: 'ascending' | 'descending',
    maxClicks = 4
  ): Promise<string[]> {
    let values = await this.getTable1LastNames();
    const matchesTarget = () =>
      target === 'ascending' ? this.isAscending(values) : this.isDescending(values);

    if (matchesTarget()) return values;

    for (let i = 0; i < maxClicks; i++) {
      await lastNameHeader.click();
      values = await this.getTable1LastNames();
      if (matchesTarget()) return values;
    }

    throw new Error(
      `Unable to reach ${target} sort order for table 1 Last Name column. Last observed order: ${values.join(', ')}`
    );
  }

  async sortTable1LastNameAscendingThenDescending() {
    const lastNameHeader = this.page.locator('#table1 th').filter({ hasText: 'Last Name' });
    await expect(lastNameHeader).toBeVisible();

    const ascending = await this.ensureTable1LastNameOrder(lastNameHeader, 'ascending');
    expect(this.isAscending(ascending)).toBeTruthy();

    await lastNameHeader.click();
    const descending = await this.ensureTable1LastNameOrder(lastNameHeader, 'descending');
    expect(this.isDescending(descending)).toBeTruthy();
  }
}
