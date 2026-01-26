import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { InputsPage } from '../pages/InputsPage';

Then('the Inputs page should load', async function () {
  const inputs = new InputsPage(this.page);
  await inputs.assertLoaded();
});

Then('I exercise the Inputs page', async function () {
  const inputs = new InputsPage(this.page);
  await inputs.exercise();
});


Then('the Inputs page should display required text', async function () {
  const inputs = new InputsPage(this.page);
  await inputs.assertLoaded();
});

Then('the Inputs page should show a numeric input field', async function () {
  const inputs = new InputsPage(this.page);

  const input = this.page.locator('input[type="number"]');
  await expect(input).toBeVisible();

  // Prove it's usable
  await inputs.typeNumber(123);
});

Given('I open the Inputs page', async function () {
  if (!this.page) {
    await this.launch();
  }
  await this.page.goto(`${this.baseUrl}/inputs`);
});
