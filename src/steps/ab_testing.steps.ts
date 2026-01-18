import { Then } from '@cucumber/cucumber';
import { ABTestingPage } from '../pages/ABTestingPage';

Then('the footer should show {string} with a valid link', async function (footerText: string) {
  const ab = new ABTestingPage(this.page);
  await ab.assertFooterElementalSelenium(footerText);
});
