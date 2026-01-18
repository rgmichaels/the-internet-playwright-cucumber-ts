import { Given, Then } from '@cucumber/cucumber';
import { ABTestingPage } from '../pages/ABTestingPage';

Given(/^I am on the A\/B Testing page$/, async function () {
  const ab = new ABTestingPage(this.page);

  await this.page.goto(`${this.baseUrl}/abtest`);
  await ab.assertLoaded();
});

Then('the footer should show {string} with a valid link', async function (footerText: string) {
  const ab = new ABTestingPage(this.page);
  await ab.assertFooterElementalSelenium(footerText);
});

Then(/^I should see the A\/B testing description text$/, async function () {
  const ab = new ABTestingPage(this.page);
  await ab.assertDescriptionTextPresent();
});
