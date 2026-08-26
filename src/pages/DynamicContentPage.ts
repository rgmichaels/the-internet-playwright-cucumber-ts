import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type ContentRowSnapshot = {
  imageSrc: string;
  text: string;
};

export class DynamicContentPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Dynamic Content'); }

  private contentRows() {
    return this.page.locator('.example > .row > .large-centered > .row');
  }

  private async snapshotContentRows(): Promise<ContentRowSnapshot[]> {
    const rows = this.contentRows();
    await expect(rows).toHaveCount(3);

    return Promise.all(
      [0, 1, 2].map(async (index) => {
        const row = rows.nth(index);
        const image = row.locator('img');
        const text = row.locator('.large-10.columns');

        await expect(image).toBeVisible();
        await expect(text).toBeVisible();

        const imageSrc = await image.getAttribute('src');
        expect(imageSrc, `Dynamic Content row ${index + 1} should include an avatar`).toBeTruthy();

        return {
          imageSrc: imageSrc!,
          text: (await text.innerText()).replace(/\s+/g, ' ').trim(),
        };
      })
    );
  }

  async enableStaticMode() {
    const staticModeLink = this.page.getByRole('link', { name: 'click here', exact: true });
    await expect(staticModeLink).toHaveAttribute(
      'href',
      '/dynamic_content?with_content=static'
    );

    await staticModeLink.click();

    await expect(this.page).toHaveURL(/\/dynamic_content\?with_content=static$/);
    await this.assertLoaded();
    await expect(this.contentRows()).toHaveCount(3);
  }

  async assertStaticModeBoundaryAfterReload() {
    await expect(this.page).toHaveURL(/\/dynamic_content\?with_content=static$/);
    const beforeReload = await this.snapshotContentRows();

    await this.page.reload({ waitUntil: 'domcontentloaded' });

    await expect(this.page).toHaveURL(/\/dynamic_content\?with_content=static$/);
    await this.assertLoaded();
    const afterReload = await this.snapshotContentRows();

    expect(afterReload.slice(0, 2)).toEqual(beforeReload.slice(0, 2));
    expect(afterReload[2].text).not.toBe(beforeReload[2].text);
    expect(afterReload[2].imageSrc).toMatch(/^\/img\/avatars\//);
  }

  async refreshAndExpectChange() {
    const firstRow = this.page.locator('#content .row').first();
    const firstRowImage = this.page.locator('#content .row img').first();

    await expect(firstRow).toBeVisible();
    await expect(firstRowImage).toBeVisible();

    const beforeText = await firstRow.textContent();
    const beforeImageSrc = await firstRowImage.getAttribute('src');

    await this.page.getByRole('link', { name: 'click here' }).click();
    await expect(firstRow).toBeVisible();

    await expect
      .poll(
        async () => {
          const afterText = await firstRow.textContent();
          const afterImageSrc = await firstRowImage.getAttribute('src');
          return afterText !== beforeText || afterImageSrc !== beforeImageSrc;
        },
        {
          message: 'Expected the refreshed first row text or image to change',
          timeout: 20_000,
        }
      )
      .toBe(true);
  }

  async exercise() {
    await this.refreshAndExpectChange();
  }
}
