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

  const headed = process.env.HEADED === '1';
  const slowMo = Number(process.env.SLOWMO ?? 0) || 0;

  await this.launch({ authAdmin, geo, headed, slowMo });
});

After(async function (this: CustomWorld, scenario) {
  const failed = scenario.result?.status === Status.FAILED;

  // Always stop tracing (if it was started). Only write a trace file when failed.
  if ((process.env.TRACE ?? '1') !== '0') {
    try {
      fs.mkdirSync(resultsDir, { recursive: true });
      const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]+/g, '_');
      const tracePath = path.join(resultsDir, `${safeName}-trace.zip`);

      if (failed) {
        await this.context.tracing.stop({ path: tracePath });
        const traceData = fs.readFileSync(tracePath);
        await this.attach(traceData, 'application/zip');
      } else {
        await this.context.tracing.stop();
      }
    } catch (err) {
      // Tracing should never make a scenario fail.
      console.warn('WARN: Failed to stop/attach trace:', err);
    }
  }

  if (failed) {
    fs.mkdirSync(resultsDir, { recursive: true });
    const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]+/g, '_');
    const screenshotPath = path.join(resultsDir, `${safeName}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    const data = fs.readFileSync(screenshotPath);
    await this.attach(data, 'image/png');
  }

  await this.close();
});

