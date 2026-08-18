import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { ABTestingPage } from '../pages/ABTestingPage';

// Standard framework steps used by most page features
Given('I open the A/B Testing page', async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.goto(this.baseUrl);
});

Then(/^the A\/B Testing page should load$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.assertLoaded();
});

Then(/^I should see a valid A\/B test variant$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.exercise();
});

// Extra A/B Testing-specific steps
Given(/^I am on the A\/B Testing page$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.goto(this.baseUrl);
});

Given(
  /^the A\/B Testing page initially returns a transient server error$/,
  async function (this: CustomWorld) {
    await this.page.route(`${this.baseUrl}/abtest`, async (route) => {
      this.exampleNavigationAttempts += 1;

      if (this.exampleNavigationAttempts === 1) {
        await route.fulfill({
          status: 503,
          contentType: 'text/html',
          body: '<h1>Application error</h1>',
        });
        return;
      }

      await route.fallback();
    });
  }
);

When(/^I navigate directly to the A\/B Testing page$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.goto(this.baseUrl);
});

Then(/^I should see the A\/B testing description text$/, async function (this: CustomWorld) {
  const po = new ABTestingPage(this.page);
  await po.assertDescriptionTextPresent();
});
