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

  async assertEditingState() {
    const editorBody = this.editorFrame().locator('body#tinymce');
    const boldButton = this.page.getByRole('button', { name: 'Bold', exact: true });
    const italicButton = this.page.getByRole('button', { name: 'Italic', exact: true });

    await expect(editorBody).toBeVisible({ timeout: 20_000 });

    const contentEditable = await editorBody.getAttribute('contenteditable');

    if (contentEditable === 'true') {
      const text = `QA was here @ ${new Date().toISOString()}`;

      await editorBody.click();
      await this.page.keyboard.press('ControlOrMeta+A');
      await this.page.keyboard.type(text);
      await expect(editorBody).toHaveText(text, { timeout: 20_000 });

      await expect(boldButton).toBeEnabled();
      await this.page.keyboard.press('ControlOrMeta+A');
      await boldButton.click();
      await expect(editorBody.locator('strong, b')).toHaveText(text, { timeout: 20_000 });
      return;
    }

    await expect(editorBody).toHaveAttribute('contenteditable', 'false');
    await expect(editorBody).toContainText(/\S/);
    await expect(boldButton).toBeDisabled();
    await expect(italicButton).toBeDisabled();

    const originalText = await editorBody.innerText();
    await editorBody.focus();
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.type('This must not replace read-only content');
    await expect(editorBody).toHaveText(originalText);
  }
}
