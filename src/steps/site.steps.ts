import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HomePage } from '../pages/HomePage';

// Home-page-centric steps live here.
// Page-specific load/exercise/direct-nav steps live in their own *.steps.ts files.

Given('I am on the home page', async function (this: CustomWorld) {
  const home = new HomePage(this.page);
  await home.goto(this.baseUrl);
});

When('I open the {string} example', async function (this: CustomWorld, name: string) {
  const home = new HomePage(this.page);
  await home.openExample(name);
});

Then('the global footer should be valid', async function (this: CustomWorld) {
  const base = new HomePage(this.page);
  await base.assertGlobalFooterPoweredByElementalSelenium();
});
