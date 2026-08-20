import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class LargeDeepDomPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Large & Deep DOM'); }

  async assertCompleteDataTopology() {
    const expectedDimension = 50;
    const siblingItems = this.page.locator('#siblings [id^="sibling-"]');
    const expectedSiblingIds = Array.from(
      { length: expectedDimension },
      (_, tierIndex) => [1, 2, 3].map((item) => `sibling-${tierIndex + 1}.${item}`)
    ).flat();

    await expect(siblingItems).toHaveCount(expectedSiblingIds.length);
    expect(await siblingItems.evaluateAll((elements) => elements.map((element) => element.id)))
      .toEqual(expectedSiblingIds);
    await expect(
      this.page.locator('[id="sibling-1.1"] [id="sibling-50.1"]')
    ).toHaveCount(1);

    const table = this.page.locator('#large-table');
    const headers = table.locator('thead th');
    const rows = table.locator('tbody tr');

    await expect(table).toBeVisible();
    await expect(headers).toHaveCount(expectedDimension);
    await expect(headers).toHaveText(
      Array.from({ length: expectedDimension }, (_, columnIndex) => String(columnIndex + 1))
    );
    await expect(rows).toHaveCount(expectedDimension);

    for (let rowIndex = 1; rowIndex <= expectedDimension; rowIndex += 1) {
      const cells = rows.nth(rowIndex - 1).locator('td');
      const expectedCoordinates = Array.from(
        { length: expectedDimension },
        (_, columnIndex) => `${rowIndex}.${columnIndex + 1}`
      );

      await expect(cells).toHaveCount(expectedDimension);
      await expect(cells).toHaveText(expectedCoordinates);
    }
  }
}
