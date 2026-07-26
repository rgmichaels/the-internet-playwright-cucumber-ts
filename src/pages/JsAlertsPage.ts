import { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

type DialogContract = {
  action: 'accept' | 'dismiss';
  button: Locator;
  expectedMessage: string;
  expectedType: 'alert' | 'confirm' | 'prompt';
  promptText?: string;
};

export class JsAlertsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('JavaScript Alerts'); }

  private result() {
    return this.page.locator('#result');
  }

  private async triggerDialog(contract: DialogContract) {
    const dialogPromise = this.page.waitForEvent('dialog', { timeout: 20_000 });
    const clickPromise = contract.button.click();
    const dialog = await dialogPromise;

    const actualType = dialog.type();
    const actualMessage = dialog.message();
    const actualDefaultValue = dialog.defaultValue();

    if (contract.action === 'accept') {
      await dialog.accept(contract.promptText);
    } else {
      await dialog.dismiss();
    }

    await clickPromise;

    expect(actualType).toBe(contract.expectedType);
    expect(actualMessage).toBe(contract.expectedMessage);

    if (contract.expectedType === 'prompt') {
      expect(actualDefaultValue).toBe('');
    }
  }

  async clickAlert() {
    await this.triggerDialog({
      action: 'accept',
      button: this.page.locator('button[onclick="jsAlert()"]'),
      expectedMessage: 'I am a JS Alert',
      expectedType: 'alert',
    });
    await expect(this.result()).toHaveText('You successfully clicked an alert');
  }

  async clickConfirm() {
    await this.triggerDialog({
      action: 'accept',
      button: this.page.locator('button[onclick="jsConfirm()"]'),
      expectedMessage: 'I am a JS Confirm',
      expectedType: 'confirm',
    });
    await expect(this.result()).toHaveText('You clicked: Ok');
  }

  async clickConfirmAndCancel() {
    await this.triggerDialog({
      action: 'dismiss',
      button: this.page.locator('button[onclick="jsConfirm()"]'),
      expectedMessage: 'I am a JS Confirm',
      expectedType: 'confirm',
    });
    await expect(this.result()).toHaveText('You clicked: Cancel');
  }

  async clickPrompt() {
    const promptText = 'BDD prompt: 42!?';
    await this.triggerDialog({
      action: 'accept',
      button: this.page.locator('button[onclick="jsPrompt()"]'),
      expectedMessage: 'I am a JS prompt',
      expectedType: 'prompt',
      promptText,
    });
    await expect(this.result()).toHaveText(`You entered: ${promptText}`);
  }

  async clickPromptAndCancel() {
    await this.triggerDialog({
      action: 'dismiss',
      button: this.page.locator('button[onclick="jsPrompt()"]'),
      expectedMessage: 'I am a JS prompt',
      expectedType: 'prompt',
    });
    await expect(this.result()).toHaveText('You entered: null');
  }

  async exerciseAcceptedDialogContracts() {
    await this.clickAlert();
    await this.clickConfirm();
    await this.clickPrompt();
  }

  async exerciseCancelledDialogContracts() {
    await this.clickConfirmAndCancel();
    await this.clickPromptAndCancel();
  }
}
