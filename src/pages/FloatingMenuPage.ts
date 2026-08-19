import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type ViewportGeometry = {
  bottom: number;
  left: number;
  right: number;
  scrollY: number;
  top: number;
  viewportHeight: number;
  viewportWidth: number;
};

export class FloatingMenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await this.expectH3ToBe('Floating Menu');
  }

  async assertAtLeastOneParagraphPresent() {
    const paragraphs = this.page.locator('p');
    const count = await paragraphs.count();

    expect(
      count,
      'Expected at least one <p> element to be present on the Floating Menu page'
    ).toBeGreaterThan(0);
  }

  private async viewportGeometry(): Promise<ViewportGeometry> {
    const menu = this.page.locator('#menu');
    return menu.evaluate((element) => {
      const rect = element.getBoundingClientRect();

      return {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        scrollY: window.scrollY,
        top: rect.top,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });
  }

  private assertInsideViewport(geometry: ViewportGeometry) {
    const renderingTolerance = 8;

    expect(geometry.top, 'Floating menu should not move above the viewport').toBeGreaterThanOrEqual(
      -renderingTolerance
    );
    expect(geometry.left, 'Floating menu should not move left of the viewport').toBeGreaterThanOrEqual(
      -renderingTolerance
    );
    expect(geometry.bottom, 'Floating menu should not move below the viewport').toBeLessThanOrEqual(
      geometry.viewportHeight + renderingTolerance
    );
    expect(geometry.right, 'Floating menu should not move right of the viewport').toBeLessThanOrEqual(
      geometry.viewportWidth + renderingTolerance
    );
  }

  async assertMenuRemainsInViewportWhileScrolling() {
    const menu = this.page.locator('#menu');

    await expect(menu, 'Expected the floating menu (#menu) to be visible').toBeVisible();
    const initial = await this.viewportGeometry();
    this.assertInsideViewport(initial);

    await this.page.mouse.wheel(0, 1500);

    await expect
      .poll(async () => (await this.viewportGeometry()).scrollY, {
        message: 'Expected the document to scroll before checking the floating menu',
      })
      .toBeGreaterThan(initial.scrollY + 1000);
    await expect
      .poll(
        async () => {
          const { top } = await this.viewportGeometry();
          return top >= -8 && top <= 8;
        },
        { message: 'Expected the floating menu to settle against the viewport edge' }
      )
      .toBe(true);

    const firstScrolledPosition = await this.viewportGeometry();
    this.assertInsideViewport(firstScrolledPosition);
    await expect(menu).toBeInViewport({ ratio: 0.8 });

    await this.page.mouse.wheel(0, 1500);

    await expect
      .poll(async () => (await this.viewportGeometry()).scrollY, {
        message: 'Expected the document to continue scrolling beneath the floating menu',
      })
      .toBeGreaterThan(firstScrolledPosition.scrollY + 1000);
    await expect
      .poll(
        async () => {
          const current = await this.viewportGeometry();
          return Math.abs(current.top - firstScrolledPosition.top);
        },
        { message: 'Expected the floating menu viewport position to remain stable' }
      )
      .toBeLessThanOrEqual(2);

    const secondScrolledPosition = await this.viewportGeometry();
    this.assertInsideViewport(secondScrolledPosition);
    await expect(menu).toBeInViewport({ ratio: 0.8 });
    await expect(menu.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'About' })).toBeVisible();
  }

  async exercise() {
    await this.assertLoaded();
    await this.assertAtLeastOneParagraphPresent();
    await this.assertMenuRemainsInViewportWhileScrolling();
  }
}
