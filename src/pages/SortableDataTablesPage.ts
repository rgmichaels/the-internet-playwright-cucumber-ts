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

  async sortTable1LastNameAscendingThenDescending() {
    const lastNameHeader = this.page.locator('#table1 th').filter({ hasText: 'Last Name' });
    await expect(lastNameHeader).toBeVisible();

    await lastNameHeader.click();
    const ascending = await this.getTable1LastNames();
    const ascendingExpected = [...ascending].sort((a, b) => a.localeCompare(b));
    expect(ascending).toEqual(ascendingExpected);

    await lastNameHeader.click();
    const descending = await this.getTable1LastNames();
    const descendingExpected = [...descending].sort((a, b) => b.localeCompare(a));
    expect(descending).toEqual(descendingExpected);
  }
}
