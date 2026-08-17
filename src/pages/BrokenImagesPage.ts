import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class BrokenImagesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded(expectedText = 'Broken Images') { await this.expectH3ToBe(expectedText); }

  async assertDocumentedImageStates() {
    const imgs = this.page.locator('#content img');
    await expect(imgs).toHaveCount(3);

    await expect
      .poll(
        async () => {
          const states = await imgs.evaluateAll((elements) =>
            elements.map((element) => {
              if (!(element instanceof HTMLImageElement) || !element.complete) {
                return 'pending';
              }

              return element.naturalWidth > 0 && element.naturalHeight > 0
                ? 'loaded'
                : 'broken';
            })
          );

          if (states.includes('pending')) {
            return null;
          }

          return {
            broken: states.filter((state) => state === 'broken').length,
            loaded: states.filter((state) => state === 'loaded').length,
          };
        },
        {
          message: 'Expected exactly two broken images and one loaded control image',
          timeout: 20_000,
        }
      )
      .toEqual({ broken: 2, loaded: 1 });
  }

  async exercise() {
    await this.assertDocumentedImageStates();
  }
}
