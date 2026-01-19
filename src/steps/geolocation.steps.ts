import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { GeolocationPage } from '../pages/GeolocationPage';

Given('I open the Geolocation page', async function (this: CustomWorld) {
  const po = new GeolocationPage(this.page);
  await this.page.goto(`${this.baseUrl}/geolocation`);
  await po.assertLoaded();
});

Then('the Geolocation page should load', async function (this: CustomWorld) {
  const po = new GeolocationPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Geolocation page', async function (this: CustomWorld) {
  const po = new GeolocationPage(this.page);
  await po.exercise();
});
