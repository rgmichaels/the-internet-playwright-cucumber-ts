import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { GeolocationPage } from '../pages/GeolocationPage';
import { TEST_GEOLOCATION } from '../support/geolocation';

Given('I open the Geolocation page', async function (this: CustomWorld) {
  const po = new GeolocationPage(this.page);

  await this.page.goto(`${this.baseUrl}/geolocation`);
  await po.assertLoaded();
});

Then('the Geolocation page should load', async function (this: CustomWorld) {
  const po = new GeolocationPage(this.page);
  await po.assertLoaded();
});

When('I request my location on the Geolocation page', async function (this: CustomWorld) {
  const po = new GeolocationPage(this.page);
  await po.requestLocation();
});

Then(
  'the Geolocation page should report the configured coordinates',
  async function (this: CustomWorld) {
    const po = new GeolocationPage(this.page);
    await po.assertCoordinates(TEST_GEOLOCATION);
  }
);

Then(
  'the Geolocation page should show the proper header and text',
  async function (this: CustomWorld) {
    const po = new GeolocationPage(this.page);

    // assertLoaded() now checks BOTH:
    // - h3 "Geolocation"
    // - paragraph "Click the button to get your current latitude and longitude"
    await po.assertLoaded();
  }
);
