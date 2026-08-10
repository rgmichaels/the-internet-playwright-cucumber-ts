import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { JsOnloadErrorPage } from '../pages/JsOnloadErrorPage';

Given('I open the JavaScript onload event error page', async function (this: CustomWorld) {
  const po = new JsOnloadErrorPage(this.page);
  await this.page.goto(`${this.baseUrl}/javascript_error`);
  await po.assertLoaded();
});

Then('the JavaScript onload event error page should load', async function (this: CustomWorld) {
  const po = new JsOnloadErrorPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the JavaScript onload event error page', async function (this: CustomWorld) {
  const po = new JsOnloadErrorPage(this.page);
  await po.exercise();
});

When(
  'I open the JavaScript onload event error page while observing runtime errors',
  async function (this: CustomWorld) {
    const po = new JsOnloadErrorPage(this.page);
    this.lastPageErrors = await po.openAndCaptureRuntimeErrors(this.baseUrl);
  }
);

Then(
  'exactly one documented JavaScript onload error should be emitted',
  function (this: CustomWorld) {
    const po = new JsOnloadErrorPage(this.page);
    po.assertDocumentedOnloadError(this.lastPageErrors);
  }
);
