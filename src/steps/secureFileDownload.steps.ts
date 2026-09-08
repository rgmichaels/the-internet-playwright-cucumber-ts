import { Given, Then, When } from '@cucumber/cucumber';
import type { BrowserContextOptions } from 'playwright';
import { CustomWorld } from '../support/world';
import { SecureFileDownloadPage } from '../pages/SecureFileDownloadPage';

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

Given('I open the Secure File Download page', async function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  await this.page.goto(`${this.baseUrl}/download_secure`);
  await po.assertLoaded();
});

Then('the Secure File Download page should load', async function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the Secure File Download page', async function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  await po.exercise();
});

Then(
  'an available secure download should match its authenticated response',
  async function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    await po.assertDownloadedPayloadMatchesAuthenticatedResponse();
  }
);

When(
  'I request the Secure File Download page without credentials',
  async function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    this.lastResponse = await po.open(this.baseUrl);
  }
);

When(
  'I request the Secure File Download page with invalid credentials',
  async function (this: CustomWorld) {
    await replaceContextWithInvalidCredentials(this);
    const po = new SecureFileDownloadPage(this.page);
    this.lastResponse = await po.open(this.baseUrl);
  }
);

Then('Secure File Download access should be denied', function (this: CustomWorld) {
  const po = new SecureFileDownloadPage(this.page);
  po.assertAccessDenied(this.lastResponse);
});

Then(
  'the Secure File Download page should indicate the user is not authorized',
  async function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    await po.assertNotAuthorizedMessage();
  }
);

Then(
  'the response should include the Secure File Download Basic authentication challenge',
  function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    po.assertBasicAuthenticationChallenge(this.lastResponse);
  }
);

Then(
  'protected Secure File Download content should not be displayed',
  async function (this: CustomWorld) {
    const po = new SecureFileDownloadPage(this.page);
    await po.assertProtectedContentNotDisplayed();
  }
);
