import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ContextMenuPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await this.expectH3ToBe('Context Menu');

    const paragraphs = this.page.locator('#content p');
    await expect(paragraphs).toHaveCount(2);

    await expect(paragraphs.nth(0)).toHaveText(
      'Context menu items are custom additions that appear in the right-click menu.'
    );

    await expect(paragraphs.nth(1)).toHaveText(
      "Right-click in the box below to see one called 'the-internet'. When you click it, it will trigger a JavaScript alert."
    );
  }

  async triggerContextMenuAlert() {
    const box = this.page.locator('#hot-spot');
    await expect(box).toBeVisible();

    const dialogPromise = this.page.waitForEvent('dialog', { timeout: 20_000 });
    const clickPromise = box.click({ button: 'right' });
    const dialog = await dialogPromise;

    try {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('You selected a context menu');
    } finally {
      await dialog.accept();
      await clickPromise;
    }

    await expect(box).toBeVisible();
  }

  async exercise() {
    await this.triggerContextMenuAlert();
  }
}
