import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { StatusCodesPage } from '../pages/StatusCodesPage';

Given('I open the Status Codes page', async function (this: CustomWorld) {
  const po = new StatusCodesPage(this.page);
  await this.page.goto(`${this.baseUrl}/status_codes`);
  await po.assertLoaded();
});

Then('the Status Codes page should load', async function () {
  this.statusCodesPage = new StatusCodesPage(this.page);
  await this.statusCodesPage.assertLoaded();
});

Then('I exercise the Status Codes page', async function (this: CustomWorld) {
  const po = new StatusCodesPage(this.page);
  await po.exercise();
});

Then(
  'each status code link should show the correct explanation',
  async function () {
    await this.statusCodesPage.exercise();
  }
);
