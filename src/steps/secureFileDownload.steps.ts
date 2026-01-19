import { Given, Then } from '@cucumber/cucumber';
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
