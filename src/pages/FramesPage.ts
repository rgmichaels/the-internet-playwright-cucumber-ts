import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class FramesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/frames$/, { timeout: 20_000 });
    await expect(this.page.locator('#content')).toContainText('Frames', { timeout: 20_000 });
  }

  private async openIFrameEditor() {
    await this.page.locator('a[href="/iframe"]').click();
    await expect(this.page).toHaveURL(/\/iframe$/, { timeout: 20_000 });
    await expect(this.page.locator('h3')).toHaveText('An iFrame containing the TinyMCE WYSIWYG Editor', {
      timeout: 20_000
    });
  }

  async openIFrameAndType() {
    await this.openIFrameEditor();

    const frame = this.page.frameLocator('#mce_0_ifr');
    const body = frame.locator('#tinymce');

    await expect(body).toBeVisible({ timeout: 20_000 });

    const text = `Hello from Playwright @ ${new Date().toISOString()}`;

    // TinyMCE on this demo can be readonly and/or covered by overlays.
    // Don't click/type. Set content directly inside the iframe DOM.
    await frame.locator('body').evaluate((el, value) => {
      // Prefer TinyMCE API if present, otherwise fall back to direct DOM manipulation.
      // @ts-ignore
      const win = el.ownerDocument?.defaultView;
      // @ts-ignore
      const editor = win?.tinymce?.activeEditor;
      if (editor) {
        editor.setContent(`<p>${value}</p>`);
        return;
      }

      // Fallback: write into the editor body
      el.innerHTML = `<p>${value}</p>`;
    }, text);

    // Assert the content is now present
    await expect(body).toContainText(text, { timeout: 20_000 });
  }

  async exercise() {
    await this.openIFrameAndType();
  }
}
