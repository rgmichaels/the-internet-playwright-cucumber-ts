import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class WysiwygEditorPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await expect(this.page.frameLocator('#mce_0_ifr').locator('body')).toBeVisible();
  }

  async typeInEditor(text: string) {
    const body = this.page.frameLocator('#mce_0_ifr').locator('body');
    await body.click();
    await body.press('Control+A');
    await body.type(text);
    await expect(body).toContainText(text);
  }

  async exercise() {
    await this.typeInEditor('BDD is a lifestyle choice.');
  }
}
