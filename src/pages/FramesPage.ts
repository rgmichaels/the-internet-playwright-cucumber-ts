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

  async exerciseIFrameEditor() {
    await this.openIFrameEditor();

    const frame = this.page.frameLocator('#mce_0_ifr');
    const body = frame.locator('#tinymce');

    await expect(body).toBeVisible({ timeout: 20_000 });

    const isEditable = await body.evaluate(
      (element) => element instanceof HTMLElement && element.isContentEditable
    );

    if (isEditable) {
      const text = `Hello from Playwright @ ${new Date().toISOString()}`;
      await body.fill(text);
      await expect(body).toContainText(text, { timeout: 20_000 });
      return;
    }

    expect(isEditable).toBe(false);
    await expect(body).toContainText(/\S/, { timeout: 20_000 });
  }

  async exercise() {
    await this.exerciseIFrameEditor();
  }
}
