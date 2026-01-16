import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { browserName, isHeadless } from './env';

export type WorldParams = { baseUrl: string };

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  baseUrl: string;

  constructor(options: IWorldOptions) {
    super(options);
    const params = (options.parameters || {}) as WorldParams;
    this.baseUrl = params.baseUrl;
  }

  async launch(opts?: { authAdmin?: boolean; geo?: boolean }) {
    const headed = process.env.HEADED === '1';
    const slowMo = Number(process.env.SLOWMO ?? 0) || 0;

    const headless = headed ? false : isHeadless();
    const name = browserName();
    const launcher =
      name === 'firefox'
        ? firefox
        : name === 'webkit'
        ? webkit
        : chromium;

    this.browser = await launcher.launch({
      headless,
      slowMo: headed ? slowMo : 0,
    });

    const contextOptions: any = {
      viewport: { width: 1280, height: 720 },
      acceptDownloads: true,
    };

    if (opts?.authAdmin) {
      contextOptions.httpCredentials = {
        username: 'admin',
        password: 'admin',
      };
    }

    if (opts?.geo) {
      contextOptions.geolocation = {
        latitude: 40.7128,
        longitude: -74.0060,
      };
      contextOptions.permissions = ['geolocation'];
    }

    this.context = await this.browser.newContext(contextOptions);
    this.page = await this.context.newPage();
  }

  async close() {
    await this.context?.close().catch(() => {});
    await this.browser?.close().catch(() => {});
  }
}

setWorldConstructor(CustomWorld);
