import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class ContextMenuPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Context Menu'); }

  async triggerContextMenuAlert() {
    const box = this.page.locator('#hot-spot');
    await expect(box).toBeVisible();
    this.page.once('dialog', async (d) => {
      expect(d.message()).toContain('You selected a context menu');
      await d.accept();
    });
    await box.click({ button: 'right' });
  }

  async exercise() {
    await this.triggerContextMenuAlert();
  }
}
