import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { JsAlertsPage } from '../pages/JsAlertsPage';

Given('I open the JavaScript Alerts page', async function (this: CustomWorld) {
  const po = new JsAlertsPage(this.page);
  await this.page.goto(`${this.baseUrl}/javascript_alerts`);
  await po.assertLoaded();
});

Then('the JavaScript Alerts page should load', async function (this: CustomWorld) {
  const po = new JsAlertsPage(this.page);
  await po.assertLoaded();
});

Then('I verify the accepted JavaScript Alerts dialog contracts', async function (this: CustomWorld) {
  const po = new JsAlertsPage(this.page);
  await po.exerciseAcceptedDialogContracts();
});

Then('I verify the cancelled JavaScript Alerts dialog contracts', async function (this: CustomWorld) {
  const po = new JsAlertsPage(this.page);
  await po.exerciseCancelledDialogContracts();
});
