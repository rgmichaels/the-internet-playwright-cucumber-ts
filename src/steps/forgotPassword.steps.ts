import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

Given('I open the Forgot Password page', async function (this: CustomWorld) {
  const po = new ForgotPasswordPage(this.page);
  await this.page.goto(`${this.baseUrl}/forgot_password`);
  await po.assertLoaded();
});

Then('the Forgot Password page should load', async function (this: CustomWorld) {
  const po = new ForgotPasswordPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Forgot Password page', async function (this: CustomWorld) {
  const po = new ForgotPasswordPage(this.page);
  await po.exercise();
});
