
import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(90 * 1000);

import fs from 'node:fs';
import path from 'node:path';
import { CustomWorld } from './world';

const resultsDir = path.resolve(process.cwd(), 'test-results');

Before(async function (this: CustomWorld, scenario) {
  const tags = scenario.pickle.tags.map((t: any) => t.name);
  const authAdmin = tags.includes('@auth_admin');
  const geo = tags.includes('@geo');
  await this.launch({ authAdmin, geo });
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    fs.mkdirSync(resultsDir, { recursive: true });
    const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]+/g, '_');
    const screenshotPath = path.join(resultsDir, `${safeName}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    const data = fs.readFileSync(screenshotPath);
    await this.attach(data, 'image/png');
  }
  await this.close();
});
