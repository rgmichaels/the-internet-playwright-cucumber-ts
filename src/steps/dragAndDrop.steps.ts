import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { DragAndDropPage } from '../pages/DragAndDropPage';

Given('I open the Drag and Drop page', async function (this: CustomWorld) {
  const po = new DragAndDropPage(this.page);
  await this.page.goto(`${this.baseUrl}/drag_and_drop`);
  await po.assertLoaded();
});

Then('the Drag and Drop page should load', async function (this: CustomWorld) {
  const po = new DragAndDropPage(this.page);
  await po.assertLoaded();
});

Then('dragging the tiles twice should restore their original order', async function (this: CustomWorld) {
  const po = new DragAndDropPage(this.page);
  await po.assertReversibleOrder();
});
