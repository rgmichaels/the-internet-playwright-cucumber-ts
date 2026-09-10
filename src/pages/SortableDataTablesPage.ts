import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type CustomerRecord = {
  lastName: string;
  firstName: string;
  email: string;
  amountDue: string;
  website: string;
};

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

  private async getTable1AmountDues(): Promise<number[]> {
    const cells = this.page.locator('#table1 tbody tr td:nth-child(4)');
    await expect(cells.first()).toBeVisible();

    return (await cells.allTextContents()).map((value) => {
      const displayedValue = value.trim();
      expect(displayedValue).toMatch(/^\$\d+\.\d{2}$/);

      const amount = Number(displayedValue.slice(1));
      expect(Number.isFinite(amount)).toBe(true);
      return amount;
    });
  }

  private async getTable1CustomerRecords(): Promise<CustomerRecord[]> {
    const rows = this.page.locator('#table1 tbody tr');
    const rowCount = await rows.count();

    expect(rowCount, 'Table 1 should contain customer records').toBeGreaterThan(0);

    const records: CustomerRecord[] = [];
    for (let index = 0; index < rowCount; index += 1) {
      const cells = rows.nth(index).locator('td');
      await expect(cells).toHaveCount(6);

      const values = (await cells.allTextContents()).map((value) => value.trim());
      const [lastName, firstName, email, amountDue, website] = values;

      expect(lastName).toMatch(/\S/);
      expect(firstName).toMatch(/\S/);
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(amountDue).toMatch(/^\$\d+\.\d{2}$/);
      expect(website).toMatch(/^https?:\/\//);

      records.push({ lastName, firstName, email, amountDue, website });
    }

    return records;
  }

  private customerRecordSignatures(records: CustomerRecord[]): string[] {
    return records.map((record) => JSON.stringify(record)).sort();
  }

  private amountDuesFromRecords(records: CustomerRecord[]): number[] {
    return records.map(({ amountDue }) => Number(amountDue.slice(1)));
  }

  async sortTable1LastNameAscendingThenDescending() {
    const lastNameHeader = this.page.locator('#table1 th').filter({ hasText: 'Last Name' });
    await expect(lastNameHeader).toBeVisible();

    const initial = await this.getTable1LastNames();
    const ascending = [...initial].sort((a, b) => a.localeCompare(b));
    const descending = [...ascending].reverse();

    await lastNameHeader.click();
    await expect.poll(() => this.getTable1LastNames()).toEqual(ascending);

    await lastNameHeader.click();
    await expect.poll(() => this.getTable1LastNames()).toEqual(descending);
  }

  async sortTable1AmountDueAscendingThenDescending() {
    const amountDueHeader = this.page.locator('#table1 th').filter({ hasText: 'Due' });
    await expect(amountDueHeader).toBeVisible();

    const initial = await this.getTable1AmountDues();
    const ascending = [...initial].sort((a, b) => a - b);
    const descending = [...ascending].reverse();

    await amountDueHeader.click();
    await expect.poll(() => this.getTable1AmountDues()).toEqual(ascending);

    await amountDueHeader.click();
    await expect.poll(() => this.getTable1AmountDues()).toEqual(descending);
  }

  async assertAmountDueSortPreservesCustomerRecords() {
    const amountDueHeader = this.page.locator('#table1 th').filter({ hasText: 'Due' });
    await expect(amountDueHeader).toBeVisible();

    const originalRecords = await this.getTable1CustomerRecords();
    const originalSignatures = this.customerRecordSignatures(originalRecords);
    expect(new Set(originalSignatures).size).toBe(originalRecords.length);

    const ascendingAmounts = [...this.amountDuesFromRecords(originalRecords)].sort((a, b) => a - b);
    const descendingAmounts = [...ascendingAmounts].reverse();

    await amountDueHeader.click();
    await expect
      .poll(async () => this.amountDuesFromRecords(await this.getTable1CustomerRecords()))
      .toEqual(ascendingAmounts);
    expect(this.customerRecordSignatures(await this.getTable1CustomerRecords())).toEqual(
      originalSignatures
    );

    await amountDueHeader.click();
    await expect
      .poll(async () => this.amountDuesFromRecords(await this.getTable1CustomerRecords()))
      .toEqual(descendingAmounts);
    expect(this.customerRecordSignatures(await this.getTable1CustomerRecords())).toEqual(
      originalSignatures
    );
  }
}
