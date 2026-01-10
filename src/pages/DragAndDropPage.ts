import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DragAndDropPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private columnA() {
    return this.page.locator('#column-a');
  }

  private columnB() {
    return this.page.locator('#column-b');
  }

  private headerA() {
    return this.page.locator('#column-a header');
  }

  private headerB() {
    return this.page.locator('#column-b header');
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/drag_and_drop$/, { timeout: 20_000 });

    // Use the actual interactive elements as the readiness signal (not #columns).
    await expect(this.columnA()).toBeVisible({ timeout: 20_000 });
    await expect(this.columnB()).toBeVisible({ timeout: 20_000 });

    // Sanity check that headers exist (A/B)
    await expect(this.headerA()).toHaveText(/A|B/, { timeout: 20_000 });
    await expect(this.headerB()).toHaveText(/A|B/, { timeout: 20_000 });
  }

  /**
   * The-internet's Drag and Drop is flaky with native dragTo().
   * This uses a DataTransfer-based HTML5 drag simulation.
   */
  private async html5DragAndDrop(sourceSelector: string, targetSelector: string) {
    await this.page.evaluate(
      ({ sourceSelector, targetSelector }) => {
        const source = document.querySelector(sourceSelector) as HTMLElement | null;
        const target = document.querySelector(targetSelector) as HTMLElement | null;
        if (!source || !target) throw new Error('Source or target not found');

        // @ts-ignore - DataTransfer exists in browser context
        const dataTransfer = new DataTransfer();

        const fire = (el: HTMLElement, type: string) => {
          const event = new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            dataTransfer
          });
          el.dispatchEvent(event);
        };

        fire(source, 'dragstart');
        fire(target, 'dragenter');
        fire(target, 'dragover');
        fire(target, 'drop');
        fire(source, 'dragend');
      },
      { sourceSelector, targetSelector }
    );
  }

  async dragAToB() {
    // Wait for the draggable tiles to be rendered + in view.
    await this.columnA().scrollIntoViewIfNeeded();
    await this.columnB().scrollIntoViewIfNeeded();

    // Record start state
    const beforeA = ((await this.headerA().textContent()) ?? '').trim();
    const beforeB = ((await this.headerB().textContent()) ?? '').trim();

    // Drag A onto B
    await this.html5DragAndDrop('#column-a', '#column-b');

    // Verify something actually changed (the page swaps headers on success)
    await expect
      .poll(async () => {
        const afterA = ((await this.headerA().textContent()) ?? '').trim();
        const afterB = ((await this.headerB().textContent()) ?? '').trim();
        return `${beforeA}->${afterA} | ${beforeB}->${afterB}`;
      }, { timeout: 20_000 })
      .not.toContain(`${beforeA}->${beforeA} | ${beforeB}->${beforeB}`);
  }

  async exercise() {
    await this.dragAToB();
  }
}
