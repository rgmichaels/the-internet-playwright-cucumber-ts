import { Given, Then, When } from '@cucumber/cucumber';
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

When(
  'I open the Digest Authentication page without credentials',
  async function (this: CustomWorld) {
    const po = new DigestAuthPage(this.page);
    this.lastResponse = await po.openWithoutCredentials(this.baseUrl);
  }
);

Then(
  'the digest authentication request should be unauthorized',
  function (this: CustomWorld) {
    const po = new DigestAuthPage(this.page);
    po.assertUnauthorizedResponse(this.lastResponse);
  }
);

Then(
  'the response should include a Digest authentication challenge',
  function (this: CustomWorld) {
    const po = new DigestAuthPage(this.page);
    po.assertDigestChallenge(this.lastResponse);
  }
);
