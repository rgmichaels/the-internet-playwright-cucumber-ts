import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { FileUploadPage } from '../pages/FileUploadPage';

Given('I open the File Upload page', async function (this: CustomWorld) {
  const po = new FileUploadPage(this.page);
  await this.page.goto(`${this.baseUrl}/upload`);
  await po.assertLoaded();
});

Then('the File Upload page should load', async function (this: CustomWorld) {
  const po = new FileUploadPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the File Upload page', async function (this: CustomWorld) {
  const po = new FileUploadPage(this.page);
  await po.exercise();
});
