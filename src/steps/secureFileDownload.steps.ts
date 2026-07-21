import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { SecureFileDownloadPage } from '../pages/SecureFileDownloadPage';

Given('I open the Secure File Download page', async function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  await this.page.goto(`${this.baseUrl}/download_secure`);
  await po.assertLoaded();
});

Then('the Secure File Download page should load', async function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Secure File Download page', async function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  await po.exercise();
});

When(
  'I request the Secure File Download page without credentials',
  async function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    this.lastResponse = await po.openWithoutCredentials(this.baseUrl);
  }
);

Then('Secure File Download access should be denied', function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  po.assertAccessDenied(this.lastResponse);
});

Then(
  'the Secure File Download page should indicate the user is not authorized',
  async function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    await po.assertNotAuthorizedMessage();
  }
);
