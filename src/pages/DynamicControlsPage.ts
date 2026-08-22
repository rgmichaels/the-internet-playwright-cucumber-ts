import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicControlsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/dynamic_controls$/, { timeout: 20_000 });
    await expect(this.page.locator('#checkbox-example')).toBeVisible({ timeout: 20_000 });
    await expect(this.page.locator('#input-example')).toBeVisible({ timeout: 20_000 });
    await expect(this.page.locator('#content')).toContainText('Dynamic Controls', { timeout: 20_000 });
  }

  private checkbox() {
    return this.page.locator('#checkbox-example input[type="checkbox"]');
  }

  private checkboxButton() {
    return this.page.locator('#checkbox-example button');
  }

  private checkboxLoading() {
    return this.page.locator('#checkbox-example #loading');
  }

  private input() {
    return this.page.locator('#input-example input');
  }

  private inputButton() {
    return this.page.locator('#input-example button');
  }

  private async clickCheckboxAndWaitFor(messageText: "It's gone!" | "It's back!") {
    const loaders = this.checkboxLoading();
    const loaderCountBeforeClick = await loaders.count();

    await this.checkboxButton().click();
    await expect(loaders).toHaveCount(loaderCountBeforeClick + 1, { timeout: 20_000 });

    // The demo inserts each new loader immediately after the button, before prior hidden loaders.
    const currentLoader = loaders.first();
    await expect(currentLoader).toBeVisible({ timeout: 20_000 });
    await expect(currentLoader).toBeHidden({ timeout: 20_000 });
    await expect(this.page.locator('#message')).toHaveText(messageText, { timeout: 20_000 });
  }

  /**
   * Input demo: DO NOT wait on the spinner. It's flaky and can remain visible forever.
   * Completion signal is message + input enabled/disabled state.
   */
  private async waitInputCycle(expectedMessage: "It's enabled!" | "It's disabled!") {
    const message = this.page.locator('#message');
    const input = this.input();

    // allow DOM/spinner to start
    await this.page.waitForTimeout(150);

    // authoritative: message
    await expect(message).toContainText(expectedMessage, { timeout: 20_000 });

    // authoritative: input state
    if (expectedMessage === "It's enabled!") {
      await expect(input).toBeEnabled({ timeout: 20_000 });
    } else {
      await expect(input).toBeDisabled({ timeout: 20_000 });
    }
  }

  async removeAndAddCheckbox() {
    const checkbox = this.checkbox();
    const button = this.checkboxButton();

    await expect(checkbox).toHaveCount(1);
    await expect(checkbox).toBeVisible();
    await expect(button).toHaveText('Remove');

    await this.clickCheckboxAndWaitFor("It's gone!");
    await expect(checkbox).toHaveCount(0);
    await expect(button).toHaveText('Add');

    await this.clickCheckboxAndWaitFor("It's back!");
    await expect(checkbox).toHaveCount(1);
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
    await expect(button).toHaveText('Remove');
  }

  async enableInputAndEnter(value: string) {
    const input = this.input();

    await expect(input).toBeDisabled({ timeout: 20_000 });
    await this.inputButton().click();
    await this.waitInputCycle("It's enabled!");

    await input.fill(value);
    await expect(input).toHaveValue(value);
  }

  async disableInputAndAssertValue(value: string) {
    const input = this.input();

    await expect(input).toBeEnabled({ timeout: 20_000 });
    await expect(input).toHaveValue(value);

    await this.inputButton().click();
    await this.waitInputCycle("It's disabled!");

    await expect(input).toBeDisabled({ timeout: 20_000 });
    await expect(input).toHaveValue(value);
  }
}
