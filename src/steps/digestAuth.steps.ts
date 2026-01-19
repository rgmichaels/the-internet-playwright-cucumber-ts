import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DigestAuthPage } from '../pages/DigestAuthPage';

Given('I open the Digest Authentication page', async function (this: CustomWorld) {
  const po = new DigestAuthPage(this.page);
  await this.page.goto(`${this.baseUrl}/digest_auth`);
  await po.assertLoaded();
});

Then('the Digest Authentication page should load', async function (this: CustomWorld) {
  const po = new DigestAuthPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Digest Authentication page', async function (this: CustomWorld) {
  const po = new DigestAuthPage(this.page);
  await po.exercise();
});
