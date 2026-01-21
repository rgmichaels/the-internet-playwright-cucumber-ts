import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { GeolocationPage } from '../pages/GeolocationPage';

Given('I open the Geolocation page', async function (this: CustomWorld) {
  this.geolocationPage = new GeolocationPage(this.page);

  await this.page.goto(`${this.baseUrl}/geolocation`);
  await this.geolocationPage.assertLoaded();
});

Then('the Geolocation page should load', async function (this: CustomWorld) {
  this.geolocationPage = this.geolocationPage ?? new GeolocationPage(this.page);
  await this.geolocationPage.assertLoaded();
});

Then('I exercise the Geolocation page', async function (this: CustomWorld) {
  this.geolocationPage = this.geolocationPage ?? new GeolocationPage(this.page);
  await this.geolocationPage.exercise();
});

Then(
  'the Geolocation page should show the proper header and text',
  async function (this: CustomWorld) {
    this.geolocationPage = this.geolocationPage ?? new GeolocationPage(this.page);

    // assertLoaded() now checks BOTH:
    // - h3 "Geolocation"
    // - paragraph "Click the button to get your current latitude and longitude"
    await this.geolocationPage.assertLoaded();
  }
);
