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

    // Single source of truth for base URL.
    // Prefer (in order): worldParameters.baseUrl, env vars, then default demo site.
    const params = (options.parameters || {}) as Partial<WorldParams>;
    const envBase =
      process.env.BASE_URL ||
      process.env.PLAYWRIGHT_BASE_URL ||
      process.env.THE_INTERNET_BASE_URL ||
      '';

    this.baseUrl = (params.baseUrl || envBase || 'https://the-internet.herokuapp.com').replace(/\/+$/, '');

    // Back-compat alias: some steps historically looked for baseURL (capital URL).
    (this as any).baseURL = this.baseUrl;
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
      const username = process.env.BASIC_AUTH_USER || 'admin';
      const password = process.env.BASIC_AUTH_PASS || 'admin';
      contextOptions.httpCredentials = {
        username,
        password,
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
