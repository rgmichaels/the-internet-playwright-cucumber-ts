import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { NotificationMessagesPage } from '../pages/NotificationMessagesPage';

Given('I open the Notification Messages page', async function (this: CustomWorld) {
  const po = new NotificationMessagesPage(this.page);
  await this.page.goto(`${this.baseUrl}/notification_message`);
  await po.assertLoaded();
});

Then('the Notification Messages page should load', async function (this: CustomWorld) {
  const po = new NotificationMessagesPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Notification Messages page', async function (this: CustomWorld) {
  const po = new NotificationMessagesPage(this.page);
  await po.exercise();
});

Then(
  'the Notification Messages flash should be one of the expected variants',
  async function (this: CustomWorld) {
    const po = new NotificationMessagesPage(this.page);
    await po.assertFlashMessageIsExpected();
  }
);

Then('the Notification Messages flash can be dismissed', async function (this: CustomWorld) {
  const po = new NotificationMessagesPage(this.page);
  await po.dismissFlashMessage();
});
