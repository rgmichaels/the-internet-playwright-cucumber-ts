import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class InputsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private numericInput() {
    return this.page.locator('input[type="number"]');
  }

  async assertLoaded() {
    await this.expectH3ToBe('Inputs');

    // Case-insensitive match: "Number" on the page should satisfy "number"
    const content = this.page.locator('#content');
    await expect(content).toContainText(/number/i);
  }


  async typeNumber(n: number) {
    const input = this.numericInput();
    await expect(input).toBeVisible();
    await input.fill(String(n));
    await expect(input).toHaveValue(String(n));
  }

  async assertNumericKeyboardInput() {
    const input = this.numericInput();
    await expect(input).toBeVisible();

    await input.pressSequentially('-7');
    await expect(input).toHaveValue('-7');
    const signedIntegerIsValid = await input.evaluate(
      (element: HTMLInputElement) => element.checkValidity()
    );
    expect(signedIntegerIsValid).toBe(true);

    await input.fill('');
    await input.pressSequentially('12abc');
    await expect(input).toHaveValue('12');
    const filteredValueIsValid = await input.evaluate(
      (element: HTMLInputElement) => element.checkValidity()
    );
    expect(filteredValueIsValid).toBe(true);
  }

  async exercise() {
    await this.typeNumber(123);
  }
}
