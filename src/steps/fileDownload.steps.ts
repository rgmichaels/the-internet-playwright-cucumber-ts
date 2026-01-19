import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { FileDownloadPage } from '../pages/FileDownloadPage';

Given('I open the File Download page', async function (this: CustomWorld) {
  const po = new FileDownloadPage(this.page);
  await this.page.goto(`${this.baseUrl}/download`);
  await po.assertLoaded();
});

Then('the File Download page should load', async function (this: CustomWorld) {
  const po = new FileDownloadPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the File Download page', async function (this: CustomWorld) {
  const po = new FileDownloadPage(this.page);
  await po.exercise();
});
