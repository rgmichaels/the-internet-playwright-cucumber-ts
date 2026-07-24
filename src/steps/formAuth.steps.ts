import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { FormAuthPage } from '../pages/FormAuthPage';

Given('I open the Form Authentication page', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await this.page.goto(`${this.baseUrl}/login`);
  await po.assertLoaded();
});

Given('I open the secure area without signing in', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await po.openSecureAreaDirectly(this.baseUrl);
});

When('I sign in and log out of the secure area', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await po.loginSuccessfullyAndLogOut();
});

When('I revisit the secure area after logging out', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await po.openSecureAreaDirectly(this.baseUrl);
});

Then('the Form Authentication page should load', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Form Authentication page', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await po.exercise();
});

Then('an invalid login should show a dismissible error', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await po.assertInvalidLoginDismissible();
});

Then(
  'access should be rejected with an authentication-required error',
  async function (this: CustomWorld) {
    const po = new FormAuthPage(this.page);
    await po.assertUnauthenticatedAccessRejected();
  }
);
