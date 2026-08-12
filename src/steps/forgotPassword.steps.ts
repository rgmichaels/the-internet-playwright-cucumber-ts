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

Then('the Forgot Password page should send the exact recovery request', async function (this: CustomWorld) {
  const po = new ForgotPasswordPage(this.page);
  await po.assertRecoveryRequestContract();
});
