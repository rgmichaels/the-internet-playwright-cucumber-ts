import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ChallengingDomPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly description = this.page.locator('#content p');

  private buttons() {
    return this.page.locator('.large-2.columns a.button');
  }

  private table() {
    return this.page.locator('#content table');
  }

  async assertLoaded() {
    await this.expectH3ToBe('Challenging DOM');

    await expect(this.description).toHaveText(
      `The hardest part in automated web testing is finding the best locators (e.g., ones that well named, unique, and unlikely to change). It's more often than not that the application you're testing was not built with this concept in mind. This example demonstrates that with unique IDs, a table with no helpful locators, and a canvas element.`
    );
  }

  private async buttonIds(): Promise<string[]> {
    const buttons = this.buttons();
    await expect(buttons).toHaveCount(3);

    const ids = await buttons.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('id') ?? '')
    );

    for (const id of ids) {
      expect(id, 'Each Challenging DOM button should have a generated ID').not.toBe('');
    }
    expect(new Set(ids).size, 'Generated button IDs should be unique').toBe(3);

    return ids;
  }

  private async assertTableContract() {
    const table = this.table();
    const headers = table.locator('thead th');
    const rows = table.locator('tbody tr');

    await expect(table).toBeVisible();
    await expect(headers).toHaveText([
      'Lorem',
      'Ipsum',
      'Dolor',
      'Sit',
      'Amet',
      'Diceret',
      'Action',
    ]);
    await expect(rows).toHaveCount(10);

    for (let index = 0; index < 10; index += 1) {
      const cells = rows.nth(index).locator('td');
      const actionLinks = cells.nth(6).getByRole('link');

      await expect(cells).toHaveCount(7);
      await expect(cells.nth(0)).toHaveText(`Iuvaret${index}`);
      await expect(cells.nth(1)).toHaveText(`Apeirian${index}`);
      await expect(cells.nth(2)).toHaveText(`Adipisci${index}`);
      await expect(cells.nth(3)).toHaveText(`Definiebas${index}`);
      await expect(cells.nth(4)).toHaveText(`Consequuntur${index}`);
      await expect(cells.nth(5)).toHaveText(`Phaedrum${index}`);
      await expect(actionLinks).toHaveText(['edit', 'delete']);
      await expect(actionLinks.nth(0)).toHaveAttribute('href', '#edit');
      await expect(actionLinks.nth(1)).toHaveAttribute('href', '#delete');
    }
  }

  async assertVolatileButtonsPreserveTableContract() {
    await this.assertTableContract();
    let previousIds = await this.buttonIds();

    for (let index = 0; index < 3; index += 1) {
      const [navigationResponse] = await Promise.all([
        this.page.waitForResponse(
          (response) =>
            response.request().isNavigationRequest() &&
            new URL(response.url()).pathname === '/challenging_dom'
        ),
        this.buttons().nth(index).click(),
      ]);

      expect(navigationResponse.request().method()).toBe('GET');
      expect(navigationResponse.status()).toBe(200);
      await this.assertLoaded();

      const currentIds = await this.buttonIds();
      expect(
        currentIds.some((id) => previousIds.includes(id)),
        'Every button reload should replace all generated IDs'
      ).toBe(false);

      await this.assertTableContract();
      previousIds = currentIds;
    }
  }
}
