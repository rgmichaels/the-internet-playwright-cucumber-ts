import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ABTestingPage } from '../pages/ABTestingPage';

// Standard framework steps used by most page features
Given('I open the A/B Testing page', async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await this.page.goto(`${this.baseUrl}/abtest`);
  await po.assertLoaded();
});

Then(/^the A\/B Testing page should load$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.assertLoaded();
});

Then(/^I exercise the A\/B Testing page$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.exercise();
});

// Extra A/B Testing-specific steps
Given(/^I am on the A\/B Testing page$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await this.page.goto(`${this.baseUrl}/abtest`);
  await po.assertLoaded();
});

Then(/^I should see the A\/B testing description text$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.assertDescriptionTextPresent();
});
