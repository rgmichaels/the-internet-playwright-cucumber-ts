import { Given, Then, When } from '@cucumber/cucumber';
import type { BrowserContextOptions } from 'playwright';
import { CustomWorld } from '../support/world';
import { DigestAuthPage } from '../pages/DigestAuthPage';

async function replaceContextWithInvalidCredentials(world: CustomWorld) {
  await world.context.close().catch(() => {});

  const username = process.env.BASIC_AUTH_USER || 'admin';
  const password = process.env.BASIC_AUTH_PASS || 'admin';
  const contextOptions: BrowserContextOptions = {
    baseURL: world.baseUrl,
    viewport: { width: 1280, height: 720 },
    acceptDownloads: true,
    httpCredentials: {
      username,
      password: `${password}__invalid__`,
    },
  };

  world.context = await world.browser.newContext(contextOptions);

  if ((process.env.TRACE ?? '1') !== '0') {
    await world.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  world.page = await world.context.newPage();
}

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
    this.lastResponse = await po.open(this.baseUrl);
  }
);

When(
  'I open the Digest Authentication page with invalid credentials',
  async function (this: CustomWorld) {
    await replaceContextWithInvalidCredentials(this);
    const po = new DigestAuthPage(this.page);
    this.lastResponse = await po.open(this.baseUrl);
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

Then(
  'protected digest authentication content should not be displayed',
  async function (this: CustomWorld) {
    const po = new DigestAuthPage(this.page);
    await po.assertProtectedContentNotDisplayed();
  }
);
