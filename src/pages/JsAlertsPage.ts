import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class JsAlertsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('JavaScript Alerts'); }

  async clickAlert() {
    this.page.once('dialog', async (d) => d.accept());
    await this.page.locator('button[onclick="jsAlert()"]').click();
    await expect(this.page.locator('#result')).toContainText('You successfully clicked an alert');
  }

  async clickConfirm() {
    this.page.once('dialog', async (d) => d.accept());
    await this.page.locator('button[onclick="jsConfirm()"]').click();
    await expect(this.page.locator('#result')).toContainText('You clicked: Ok');
  }

  async clickPrompt() {
    this.page.once('dialog', async (d) => d.accept('hello'));
    await this.page.locator('button[onclick="jsPrompt()"]').click();
    await expect(this.page.locator('#result')).toContainText('You entered: hello');
  }

  async exercise() {
    await this.clickAlert();
    await this.clickConfirm();
    await this.clickPrompt();
  }
}
