import { Page, FrameLocator } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class WysiwygEditorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/tinymce$/, { timeout: 20_000 });

    // TinyMCE iframe should exist
    await expect(this.page.locator('#mce_0_ifr')).toBeVisible({ timeout: 20_000 });
  }

  private editorFrame(): FrameLocator {
    return this.page.frameLocator('#mce_0_ifr');
  }

  async exercise() {
    const editorBody = this.editorFrame().locator('body#tinymce');

    // It’s often read-only on this demo. Don’t click/type; set content directly.
    // First, clear existing content.
    await editorBody.evaluate((el) => {
      (el as HTMLElement).innerHTML = '';
    });

    const text = `QA was here @ ${new Date().toISOString()}`;

    // Set content inside the iframe body
    await editorBody.evaluate((el, value) => {
      (el as HTMLElement).innerHTML = `<p>${value}</p>`;
    }, text);

    // Assert it stuck
    await expect(editorBody).toContainText(text, { timeout: 20_000 });

    // Bonus: exercise formatting by injecting bold text
    await editorBody.evaluate((el) => {
      (el as HTMLElement).innerHTML = `<p><strong>Bold</strong> and normal</p>`;
    });

    await expect(editorBody).toContainText('Bold', { timeout: 20_000 });
    await expect(editorBody).toContainText('and normal', { timeout: 20_000 });
  }
}
