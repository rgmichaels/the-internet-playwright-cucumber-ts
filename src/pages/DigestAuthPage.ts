import { Page, Response } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from './BasePage';

export class DigestAuthPage extends BasePage {
  constructor(page: Page) { super(page); }

  async assertLoaded() {
    await expect(this.page.locator('#content')).toContainText('Congratulations');
  }

  async openWithoutCredentials(baseUrl: string): Promise<Response | null> {
    return this.page.goto(`${baseUrl}/digest_auth`);
  }

  assertUnauthorizedResponse(response: Response | null) {
    expect(response, 'Expected navigation to return an HTTP response').not.toBeNull();
    expect(response!.status()).toBe(401);
  }

  assertDigestChallenge(response: Response | null) {
    expect(response, 'Expected navigation to return an HTTP response').not.toBeNull();

    const challenge = response!.headers()['www-authenticate'];
    expect(challenge, 'Expected a WWW-Authenticate challenge').toBeTruthy();
    expect(challenge!).toMatch(/^Digest\s/);
    expect(challenge!).toContain('realm="Protected Area"');
  }

  async exercise() {
    // Auth page "exercise" is the content assertion above
    await this.assertLoaded();
  }
}
