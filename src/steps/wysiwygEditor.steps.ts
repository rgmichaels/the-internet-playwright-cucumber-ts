import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { WysiwygEditorPage } from '../pages/WysiwygEditorPage';

Given('I open the WYSIWYG Editor page', async function (this: CustomWorld) {
  const po = new WysiwygEditorPage(this.page);
  await this.page.goto(`${this.baseUrl}/tinymce`);
  await po.assertLoaded();
});

Then('the WYSIWYG Editor page should load', async function (this: CustomWorld) {
  const po = new WysiwygEditorPage(this.page);
  await po.assertLoaded();
});

Then('I exercise the WYSIWYG Editor page', async function (this: CustomWorld) {
  const po = new WysiwygEditorPage(this.page);
  await po.exercise();
});
