import { Given, Then } from '@cucumber/cucumber';
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
