import { Page } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicControlsPage extends BasePage {
  private healedOnce = false;

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
    return this.page.locator('#checkbox input');
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

  private async waitAllHidden(loadingLocator: ReturnType<Page['locator']>, timeoutMs = 20_000) {
    const n = await loadingLocator.count();
    if (n === 0) return;

    for (let i = 0; i < n; i++) {
      await expect(loadingLocator.nth(i)).toBeHidden({ timeout: timeoutMs });
    }
  }

  private async waitCheckboxCycle() {
    await this.page.waitForTimeout(150);
    await this.waitAllHidden(this.checkboxLoading(), 20_000);
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

  private async clickCheckboxButtonUntilState(target: 'gone' | 'back', attempts = 3): Promise<void> {
    const message = this.page.locator('#message');

    for (let i = 0; i < attempts; i++) {
      const before = (await message.textContent().catch(() => '')) ?? '';

      await this.checkboxButton().click();
      await this.waitCheckboxCycle();

      await expect(message).toBeVisible({ timeout: 20_000 });

      await expect
        .poll(async () => {
          const now = (await message.textContent()) ?? '';
          return now.trim() === before.trim() ? now.trim() + ' (unchanged)' : now.trim();
        }, { timeout: 20_000 })
        .not.toContain('(unchanged)');

      const text = ((await message.textContent()) ?? '').trim();

      if (target === 'gone' && text.includes("It's gone!")) {
        await expect(this.checkbox()).toHaveCount(0, { timeout: 20_000 });
        return;
      }

      if (target === 'back' && text.includes("It's back!")) {
        await expect
          .poll(async () => {
            const count = await this.checkbox().count();
            const btn = ((await this.checkboxButton().textContent()) ?? '').trim();
            return count === 1 || btn === 'Remove';
          }, { timeout: 20_000 })
          .toBe(true);

        if (await this.checkbox().count()) {
          await expect(this.checkbox()).toBeVisible({ timeout: 20_000 });
        }
        return;
      }
    }

    if (!this.healedOnce) {
      this.healedOnce = true;
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.assertLoaded();
      return this.clickCheckboxButtonUntilState(target, attempts);
    }

    throw new Error(`Failed to reach checkbox state "${target}" after ${attempts} attempts`);
  }

  async removeAndAddCheckbox() {
    await this.clickCheckboxButtonUntilState('gone', 3);
    await this.clickCheckboxButtonUntilState('back', 3);
  }

  async enableAndDisableInput() {
    const input = this.input();
    const button = this.inputButton();
    const message = this.page.locator('#message');

    await expect(input).toBeVisible({ timeout: 20_000 });

    // Enable
    await button.click();
    await this.waitInputCycle("It's enabled!");
    await expect(message).toContainText("It's enabled!", { timeout: 20_000 });

    // Disable
    await button.click();
    await this.waitInputCycle("It's disabled!");
    await expect(message).toContainText("It's disabled!", { timeout: 20_000 });
  }

  async exercise() {
    await this.removeAndAddCheckbox();
    await this.enableAndDisableInput();
  }
}
