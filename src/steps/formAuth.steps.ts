import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { FormAuthPage } from '../pages/FormAuthPage';

Given('I open the Form Authentication page', async function (this: CustomWorld) {
  const po = new FormAuthPage(this.page);
  await this.page.goto(`${this.baseUrl}/login`);
  await po.assertLoaded();
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
