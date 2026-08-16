import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  constructor(page: Page) { super(page); }
  async assertLoaded() { await this.expectH3ToBe('Checkboxes'); }

  private checkboxes() {
    return this.page.locator('#checkboxes input');
  }

  private async assertCheckedStates(firstChecked: boolean, secondChecked: boolean) {
    const checkboxes = this.checkboxes();
    await expect(checkboxes).toHaveCount(2);

    const expectedStates = [firstChecked, secondChecked];
    for (let index = 0; index < expectedStates.length; index += 1) {
      const checkbox = checkboxes.nth(index);
      await expect(checkbox).toBeVisible();

      if (expectedStates[index]) {
        await expect(checkbox).toBeChecked();
      } else {
        await expect(checkbox).not.toBeChecked();
      }
    }
  }

  async assertIndependentToggleLifecycle() {
    const checkboxes = this.checkboxes();

    await this.assertCheckedStates(false, true);

    await checkboxes.nth(0).click();
    await this.assertCheckedStates(true, true);

    await checkboxes.nth(1).click();
    await this.assertCheckedStates(true, false);

    await checkboxes.nth(0).click();
    await this.assertCheckedStates(false, false);

    await checkboxes.nth(1).click();
    await this.assertCheckedStates(false, true);
  }
}
